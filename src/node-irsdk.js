var IrSdkNodeWrapper = require('bindings')('IrSdkNodeBindings')
var JsIrSdk = require('./JsIrSdk')

/**
  @module irsdk
*/
module.exports = {}

var instance

/**
  Initialize JsIrSdk, can be done once before using getInstance first time.
  @function
  @static
  @param {Object} [opts] Options
  @param {Integer} [opts.telemetryUpdateInterval=5] Telemetry update interval, milliseconds
  @param {Integer} [opts.sessionInfoUpdateInterval=1000] SessionInfo update interval, milliseconds
  @param {iracing~sessionInfoParser} [opts.sessionInfoParser] Custom parser for session info
  @example
  * var irsdk = require('node-irsdk')
  * // update telemetry as fast as possible
  * irsdk.init({telemetryUpdateInterval: 0})
  * var iracing = irsdk.getInstance()
*/
var init = module.exports.init = function (opts) {
  if (!instance) {
    instance = new JsIrSdk(IrSdkNodeWrapper, opts)
  }
}

/**
  Get initialized instance of JsIrSdk
  @function
  @static
  @returns {iracing} Running instance of JsIrSdk
  @example
  * var irsdk = require('node-irsdk')
  * var iracing = irsdk.getInstance()
*/
module.exports.getInstance = function () {
  if (!instance) {
    init()
  }
  return instance
}

