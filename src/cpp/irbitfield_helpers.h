#pragma once

#include <node.h>
#include "irsdk/irsdk_defines.h"
#include <vector>

using namespace v8;

// methods to extract/convert bitfields and enums to v8 string/string arrays for readability
namespace iRBitFieldHelpers
{

  struct MaskName {
    int val;
    const char* name;

    MaskName(int val, const char* name);
  };

  Handle<Value> getSessionStateValue(Isolate* isolate, const int& val);
  Handle<Value> getTrackLoc(Isolate* isolate, const int& val);

  Handle<Array> getMaskedValues(Isolate* isolate, const int& val, char* unit);
  Handle<Array> getValueArr(Isolate* isolate, const int& val, const std::vector<iRBitFieldHelpers::MaskName> MASKS);

  const std::vector<MaskName> FLAG_MASKS = {
    MaskName((int)irsdk_checkered, "Checkered"),
    MaskName((int)irsdk_white, "White"),
    MaskName((int)irsdk_green, "Green"),
    MaskName((int)irsdk_yellow, "Yellow"),
    MaskName((int)irsdk_red, "Red"),
    MaskName((int)irsdk_blue, "Blue"),
    MaskName((int)irsdk_debris, "Debris"),
    MaskName((int)irsdk_crossed, "Crossed"),
    MaskName((int)irsdk_yellowWaving, "YellowWaving"),
    MaskName((int)irsdk_oneLapToGreen, "OneLapToGreen"),
    MaskName((int)irsdk_greenHeld, "GreenHeld"),
    MaskName((int)irsdk_tenToGo, "TenToGo"),
    MaskName((int)irsdk_fiveToGo, "FiveToGo"),
    MaskName((int)irsdk_randomWaving, "RandomWaving"),
    MaskName((int)irsdk_caution, "Caution"),
    MaskName((int)irsdk_cautionWaving, "CautionWaving"),

    // drivers black flags
    MaskName((int)irsdk_black, "Black"),
    MaskName((int)irsdk_disqualify, "Disqualify"),
    MaskName((int)irsdk_servicible, "Servicible"),
    MaskName((int)irsdk_furled, "Furled"),
    MaskName((int)irsdk_repair, "Repair"),

    // start lights
    MaskName((int)irsdk_startHidden, "StartHidden"),
    MaskName((int)irsdk_startReady, "StartReady"),
    MaskName((int)irsdk_startSet, "StartSet"),
    MaskName((int)irsdk_startGo, "StartGo")
  };

  const std::vector<MaskName> CAMERA_STATE_MASKS = {
    MaskName((int)irsdk_IsSessionScreen, "IsSessionScreen"),
    MaskName((int)irsdk_IsScenicActive, "IsScenicActive"),

    //these can be changed with a broadcast message
    MaskName((int)irsdk_CamToolActive, "CamToolActive"),
    MaskName((int)irsdk_UIHidden, "UIHidden"),
    MaskName((int)irsdk_UseAutoShotSelection, "UseAutoShotSelection"),
    MaskName((int)irsdk_UseTemporaryEdits, "UseTemporaryEdits"),
    MaskName((int)irsdk_UseKeyAcceleration, "UseKeyAcceleration"),
    MaskName((int)irsdk_UseKey10xAcceleration, "UseKey10xAcceleration"),
    MaskName((int)irsdk_UseMouseAimMode, "UseMouseAimMode")
  };

  const std::vector<MaskName> ENGINE_WARNINGS_MASKS = {
    MaskName((int)irsdk_waterTempWarning, "WaterTempWarning"),
    MaskName((int)irsdk_fuelPressureWarning, "FuelPressureWarning"),
    MaskName((int)irsdk_oilPressureWarning, "OilPressureWarning"),
    MaskName((int)irsdk_engineStalled, "EngineStalled"),
    MaskName((int)irsdk_pitSpeedLimiter, "PitSpeedLimiter"),
    MaskName((int)irsdk_revLimiterActive, "RevLimiterActive"),
  };

  const std::vector<MaskName> SESSION_STATES = {
    MaskName((int)irsdk_StateInvalid, "Invalid"),
    MaskName((int)irsdk_StateGetInCar, "GetInCar"),
    MaskName((int)irsdk_StateWarmup, "Warmup"),
    MaskName((int)irsdk_StateParadeLaps, "ParadeLaps"),
    MaskName((int)irsdk_StateRacing, "Racing"),
    MaskName((int)irsdk_StateCheckered, "Checkered"),
    MaskName((int)irsdk_StateCoolDown, "CoolDown")
  };

  const std::vector<MaskName> TRACK_LOCS = {
    MaskName((int)irsdk_NotInWorld, "NotInWorld"),
    MaskName((int)irsdk_OffTrack, "OffTrack"),
    MaskName((int)irsdk_InPitStall, "InPitStall"),
    MaskName((int)irsdk_AproachingPits, "AproachingPits"),
    MaskName((int)irsdk_OnTrack, "OnTrack")
  };
};

