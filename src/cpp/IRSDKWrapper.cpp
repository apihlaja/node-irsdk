#include "IRSDKWrapper.h"
#include <iostream>

IRSDKWrapper::IRSDKWrapper():
hMemMapFile(NULL), pSharedMem(NULL), pHeader(NULL), lastTickCount(INT_MIN), lastSessionInfoUpdate(INT_MIN), 
data(NULL), sessionInfoStr(), varHeadersMap()
{
}


IRSDKWrapper::~IRSDKWrapper()
{
}

bool IRSDKWrapper::startup()
{

  if (!hMemMapFile)
  {
    hMemMapFile = OpenFileMapping(FILE_MAP_READ, FALSE, IRSDK_MEMMAPFILENAME);
    pSharedMem = (const char *)MapViewOfFile(hMemMapFile, FILE_MAP_READ, 0, 0, 0);
    pHeader = (irsdk_header *)pSharedMem;
    lastTickCount = INT_MIN;
    data = new char[pHeader->bufLen];
  }

  return true;
}

bool IRSDKWrapper::isInitialized() const 
{
  if (!hMemMapFile) return false;
  return true;
}

bool IRSDKWrapper::isConnected() const 
{
  return pHeader->status == irsdk_stConnected;
}

void IRSDKWrapper::shutdown() 
{
  if (pSharedMem)
    UnmapViewOfFile(pSharedMem);

  if (hMemMapFile)
    CloseHandle(hMemMapFile);

  hMemMapFile = NULL;
  pSharedMem = NULL;
  pHeader = NULL;
  
  lastTickCount = INT_MIN;
  lastSessionInfoUpdate = INT_MIN;
  delete data;
  data = NULL;
  lastValidTime = time(NULL);
  varHeadersMap.clear();
  varHeadersArr.clear();
  sessionInfoStr = "";
}

bool IRSDKWrapper::updateSessionInfo() 
{
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

const std::string IRSDKWrapper::getSessionInfo() const 
{
  return sessionInfoStr;
}

bool IRSDKWrapper::updateTelemetry() 
{
  if ( startup() )
  {
    if (varHeadersMap.empty()) {
      updateVarHeaders();
    }
    // if sim is not active, then no new data
    if (!pHeader->status)
    {
      lastTickCount = INT_MIN;
      return false;
    }

    int latest = 0;
    for (int i = 1; i<pHeader->numBuf; i++)
      if (pHeader->varBuf[latest].tickCount < pHeader->varBuf[i].tickCount)
        latest = i;

    // if newer than last recieved, than report new data
    if (lastTickCount < pHeader->varBuf[latest].tickCount)
    {
      // if asked to retrieve the data
      if (data)
      {
        // try twice to get the data out
        for (int count = 0; count < 2; count++)
        {
          int curTickCount = pHeader->varBuf[latest].tickCount;
          memcpy(data, pSharedMem + pHeader->varBuf[latest].bufOffset, pHeader->bufLen);
          if (curTickCount == pHeader->varBuf[latest].tickCount)
          {
            lastTickCount = curTickCount;
            lastValidTime = time(NULL);
            return true;
          }
        }
        // if here, the data changed out from under us.
        return false;
      }
      else
      {
        lastTickCount = pHeader->varBuf[latest].tickCount;
        lastValidTime = time(NULL);
        return true;
      }
    }
    // if older than last recieved, than reset, we probably disconnected
    else if (lastTickCount >  pHeader->varBuf[latest].tickCount)
    {
      lastTickCount = INT_MIN;
      return false;
    }
    // else the same, and nothing changed this tick
  }
  return false;
}

const double IRSDKWrapper::getLastTelemetryUpdateTS() const
{
  return 1000.0f * lastValidTime;
}

const char* IRSDKWrapper::getSessionInfoStr() const
{
  if (isInitialized()) {
    return pSharedMem + pHeader->sessionInfoOffset;
  }

  return NULL;
}

void IRSDKWrapper::updateVarHeaders() 
{
  varHeadersMap.clear();
  varHeadersArr.clear();

  for (int index = 0; index < pHeader->numVars; ++index)
  {
    irsdk_varHeader* pVarHeader = &((irsdk_varHeader*)(pSharedMem + pHeader->varHeaderOffset))[index];
    varHeadersMap.insert(std::pair<std::string, irsdk_varHeader*>(std::string(pVarHeader->name), pVarHeader));
    varHeadersArr.push_back(pVarHeader);
  }
}

IRSDKWrapper::TelemetryVar::TelemetryVar(irsdk_varHeader* varHeader):
header(varHeader)
{
  value = new char[irsdk_VarTypeBytes[varHeader->type] * varHeader->count];
  type = (irsdk_VarType)varHeader->type;
}

IRSDKWrapper::TelemetryVar::~TelemetryVar() 
{
  delete value;
}

const std::vector<irsdk_varHeader*> IRSDKWrapper::getVarHeaders() const 
{
  return varHeadersArr;
}

irsdk_varHeader* IRSDKWrapper::getVarHeader(const std::string& name) const
{
  std::map<std::string, irsdk_varHeader*>::const_iterator it = varHeadersMap.find(name);

  if (it != varHeadersMap.end()) {
    std::cout << "varHeader found.." << std::endl;
    return it->second;
  }

  std::cout << "varHeader not found.." << std::endl;
  return NULL;
}

bool IRSDKWrapper::getVar(TelemetryVar& var) const 
{
  if (data == NULL) {
    std::cout << "no data available.." << std::endl;
    return false;
  }

  int valueBytes = irsdk_VarTypeBytes[var.header->type] * var.header->count;
  memcpy(var.value, data + var.header->offset, valueBytes);
  return true;
}