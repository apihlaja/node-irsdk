# node-irsdk

[![Build status](https://ci.appveyor.com/api/projects/status/ukyuuq9004wy9h5b/branch/master?svg=true)](https://ci.appveyor.com/project/apihlaja/node-irsdk/branch/master)

iRacing SDK implementation for Node.js. 

The current version provides 

* session info
* live telemetry

You can find simple usage examples from [utils](utils/) directory.


## Installing

Before installing, you need

* Windows version of [Node.js](https://nodejs.org/download/) v0.12 or v4
* Visual Studio and Python 2.7 for node-gyp, see 
[installation instructions](https://github.com/TooTallNate/node-gyp)

`npm install --save node-irsdk`


## API

### irsdk

Exposed by `require('node-irsdk')`. 

### irsdk#init(options : Object)

Can be called once to set up wrapper options. Subsequent calls are ignored. All options are optional:

* telemetryUpdateInterval: milliseconds between update checks (default 5)
* sessionInfoUpdateInterval: milliseconds between update checks (default 1000)
* sessionInfoParser: replace default parser

### irsdk#getInstance()

Returns `JsIrSdk` instance. Calls `init` if its not called already.


### JsIrSdk

JsIrSdk inherits [EventEmiter](https://nodejs.org/api/events.html#events_class_events_eventemitter) 
and exposes status and data from SDK using events:

* `Connected`: Emitted when iRacing SDK is available.
* `Disconnected`: Emitted when iRacing SDK access is lost ie. when sim is shut down. The `Connected` event is emitted again if sim is restarted.
* `TelemetryDescription`: Emitted when first telemetry sample is received after `Connected` event. See sample payload object here: [telemetry-desc.json](sample-data/telemetry-desc.json).
* `Telemetry`: Emitted always when new telemetry sample is received. See sample payload object here: [telemetry.json](sample-data/telemetry.json).
* `SessionInfo`: Emitted always when session info is updated. See sample payload object here: [sessioninfo.json](sample-data/sessioninfo.json).

