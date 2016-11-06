module.exports = {
  BroadcastMsg: {
    CamSwitchPos: 0,              // car position, group, camera
    CamSwitchNum: 1,              // driver #, group, camera
    CamSetState: 2,               // irsdk_CameraState, unused, unused 
    ReplaySetPlaySpeed: 3,        // speed, slowMotion, unused
    ReplaySetPlayPosition: 4,     // RpyPosMode, Frame Number (high, low)
    ReplaySearch: 5,              // RpySrchMode, unused, unused
    // ReplaySetState: 6,         // RpyStateMode, unused, unused
    ReloadTextures: 7,            // ReloadTexturesMode, carIdx, unused
    ChatComand: 8,                // ChatCommand, subCommand, unused
    PitCommand: 9,                // PitCommand, parameter
    TelemCommand: 10,             // TelemCommand, unused, unused
    // FFBCommand: 11,            // FFBCommandMode, value (float, high, low)
    ReplaySearchSessionTime: 12,  // sessionNum, sessionTimeMS (high, low)
  },
  CameraState: {
    IsSessionScreen:           0x0001, // the camera tool can only be activated if viewing the session screen (out of car)
    IsScenicActive:            0x0002, // the scenic camera is active (no focus car)

    //these can be changed with a broadcast message
    CamToolActive:             0x0004,
    UIHidden:                  0x0008,
    UseAutoShotSelection:      0x0010,
    UseTemporaryEdits:         0x0020,
    UseKeyAcceleration:        0x0040,
    UseKey10xAcceleration:     0x0080,
    UseMouseAimMode:           0x0100
  },
  RpyPosMode: {
    Begin: 0,
    Current: 1,
    End: 2,
  },
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
    NextIncident: 9,
  },
  RpyStateMode: {
    EraseTape: 0,		// clear any data in the replay tape
  },
  ReloadTexturesMode: {
    All: 0,
    CarIdx: 1
  },
  ChatCommand: 
  {
    Macro: 0,       // pass in a number from 1-15 representing the chat macro to launch
    BeginChat: 1,   // Open up a new chat window
    Reply: 2,       // Reply to last private chat
    Cancel: 3,      // Close chat window
  },
  PitCommand:
  {
    Clear: 0,       // Clear all pit checkboxes
    WS: 1,          // Clean the winshield, using one tear off
    Fuel: 2,        // Add fuel, optionally specify the amount to add in liters or pass '0' to use existing amount
    LF: 3,          // Change the left front tire, optionally specifying the pressure in KPa or pass '0' to use existing pressure
    RF: 4,          // right front
    LR: 5,          // left rear
    RR: 6,          // right rear
    ClearTires: 7,  // Clear tire pit checkboxes
    FR: 8,          // Request a fast repair
  },
  TelemCommand:
  {
    Stop: 0,        // Turn telemetry recording off
    Start: 1,       // Turn telemetry recording on
    Restart: 2,     // Write current file to disk and start a new one
  }
}