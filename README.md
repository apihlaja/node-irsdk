# node-irsdk

[![Build status](https://ci.appveyor.com/api/projects/status/ukyuuq9004wy9h5b/branch/master?svg=true)](https://ci.appveyor.com/project/apihlaja/node-irsdk/branch/master)

iRacing SDK implementation for Node.js. 

You can find simple usage examples from [utils](utils/) directory.

Released under the [MIT License](LICENSE.md).


## Installing

Before installing, you need

* Windows version of [Node.js](https://nodejs.org/download/) v4 or later
* Visual Studio and Python 2.7 for node-gyp, see 
[installation instructions](https://github.com/TooTallNate/node-gyp)

`npm install --save node-irsdk`

# API

<a name="module_irsdk"></a>

## irsdk

* [irsdk](#module_irsdk)
    * [.init([opts])](#module_irsdk.init)
    * [.getInstance()](#module_irsdk.getInstance) ⇒ <code>[iracing](#iracing)</code>

<a name="module_irsdk.init"></a>

### irsdk.init([opts])
Initialize JsIrSdk, can be done once before using getInstance first time.

**Kind**: static method of <code>[irsdk](#module_irsdk)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [opts] | <code>Object</code> |  | Options |
| [opts.telemetryUpdateInterval] | <code>Integer</code> | <code>5</code> | Telemetry update interval, milliseconds |
| [opts.sessionInfoUpdateInterval] | <code>Integer</code> | <code>1000</code> | SessionInfo update interval, milliseconds |
| [opts.sessionInfoParser] | <code>[sessionInfoParser](#iracing..sessionInfoParser)</code> |  | Custom parser for session info |

  
```js
var irsdk = require('node-irsdk')
irsdk.init({telemetryUpdateInterval: 0}) // update telemetry as fast as possible
var iracing = irsdk.getInstance()
```
<a name="module_irsdk.getInstance"></a>

### irsdk.getInstance() ⇒ <code>[iracing](#iracing)</code>
Get initialized instance of JsIrSdk

**Kind**: static method of <code>[irsdk](#module_irsdk)</code>  
**Returns**: <code>[iracing](#iracing)</code> - Running instance of JsIrSdk  
  
```js
var irsdk = require('node-irsdk')
var iracing = irsdk.getInstance()
```
<a name="iracing"></a>

## iracing
**Kind**: global class  
**Emits**: <code>[Connected](#iracing+event_Connected)</code>, <code>[Disconnected](#iracing+event_Disconnected)</code>, <code>[Telemetry](#iracing+event_Telemetry)</code>, <code>[TelemetryDescription](#iracing+event_TelemetryDescription)</code>, <code>[SessionInfo](#iracing+event_SessionInfo)</code>  

* [iracing](#iracing)
    * [new JsIrSdk()](#new_iracing_new)
    * _instance_
        * [.Consts](#iracing+Consts) : <code>[IrSdkConsts](#IrSdkConsts)</code>
        * [.camControls](#iracing+camControls) : <code>Object</code>
            * [.setState(state)](#iracing+camControls.setState)
            * [.switchToCar(carNum, [camGroupNum], [camNum])](#iracing+camControls.switchToCar)
            * [.switchToPos(position, [camGroupNum], [camNum])](#iracing+camControls.switchToPos)
        * [.playbackControls](#iracing+playbackControls) : <code>Object</code>
            * [.play()](#iracing+playbackControls.play)
            * [.pause()](#iracing+playbackControls.pause)
            * [.fastForward([speed])](#iracing+playbackControls.fastForward)
            * [.rewind([speed])](#iracing+playbackControls.rewind)
            * [.slowForward([divider])](#iracing+playbackControls.slowForward)
            * [.slowBackward([divider])](#iracing+playbackControls.slowBackward)
            * [.search(searchMode)](#iracing+playbackControls.search)
            * [.searchTs(sessionNum, sessionTimeMS)](#iracing+playbackControls.searchTs)
            * [.searchFrame(frameNum, rpyPosMode)](#iracing+playbackControls.searchFrame)
        * [.telemetry](#iracing+telemetry)
        * [.telemetryDescription](#iracing+telemetryDescription)
        * [.sessionInfo](#iracing+sessionInfo)
        * [.execCmd(msgId, [arg1], [arg2], [arg3])](#iracing+execCmd)
        * [.reloadTextures()](#iracing+reloadTextures)
        * [.reloadTexture(carIdx)](#iracing+reloadTexture)
        * [.execChatCmd(cmd, [arg])](#iracing+execChatCmd)
        * [.execChatMacro(num)](#iracing+execChatMacro)
        * [.execPitCmd(cmd, [arg])](#iracing+execPitCmd)
        * [.execTelemetryCmd(cmd)](#iracing+execTelemetryCmd)
        * ["Connected"](#iracing+event_Connected)
        * ["Disconnected"](#iracing+event_Disconnected)
        * ["TelemetryDescription"](#iracing+event_TelemetryDescription)
        * ["Telemetry"](#iracing+event_Telemetry)
        * ["SessionInfo"](#iracing+event_SessionInfo)
    * _inner_
        * [~sessionInfoParser](#iracing..sessionInfoParser) ⇒ <code>Object</code>

<a name="new_iracing_new"></a>

### new JsIrSdk()
JsIrSdk is javascript implementation of iRacing SDK.

  Don't use constructor directly, use [getInstance](#module_irsdk.getInstance).

  
```js
var iracing = require('node-irsdk').getInstance()
```
<a name="iracing+Consts"></a>

### iracing.Consts : <code>[IrSdkConsts](#IrSdkConsts)</code>
iRacing SDK related constants

**Kind**: instance property of <code>[iracing](#iracing)</code>  
<a name="iracing+camControls"></a>

### iracing.camControls : <code>Object</code>
Camera controls

**Kind**: instance property of <code>[iracing](#iracing)</code>  

* [.camControls](#iracing+camControls) : <code>Object</code>
    * [.setState(state)](#iracing+camControls.setState)
    * [.switchToCar(carNum, [camGroupNum], [camNum])](#iracing+camControls.switchToCar)
    * [.switchToPos(position, [camGroupNum], [camNum])](#iracing+camControls.switchToPos)

<a name="iracing+camControls.setState"></a>

#### camControls.setState(state)
Change camera tool state

**Kind**: static method of <code>[camControls](#iracing+camControls)</code>  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>[CameraState](#IrSdkConsts.CameraState)</code> | new state |

  
```js
var CamState = iracing.Consts.CameraState
var state = CamState.CamToolActive | CamState.UIHidden | CamState.UseMouseAimMode
iracing.camControls.setState(state) // hide UI and enable mouse aim
```
<a name="iracing+camControls.switchToCar"></a>

#### camControls.switchToCar(carNum, [camGroupNum], [camNum])
Switch camera, focus on car

**Kind**: static method of <code>[camControls](#iracing+camControls)</code>  

| Param | Type | Description |
| --- | --- | --- |
| carNum | <code>Integer</code> | Car to focus on |
| [camGroupNum] | <code>Integer</code> | Select camera group |
| [camNum] | <code>Integer</code> | Select camera |

  
```js
iracing.camControls.switchToCar(2) // show car #2
```
<a name="iracing+camControls.switchToPos"></a>

#### camControls.switchToPos(position, [camGroupNum], [camNum])
Switch camera, focus on position

**Kind**: static method of <code>[camControls](#iracing+camControls)</code>  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>Integer</code> | Position to focus on |
| [camGroupNum] | <code>Integer</code> | Select camera group |
| [camNum] | <code>Integer</code> | Select camera |

  
```js
iracing.camControls.switchToPos(2) // show P2
```
<a name="iracing+playbackControls"></a>

### iracing.playbackControls : <code>Object</code>
Replay and playback controls

**Kind**: instance property of <code>[iracing](#iracing)</code>  

* [.playbackControls](#iracing+playbackControls) : <code>Object</code>
    * [.play()](#iracing+playbackControls.play)
    * [.pause()](#iracing+playbackControls.pause)
    * [.fastForward([speed])](#iracing+playbackControls.fastForward)
    * [.rewind([speed])](#iracing+playbackControls.rewind)
    * [.slowForward([divider])](#iracing+playbackControls.slowForward)
    * [.slowBackward([divider])](#iracing+playbackControls.slowBackward)
    * [.search(searchMode)](#iracing+playbackControls.search)
    * [.searchTs(sessionNum, sessionTimeMS)](#iracing+playbackControls.searchTs)
    * [.searchFrame(frameNum, rpyPosMode)](#iracing+playbackControls.searchFrame)

<a name="iracing+playbackControls.play"></a>

#### playbackControls.play()
Play replay

**Kind**: static method of <code>[playbackControls](#iracing+playbackControls)</code>  
  
```js
iracing.playbackControls.play()
```
<a name="iracing+playbackControls.pause"></a>

#### playbackControls.pause()
Pause replay

**Kind**: static method of <code>[playbackControls](#iracing+playbackControls)</code>  
  
```js
iracing.playbackControls.pause()
```
<a name="iracing+playbackControls.fastForward"></a>

#### playbackControls.fastForward([speed])
fast-forward replay

**Kind**: static method of <code>[playbackControls](#iracing+playbackControls)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [speed] | <code>Integer</code> | <code>2</code> | FF speed, something between 2-16 works |

  
```js
iracing.playbackControls.fastForward() // double speed FF
```
<a name="iracing+playbackControls.rewind"></a>

#### playbackControls.rewind([speed])
rewind replay

**Kind**: static method of <code>[playbackControls](#iracing+playbackControls)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [speed] | <code>Integer</code> | <code>2</code> | RW speed, something between 2-16 works |

  
```js
iracing.playbackControls.rewind() // double speed RW
```
<a name="iracing+playbackControls.slowForward"></a>

#### playbackControls.slowForward([divider])
slow-forward replay, slow motion

**Kind**: static method of <code>[playbackControls](#iracing+playbackControls)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [divider] | <code>Integer</code> | <code>2</code> | divider of speed, something between 2-17 works |

  
```js
iracing.playbackControls.slowForward(2) // half speed
```
<a name="iracing+playbackControls.slowBackward"></a>

#### playbackControls.slowBackward([divider])
slow-backward replay, reverse slow motion

**Kind**: static method of <code>[playbackControls](#iracing+playbackControls)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [divider] | <code>Integer</code> | <code>2</code> | divider of speed, something between 2-17 works |

  
```js
iracing.playbackControls.slowBackward(2) // half speed RW
```
<a name="iracing+playbackControls.search"></a>

#### playbackControls.search(searchMode)
Search things from replay

**Kind**: static method of <code>[playbackControls](#iracing+playbackControls)</code>  

| Param | Type | Description |
| --- | --- | --- |
| searchMode | <code>[RpySrchMode](#IrSdkConsts.RpySrchMode)</code> | what to search |

  
```js
iracing.playbackControls.search('nextIncident')
```
<a name="iracing+playbackControls.searchTs"></a>

#### playbackControls.searchTs(sessionNum, sessionTimeMS)
Search timestamp

**Kind**: static method of <code>[playbackControls](#iracing+playbackControls)</code>  

| Param | Type | Description |
| --- | --- | --- |
| sessionNum | <code>Integer</code> | Session number |
| sessionTimeMS | <code>Integer</code> | Session time in milliseconds |

  
```js
iracing.playbackControls.searchTs(2, 2*60*1000) // 2nd minute of 3rd session
```
<a name="iracing+playbackControls.searchFrame"></a>

#### playbackControls.searchFrame(frameNum, rpyPosMode)
Go to frame. Frame counting can be relative to begin, end or current.

**Kind**: static method of <code>[playbackControls](#iracing+playbackControls)</code>  

| Param | Type | Description |
| --- | --- | --- |
| frameNum | <code>Integer</code> | Frame number |
| rpyPosMode | <code>[RpyPosMode](#IrSdkConsts.RpyPosMode)</code> | Is frame number relative to begin, end or current frame |

  
```js
iracing.playbackControls.searchFrame(1, 'current') // go to 1 frame forward
```
<a name="iracing+telemetry"></a>

### iracing.telemetry
Latest telemetry, may be null or undefined

**Kind**: instance property of <code>[iracing](#iracing)</code>  
<a name="iracing+telemetryDescription"></a>

### iracing.telemetryDescription
Latest telemetry, may be null or undefined

**Kind**: instance property of <code>[iracing](#iracing)</code>  
<a name="iracing+sessionInfo"></a>

### iracing.sessionInfo
Latest telemetry, may be null or undefined

**Kind**: instance property of <code>[iracing](#iracing)</code>  
<a name="iracing+execCmd"></a>

### iracing.execCmd(msgId, [arg1], [arg2], [arg3])
Execute any of available commands, excl. FFB command

**Kind**: instance method of <code>[iracing](#iracing)</code>  

| Param | Type | Description |
| --- | --- | --- |
| msgId | <code>Integer</code> | Message id |
| [arg1] | <code>Integer</code> | 1st argument |
| [arg2] | <code>Integer</code> | 2nd argument |
| [arg3] | <code>Integer</code> | 3rd argument |

<a name="iracing+reloadTextures"></a>

### iracing.reloadTextures()
Reload all car textures

**Kind**: instance method of <code>[iracing](#iracing)</code>  
  
```js
iracing.reloadTextures() // reload all paints
```
<a name="iracing+reloadTexture"></a>

### iracing.reloadTexture(carIdx)
Reload car's texture

**Kind**: instance method of <code>[iracing](#iracing)</code>  

| Param | Type | Description |
| --- | --- | --- |
| carIdx | <code>Integer</code> | car to reload |

  
```js
iracing.reloadTexture(1) // reload paint of carIdx=1
```
<a name="iracing+execChatCmd"></a>

### iracing.execChatCmd(cmd, [arg])
Execute chat command

**Kind**: instance method of <code>[iracing](#iracing)</code>  

| Param | Type | Description |
| --- | --- | --- |
| cmd | <code>[ChatCommand](#IrSdkConsts.ChatCommand)</code> |  |
| [arg] | <code>Integer</code> | Command argument, if needed |

  
```js
iracing.execChatCmd('cancel') // close chat window
```
<a name="iracing+execChatMacro"></a>

### iracing.execChatMacro(num)
Execute chat macro

**Kind**: instance method of <code>[iracing](#iracing)</code>  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>Integer</code> | Macro's number (0-15) |

  
```js
iracing.execChatMacro(1) // macro 1
```
<a name="iracing+execPitCmd"></a>

### iracing.execPitCmd(cmd, [arg])
Execute pit command

**Kind**: instance method of <code>[iracing](#iracing)</code>  

| Param | Type | Description |
| --- | --- | --- |
| cmd | <code>[PitCommand](#IrSdkConsts.PitCommand)</code> |  |
| [arg] | <code>Integer</code> | Command argument, if needed |

  
```js
// full tank, no tires, no tear off
iracing.execPitCmd('clear')
iracing.execPitCmd('fuel', 999) // request 999 liters
```
<a name="iracing+execTelemetryCmd"></a>

### iracing.execTelemetryCmd(cmd)
Control telemetry logging (ibt file)

**Kind**: instance method of <code>[iracing](#iracing)</code>  

| Param | Type | Description |
| --- | --- | --- |
| cmd | <code>[TelemCommand](#IrSdkConsts.TelemCommand)</code> | Command: start/stop/restart |

  
```js
iracing.execTelemetryCmd('restart')
```
<a name="iracing+event_Connected"></a>

### "Connected"
iRacing, sim, is started

**Kind**: event emitted by <code>[iracing](#iracing)</code>  
  
```js
iracing.on('Connected', function () {console.log('connected')})
```
<a name="iracing+event_Disconnected"></a>

### "Disconnected"
iRacing, sim, was closed

**Kind**: event emitted by <code>[iracing](#iracing)</code>  
  
```js
iracing.on('Disconnected', function () {console.log('disconnected')})
```
<a name="iracing+event_TelemetryDescription"></a>

### "TelemetryDescription"
Telemetry description, contains description of available telemetry values

**Kind**: event emitted by <code>[iracing](#iracing)</code>  
  
```js
iracing.on('TelemetryDescription', function (data) { console.log('TelemetryDesc:', data)})
```
<a name="iracing+event_Telemetry"></a>

### "Telemetry"
Telemetry update

**Kind**: event emitted by <code>[iracing](#iracing)</code>  
  
```js
iracing.on('Telemetry', function (data) { console.log('Telemetry:', data)})
```
<a name="iracing+event_SessionInfo"></a>

### "SessionInfo"
SessionInfo update

**Kind**: event emitted by <code>[iracing](#iracing)</code>  
  
```js
iracing.on('SessionInfo', function (data) { console.log('SessionInfo:', data)})
```
<a name="iracing..sessionInfoParser"></a>

### iracing~sessionInfoParser ⇒ <code>Object</code>
Parser for SessionInfo YAML

**Kind**: inner typedef of <code>[iracing](#iracing)</code>  
**Returns**: <code>Object</code> - parsed session info  

| Param | Type | Description |
| --- | --- | --- |
| sessionInfo | <code>String</code> | SessionInfo YAML |

<a name="IrSdkConsts"></a>

## IrSdkConsts
IrSdkConsts, iRacing SDK constants/enums.

**Kind**: global constant  
  
```js
var IrSdkConsts = require('node-irsdk').getInstance().Consts
```

* [IrSdkConsts](#IrSdkConsts)
    * [.BroadcastMsg](#IrSdkConsts.BroadcastMsg)
    * [.CameraState](#IrSdkConsts.CameraState)
    * [.RpyPosMode](#IrSdkConsts.RpyPosMode)
    * [.RpySrchMode](#IrSdkConsts.RpySrchMode)
    * [.RpyStateMode](#IrSdkConsts.RpyStateMode)
    * [.ReloadTexturesMode](#IrSdkConsts.ReloadTexturesMode)
    * [.ChatCommand](#IrSdkConsts.ChatCommand)
    * [.PitCommand](#IrSdkConsts.PitCommand)
    * [.TelemCommand](#IrSdkConsts.TelemCommand)
    * [.CamFocusAt](#IrSdkConsts.CamFocusAt)

<a name="IrSdkConsts.BroadcastMsg"></a>

### IrSdkConsts.BroadcastMsg
Available command messages.

**Kind**: static enum of <code>[IrSdkConsts](#IrSdkConsts)</code>  
**Properties**

| Name | Default | Description |
| --- | --- | --- |
| CamSwitchPos | <code>0</code> | Switch cam, args: car position, group, camera |
| CamSwitchNum | <code>1</code> | Switch cam, args, driver #, group, camera |
| CamSetState | <code>2</code> | Set cam state, args: CameraState, unused, unused |
| ReplaySetPlaySpeed | <code>3</code> | Set replay speed, args: speed, slowMotion, unused |
| ReplaySetPlayPosition | <code>4</code> | Jump to frame, args: RpyPosMode, Frame Number (high, low) |
| ReplaySearch | <code>5</code> | Search things from replay, args: RpySrchMode, unused, unused |
| ReplaySetState | <code>6</code> | Set replay state, args: RpyStateMode, unused, unused |
| ReloadTextures | <code>7</code> | Reload textures, args: ReloadTexturesMode, carIdx, unused |
| ChatComand | <code>8</code> | Chat commands, args: ChatCommand, subCommand, unused |
| PitCommand | <code>9</code> | Pit commands, args: PitCommand, parameter |
| TelemCommand | <code>10</code> | Disk telemetry commands, args: TelemCommand, unused, unused |
| FFBCommand | <code>11</code> | *not supported by node-irsdk**: Change FFB settings, args:  FFBCommandMode, value (float, high, low) |
| ReplaySearchSessionTime | <code>12</code> | Search by timestamp, args: sessionNum, sessionTimeMS (high, low) |

<a name="IrSdkConsts.CameraState"></a>

### IrSdkConsts.CameraState
Camera state
    Camera state is bitfield; use these values to compose a new state.

**Kind**: static enum of <code>[IrSdkConsts](#IrSdkConsts)</code>  
**Properties**

| Name | Default | Description |
| --- | --- | --- |
| IsSessionScreen | <code>1</code> | Is driver out of the car |
| IsScenicActive | <code>2</code> | The scenic camera is active (no focus car) |
| CamToolActive | <code>4</code> | Activate camera tool |
| UIHidden | <code>8</code> | Hide UI |
| UseAutoShotSelection | <code>16</code> | Enable auto shot selection |
| UseTemporaryEdits | <code>32</code> | Enable temporary edits |
| UseKeyAcceleration | <code>64</code> | Enable key acceleration |
| UseKey10xAcceleration | <code>128</code> | Enable 10x key acceleration |
| UseMouseAimMode | <code>256</code> | Enable mouse aim |

<a name="IrSdkConsts.RpyPosMode"></a>

### IrSdkConsts.RpyPosMode
**Kind**: static enum of <code>[IrSdkConsts](#IrSdkConsts)</code>  
**Properties**

| Name | Default | Description |
| --- | --- | --- |
| Begin | <code>0</code> | Frame number is relative to beginning |
| Current | <code>1</code> | Frame number is relative to current frame |
| End | <code>2</code> | Frame number is relative to end |

<a name="IrSdkConsts.RpySrchMode"></a>

### IrSdkConsts.RpySrchMode
**Kind**: static enum of <code>[IrSdkConsts](#IrSdkConsts)</code>  
**Properties**

| Name | Default |
| --- | --- |
| ToStart | <code>0</code> | 
| ToEnd | <code>1</code> | 
| PrevSession | <code>2</code> | 
| NextSession | <code>3</code> | 
| PrevLap | <code>4</code> | 
| NextLap | <code>5</code> | 
| PrevFrame | <code>6</code> | 
| NextFrame | <code>7</code> | 
| PrevIncident | <code>8</code> | 
| NextIncident | <code>9</code> | 

<a name="IrSdkConsts.RpyStateMode"></a>

### IrSdkConsts.RpyStateMode
**Kind**: static enum of <code>[IrSdkConsts](#IrSdkConsts)</code>  
**Properties**

| Name | Default | Description |
| --- | --- | --- |
| EraseTape | <code>0</code> | Clear any data in the replay tape (works only if replay spooling disabled) |

<a name="IrSdkConsts.ReloadTexturesMode"></a>

### IrSdkConsts.ReloadTexturesMode
**Kind**: static enum of <code>[IrSdkConsts](#IrSdkConsts)</code>  
**Properties**

| Name | Default |
| --- | --- |
| All | <code>0</code> | 
| CarIdx | <code>1</code> | 

<a name="IrSdkConsts.ChatCommand"></a>

### IrSdkConsts.ChatCommand
**Kind**: static enum of <code>[IrSdkConsts](#IrSdkConsts)</code>  
**Properties**

| Name | Default | Description |
| --- | --- | --- |
| Macro | <code>0</code> | Macro, give macro num (0-15) as argument |
| BeginChat | <code>1</code> | Open up a new chat window |
| Reply | <code>2</code> | Reply to last private chat |
| Cancel | <code>3</code> | Close chat window |

<a name="IrSdkConsts.PitCommand"></a>

### IrSdkConsts.PitCommand
**Kind**: static enum of <code>[IrSdkConsts](#IrSdkConsts)</code>  
**Properties**

| Name | Default | Description |
| --- | --- | --- |
| Clear | <code>0</code> | Clear all pit checkboxes |
| WS | <code>1</code> | Clean the winshield, using one tear off |
| Fuel | <code>2</code> | Request fuel, optional argument: liters |
| LF | <code>3</code> | Request new left front, optional argument: pressure in kPa |
| RF | <code>4</code> | Request new right front, optional argument: pressure in kPa |
| LR | <code>5</code> | Request new left rear, optional argument: pressure in kPa |
| RR | <code>6</code> | Request new right rear, optional argument: pressure in kPa |
| ClearTires | <code>7</code> | Clear tire pit checkboxes |
| FR | <code>8</code> | Request a fast repair |

<a name="IrSdkConsts.TelemCommand"></a>

### IrSdkConsts.TelemCommand
**Kind**: static enum of <code>[IrSdkConsts](#IrSdkConsts)</code>  
**Properties**

| Name | Default | Description |
| --- | --- | --- |
| Stop | <code>0</code> | Turn telemetry recording off |
| Start | <code>1</code> | Turn telemetry recording on |
| Restart | <code>2</code> | Write current file to disk and start a new one |

<a name="IrSdkConsts.CamFocusAt"></a>

### IrSdkConsts.CamFocusAt
When switching camera, these can be used instead of car number / position

**Kind**: static enum of <code>[IrSdkConsts](#IrSdkConsts)</code>  
**Properties**

| Name | Default | Description |
| --- | --- | --- |
| Incident | <code>-3</code> |  |
| Leader | <code>-2</code> |  |
| Exiting | <code>-1</code> |  |
| Driver | <code>0</code> | Use car number / position instead of this |

