var IrSdkNodeWrapper = require('../build/Release/irsdknodewrapper');

var util = require("util");
var events = require("events");

yaml = require('js-yaml');

function JsIrSdk() 
{
  events.EventEmitter.call(this);
  var self = this;
  
  var connected = false;
  var initialized = IrSdkNodeWrapper.start();
  
  var telemetryDescription;
  
  var connectedIntervalId = setInterval(function () {
    if (initialized && IrSdkNodeWrapper.isConnected()) {
      if (!connected) {
        connected = true;
        self.emit('Connected');
      }
    } else {
      if (connected) {
        connected = false;
        self.emit('Disconnected');

        IrSdkNodeWrapper.shutdown();
        initialized = false;
        telemetryDescription = null;
        
        // restart after 10s
        setTimeout(function () { 
          initialized = IrSdkNodeWrapper.start();
        }, 10000);
      }
    }
  }, 10);

  var telemetryIntervalId = setInterval(function () {
    if (connected && IrSdkNodeWrapper.updateTelemetry()) {
      var telemetry = IrSdkNodeWrapper.getTelemetry();
      if (!telemetryDescription) {
        telemetryDescription = IrSdkNodeWrapper.getTelemetryDescription();
        self.emit('TelemetryDescription', telemetryDescription);
      }
      self.emit('Telemetry', telemetry);
    }
  }, 4);

  var sessionInfoIntervalId = setInterval(function () {
    if (connected && IrSdkNodeWrapper.updateSessionInfo()) {
      var sessionInfo = IrSdkNodeWrapper.getSessionInfo();
      var doc
      try {
         doc = yaml.safeLoad(sessionInfo);
      } catch (ex) {
        console.error('js-irsdk: yaml error: ' + ex);
      }
      self.emit('SessionInfo', { raw: sessionInfo, doc: doc });
    }
  }, 500);

}

util.inherits(JsIrSdk, events.EventEmitter);

module.exports = new JsIrSdk();