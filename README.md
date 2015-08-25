# node-irsdk

iRacing SDK implementation for Node.js. 

The current versoin provides access to

* session info
* live telemetry

You can find simple usage examples from [utils](utils/) directory.


## Requirements

* Windows version of [Node.js](https://nodejs.org/download/)
* Visual Studio and Python 2.7 for node-gyp, see details: 
[installation instructions](https://github.com/TooTallNate/node-gyp)


## Install

`npm install --save node-irsdk`


## API

Module provides two methods.

### #init([options])

Can be called once to set up wrapper options. All options are optional:

* telemetryUpdateInterval: milliseconds between update checks (default 5)
* sessionInfoUpdateInterval: milliseconds between update checks (default 1000)

### #getInstance()

Returns `JsIrSdk` instance. Calls `init` if its not called already.



### JsIrSdk

JsIrSdk inherits [EventEmiter](https://nodejs.org/api/events.html#events_class_events_eventemitter) 
and exposes data from SDK using events.


#### Event: 'Connected'

Emitted when iRacing SDK is available.


#### Event: 'Disconnected'

Emitted when iRacing SDK access is lost ie. when sim is shut down. 
The `Connected` event is emitted again if sim is restarted.


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

Emitted always when session info is updated. 
See example of `sessionInfo` object here: [sessioninfo.json](sample-data/sessioninfo.json).

