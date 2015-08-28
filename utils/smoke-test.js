// tests if node-irsdk works at all..

var expect = require('chai').expect;

var irsdk = require('../');

irsdk.init({
  telemetryUpdateInterval: 1000,
  sessionInfoUpdateInterval: 1000
});

var iracing = irsdk.getInstance();

console.log('\nwaiting for iRacing...');


iracing.on('Connected', function () {
  console.log('\nConnected to iRacing.');
  
  iracing.once('Disconnected', function () { 
    console.log('iRacing shut down.');
  });
  
  iracing.once('TelemetryDescription', function (data) {
    console.log('TelemetryDescription event received');
    expect(data).to.exist.and.to.be.an('object');
  });
  
  iracing.once('Telemetry', function (data) {
    console.log('Telemetry event received');
    expect(data).to.exist.and.to.be.an('object');
    expect(data).to.have.property('timestamp').that.is.a('date');
    expect(data).to.have.property('values').that.is.an('object');
  });
  
  iracing.once('SessionInfo', function (data) {
    console.log('SessionInfo event received');
    expect(data).to.exist.and.to.be.an('object');
    expect(data).to.have.property('timestamp').that.is.a('date');
    expect(data).to.have.property('data').that.is.an('object');
  });
});

