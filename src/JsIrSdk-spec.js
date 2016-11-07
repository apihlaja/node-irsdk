var JsIrSdk = require('./JsIrSdk')
var IrSdkWrapper = require('./IrsdkNodeWrapper-stub')

describe('JsIrSdk', function () {
  beforeEach(function () {
    this.clock = sinon.useFakeTimers()
  })

  afterEach(function () {
    this.clock.restore()
  })

  var irsdk

  it('emits "Connected" when iRacing available', function () {
    var opts = {
      telemetryUpdateInterval: 1,
      sessionInfoUpdateInterval: 20000
    }
    var mock = Object.create(IrSdkWrapper)
    var start = sinon.stub(mock, 'start')
    start.returns(true)
    irsdk = new JsIrSdk(mock, opts)
    var isConnected = sinon.stub(mock, 'isConnected')
    isConnected.returns(false)
    var spy = sinon.spy()
    irsdk.on('Connected', spy)
    this.clock.tick(2)
    spy.should.not.have.been.called
    isConnected.returns(true)
    this.clock.tick(2)
    spy.should.have.been.called
    start.should.have.been.calledOnce
    irsdk.stop()
  })
  it('emits "Disconnected" when iRacing shut down', function () {
    var opts = {
      telemetryUpdateInterval: 1,
      sessionInfoUpdateInterval: 20000
    }
    var mock = Object.create(IrSdkWrapper)
    irsdk = new JsIrSdk(mock, opts)
    var isConnected = sinon.stub(mock, 'isConnected')
    isConnected.returns(true)
    var spy = sinon.spy()
    irsdk.on('Disconnected', spy)
    this.clock.tick(2)
    spy.should.not.have.been.called
    isConnected.returns(false)
    this.clock.tick(2)
    spy.should.have.been.called
    irsdk.stop()
  })
  it('emits "Connected" again after reconnect', function () {
    var opts = {
      telemetryUpdateInterval: 2000,
      sessionInfoUpdateInterval: 20000
    }
    var mock = Object.create(IrSdkWrapper)
    var start = sinon.stub(mock, 'start')
    start.returns(true)
    var isConnected = sinon.stub(mock, 'isConnected')
    isConnected.returns(true)
    irsdk = new JsIrSdk(mock, opts)
    start.should.have.been.calledOnce
    this.clock.tick(2500)
    isConnected.returns(false)
    var isInitialized = sinon.stub(mock, 'isInitialized')
    isInitialized.returns(false)
    this.clock.tick(11000)
    start.should.have.been.calledTwice
    isConnected.returns(true)
    isInitialized.returns(true)
    var restartSpy = sinon.spy()
    irsdk.on('Connected', restartSpy)
    this.clock.tick(2500)
    restartSpy.should.have.been.called
    irsdk.stop()
  })
  it('emits "TelemetryDescription" once after "Connected"', function () {
    var opts = {
      telemetryUpdateInterval: 1,
      sessionInfoUpdateInterval: 20000
    }
    var mock = Object.create(IrSdkWrapper)
    var updateTelemetry = sinon.stub(mock, 'updateTelemetry')
    updateTelemetry.returns(true)
    var getTelemetryDescription = sinon.stub(mock, 'getTelemetryDescription')
    var desc = [{'RPM': 'engine revs per minute'}]
    getTelemetryDescription.returns(desc)
    var isConnected = sinon.stub(mock, 'isConnected')
    isConnected.returns(true)
    irsdk = new JsIrSdk(mock, opts)
    var spy = sinon.spy()
    irsdk.on('TelemetryDescription', spy)
    this.clock.tick(5)
    spy.should.have.been.calledOnce
    spy.should.have.been.calledWith(desc)
    this.clock.tick(5)
    spy.should.have.been.calledOnce
    irsdk.stop()
  })
  it('emits "Telemetry" when update available', function () {
    var opts = {
      telemetryUpdateInterval: 10,
      sessionInfoUpdateInterval: 20000
    }
    var mock = Object.create(IrSdkWrapper)
    var updateTelemetry = sinon.stub(mock, 'updateTelemetry')
    updateTelemetry.returns(true)
    var getTelemetry = sinon.stub(mock, 'getTelemetry')
    var data = [{'RPM': 1100}]
    getTelemetry.returns(data)
    var isConnected = sinon.stub(mock, 'isConnected')
    isConnected.returns(true)
    irsdk = new JsIrSdk(mock, opts)
    var spy = sinon.spy()
    irsdk.on('Telemetry', spy)
    this.clock.tick(12)
    spy.should.have.been.calledOnce
    spy.should.have.been.calledWith(data)
    updateTelemetry.returns(false)
    this.clock.tick(12)
    spy.should.have.been.calledOnce
    updateTelemetry.returns(true)
    this.clock.tick(12)
    spy.should.have.been.calledTwice
    irsdk.stop()
  })
  it('emits "SessionInfo" when update available', function () {
    var opts = {
      telemetryUpdateInterval: 10,
      sessionInfoUpdateInterval: 10
    }
    var mock = Object.create(IrSdkWrapper)
    var updateSessionInfo = sinon.stub(mock, 'updateSessionInfo')
    updateSessionInfo.returns(true)
    var getSessionInfo = sinon.stub(mock, 'getSessionInfo')
    var data = {'type': 'race'}
    getSessionInfo.returns(data)
    var isConnected = sinon.stub(mock, 'isConnected')
    isConnected.returns(true)
    irsdk = new JsIrSdk(mock, opts)
    var spy = sinon.spy()
    irsdk.on('SessionInfo', spy)
    this.clock.tick(12)
    spy.should.have.been.calledOnce
    // spy.should.have.been.calledWith(data);
    updateSessionInfo.returns(false)
    this.clock.tick(12)
    spy.should.have.been.calledOnce
    updateSessionInfo.returns(true)
    this.clock.tick(12)
    spy.should.have.been.calledTwice
    irsdk.stop()
  })
})
