var util = require("util");
var events = require("events");

yaml = require('js-yaml');

function JsIrSdk(IrSdkWrapper, opts) 
{
  events.EventEmitter.call(this);
  var self = this;
  var opts = opts || {};
  
  if ( opts.telemetryUpdateInterval === undefined ) {
    opts.telemetryUpdateInterval = 5;
  }
  if ( opts.sessionInfoUpdateInterval === undefined ) {
    opts.sessionInfoUpdateInterval = 1000;
  }
  
  var CONNECTION_INTERVAL = opts.telemetryUpdateInterval / 3; // ms
  
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
      setImmediate(function () {
        if (!telemetryDescription) {
          telemetryDescription = IrSdkWrapper.getTelemetryDescription();
          self.emit('TelemetryDescription', telemetryDescription);
        }
        self.emit('Telemetry', telemetry); 
      });
    }
  }, opts.telemetryUpdateInterval);

  var sessionInfoIntervalId = setInterval(function () {
    if (connected && IrSdkWrapper.updateSessionInfo()) {
      var now = new Date();
      var sessionInfo = IrSdkWrapper.getSessionInfo();
      var doc;
      setImmediate(function () {
        try {
           doc = yaml.safeLoad(sessionInfo);
        } catch (ex) {
          console.error('js-irsdk: yaml error: \n' + ex);
        }
        self.emit('SessionInfo', { timestamp: now, raw: sessionInfo, doc: doc });
      });
    }
  }, opts.sessionInfoUpdateInterval);
  
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