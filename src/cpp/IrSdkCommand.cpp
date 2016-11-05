#include "IrSdkCommand.h"
#include "irsdk/irsdk_defines.h"

#define WIN32_LEAN_AND_MEAN
#include <windows.h>


void NodeIrSdk::broadcastCmd(int cmd, int var1, int var2) {
  static unsigned int msgId = RegisterWindowMessageA(IRSDK_BROADCASTMSGNAME);

	if(cmd >= 0 && cmd < irsdk_BroadcastLast)
	{
		SendNotifyMessage(HWND_BROADCAST, msgId, MAKELONG(cmd, var1), var2);
	}
}

void NodeIrSdk::broadcastCmd(int cmd, int var1, int var2, int var3) {
  broadcastCmd(cmd, var1, MAKELONG(var2, var3));
}
