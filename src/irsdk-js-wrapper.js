var util = require("util");
var events = require("events");

yaml = require('js-yaml');

function JsIrSdk(IrSdkWrapper, opts) 
{
  events.EventEmitter.call(this);
  var self = this;
  var opts = opts || {};
  
  var TELEMETRY_UPDATE_INTERVAL = opts.telemetryUpdateInterval || 5; // ms
  var CONNECTION_INTERVAL = TELEMETRY_UPDATE_INTERVAL / 3; // ms
  var SESSIONINFO_UPDATE_INTERVAL = opts.sessionInfoUpdateInterval || 400; // ms
  
  var connected = false; // if irsdk is available
  var initialized = IrSdkWrapper.start(); // if wrapper is started
  
  var telemetryDescription;
  
  var connectedIntervalId = setInterval(function () {
    if (initialized && IrSdkWrapper.isConnected()) {
      if (!connected) {
        connected = true;
        self.emit('Connected');
      }
    } else {
      if (connected) {
        connected = false;
        self.emit('Disconnected');

        IrSdkWrapper.shutdown();
        initialized = false;
        telemetryDescription = null;
        
        // restarts after 10s
        // so if iRacing is started again,
        // new Connected event is emitted
        setTimeout(function () {
          initialized = IrSdkWrapper.start();
        }, 10000);
      }
    }
  }, CONNECTION_INTERVAL);

  var telemetryIntervalId = setInterval(function () {
    if (connected && IrSdkWrapper.updateTelemetry()) {
      var telemetry = IrSdkWrapper.getTelemetry();
      if (!telemetryDescription) {
        telemetryDescription = IrSdkWrapper.getTelemetryDescription();
        self.emit('TelemetryDescription', telemetryDescription);
      }
      self.emit('Telemetry', telemetry); 
    }
  }, TELEMETRY_UPDATE_INTERVAL);

  var sessionInfoIntervalId = setInterval(function () {
    if (connected && IrSdkWrapper.updateSessionInfo()) {
      var sessionInfo = IrSdkWrapper.getSessionInfo();
      var doc
      try {
         doc = yaml.safeLoad(sessionInfo);
      } catch (ex) {
        console.error('js-irsdk: yaml error: \n' + ex);
      }
      self.emit('SessionInfo', { raw: sessionInfo, doc: doc });
    }
  }, SESSIONINFO_UPDATE_INTERVAL);
  
  /**
    * makes instance garbage, useless:
    * any events arent emited after this call.
    */
  this.stop = function () {
    clearInterval(connectedIntervalId);
    clearInterval(telemetryIntervalId);
    clearInterval(sessionInfoIntervalId);
    IrSdkWrapper.shutdown();
  };
}

util.inherits(JsIrSdk, events.EventEmitter);

module.exports = JsIrSdk;