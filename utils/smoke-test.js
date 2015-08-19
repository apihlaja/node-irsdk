// manual integration test to check that
// anything doesnt explode

var expect = require("chai").expect;

var irsdk = require('../');

irsdk.init({
  telemetryUpdateInterval: 1000,
  sessionInfoUpdateInterval: 1000
});

var iracing = irsdk.getInstance();

console.log('waiting for iRacing...');

// should print got telemetry, desc & session info once each time
// you launch iRacing

iracing.on('Connected', function () {
  console.log('connected to iRacing..');
  
  iracing.once('Disconnected', function () { 
    console.log('iRacing shut down.');
  });
  iracing.once('TelemetryDescription', function (data) {
    console.log('got TelemetryDescription');
    expect(data).to.exist.and.to.be.an('object');
  });
  iracing.once('Telemetry', function (data) {
    console.log('got Telemetry');
    expect(data).to.exist.and.to.be.an('object');
    expect(data).to.have.property('timestamp').that.is.a('date');
    expect(data).to.have.property('values').that.is.an('object');
  });
  iracing.once('SessionInfo', function (data) {
    console.log('got SessionInfo');
    expect(data).to.exist.and.to.be.an('object');
    expect(data).to.have.property('timestamp').that.is.a('date');
    expect(data).to.have.property('data').that.is.an('object');
  });
});

