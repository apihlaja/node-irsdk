#include "IRSDKWrapper.h"
#include <iostream>

// npm install --debug enables debug prints
#ifdef _DEBUG
  #define debug(x) std::cout << x << std::endl;
#else
  #define debug(x)
#endif

NodeIrSdk::IRSDKWrapper::IRSDKWrapper():
hMemMapFile(NULL), pSharedMem(NULL), pHeader(NULL), lastTickCount(INT_MIN), lastSessionInfoUpdate(INT_MIN), 
data(NULL), dataLen(-1), sessionInfoStr()
{
  debug("IRSDKWrapper: constructing...");
}


NodeIrSdk::IRSDKWrapper::~IRSDKWrapper()
{
  debug("IRSDKWrapper: deconstructing...");
}

bool NodeIrSdk::IRSDKWrapper::startup()
{
  debug("IRSDKWrapper: starting up...");
  
  if (!hMemMapFile)
  {
    debug("IRSDKWrapper: opening mem map...");
    hMemMapFile = OpenFileMapping(FILE_MAP_READ, FALSE, IRSDK_MEMMAPFILENAME);
    if ( hMemMapFile == NULL ) {
      return false;
    }
    pSharedMem = (const char *)MapViewOfFile(hMemMapFile, FILE_MAP_READ, 0, 0, 0);
    pHeader = (irsdk_header *)pSharedMem;
    lastTickCount = INT_MIN;
  }
  debug("IRSDKWrapper: start up ready.");
  return true;
}

bool NodeIrSdk::IRSDKWrapper::isInitialized() const 
{
  if (!hMemMapFile) {
    debug("IRSDKWrapper: not initialized...");
    return false;
  }
  debug("IRSDKWrapper: is initialized...");
  return true;
}

bool NodeIrSdk::IRSDKWrapper::isConnected() const 
{
  bool status = pHeader->status == irsdk_stConnected;
  debug("IRSDKWrapper: sim status: " << status);
  return status;
}

void NodeIrSdk::IRSDKWrapper::shutdown() 
{
  debug("IRSDKWrapper: shutting down...");
  if (pSharedMem)
    UnmapViewOfFile(pSharedMem);

  if (hMemMapFile)
    CloseHandle(hMemMapFile);

  hMemMapFile = NULL;
  pSharedMem = NULL;
  pHeader = NULL;
  
  lastTickCount = INT_MIN;
  lastSessionInfoUpdate = INT_MIN;
  delete[] data;
  data = NULL;
  lastValidTime = time(NULL);
  varHeadersArr.clear();
  sessionInfoStr = "";
  
  debug("IRSDKWrapper: shutdown ready.");
}

bool NodeIrSdk::IRSDKWrapper::updateSessionInfo() 
{
  debug("IRSDKWrapper: updating session info...");
  if (startup()) {
    int counter = pHeader->sessionInfoUpdate;

    if (counter > lastSessionInfoUpdate) {
      sessionInfoStr = getSessionInfoStr();
      lastSessionInfoUpdate = counter;
      return true;
    }
    return false;
  }
  return false;
}

const std::string NodeIrSdk::IRSDKWrapper::getSessionInfo() const 
{
  return sessionInfoStr;
}

bool NodeIrSdk::IRSDKWrapper::updateTelemetry() 
{
  debug("IRSDKWrapper: updating telemetry...");
  if ( isInitialized() && isConnected() )
  {
    if (varHeadersArr.empty()) {
      updateVarHeaders();
    }
    // if sim is not active, then no new data
    if (pHeader->status != irsdk_stConnected)
    {
      debug("IRSDKWrapper: not connected, break");
      lastTickCount = INT_MIN;
      return false;
    }
    
    debug("IRSDKWrapper: finding lastest buffer");
    int latest = 0;
    for (int i = 1; i<pHeader->numBuf; i++)
      if (pHeader->varBuf[latest].tickCount < pHeader->varBuf[i].tickCount)
        latest = i;
    
    debug("IRSDKWrapper: lastest buffer " << latest);

    // if newer than last recieved, than report new data
    if (lastTickCount < pHeader->varBuf[latest].tickCount)
    {
      debug("IRSDKWrapper: new data, attempting to copy");
      if ( data == NULL || dataLen != pHeader->bufLen ) {
        debug("IRSDKWrapper: create new data array");
        if ( data != NULL ) delete[] data;
        data = NULL;
        
        if ( pHeader->bufLen > 0 ) {
          dataLen = pHeader->bufLen;
          data = new char[dataLen];
        } else {
          debug("IRSDKWrapper: weird bufferLen.. skipping");
          return false;
        }
      }
      // try to get data
      // try twice to get the data out
      for (int count = 0; count < 2; count++)
      {
        debug("IRSDKWrapper: copy attempt " << count);
        int curTickCount = pHeader->varBuf[latest].tickCount;
        memcpy(data, pSharedMem + pHeader->varBuf[latest].bufOffset, pHeader->bufLen);
        if (curTickCount == pHeader->varBuf[latest].tickCount)
        {
          lastTickCount = curTickCount;
          lastValidTime = time(NULL);
          debug("IRSDKWrapper: copy complete");
          return true;
        }
      }
      // if here, the data changed out from under us.
      debug("IRSDKWrapper: copy failed");
      return false;
    }
    // if older than last recieved, than reset, we probably disconnected
    else if (lastTickCount >  pHeader->varBuf[latest].tickCount)
    {
      debug("IRSDKWrapper: ???");
      lastTickCount = INT_MIN;
      return false;
    }
    // else the same, and nothing changed this tick
  }
  debug("IRSDKWrapper: no new telemetry data");
  return false;
}

const double NodeIrSdk::IRSDKWrapper::getLastTelemetryUpdateTS() const
{
  return 1000.0f * lastValidTime;
}

const char* NodeIrSdk::IRSDKWrapper::getSessionInfoStr() const
{
  debug("IRSDKWrapper: getSessionInfoStr");
  if (isInitialized()) {
    return pSharedMem + pHeader->sessionInfoOffset;
  }

  return NULL;
}

void NodeIrSdk::IRSDKWrapper::updateVarHeaders() 
{
  debug("IRSDKWrapper: updating varHeaders...");
  varHeadersArr.clear();

  for (int index = 0; index < pHeader->numVars; ++index)
  {
    irsdk_varHeader* pVarHeader = &((irsdk_varHeader*)(pSharedMem + pHeader->varHeaderOffset))[index];
    varHeadersArr.push_back(pVarHeader);
  }
  debug("IRSDKWrapper: varHeaders update done.");
}

NodeIrSdk::IRSDKWrapper::TelemetryVar::TelemetryVar(irsdk_varHeader* varHeader):
header(varHeader)
{
  value = new char[irsdk_VarTypeBytes[varHeader->type] * varHeader->count];
  type = (irsdk_VarType)varHeader->type;
}

NodeIrSdk::IRSDKWrapper::TelemetryVar::~TelemetryVar() 
{
  delete value;
}

const std::vector<irsdk_varHeader*> NodeIrSdk::IRSDKWrapper::getVarHeaders() const 
{
  debug("IRSDKWrapper: getVarHeaders");
  return varHeadersArr;
}

bool NodeIrSdk::IRSDKWrapper::getVarVal(TelemetryVar& var) const 
{
  debug("IRSDKWrapper: getVarVal " << var.header->name);
  if (data == NULL) {
    debug("no data available..");
    return false;
  }

  int valueBytes = irsdk_VarTypeBytes[var.header->type] * var.header->count;
  memcpy(var.value, data + var.header->offset, valueBytes);
  return true;
}