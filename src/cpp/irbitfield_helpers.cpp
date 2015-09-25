#include "irbitfield_helpers.h"
#include <iostream>

using namespace v8;
using namespace std;

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
