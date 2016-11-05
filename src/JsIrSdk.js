var util = require('util');
var events = require('events');

function JsIrSdk(IrSdkWrapper, opts) 
{
  events.EventEmitter.call(this);
  
  this.sendCmd = IrSdkWrapper.sendCmd;
  
  var self = this;
  opts = opts || {};
  
  if ( opts.telemetryUpdateInterval === undefined ) {
    opts.telemetryUpdateInterval = 5;
  }
  
  if ( opts.sessionInfoUpdateInterval === undefined ) {
    opts.sessionInfoUpdateInterval = 1000;
  }
  
  var parseSessionInfo = opts.sessionInfoParser;
  if ( !parseSessionInfo ) {
    parseSessionInfo = (function () {
      var yaml = require('js-yaml');
      
      return function (sessionInfoStr) {
        return yaml.safeLoad(sessionInfoStr);
      };
    })();
  }
  
  
  var connected = false; // if irsdk is available
  
  var startIntervalId = setInterval(function () {
    if ( !IrSdkWrapper.isInitialized() ) {
      IrSdkWrapper.start();
    }
  }, 10000);
  
  IrSdkWrapper.start();
  
  var telemetryDescription;
  
  var checkConnection = function () {
    if (IrSdkWrapper.isInitialized() && IrSdkWrapper.isConnected()) {
      if (!connected) {
        connected = true;
        self.emit('Connected');
      }
    } else {
      if (connected) {
        connected = false;
        self.emit('Disconnected');

        IrSdkWrapper.shutdown();
        telemetryDescription = null;
      }
    }
  };

  var telemetryIntervalId = setInterval(function () {
    checkConnection();
    if (connected && IrSdkWrapper.updateTelemetry()) {
      var now = new Date(); // date gives ms accuracy
      var telemetry = IrSdkWrapper.getTelemetry();
      // replace ctime timestamp 
      telemetry.timestamp = now; 
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
    checkConnection();
    if (connected && IrSdkWrapper.updateSessionInfo()) {
      var now = new Date();
      var sessionInfo = IrSdkWrapper.getSessionInfo();
      var doc;
      setImmediate(function () {
        try {
          doc = parseSessionInfo(sessionInfo);
        } catch (ex) {
          // TODO: log faulty yaml
          console.error('js-irsdk: yaml error: \n' + ex);
        }
        
        // in dev mode: include yaml and emit even if parsing failed
        if ( process.env.NODE_ENV === 'development' ) {
          self.emit('SessionInfo', { timestamp: now, data: doc, yaml: sessionInfo });
        } else if (doc) {
          // normally hide emit only successfully parsed doc
          self.emit('SessionInfo', { timestamp: now, data: doc});
        }
      });
    }
  }, opts.sessionInfoUpdateInterval);
  
  /**
    * makes instance garbage, useless:
    * any events arent emited after this call.
    */
  this.stop = function () {
    clearInterval(telemetryIntervalId);
    clearInterval(sessionInfoIntervalId);
    clearInterval(startIntervalId);
    IrSdkWrapper.shutdown();
  };
}

util.inherits(JsIrSdk, events.EventEmitter);

module.exports = JsIrSdk;

