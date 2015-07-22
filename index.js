var IrSdkNodeWrapper = require('./build/Release/irsdknodewrapper');
var JsIrSdk = require('./src/js-irsdk.js');

var instance;

module.exports = function (opts) {
  if ( !instance ) {
    return instance = new JsIrSdk(IrSdkNodeWrapper, opts);
  } else {
    if ( opts ) {
      console.warn('node-irsdk can be initialized only once, ignoring opts');
    }
    return instance;
  }
}
