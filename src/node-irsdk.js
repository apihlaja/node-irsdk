var IrSdkNodeWrapper = require('./irsdk-node-wrapper');
var IrSdkJsWrapper = require('./irsdk-js-wrapper');

var instance;

module.exports = {};

var init = module.exports.init = function (opts) {
  if (!instance) {
    instance = new IrSdkJsWrapper(IrSdkNodeWrapper, opts);
  }
}

module.exports.getInstance = function () {
  if ( !instance ) {
    init();
  }
  return instance;
}