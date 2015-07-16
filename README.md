# Node.js iRacing SDK

The first version will support session data and live telemetry only.

## Requirements

[node-gyp](https://github.com/TooTallNate/node-gyp/) is used to compile C++ module 
so check you have its dependencies (Python 2.7 and Visual Studio).

## API


### Event: 'Connected'

Emitted when iRacing SDK is available.


### Event: 'Disconnected'

Emitted when iRacing SDK access is lost ie. when sim is shut down. 
The `'Connected'` event is emitted again if sim is restarted.


### Event: 'TelemetryDescription'

* `function (data) { }`

Emitted when first telemetry sample is received after connecting. 
See example of `data` object in [telemetry-desc.json](sample-data/telemetry-desc.json).


### Event: 'Telemetry'

* `function (data) { }`

Emitted always when new telemetry sample is received. 
See example of `data` object in [telemetry.json](sample-data/telemetry.json).


### Event: 'SessionInfo'

* `function (data) { }`

Emitted always when new SessionInfo is changed. `data` has two properties: raw and doc.
`raw` is orginal yaml string from iRacing, see example in [sessioninfo.yaml](sample-data/sessioninfo.yaml).
`doc` is Object with same data, see example in [sessioninfo.json](sample-data/sessioninfo.json).


