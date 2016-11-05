#pragma once

#include <node.h>
#include <nan.h>

using namespace v8;

namespace NodeIrSdk {

  IRSDKWrapper irsdk;

  void start(const Nan::FunctionCallbackInfo<v8::Value>& args);

  void shutdown(const Nan::FunctionCallbackInfo<v8::Value>& args);

  void isInitialized(const Nan::FunctionCallbackInfo<v8::Value>& args);

  void isConnected(const Nan::FunctionCallbackInfo<v8::Value>& args);

  void updateSessionInfo(const Nan::FunctionCallbackInfo<v8::Value>& args);

  void getSessionInfo(const Nan::FunctionCallbackInfo<v8::Value>& args);

  void updateTelemetry(const Nan::FunctionCallbackInfo<v8::Value>& args);

  void getTelemetry(const Nan::FunctionCallbackInfo<v8::Value>& args);

  void getTelemetryDescription(const Nan::FunctionCallbackInfo<v8::Value>& args);
  
  NAN_METHOD(sendCmd);

  static void cleanUp(void* arg);

  // this defines public api of native addon
  NAN_MODULE_INIT(init)
  {
    irsdk.startup();

    node::AtExit(cleanUp);

    NAN_EXPORT(target, start);
    NAN_EXPORT(target, shutdown);

    NAN_EXPORT(target, isInitialized);
    NAN_EXPORT(target, isConnected);

    NAN_EXPORT(target, updateSessionInfo);
    NAN_EXPORT(target, getSessionInfo);

    NAN_EXPORT(target, updateTelemetry);
    NAN_EXPORT(target, getTelemetryDescription);
    NAN_EXPORT(target, getTelemetry);
    
    NAN_EXPORT(target, sendCmd);
  }

  // name of native addon
  NODE_MODULE(IrSdkNodeBindings, init)
}