# Node.js iRacing SDK

The first, experimental, version will support session data and live telemetry only.

## Requirements and Install

You need Windows version of [Node.js](https://nodejs.org/download/). And because 
node-gyp is used to compile C++ module, you have to 
install its dependencies. Having Python 2.7 in PATH and some version of Visual Studio 
should be enough but check 
[installation instructions of node-gyp](https://github.com/TooTallNate/node-gyp) 
if node-gyp fails.

node-irsdk can be installed from GitHub using command:

`npm install --save apihlaja/node-irsdk`


## API

### #init([options])

Can be called once to set up wrapper options. All options are optional:

* telemetryUpdateInterval: milliseconds between update checks (default 5)
* sessionInfoUpdateInterval: milliseconds between update checks (default 400)

### #getInstance()

Returns IrSdkJsWrapper instance. Calls `init` if its not called already.


### IrSdkJsWrapper

IrSdkJsWrapper inherits [EventEmiter](https://nodejs.org/api/events.html#events_class_events_eventemitter) 
and exposes SDK and sim state using events.

#### Event: 'Connected'

Emitted when iRacing SDK is available.


#### Event: 'Disconnected'

Emitted when iRacing SDK access is lost ie. when sim is shut down. 
The `'Connected'` event is emitted again if sim is restarted.


#### Event: 'TelemetryDescription'

* `function (desc) { }`

Emitted when first telemetry sample is received after connecting. 
See example of `desc` object here: [telemetry-desc.json](sample-data/telemetry-desc.json).


#### Event: 'Telemetry'

* `function (telemetry) { }`

Emitted always when new telemetry sample is received. 
See example of `telemetry` object here: [telemetry.json](sample-data/telemetry.json).


#### Event: 'SessionInfo'

* `function (sessionInfo) { }`

Emitted always when new SessionInfo is changed.
See example of `sessionInfo` object here: [sessioninfo.json](sample-data/sessioninfo.json).


