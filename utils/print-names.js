// prints team names

var irsdk = require('../')

irsdk.init({
  telemetryUpdateInterval: 1000,
  sessionInfoUpdateInterval: 1000
})

var iracing = irsdk.getInstance()

console.log('\nwaiting for iRacing...')

iracing.on('Connected', function () {
  console.log('\nConnected to iRacing.')

  iracing.once('Disconnected', function () {
    console.log('iRacing shut down.')
  })

  iracing.once('SessionInfo', function (sessionInfo) {
    console.log('SessionInfo event received\n')
    sessionInfo.data.DriverInfo.Drivers.forEach(function (driver) {
      console.log(driver.TeamName + ' - ' + driver.UserName)
    })
    process.exit()
  })
})

