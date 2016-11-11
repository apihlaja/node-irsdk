// tests if node-irsdk works at all..

var expect = require('chai').expect

var irsdk = require('../')

irsdk.init({
  telemetryUpdateInterval: 0,
  sessionInfoUpdateInterval: 1000
})

var iracing = irsdk.getInstance()

console.log()
console.log('waiting for iRacing...')

iracing.once('Connected', function () {
  console.log()
  console.log('Connected to iRacing.')

  var telemetry
  var desc

  iracing.once('TelemetryDescription', function (data) {
    console.log('TelemetryDescription event received')
    expect(data).to.exist.and.to.be.an('object')
    desc = data
    checkTelemetryValues(telemetry, desc)
    done('desc')
  })

  iracing.once('Telemetry', function (data) {
    console.log('Telemetry event received')
    expect(data).to.exist.and.to.be.an('object')
    expect(data).to.have.property('timestamp').that.is.a('date')
    expect(data).to.have.property('values').that.is.an('object')
    telemetry = data
    checkTelemetryValues(telemetry, desc)
    done('telemetry')
  })

  iracing.once('SessionInfo', function (data) {
    console.log('SessionInfo event received')
    expect(data).to.exist.and.to.be.an('object')
    expect(data).to.have.property('timestamp').that.is.a('date')
    expect(data).to.have.property('data').that.is.an('object')
    done('sessioninfo')
  })
})

// tests that C++ module is working
// correctly when doing unit & type conversions
var checkTelemetryValues = function (telemetry, desc) {
  if (!desc || !telemetry) {
    return
  }

  console.log('got telemetry and its description, validating output..')

  for (var telemetryVarName in desc) {
    if (desc.hasOwnProperty(telemetryVarName)) {
      console.log('checking ' + telemetryVarName)
      var varDesc = desc[telemetryVarName]
      var value = telemetry.values[telemetryVarName]

      expect(varDesc).to.exist.and.to.be.an('object')
      expect(value).to.exist

      if (varDesc.count > 1) {
        expect(value).to.be.an('array')
        value.forEach(function (val) {
          validateValue(val, varDesc)
        })
      } else {
        validateValue(value, varDesc)
      }
    }
  }
}
var validateValue = function (val, desc) {
  if (desc.type !== 'bitField') {
    if (desc.unit.substr(0, 5) === 'irsdk') {
      expect(val).to.be.a('string', 'enums should be converted to strings')
    } else {
      if (desc.type === 'bool') {
        expect(val).to.be.a('boolean')
      }
      if (desc.type === 'int') {
        expect(val).to.be.a('number')
      }
      if (desc.type === 'float') {
        expect(val).to.be.a('number')
      }
      if (desc.type === 'double') {
        expect(val).to.be.a('number')
      }
      if (desc.type === 'char') {
        expect(val).to.be.a('string').and.have.length(1)
      }
    }
  } else {
    // expect bitField to be converted to array<string>
    expect(val).to.be.an('array', 'bitField should be converted to array<string>')
    val.forEach(function (bitFieldVal) {
      expect(bitFieldVal).to.be.a('string')
    })
  }
}

// kill the process when enough is done..
var done = (function () {
  var tasks = []
  var totalTasks = 3

  return function (taskName) {
    tasks.push(taskName)
    if (tasks.length >= totalTasks) {
      console.log()
      console.log('checks done', new Date())
      process.exit()
    }
  }
})()

setTimeout(function () {
  console.log('no iRacing detected, skipping telemetry checks.')
  process.exit(0)
}, 3000)
