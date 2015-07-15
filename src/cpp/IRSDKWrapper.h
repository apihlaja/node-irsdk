#pragma once

#include "irsdk/irsdk_defines.h"
#include <time.h>
#include <windows.h>

#include <map>
#include <string>
#include <vector>

class IRSDKWrapper
{
public:
	IRSDKWrapper();
	~IRSDKWrapper();

  struct TelemetryVar {

    irsdk_varHeader* header;
    irsdk_VarType type;

    union { // choose correct based on irsdk_VarType
      char* value;
      float* floatValue;
      int* intValue;
      bool* boolValue;
      double* doubleValue;
    };

    TelemetryVar(irsdk_varHeader* varHeader);
    ~TelemetryVar();
  };

	bool startup();
	void shutdown();

  bool updateTelemetry(); // returns true if telemetry update available
  bool updateSessionInfo(); // returns true if session info update available
  
  const std::string getSessionInfo() const; // returns yaml string

	bool isInitialized() const;
	bool isConnected() const;

  const std::vector<irsdk_varHeader*> getVarHeaders() const;

  irsdk_varHeader* getVarHeader(std::string& const name) const;
  
  bool getVar(TelemetryVar& var) const;

private:
	HANDLE hMemMapFile;
	const char *pSharedMem;
	const irsdk_header *pHeader;
	int lastTickCount;
  int lastSessionInfoUpdate;
	time_t lastValidTime;
	char* data;
  std::string sessionInfoStr;

  std::vector<irsdk_varHeader*> varHeadersArr;
  std::map<std::string, irsdk_varHeader*> varHeadersMap;

  void updateVarHeaders(); // updates map and vector
  const char* getSessionInfoStr() const;
};

