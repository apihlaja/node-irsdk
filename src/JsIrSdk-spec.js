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
    var data = {values: {'RPM': 1100}}
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
    var data = '---\ntype: race\n'
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
  })

  describe('.execCmd(msg, [arg1, arg2, arg3])', function () {
    it('sends arbitrary broadcast message', function () {
      var mock = Object.create(IrSdkWrapper)
      var sendCmd = sinon.spy(mock, 'sendCmd')
      var iracing = new JsIrSdk(mock)
      iracing.execCmd(12, 13, 14, 15)
      sendCmd.should.have.been.calledWithExactly(12, 13, 14, 15)
    })
  })
  describe('.reloadTextures()', function () {
    it('sends reload all command', function () {
      var mock = Object.create(IrSdkWrapper)
      var sendCmd = sinon.spy(mock, 'sendCmd')
      var iracing = new JsIrSdk(mock)
      iracing.reloadTextures()
      sendCmd.should.have.been.calledWithExactly(7, 0)
    })
  })
  describe('.reloadTexture(carIdx)', function () {
    it('sends reload car command', function () {
      var mock = Object.create(IrSdkWrapper)
      var sendCmd = sinon.spy(mock, 'sendCmd')
      var iracing = new JsIrSdk(mock)
      iracing.reloadTexture(13)
      sendCmd.should.have.been.calledWithExactly(7, 1, 13)
    })
  })
  describe('.execChatCmd(cmd, [arg])', function () {
    it('sends chat command when cmd given as integer', function () {
      var mock = Object.create(IrSdkWrapper)
      var sendCmd = sinon.spy(mock, 'sendCmd')
      var iracing = new JsIrSdk(mock)
      iracing.execChatCmd(2)
      sendCmd.should.have.been.calledWithExactly(8, 2, 0)
    })
    it('sends chat command when cmd given as string', function () {
      var mock = Object.create(IrSdkWrapper)
      var sendCmd = sinon.spy(mock, 'sendCmd')
      var iracing = new JsIrSdk(mock)
      iracing.execChatCmd('cancel')
      sendCmd.should.have.been.calledWithExactly(8, 3, 0)
    })
  })
  describe('.execChatMacro(num)', function () {
    it('sends chat macro command', function () {
      var mock = Object.create(IrSdkWrapper)
      var sendCmd = sinon.spy(mock, 'sendCmd')
      var iracing = new JsIrSdk(mock)
      iracing.execChatMacro(7)
      sendCmd.should.have.been.calledWithExactly(8, 0, 7)
    })
  })
  describe('.execPitCmd(cmd, [arg])', function () {
    it('sends command when cmd given as integer', function () {
      var mock = Object.create(IrSdkWrapper)
      var sendCmd = sinon.spy(mock, 'sendCmd')
      var iracing = new JsIrSdk(mock)
      iracing.execPitCmd(1)
      sendCmd.should.have.been.calledWithExactly(9, 1, 0)
    })
    it('sends command when cmd given as string', function () {
      var mock = Object.create(IrSdkWrapper)
      var sendCmd = sinon.spy(mock, 'sendCmd')
      var iracing = new JsIrSdk(mock)
      iracing.execPitCmd('clearTires')
      sendCmd.should.have.been.calledWithExactly(9, 7, 0)
    })
    it('passes thru integer argument', function () {
      var mock = Object.create(IrSdkWrapper)
      var sendCmd = sinon.spy(mock, 'sendCmd')
      var iracing = new JsIrSdk(mock)
      iracing.execPitCmd('fuel', 60)
      sendCmd.should.have.been.calledWithExactly(9, 2, 60)
    })
  })
  describe('.execTelemetryCmd(cmd)', function () {
    it('sends command when cmd given as integer', function () {
      var mock = Object.create(IrSdkWrapper)
      var sendCmd = sinon.spy(mock, 'sendCmd')
      var iracing = new JsIrSdk(mock)
      iracing.execTelemetryCmd(1)
      sendCmd.should.have.been.calledWithExactly(10, 1)
    })
    it('sends command when cmd given as string', function () {
      var mock = Object.create(IrSdkWrapper)
      var sendCmd = sinon.spy(mock, 'sendCmd')
      var iracing = new JsIrSdk(mock)
      iracing.execTelemetryCmd('restart')
      sendCmd.should.have.been.calledWithExactly(10, 2)
    })
  })

  describe('.camControls', function () {
    describe('.setState(state)', function () {
      it('sends state cmd', function () {
        var mock = Object.create(IrSdkWrapper)
        var sendCmd = sinon.spy(mock, 'sendCmd')
        var iracing = new JsIrSdk(mock)
        iracing.camControls.setState(15)
        sendCmd.should.have.been.calledWithExactly(2, 15)
      })
    })
    describe('.switchToCar(carNum, [camGroupNum], [camNum])', function () {
      it('sends switch cmd', function () {
        var mock = Object.create(IrSdkWrapper)
        var sendCmd = sinon.spy(mock, 'sendCmd')
        var iracing = new JsIrSdk(mock)
        iracing.camControls.switchToCar(12)
        sendCmd.should.have.been.calledWithExactly(1, 12, 0, 0)
      })
      describe('leading zeros are padded if car num is given as string', function () {
        var sendCmd, iracing
        beforeEach(function () {
          var mock = Object.create(IrSdkWrapper)
          sendCmd = sinon.spy(mock, 'sendCmd')
          iracing = new JsIrSdk(mock)
        })
        afterEach(function () {
          sendCmd = null
          iracing = null
        })
        it('"1" -> 1', function () {
          iracing.camControls.switchToCar('1')
          sendCmd.should.have.been.calledWithExactly(1, 1, 0, 0)
        })
        it('"100" -> 100', function () {
          iracing.camControls.switchToCar('100')
          sendCmd.should.have.been.calledWithExactly(1, 100, 0, 0)
        })
        it('"110" -> 110', function () {
          iracing.camControls.switchToCar('100')
          sendCmd.should.have.been.calledWithExactly(1, 100, 0, 0)
        })
        it('"01" -> 2001', function () {
          iracing.camControls.switchToCar('01')
          sendCmd.should.have.been.calledWithExactly(1, 2001, 0, 0)
        })
        it('"001" -> 3001', function () {
          iracing.camControls.switchToCar('001')
          sendCmd.should.have.been.calledWithExactly(1, 3001, 0, 0)
        })
        it('"011" -> 3011', function () {
          iracing.camControls.switchToCar('011')
          sendCmd.should.have.been.calledWithExactly(1, 3011, 0, 0)
        })
      })
      it('sends focus at cmd', function () {
        var mock = Object.create(IrSdkWrapper)
        var sendCmd = sinon.spy(mock, 'sendCmd')
        var iracing = new JsIrSdk(mock)
        iracing.camControls.switchToCar(-2)
        sendCmd.should.have.been.calledWithExactly(1, -2, 0, 0)
      })
      it('switches cam group and cam', function () {
        var mock = Object.create(IrSdkWrapper)
        var sendCmd = sinon.spy(mock, 'sendCmd')
        var iracing = new JsIrSdk(mock)
        iracing.camControls.switchToCar(12, 2, 3)
        sendCmd.should.have.been.calledWithExactly(1, 12, 2, 3)
      })
    })
    describe('.switchToPos(carNum, [camGroupNum], [camNum])', function () {
      it('sends switch cmd', function () {
        var mock = Object.create(IrSdkWrapper)
        var sendCmd = sinon.spy(mock, 'sendCmd')
        var iracing = new JsIrSdk(mock)
        iracing.camControls.switchToPos(12)
        sendCmd.should.have.been.calledWithExactly(0, 12, 0, 0)
      })
      it('sends focus at cmd', function () {
        var mock = Object.create(IrSdkWrapper)
        var sendCmd = sinon.spy(mock, 'sendCmd')
        var iracing = new JsIrSdk(mock)
        iracing.camControls.switchToPos(-2)
        sendCmd.should.have.been.calledWithExactly(0, -2, 0, 0)
      })
      it('switches cam group and cam', function () {
        var mock = Object.create(IrSdkWrapper)
        var sendCmd = sinon.spy(mock, 'sendCmd')
        var iracing = new JsIrSdk(mock)
        iracing.camControls.switchToPos(12, 2, 3)
        sendCmd.should.have.been.calledWithExactly(0, 12, 2, 3)
      })
    })
  })
  describe('.playbackControls', function () {
    describe('.play()', function () {
      it('sends cmd', function () {
        var mock = Object.create(IrSdkWrapper)
        var sendCmd = sinon.spy(mock, 'sendCmd')
        var iracing = new JsIrSdk(mock)
        iracing.playbackControls.play()
        sendCmd.should.have.been.calledWithExactly(3, 1, 0)
      })
    })
    describe('.pause()', function () {
      it('sends cmd', function () {
        var mock = Object.create(IrSdkWrapper)
        var sendCmd = sinon.spy(mock, 'sendCmd')
        var iracing = new JsIrSdk(mock)
        iracing.playbackControls.pause()
        sendCmd.should.have.been.calledWithExactly(3, 0, 0)
      })
    })
    describe('.fastForward([speed])', function () {
      it('sends cmd', function () {
        var mock = Object.create(IrSdkWrapper)
        var sendCmd = sinon.spy(mock, 'sendCmd')
        var iracing = new JsIrSdk(mock)
        iracing.playbackControls.fastForward()
        sendCmd.should.have.been.calledWithExactly(3, 2, 0)
      })
      it('passes optional argument', function () {
        var mock = Object.create(IrSdkWrapper)
        var sendCmd = sinon.spy(mock, 'sendCmd')
        var iracing = new JsIrSdk(mock)
        iracing.playbackControls.fastForward(16)
        sendCmd.should.have.been.calledWithExactly(3, 16, 0)
      })
    })
    describe('.rewind([speed])', function () {
      it('sends cmd', function () {
        var mock = Object.create(IrSdkWrapper)
        var sendCmd = sinon.spy(mock, 'sendCmd')
        var iracing = new JsIrSdk(mock)
        iracing.playbackControls.rewind()
        sendCmd.should.have.been.calledWithExactly(3, -2, 0)
      })
      it('passes optional argument', function () {
        var mock = Object.create(IrSdkWrapper)
        var sendCmd = sinon.spy(mock, 'sendCmd')
        var iracing = new JsIrSdk(mock)
        iracing.playbackControls.rewind(16)
        sendCmd.should.have.been.calledWithExactly(3, -16, 0)
      })
    })
    describe('.slowForward([divider])', function () {
      it('sends cmd', function () {
        var mock = Object.create(IrSdkWrapper)
        var sendCmd = sinon.spy(mock, 'sendCmd')
        var iracing = new JsIrSdk(mock)
        iracing.playbackControls.slowForward()
        sendCmd.should.have.been.calledWithExactly(3, 1, 1)
      })
      it('passes optional argument', function () {
        var mock = Object.create(IrSdkWrapper)
        var sendCmd = sinon.spy(mock, 'sendCmd')
        var iracing = new JsIrSdk(mock)
        iracing.playbackControls.slowForward(16)
        sendCmd.should.have.been.calledWithExactly(3, 15, 1)
      })
    })
    describe('.slowBackward([divider])', function () {
      it('sends cmd', function () {
        var mock = Object.create(IrSdkWrapper)
        var sendCmd = sinon.spy(mock, 'sendCmd')
        var iracing = new JsIrSdk(mock)
        iracing.playbackControls.slowBackward()
        sendCmd.should.have.been.calledWithExactly(3, -1, 1)
      })
      it('passes optional argument', function () {
        var mock = Object.create(IrSdkWrapper)
        var sendCmd = sinon.spy(mock, 'sendCmd')
        var iracing = new JsIrSdk(mock)
        iracing.playbackControls.slowBackward(16)
        sendCmd.should.have.been.calledWithExactly(3, -15, 1)
      })
    })
    describe('.searchTs(sessionNum, sessionTimeMS)', function () {
      it('sends cmd with args', function () {
        var mock = Object.create(IrSdkWrapper)
        var sendCmd = sinon.spy(mock, 'sendCmd')
        var iracing = new JsIrSdk(mock)
        iracing.playbackControls.searchTs(1, 5000)
        sendCmd.should.have.been.calledWithExactly(12, 1, 5000)
      })
    })
    describe('.searchFrame(frameNum, rpyPosMode)', function () {
      it('sends cmd with args', function () {
        var mock = Object.create(IrSdkWrapper)
        var sendCmd = sinon.spy(mock, 'sendCmd')
        var iracing = new JsIrSdk(mock)
        iracing.playbackControls.searchFrame(5, 1)
        sendCmd.should.have.been.calledWithExactly(4, 1, 5)
      })
      it('rpyPosMode can be given as string', function () {
        var mock = Object.create(IrSdkWrapper)
        var sendCmd = sinon.spy(mock, 'sendCmd')
        var iracing = new JsIrSdk(mock)
        iracing.playbackControls.searchFrame(17, 'end')
        sendCmd.should.have.been.calledWithExactly(4, 2, 17)
      })
    })
    describe('.search(searchMode)', function () {
      it('sends cmd with args', function () {
        var mock = Object.create(IrSdkWrapper)
        var sendCmd = sinon.spy(mock, 'sendCmd')
        var iracing = new JsIrSdk(mock)
        iracing.playbackControls.search(6)
        sendCmd.should.have.been.calledWithExactly(5, 6)
      })
      it('searchMode can be given as string', function () {
        var mock = Object.create(IrSdkWrapper)
        var sendCmd = sinon.spy(mock, 'sendCmd')
        var iracing = new JsIrSdk(mock)
        iracing.playbackControls.search('prevIncident')
        sendCmd.should.have.been.calledWithExactly(5, 8)
      })
    })
  })
})
