var mock = {}

mock.start = function () { return true }
mock.shutdown = function () {}
mock.isInitialized = function () { return true }
mock.isConnected = function () { return false }

mock.updateSessionInfo = function () { return false }
mock.getSessionInfo = function () {}

mock.updateTelemetry = function () { return false }
mock.getTelemetryDescription = function () { return {'telemetry': 'is telemetry'} }
mock.getTelemetry = function () { return {} }

mock.sendCmd = function () {}

module.exports = mock
