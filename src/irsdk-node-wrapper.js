var addonPath = '../build/Release/irsdknodewrapper';
try {
  module.exports = require(addonPath);
} catch (ex) {
  module.exports = {
    start: function () {return false;},
    isConnected: function () {return false;},
    isInitialized: function () {return false;}
  }
}