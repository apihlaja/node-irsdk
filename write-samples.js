
var irsdk = require('./');
var fs = require('fs');

var telemetryDescription;
var telemetry;
var sessionInfoStr;
var sessionInfoObj;

console.log('waiting for iRacing...');
var dateStr;

irsdk.on('Connected', function () { 
  console.log('connected to iRacing..');
  dateStr = new Date().toISOString().split(".")[0].replace(/:/g,'')+'Z';
});

irsdk.on('Disconnected', function () { 
  // this is here just for documentation because
  // the script doesnt wait for Disconnected-event.
  console.log('iRacing shut down.');
});

irsdk.once('TelemetryDescription', function (data) {
  console.log('got TelemetryDescription');
  var fileName = './sample-data/'+dateStr+'-telemetry-desc.json';
  
  fs.writeFile(fileName, JSON.stringify(data, null, 2), function (err) {
    if (err) throw err;
    telemetryDescription = data;
  });
});

irsdk.once('Telemetry', function (data) {
  console.log('got Telemetry');
  var fileName = './sample-data/'+dateStr+'-telemetry.json';
  
  fs.writeFile(fileName, JSON.stringify(data, null, 2), function (err) {
    if (err) throw err;
    telemetry = data;
  });
});

irsdk.once('SessionInfo', function (data) {
  console.log('got SessionInfo');
  var yamlFileName = './sample-data/'+dateStr+'-sessioninfo.yaml';
  var jsonFileName = './sample-data/'+dateStr+'-sessioninfo.json';
  
  fs.writeFile(yamlFileName, data.raw, function (err) {
    if (err) throw err;
    sessionInfoStr = data;
  });
  
  fs.writeFile(jsonFileName, JSON.stringify(data.doc, null, 2), function (err) {
    if (err) throw err;
    sessionInfoObj = data;
  });
});

var exitIntervalId = setInterval(function () {
  if (telemetryDescription && telemetry && sessionInfoStr && sessionInfoObj) {
    console.log('got everything, exiting..');
    process.exit();
  }
},400);
