
var irsdk = require('../');
var fs = require('fs');
var moment = require('moment');

var telemetryDescription;
var telemetry;
var sessionInfoStr;
var sessionInfoObj;

irsdk.init({
  telemetryUpdateInterval: 1000,
  sessionInfoUpdateInterval: 1000
});

var iracing = irsdk.getInstance();

console.log('waiting for iRacing...');

var calls = 0;

iracing.once('Connected', function () {
  console.log('connected to iRacing..');
  calls++;
});

iracing.on('Disconnected', function () { 
  // this is here just for documentation because
  // the script doesnt wait for Disconnected-event.
  console.log('iRacing shut down.');
});

iracing.once('TelemetryDescription', function (data) {
  console.log('got TelemetryDescription');
  calls++;
});

iracing.once('Telemetry', function (data) {
  console.log('got Telemetry');
  calls++;
});

iracing.on('SessionInfo', function (data) {
  console.log('got SessionInfo');
  calls++;
});

setInterval(function () {
  if ( calls >= 4 ) {
    console.log('got all, looks ok');
    process.exit();
  } else {
    console.log('waiting for events...');
  }
}, 2000);