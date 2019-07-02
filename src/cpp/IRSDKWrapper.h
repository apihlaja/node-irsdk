#pragma once

#include "irsdk/irsdk_defines.h"
#include <time.h>
#define WIN32_LEAN_AND_MEAN
#include <windows.h>

#include <map>
#include <string>
#include <vector>

namespace NodeIrSdk
{

class IRSDKWrapper
{
public:
  IRSDKWrapper();
  ~IRSDKWrapper();

  bool startup();
  void shutdown();

  bool isInitialized() const;
  bool isConnected() const;

  bool updateTelemetry();   // returns true if telemetry update available
  bool updateSessionInfo(); // returns true if session info update available

  const std::string getSessionInfo() const; // returns yaml string

  struct TelemetryVar
  {
    irsdk_varHeader *header;
    irsdk_VarType type;

    union { // choose correct based on irsdk_VarType
      char *value;
      float *floatValue;
      int *intValue;
      bool *boolValue;
      double *doubleValue;
    };

    TelemetryVar(irsdk_varHeader *varHeader);
    ~TelemetryVar();
  };

  const std::vector<irsdk_varHeader *> getVarHeaders() const;

  bool getVarVal(TelemetryVar &var) const;

  const double getLastTelemetryUpdateTS() const; // returns JS compatible TS

private:
  HANDLE hMemMapFile;
  const char *pSharedMem;
  const irsdk_header *pHeader;
  int lastTickCount;
  int lastSessionInfoUpdate;
  time_t lastValidTime;
  char *data;
  int dataLen;
  std::string sessionInfoStr;

  std::vector<irsdk_varHeader *> varHeadersArr;

  void updateVarHeaders(); // updates map and vector
  const char *getSessionInfoStr() const;
};

} // namespace NodeIrSdk
