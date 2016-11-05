#pragma once

#include "irsdk/irsdk_defines.h"

namespace NodeIrSdk {
  void broadcastCmd(int cmd, int var1, int var2);
  void broadcastCmd(int cmd, int var1, int var2, int var3);
}
