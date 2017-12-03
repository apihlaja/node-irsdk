/**
  IrSdkConsts, iRacing SDK constants/enums.

  @namespace
  @constant
  @example var IrSdkConsts = require('node-irsdk').getInstance().Consts
 */
var IrSdkConsts = {
  /**
    Available command messages.
    @enum
  */
  BroadcastMsg: {
    /** Switch cam, args: car position, group, camera */
    CamSwitchPos: 0,
    /** Switch cam, args, driver #, group, camera */
    CamSwitchNum: 1,
    /** Set cam state, args: CameraState, unused, unused */
    CamSetState: 2,
    /** Set replay speed, args: speed, slowMotion, unused */
    ReplaySetPlaySpeed: 3,
    /** Jump to frame, args: RpyPosMode, Frame Number (high, low) */
    ReplaySetPlayPosition: 4,
    /** Search things from replay, args: RpySrchMode, unused, unused */
    ReplaySearch: 5,
    /** Set replay state, args: RpyStateMode, unused, unused */
    ReplaySetState: 6,
    /** Reload textures, args: ReloadTexturesMode, carIdx, unused */
    ReloadTextures: 7,
    /** Chat commands, args: ChatCommand, subCommand, unused */
    ChatComand: 8,
    /** Pit commands, args: PitCommand, parameter */
    PitCommand: 9,
    /** Disk telemetry commands, args: TelemCommand, unused, unused */
    TelemCommand: 10,
    /** **not supported by node-irsdk**: Change FFB settings, args:  FFBCommandMode, value (float, high, low) */
    FFBCommand: 11,
    /** Search by timestamp, args: sessionNum, sessionTimeMS (high, low) */
    ReplaySearchSessionTime: 12
  },
  /** Camera state
    Camera state is bitfield; use these values to compose a new state.
    @enum
  */
  CameraState: {
    /** Is driver out of the car */
    IsSessionScreen: 0x0001,      //
    /** The scenic camera is active (no focus car) */
    IsScenicActive: 0x0002,       //

    // these can be changed with a broadcast message
    /** Activate camera tool */
    CamToolActive: 0x0004,
    /** Hide UI */
    UIHidden: 0x0008,
    /** Enable auto shot selection */
    UseAutoShotSelection: 0x0010,
    /** Enable temporary edits */
    UseTemporaryEdits: 0x0020,
    /** Enable key acceleration */
    UseKeyAcceleration: 0x0040,
    /** Enable 10x key acceleration */
    UseKey10xAcceleration: 0x0080,
    /** Enable mouse aim */
    UseMouseAimMode: 0x0100
  },
  /** @enum */
  RpyPosMode: {
    /** Frame number is relative to beginning */
    Begin: 0,
    /** Frame number is relative to current frame */
    Current: 1,
    /** Frame number is relative to end */
    End: 2
  },
  /** @enum */
  RpySrchMode:
  {
    ToStart: 0,
    ToEnd: 1,
    PrevSession: 2,
    NextSession: 3,
    PrevLap: 4,
    NextLap: 5,
    PrevFrame: 6,
    NextFrame: 7,
    PrevIncident: 8,
    NextIncident: 9
  },
  /** @enum */
  RpyStateMode: {
    /** Clear any data in the replay tape (works only if replay spooling disabled) */
    EraseTape: 0
  },
  /** @enum */
  ReloadTexturesMode: {
    All: 0,
    CarIdx: 1
  },
  /** @enum */
  ChatCommand:
  {
    /** Macro, give macro num (0-15) as argument */
    Macro: 0,
    /** Open up a new chat window */
    BeginChat: 1,
    /** Reply to last private chat */
    Reply: 2,
    /** Close chat window */
    Cancel: 3
  },
  /** @enum */
  PitCommand:
  {
    /** Clear all pit checkboxes */
    Clear: 0,
    /** Clean the winshield, using one tear off */
    WS: 1,
    /** Request fuel, optional argument: liters */
    Fuel: 2,
    /** Request new left front, optional argument: pressure in kPa */
    LF: 3,
    /** Request new right front, optional argument: pressure in kPa */
    RF: 4,
    /** Request new left rear, optional argument: pressure in kPa */
    LR: 5,
    /** Request new right rear, optional argument: pressure in kPa */
    RR: 6,
    /** Clear tire pit checkboxes */
    ClearTires: 7,
    /** Request a fast repair */
    FR: 8,
    /** Disable clear windshield  */
    ClearWS: 9,
    /** Disable fast repair  */
    ClearFR: 10,
    /** Disable refueling  */
    ClearFuel: 11
  },
  /** @enum */
  TelemCommand:
  {
    /** Turn telemetry recording off */
    Stop: 0,
    /** Turn telemetry recording on */
    Start: 1,
    /** Write current file to disk and start a new one */
    Restart: 2
  },
  /** When switching camera, these can be used instead of car number / position
    @enum
  */
  CamFocusAt:
  {
    Incident: -3,
    Leader: -2,
    Exciting: -1,
    /** Use car number / position instead of this */
    Driver: 0
  }
}

module.exports = IrSdkConsts
