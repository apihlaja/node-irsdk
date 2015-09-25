#include "IrSdkBindingHelpers.h"
#include <iostream>

using namespace v8;
using namespace std;

Handle<Value> NodeIrSdk::convertTelemetryValueToObject(Isolate* isolate, IRSDKWrapper::TelemetryVar& var, const int& index)
{
  switch (var.type) {
  case irsdk_char:
    return String::NewFromUtf8(isolate, (var.value[index]) + "\0");
  case irsdk_bool:
    return Boolean::New(isolate, var.boolValue[index]);
  case irsdk_int:
    if (strcmp(var.header->unit, "irsdk_SessionState") == 0) {
      return getSessionStateValue(isolate, var.intValue[index]);
    }
    if (strcmp(var.header->unit, "irsdk_TrkLoc") == 0) {
      return getTrackLoc(isolate, var.intValue[index]);
    }
    return Integer::New(isolate, static_cast<int32_t>(var.intValue[index]));
  case irsdk_bitField:
    return getMaskedValues(isolate, var.intValue[index], var.header->unit);
  case irsdk_float:
    return Number::New(isolate, static_cast<double>(var.floatValue[index]));
  case irsdk_double:
    return Number::New(isolate, var.doubleValue[index]);
  default:
    return Undefined(isolate);
  }
}

Handle<Value> NodeIrSdk::convertTelemetryVarToObject(Isolate* isolate, IRSDKWrapper::TelemetryVar& var)
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

void NodeIrSdk::convertVarHeaderToObject(Isolate* isolate, IRSDKWrapper::TelemetryVar& var, Handle<Object>& obj)
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

Handle<Value> NodeIrSdk::getMaskedValues(Isolate* isolate, const int& val, char* unit)
{
  if (strcmp(unit,"irsdk_Flags") == 0) {
    return getValueArr(isolate, val, FLAG_MASKS);
  }
  if (strcmp(unit, "irsdk_CameraState") == 0) {
    return getValueArr(isolate, val, CAMERA_STATE_MASKS);
  }
  if (strcmp(unit, "irsdk_EngineWarnings") == 0) {
    return getValueArr(isolate, val, ENGINE_WARNINGS_MASKS);
  }
  if (strcmp(unit, "irsdk_PitSvFlags") == 0) {
    return getValueArr(isolate, val, PIT_SV_MASKS);
  }
  cerr << "Missing converter for bitField: " << unit << endl;
  return Integer::New(isolate, static_cast<int32_t>(val));
}

Handle<Array> NodeIrSdk::getValueArr(Isolate* isolate, const int& val, const std::vector<NodeIrSdk::MaskName> MASKS)
{
  Handle<Array> arr = Array::New(isolate);
  int counter = 0;
  for (const auto& mask : MASKS)
  {
    if ((mask.val & val) == mask.val) {
      arr->Set(counter++, String::NewFromUtf8(isolate, mask.name));
    }
  }
  return arr;
}

Handle<Value> NodeIrSdk::getSessionStateValue(Isolate* isolate, const int& val)
{
  for (const auto& mask : SESSION_STATES) {
    if (mask.val == val) {
      return String::NewFromUtf8(isolate,mask.name);
    }
  }
  return Undefined(isolate);
}

Handle<Value> NodeIrSdk::getTrackLoc(Isolate* isolate, const int& val)
{
  for (const auto& mask : TRACK_LOCS) {
    if (mask.val == val) {
      return String::NewFromUtf8(isolate, mask.name);
    }
  }
  return Undefined(isolate);
}

NodeIrSdk::MaskName::MaskName(int val, const char* name) : 
val(val), name(name)
{
}
