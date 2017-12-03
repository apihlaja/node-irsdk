#pragma once

#include <node.h>
#include "irsdk/irsdk_defines.h"
#include "IRSDKWrapper.h"
#include <vector>

using namespace v8;

namespace NodeIrSdk
{

  Handle<Value> convertTelemetryValueToObject(IRSDKWrapper::TelemetryVar& var, const int& index);
  Handle<Value> convertTelemetryVarToObject(IRSDKWrapper::TelemetryVar& var);
  void convertVarHeaderToObject(IRSDKWrapper::TelemetryVar& var, Handle<Object>& obj);


  struct MaskName {
    int val;
    const char* name;

    MaskName(int val, const char* name);
  };

  Handle<Value> getStringValue(const int& val, const std::vector<MaskName>& map);

  Handle<Value> getMaskedValues(const int& val, char* unit);
  Handle<Array> getValueArr(const int& val, const std::vector<MaskName> MASKS);

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
  
  const std::vector<MaskName> PIT_SV_MASKS = {
    MaskName((int)irsdk_LFTireChange, "LFTireChange"),
    MaskName((int)irsdk_RFTireChange, "RFTireChange"),
    MaskName((int)irsdk_LRTireChange, "LRTireChange"),
    MaskName((int)irsdk_RRTireChange, "RRTireChange"),

    MaskName((int)irsdk_FuelFill, "FuelFill"),
    MaskName((int)irsdk_WindshieldTearoff, "WindshieldTearoff"),
    MaskName((int)irsdk_FastRepair, "FastRepair")
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

  const std::vector<MaskName> TRACK_SURF = {
      MaskName((int)irsdk_SurfaceNotInWorld, "SurfaceNotInWorld"),
      MaskName((int)irsdk_UndefinedMaterial, "UndefinedMaterial"),

      MaskName((int)irsdk_Asphalt1Material, "Asphalt1Material"),
      MaskName((int)irsdk_Asphalt2Material, "Asphalt2Material"),
      MaskName((int)irsdk_Asphalt3Material, "Asphalt3Material"),
      MaskName((int)irsdk_Asphalt4Material, "Asphalt4Material"),
      MaskName((int)irsdk_Concrete1Material, "Concrete1Material"),
      MaskName((int)irsdk_Concrete2Material, "Concrete2Material"),
      MaskName((int)irsdk_RacingDirt1Material, "RacingDirt1Material"),
      MaskName((int)irsdk_RacingDirt2Material, "RacingDirt2Material"),
      MaskName((int)irsdk_Paint1Material, "Paint1Material"),
      MaskName((int)irsdk_Paint2Material, "Paint2Material"),
      MaskName((int)irsdk_Rumble1Material, "Rumble1Material"),
      MaskName((int)irsdk_Rumble2Material, "Rumble2Material"),
      MaskName((int)irsdk_Rumble3Material, "Rumble3Material"),
      MaskName((int)irsdk_Rumble4Material, "Rumble4Material"),

      MaskName((int)irsdk_Grass1Material, "Grass1Material"),
      MaskName((int)irsdk_Grass2Material, "Grass2Material"),
      MaskName((int)irsdk_Grass3Material, "Grass3Material"),
      MaskName((int)irsdk_Grass4Material, "Grass4Material"),
      MaskName((int)irsdk_Dirt1Material, "Dirt1Material"),
      MaskName((int)irsdk_Dirt2Material, "Dirt2Material"),
      MaskName((int)irsdk_Dirt3Material, "Dirt3Material"),
      MaskName((int)irsdk_Dirt4Material, "Dirt4Material"),
      MaskName((int)irsdk_SandMaterial, "SandMaterial"),
      MaskName((int)irsdk_Gravel1Material, "Gravel1Material"),
      MaskName((int)irsdk_Gravel2Material, "Gravel2Material"),
      MaskName((int)irsdk_GrasscreteMaterial, "GrasscreteMaterial"),
      MaskName((int)irsdk_AstroturfMaterial, "AstroturfMaterial"),
  };

  const std::vector<MaskName> CAR_BESIDE = {
    MaskName((int)irsdk_LROff, "LROff"),
    MaskName((int)irsdk_LRClear, "LRClear"),	// no cars around us.
    MaskName((int)irsdk_LRCarLeft, "LRCarLeft"),	// there is a car to our left.
    MaskName((int)irsdk_LRCarRight, "LRCarRight"),	// there is a car to our right.
    MaskName((int)irsdk_LRCarLeftRight, "LRCarLeftRight"),	// there are cars on each side.
    MaskName((int)irsdk_LR2CarsLeft, "LR2CarsLeft"),	// there are two cars to our left.
    MaskName((int)irsdk_LR2CarsRight, "LR2CarsRight")	// there are two cars to our right.
  };
};

