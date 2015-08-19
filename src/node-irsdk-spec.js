var sandboxed = require('sandboxed-module');

describe('node-irsdk', function () {
  
  this.slow(500); // sandboxing is slowish
  
  
  describe('#init', function () {
    it('instantiates JsIrSdkWrapper once', function () {
      var jsWrapperSpy = sinon.spy();
      var nodeWrapperMock = {};
      var opts = {};
      var nodeIrSdk = sandboxed.require('./node-irsdk', {
        requires: {
          '../build/Release/IrsdkNodeWrapper': nodeWrapperMock,
          './irsdk-js-wrapper': jsWrapperSpy
        }
      });
      nodeIrSdk.init(opts);
      nodeIrSdk.init(opts);
      jsWrapperSpy.should.have.been.calledWith(nodeWrapperMock, opts);
      jsWrapperSpy.should.have.been.calledOnce;
    });
  });
  describe('#getInstance', function () {
    it('gives IrSdkJsWrapper singleton', function () {
      var jsWrapperMock = function () {return ++jsWrapperMock.instanceCount; };
      var nodeWrapperMock = {};
      var nodeIrSdk = sandboxed.require('./node-irsdk', {
        requires: {
          '../build/Release/IrsdkNodeWrapper': nodeWrapperMock,
          './irsdk-js-wrapper': jsWrapperMock
        }
      });
      var instance1 = nodeIrSdk.getInstance();
      var instance2 = nodeIrSdk.getInstance();
      instance1.should.equal(instance2);
    });
  });
});
