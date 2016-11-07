// prints team names

var irsdk = require('../')

var yaml = require('js-yaml')

/** Parser function which should fix TeamName issue
 *
 * @param {string} sessionInfoStr raw session info string
 * @returns {Object} parsed session info or falsy
 */
var parseSessionInfo = function (sessionInfoStr) {
  var fixedYamlStr = sessionInfoStr.replace(/TeamName: ([^\n]+)/g, function (match, p1) {
    if ((p1[0] === '"' && p1[p1.length - 1] === '"') ||
         (p1[0] === "'" && p1[p1.length - 1] === "'")) {
      return match // skip if quoted already
    } else {
      // 2nd replace is unnecessary atm but its here just in case
      return "TeamName: '" + p1.replace(/'/g, "''") + "'"
    }
  })
  return yaml.safeLoad(fixedYamlStr)
}

irsdk.init({
  telemetryUpdateInterval: 1000,
  sessionInfoUpdateInterval: 1000,
  sessionInfoParser: parseSessionInfo // replace default parser
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

