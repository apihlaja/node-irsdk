
var irsdk = require('../')
var fs = require('fs')

irsdk.init({
  telemetryUpdateInterval: 100,
  sessionInfoUpdateInterval: 2000
})

var iracing = irsdk.getInstance()

function saveSample (type, time, data) {
  var fileName = './sample-data/rec/' + time + '-' + type + '.json'
  fs.writeFile(fileName, JSON.stringify(data), function (err) {
    if (err) throw err
  })
}

console.log('waiting for iRacing...')

iracing.on('Connected', function () {
  console.log('connected to iRacing..')
})

iracing.on('Disconnected', function () {
  console.log('iRacing shut down, exiting.\n')
  process.exit()
})

iracing.on('TelemetryDescription', function (data) {
  console.log('got TelemetryDescription')

  saveSample('TelemetryDescription', Date.now(), data)
})

iracing.on('Telemetry', function (data) {
  console.log('got Telemetry')
  saveSample('Telemetry', Date.now(), data)
})

iracing.on('SessionInfo', function (data) {
  console.log('got SessionInfo')

  saveSample('SessionInfo', Date.now(), data)
})

