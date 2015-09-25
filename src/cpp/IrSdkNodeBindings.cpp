#pragma once

#include "IRSDKWrapper.h"
#include "IrSdkBindingHelpers.h"
#include "IrSdkNodeBindings.h"
#include <stdint.h>

using namespace v8;

namespace NodeIrSdk {

  void start(const Nan::FunctionCallbackInfo<v8::Value>& args)
  {
    args.GetReturnValue().Set(Nan::New(irsdk.startup()));
  }

  void shutdown(const Nan::FunctionCallbackInfo<v8::Value>& args)
  {
    irsdk.shutdown();
    args.GetReturnValue().Set(Nan::Undefined());
  }

  void isInitialized(const Nan::FunctionCallbackInfo<v8::Value>& args)
  {
    args.GetReturnValue().Set(Nan::New(irsdk.isInitialized()));
  }

  void isConnected(const Nan::FunctionCallbackInfo<v8::Value>& args)
  {
    args.GetReturnValue().Set(Nan::New(irsdk.isConnected()));
  }

  void updateSessionInfo(const Nan::FunctionCallbackInfo<v8::Value>& args)
  {
    args.GetReturnValue().Set(Nan::New(irsdk.updateSessionInfo()));
  }

  void getSessionInfo(const Nan::FunctionCallbackInfo<v8::Value>& args)
  {
    args.GetReturnValue().Set(
      Nan::Encode(irsdk.getSessionInfo().c_str(), irsdk.getSessionInfo().length(), Nan::BINARY));
  }

  void updateTelemetry(const Nan::FunctionCallbackInfo<v8::Value>& args)
  {
    args.GetReturnValue().Set(Nan::New(irsdk.updateTelemetry()));
  }

  void getTelemetry(const Nan::FunctionCallbackInfo<v8::Value>& args)
  {
    Local<Object> rootObj = Nan::New<v8::Object>();
    Local<Object> valuesObj = Nan::New<v8::Object>();
    Nan::Set(rootObj, Nan::New("timestamp").ToLocalChecked(), Nan::New<Date>(irsdk.getLastTelemetryUpdateTS()).ToLocalChecked());

    std::vector<irsdk_varHeader*> headers = irsdk.getVarHeaders();

    for (const auto item : headers)
    {
      IRSDKWrapper::TelemetryVar var(item);
      irsdk.getVarVal(var);
      Handle<Value> varValue = convertTelemetryVarToObject(var);
      Nan::Set(valuesObj, Nan::New(var.header->name).ToLocalChecked(), varValue);
    }
    Nan::Set(rootObj, Nan::New("values").ToLocalChecked(), valuesObj);
    args.GetReturnValue().Set(rootObj);
  }

  void getTelemetryDescription(const Nan::FunctionCallbackInfo<v8::Value>& args)
  {
    Local<Object> obj = Nan::New<Object>();
    std::vector<irsdk_varHeader*> headers = irsdk.getVarHeaders();

    for (const auto item : headers)
    {
      IRSDKWrapper::TelemetryVar var(item);
      irsdk.getVarVal(var);
      Handle<Object> varObj = Nan::New<Object>();
      convertVarHeaderToObject(var, varObj);
      Nan::Set(obj, Nan::New(var.header->name).ToLocalChecked(), varObj);
    }
    args.GetReturnValue().Set(obj);
  }

  static void cleanUp(void* arg)
  {
    irsdk.shutdown();
  }
}
