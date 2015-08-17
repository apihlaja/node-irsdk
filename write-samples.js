
var irsdk = require('./');
var fs = require('fs');
var moment = require('moment');

var telemetryDescription;
var telemetry;
var sessionInfoStr;
var sessionInfoObj;

irsdk.init({
  telemetryUpdateInterval: 5000,
  sessionInfoUpdateInterval: 5000
});

var iracing = irsdk.getInstance();

console.log('waiting for iRacing...');
var dateStr = moment().format().replace(/:/g, '');

iracing.on('Connected', function () {
  console.log('connected to iRacing..');
});

iracing.on('Disconnected', function () { 
  // this is here just for documentation because
  // the script doesnt wait for Disconnected-event.
  console.log('iRacing shut down.');
});

iracing.once('TelemetryDescription', function (data) {
  console.log('got TelemetryDescription');
  var dateStr = moment().format().replace(/:/g, '');
  var fileName = './sample-data/'+dateStr+'-telemetry-desc.json';
  
  fs.writeFile(fileName, JSON.stringify(data, null, 2), function (err) {
    if (err) throw err;
    telemetryDescription = data;
  });
});

iracing.on('Telemetry', function (data) {
  console.log('got Telemetry');
  var dateStr = moment().format().replace(/:/g, '');
  var fileName = './sample-data/'+dateStr+'-telemetry.json';
  
  fs.writeFile(fileName, JSON.stringify(data, null, 2), function (err) {
    if (err) throw err;
    telemetry = data;
  });
});

iracing.on('SessionInfo', function (data) {
  console.log('got SessionInfo');
  var dateStr = moment().format().replace(/:/g, '');
  var yamlFileName = './sample-data/'+dateStr+'-sessioninfo.yaml';
  var jsonFileName = './sample-data/'+dateStr+'-sessioninfo.json';
  
  fs.writeFile(yamlFileName, data.raw, function (err) {
    if (err) throw err;
    sessionInfoStr = data;
  });
  
  fs.writeFile(jsonFileName, JSON.stringify({timestamp: data.timestamp, data: data.doc}, null, 2), function (err) {
    if (err) throw err;
    sessionInfoObj = data;
  });
});


