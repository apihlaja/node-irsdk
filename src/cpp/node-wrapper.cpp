#include <node.h>
#include "IRSDKWrapper.h"
#include "irbitfield_helpers.h"
#include <stdint.h>

using namespace v8;

IRSDKWrapper irsdk;

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

Handle<Value> convertTelemetryValueToObject(Isolate* isolate, IRSDKWrapper::TelemetryVar& var, const int& index)
{
  switch (var.type) {
  case irsdk_char:
    return String::NewFromUtf8(isolate, (var.value[index])+"\0");
  case irsdk_bool:
    return Boolean::New(isolate, var.boolValue[index]);
  case irsdk_int:
    if (strcmp(var.header->unit, "irsdk_SessionState") == 0) {
      return iRBitFieldHelpers::getSessionStateValue(isolate, var.intValue[index]);
    }
    if (strcmp(var.header->unit, "irsdk_TrkLoc") == 0) {
      return iRBitFieldHelpers::getTrackLoc(isolate, var.intValue[index]);
    }
    return Integer::New(isolate, static_cast<int32_t>(var.intValue[index]));
  case irsdk_bitField:
    return iRBitFieldHelpers::getMaskedValues(isolate, var.intValue[index], var.header->unit);
  case irsdk_float:
    return Number::New(isolate, static_cast<double>(var.floatValue[index]));
  case irsdk_double:
    return Number::New(isolate, var.doubleValue[index]);
  default:
    return Undefined(isolate);
  }
}

Handle<Value> convertTelemetryVarToObject(Isolate* isolate, IRSDKWrapper::TelemetryVar& var)
{
  if (var.header->count > 1) {
    Handle<Array> arr = Array::New(isolate, var.header->count);
    for (int i = 0; i < var.header->count; ++i) 
    {
      arr->Set(i, convertTelemetryValueToObject(isolate, var, i));
    }
    return arr;
  }
  else
  {
    return convertTelemetryValueToObject(isolate, var, 0);
  }
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

void convertVarHeaderToObject(Isolate* isolate, IRSDKWrapper::TelemetryVar& var, Handle<Object>& obj)
{
  obj->Set(String::NewFromUtf8(isolate, "name"), String::NewFromUtf8(isolate, var.header->name));
  obj->Set(String::NewFromUtf8(isolate, "desc"), String::NewFromUtf8(isolate, var.header->desc));
  obj->Set(String::NewFromUtf8(isolate, "unit"), String::NewFromUtf8(isolate, var.header->unit));
  obj->Set(String::NewFromUtf8(isolate, "count"), Integer::New(isolate, var.header->count));
  switch (var.header->type) {
  case irsdk_char:
    obj->Set(String::NewFromUtf8(isolate, "type"), String::NewFromUtf8(isolate, "char"));
    break;
  case irsdk_bool:
    obj->Set(String::NewFromUtf8(isolate, "type"), String::NewFromUtf8(isolate, "bool"));
    break;
  case irsdk_int:
    obj->Set(String::NewFromUtf8(isolate, "type"), String::NewFromUtf8(isolate, "int"));
    break;
  case irsdk_bitField:
    obj->Set(String::NewFromUtf8(isolate, "type"), String::NewFromUtf8(isolate, "bitField"));
    break;
  case irsdk_float:
    obj->Set(String::NewFromUtf8(isolate, "type"), String::NewFromUtf8(isolate, "float"));
    break;
  case irsdk_double:
    obj->Set(String::NewFromUtf8(isolate, "type"), String::NewFromUtf8(isolate, "double"));
    break;
  default:
    obj->Set(String::NewFromUtf8(isolate, "type"), String::NewFromUtf8(isolate, "UNKNOWN"));
    break;
  }
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


NODE_MODULE(IrsdkNodeWrapper, init)