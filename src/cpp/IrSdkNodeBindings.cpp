#pragma once

#include "IRSDKWrapper.h"
#include "IrSdkBindingHelpers.h"
#include "IrSdkNodeBindings.h"
#include <stdint.h>

using namespace v8;

namespace NodeIrSdk {

  void startup(const FunctionCallbackInfo<Value>& args)
  {
    Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);

    args.GetReturnValue().Set(Boolean::New(isolate, irsdk.startup()));
  }

  void shutdown(const FunctionCallbackInfo<Value>& args)
  {
    Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    irsdk.shutdown();
    args.GetReturnValue().Set(Undefined(isolate));
  }

  void isInitialized(const FunctionCallbackInfo<Value>& args)
  {
    Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);

    args.GetReturnValue().Set(Boolean::New(isolate, irsdk.isInitialized()));
  }

  void isConnected(const FunctionCallbackInfo<Value>& args)
  {
    Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);

    args.GetReturnValue().Set(Boolean::New(isolate, irsdk.isConnected()));
  }

  void updateSessionInfo(const FunctionCallbackInfo<Value>& args)
  {
    Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);

    args.GetReturnValue().Set(Boolean::New(isolate, irsdk.updateSessionInfo()));
  }

  void getSessionInfo(const FunctionCallbackInfo<Value>& args)
  {
    Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    args.GetReturnValue().Set(
      node::Encode(irsdk.getSessionInfo().c_str(), irsdk.getSessionInfo().length(), node::BINARY));
  }

  void updateTelemetry(const FunctionCallbackInfo<Value>& args)
  {
    Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);

    args.GetReturnValue().Set(Boolean::New(isolate, irsdk.updateTelemetry()));
  }

  void getTelemetry(const FunctionCallbackInfo<Value>& args)
  {
    Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);

    Local<Object> rootObj = Object::New(isolate);
    Local<Object> valuesObj = Object::New(isolate);
    rootObj->Set(String::NewFromUtf8(isolate, "timestamp"), Date::New(isolate, irsdk.getLastTelemetryUpdateTS()));

    std::vector<irsdk_varHeader*> headers = irsdk.getVarHeaders();

    for (const auto item : headers)
    {
      IRSDKWrapper::TelemetryVar var(item);
      irsdk.getVarVal(var);
      Handle<Value> varValue = convertTelemetryVarToObject(isolate, var);
      valuesObj->Set(String::NewFromUtf8(isolate, var.header->name), varValue);
    }
    rootObj->Set(String::NewFromUtf8(isolate, "values"), valuesObj);
    args.GetReturnValue().Set(rootObj);
  }

  void getTelemetryDescription(const FunctionCallbackInfo<Value>& args)
  {
    Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);

    Local<Object> obj = Object::New(isolate);
    std::vector<irsdk_varHeader*> headers = irsdk.getVarHeaders();

    for (const auto item : headers)
    {
      IRSDKWrapper::TelemetryVar var(item);
      irsdk.getVarVal(var);
      Handle<Object> varObj = Object::New(isolate);
      convertVarHeaderToObject(isolate, var, varObj);
      obj->Set(String::NewFromUtf8(isolate, var.header->name), varObj);
    }
    args.GetReturnValue().Set(obj);
  }

  static void cleanUp(void* arg)
  {
    irsdk.shutdown();
  }
}
