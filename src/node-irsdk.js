var IrSdkNodeWrapper = require('bindings')('IrSdkNodeBindings');
var JsIrSdk = require('./JsIrSdk');

var instance;

module.exports = {};

var init = module.exports.init = function (opts) {
  if (!instance) {
    instance = new JsIrSdk(IrSdkNodeWrapper, opts);
  }
};

module.exports.getInstance = function () {
  if ( !instance ) {
    init();
  }
  return instance;
};