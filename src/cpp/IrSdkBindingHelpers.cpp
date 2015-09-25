#include "IrSdkBindingHelpers.h"
#include <nan.h>
#include <iostream>

using namespace v8;
using namespace std;

Handle<Value> NodeIrSdk::convertTelemetryValueToObject(IRSDKWrapper::TelemetryVar& var, const int& index)
{
  switch (var.type) {
  case irsdk_char:
    return Nan::New((var.value[index]) + "\0").ToLocalChecked();
  case irsdk_bool:
    return Nan::New(var.boolValue[index]);
  case irsdk_int:
    if (strcmp(var.header->unit, "irsdk_SessionState") == 0) {
      return getSessionStateValue(var.intValue[index]);
    }
    if (strcmp(var.header->unit, "irsdk_TrkLoc") == 0) {
      return getTrackLoc(var.intValue[index]);
    }
    return Nan::New(static_cast<int32_t>(var.intValue[index]));
  case irsdk_bitField:
    return getMaskedValues(var.intValue[index], var.header->unit);
  case irsdk_float:
    return Nan::New(static_cast<double>(var.floatValue[index]));
  case irsdk_double:
    return Nan::New(var.doubleValue[index]);
  default:
    return Nan::Undefined();
  }
}

Handle<Value> NodeIrSdk::convertTelemetryVarToObject(IRSDKWrapper::TelemetryVar& var)
{
  if (var.header->count > 1) {
    Handle<Array> arr = Nan::New<Array>(var.header->count);
    for (int i = 0; i < var.header->count; ++i)
    {
      arr->Set(i, convertTelemetryValueToObject(var, i));
    }
    return arr;
  }
  else
  {
    return convertTelemetryValueToObject(var, 0);
  }
}

void NodeIrSdk::convertVarHeaderToObject(IRSDKWrapper::TelemetryVar& var, Handle<Object>& obj)
{
  Nan::Set(obj, Nan::New("name").ToLocalChecked(), Nan::New(var.header->name).ToLocalChecked());
  Nan::Set(obj, Nan::New("desc").ToLocalChecked(), Nan::New(var.header->desc).ToLocalChecked());
  Nan::Set(obj, Nan::New("unit").ToLocalChecked(), Nan::New(var.header->unit).ToLocalChecked());
  Nan::Set(obj, Nan::New("count").ToLocalChecked(), Nan::New(var.header->count));
  
  switch (var.header->type) {
  case irsdk_char:
    Nan::Set(obj, Nan::New("type").ToLocalChecked(), Nan::New("char").ToLocalChecked());
    break;
  case irsdk_bool:
    Nan::Set(obj, Nan::New("type").ToLocalChecked(), Nan::New("bool").ToLocalChecked());
    break;
  case irsdk_int:
    Nan::Set(obj, Nan::New("type").ToLocalChecked(), Nan::New("int").ToLocalChecked());
    break;
  case irsdk_bitField:
    Nan::Set(obj, Nan::New("type").ToLocalChecked(), Nan::New("bitField").ToLocalChecked());
    break;
  case irsdk_float:
    Nan::Set(obj, Nan::New("type").ToLocalChecked(), Nan::New("float").ToLocalChecked());
    break;
  case irsdk_double:
    Nan::Set(obj, Nan::New("type").ToLocalChecked(), Nan::New("double").ToLocalChecked());
    break;
  default:
    Nan::Set(obj, Nan::New("type").ToLocalChecked(), Nan::New("UNKNOWN").ToLocalChecked());
    break;
  }
}

Handle<Value> NodeIrSdk::getMaskedValues(const int& val, char* unit)
{
  if (strcmp(unit,"irsdk_Flags") == 0) {
    return getValueArr(val, FLAG_MASKS);
  }
  if (strcmp(unit, "irsdk_CameraState") == 0) {
    return getValueArr(val, CAMERA_STATE_MASKS);
  }
  if (strcmp(unit, "irsdk_EngineWarnings") == 0) {
    return getValueArr(val, ENGINE_WARNINGS_MASKS);
  }
  if (strcmp(unit, "irsdk_PitSvFlags") == 0) {
    return getValueArr(val, PIT_SV_MASKS);
  }
  cerr << "Missing converter for bitField: " << unit << endl;
  return Nan::New(static_cast<int32_t>(val));
}

Handle<Array> NodeIrSdk::getValueArr(const int& val, const std::vector<NodeIrSdk::MaskName> MASKS)
{
  Handle<Array> arr = Nan::New<Array>();
  int counter = 0;
  for (const auto& mask : MASKS)
  {
    if ((mask.val & val) == mask.val) {
      Nan::Set(arr, counter++, Nan::New(mask.name).ToLocalChecked());
    }
  }
  return arr;
}

Handle<Value> NodeIrSdk::getSessionStateValue(const int& val)
{
  for (const auto& mask : SESSION_STATES) {
    if (mask.val == val) {
      return Nan::New(mask.name).ToLocalChecked();
    }
  }
  return Nan::Undefined();
}

Handle<Value> NodeIrSdk::getTrackLoc(const int& val)
{
  for (const auto& mask : TRACK_LOCS) {
    if (mask.val == val) {
      return Nan::New(mask.name).ToLocalChecked();
    }
  }
  return Nan::Undefined();
}

NodeIrSdk::MaskName::MaskName(int val, const char* name) : 
val(val), name(name)
{
}
