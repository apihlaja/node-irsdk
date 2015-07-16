var IrSdkNodeWrapper = require('../build/Release/irsdknodewrapper');

var util = require("util");
var events = require("events");

yaml = require('js-yaml');

function JsIrSdk() 
{
  events.EventEmitter.call(this);
  const self = this;
  
  const CONNECTION_CHECK_INTERVAL = 2; // ms
  const TELEMETRY_UPDATE_CHECK_INTERVAL = 5; // ms
  const SESSIONINFO_UPDATE_CHECK_INTERVAL = 400; // ms
  
  var connected = false; // if irsdk is available
  var initialized = IrSdkNodeWrapper.start(); // if wrapper is started
  
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
        
        // restarts after 10s
        // so if iRacing is started again,
        // new Connected event is emitted
        setTimeout(function () {
          initialized = IrSdkNodeWrapper.start();
        }, 10000);
      }
    }
  }, CONNECTION_CHECK_INTERVAL);

  var telemetryIntervalId = setInterval(function () {
    if (connected && IrSdkNodeWrapper.updateTelemetry()) {
      var telemetry = IrSdkNodeWrapper.getTelemetry();
      if (!telemetryDescription) {
        telemetryDescription = IrSdkNodeWrapper.getTelemetryDescription();
        self.emit('TelemetryDescription', telemetryDescription);
      }
      self.emit('Telemetry', telemetry); 
    }
  }, TELEMETRY_UPDATE_CHECK_INTERVAL);

  var sessionInfoIntervalId = setInterval(function () {
    if (connected && IrSdkNodeWrapper.updateSessionInfo()) {
      var sessionInfo = IrSdkNodeWrapper.getSessionInfo();
      var doc
      try {
         doc = yaml.safeLoad(sessionInfo);
      } catch (ex) {
        console.error('js-irsdk: yaml error: \n' + ex);
      }
      self.emit('SessionInfo', { raw: sessionInfo, doc: doc });
    }
  }, SESSIONINFO_UPDATE_CHECK_INTERVAL);

}

util.inherits(JsIrSdk, events.EventEmitter);

module.exports = new JsIrSdk();