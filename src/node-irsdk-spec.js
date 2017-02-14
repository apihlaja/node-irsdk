var sandboxed = require('sandboxed-module')

describe('node-irsdk', function () {
  this.slow(500) // sandboxing is slowish

  describe('#init', function () {
    it('instantiates JsIrSdk once', function () {
      var jsIrSdkSpy = sinon.spy()
      var nodeWrapperMock = {}
      var opts = {
        telemetryUpdateInterval: 1,
        sessionInfoUpdateInterval: 2
      }
      var nodeIrSdk = sandboxed.require('./node-irsdk', {
        requires: {
          '../build/Release/IrSdkNodeBindings': nodeWrapperMock,
          './JsIrSdk': jsIrSdkSpy
        }
      })
      nodeIrSdk.init(opts)
      nodeIrSdk.init(opts)
      jsIrSdkSpy.should.have.been.calledWith(nodeWrapperMock, opts)
      jsIrSdkSpy.should.have.been.calledOnce
    })
  })
  describe('#getInstance', function () {
    it('gives JsIrSdk singleton', function () {
      var jsWrapperMock = function () { return ++jsWrapperMock.instanceCount }
      var nodeWrapperMock = {}
      var nodeIrSdk = sandboxed.require('./node-irsdk', {
        requires: {
          '../build/Release/IrSdkNodeBindings': nodeWrapperMock,
          './JsIrSdk': jsWrapperMock
        }
      })
      var instance1 = nodeIrSdk.getInstance()
      var instance2 = nodeIrSdk.getInstance()
      instance1.should.equal(instance2)
    })
  })
})
