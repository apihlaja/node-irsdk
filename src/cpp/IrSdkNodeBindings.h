#pragma once

#include <node.h>

using namespace v8;

namespace NodeIrSdk {

  IRSDKWrapper irsdk;

  void startup(const FunctionCallbackInfo<Value>& args);

  void shutdown(const FunctionCallbackInfo<Value>& args);

  void isInitialized(const FunctionCallbackInfo<Value>& args);

  void isConnected(const FunctionCallbackInfo<Value>& args);

  void updateSessionInfo(const FunctionCallbackInfo<Value>& args);

  void getSessionInfo(const FunctionCallbackInfo<Value>& args);

  void updateTelemetry(const FunctionCallbackInfo<Value>& args);

  void getTelemetry(const FunctionCallbackInfo<Value>& args);

  void getTelemetryDescription(const FunctionCallbackInfo<Value>& args);

  static void cleanUp(void* arg);

  // this defines public api of native addon
  void init(Handle<Object> exports)
  {
    irsdk.startup();

    node::AtExit(cleanUp);

    NODE_SET_METHOD(exports, "start", startup);
    NODE_SET_METHOD(exports, "shutdown", shutdown);

    NODE_SET_METHOD(exports, "isInitialized", isInitialized);
    NODE_SET_METHOD(exports, "isConnected", isConnected);

    NODE_SET_METHOD(exports, "updateSessionInfo", updateSessionInfo);
    NODE_SET_METHOD(exports, "getSessionInfo", getSessionInfo);

    NODE_SET_METHOD(exports, "updateTelemetry", updateTelemetry);
    NODE_SET_METHOD(exports, "getTelemetryDescription", getTelemetryDescription);
    NODE_SET_METHOD(exports, "getTelemetry", getTelemetry);
  }

  // name of native addon
  NODE_MODULE(IrSdkNodeBindings, init)
}