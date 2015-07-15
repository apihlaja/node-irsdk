
var irsdk = require('./');
var fs = require('fs');

var telemetryDescription;
var telemetry;
var sessionInfoStr;
var sessionInfoObj;

console.log('waiting for iRacing...');

irsdk.on('Connected', function () { 
  console.log('connected to iRacing..');
})

irsdk.once('TelemetryDescription', function (data) {
  console.log('got TelemetryDescription');
  fs.writeFile('./sample-data/telemetry-desc.json', JSON.stringify(data, null, 2), function (err) {
    if (err) throw err;
    telemetryDescription = data;
  });
});

irsdk.once('Telemetry', function (data) {
  console.log('got Telemetry');
  fs.writeFile('./sample-data/telemetry.json', JSON.stringify(data, null, 2), function (err) {
    if (err) throw err;
    telemetry = data;
  });
});

irsdk.once('SessionInfo', function (data) {
  console.log('got SessionInfo');
  fs.writeFile('./sample-data/sessioninfo.yaml', data.raw, function (err) {
    if (err) throw err;
    sessionInfoStr = data;
  });
  fs.writeFile('./sample-data/sessioninfo.json', JSON.stringify(data.doc, null, 2), function (err) {
    if (err) throw err;
    sessionInfoObj = data;
  });
});

var exitIntervalId = setInterval(function () {
  if (telemetryDescription && telemetry && sessionInfoStr && sessionInfoObj) {
    console.log('got everything, exiting..');
    process.exit();
  }
});