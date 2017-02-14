var util = require('util')
var events = require('events')
var Consts = require('./IrSdkConsts')
var BroadcastMsg = Consts.BroadcastMsg

/** Default parser used for SessionInfo YAML
  Fixes TeamName issue, uses js-yaml for actual parsing
  @private
  @param {string} sessionInfoStr raw session info YAML string
  @returns {Object} parsed session info or falsy
*/
function createSessionInfoParser () {
  var yaml = require('js-yaml')

  return function (sessionInfoStr) {
    var fixedYamlStr = sessionInfoStr.replace(/TeamName: ([^\n]+)/g, function (match, p1) {
      if ((p1[0] === '"' && p1[p1.length - 1] === '"') ||
          (p1[0] === "'" && p1[p1.length - 1] === "'")) {
        return match // skip if quoted already
      } else {
        // 2nd replace is unnecessary atm but its here just in case
        return "TeamName: '" + p1.replace(/'/g, "''") + "'"
      }
    })
    return yaml.safeLoad(fixedYamlStr)
  }
}

/**
  JsIrSdk is javascript implementation of iRacing SDK.

  Don't use constructor directly, use {@link module:irsdk.getInstance}.

  @class
  @extends events.EventEmitter
  @see {@link https://nodejs.org/api/events.html#events_class_eventemitter|EventEmitter API}
  @alias iracing
  @fires iracing#Connected
  @fires iracing#Disconnected
  @fires iracing#Telemetry
  @fires iracing#TelemetryDescription
  @fires iracing#SessionInfo

  @example var iracing = require('node-irsdk').getInstance()
*/
function JsIrSdk (IrSdkWrapper, opts) {
  events.EventEmitter.call(this)

  /** Execute any of available commands, excl. FFB command
    @method
    @param {Integer} msgId Message id
    @param {Integer} [arg1] 1st argument
    @param {Integer} [arg2] 2nd argument
    @param {Integer} [arg3] 3rd argument
  */
  this.execCmd = IrSdkWrapper.sendCmd

  /** iRacing SDK related constants
    @type IrSdkConsts
    @instance
  */
  this.Consts = Consts

  /** Camera controls
    @type {Object}
  */
  this.camControls = {
    /** Change camera tool state
      @method
      @param {IrSdkConsts.CameraState} state new state
      @example
      * // hide UI and enable mouse aim
      * var States = iracing.Consts.CameraState
      * var state = States.CamToolActive | States.UIHidden | States.UseMouseAimMode
      * iracing.camControls.setState(state)
    */
    setState: function (state) {
      self.execCmd(BroadcastMsg.CamSetState, state)
    },
    /** Switch camera, focus on car
      @method
      @param {Integer|String|IrSdkConsts.CamFocusAt} carNum Car to focus on
      @param {Integer} [camGroupNum] Select camera group
      @param {Integer} [camNum] Select camera

      @example
      * // show car #2
      * iracing.camControls.switchToCar(2)
      @example
      * // show car #02
      * iracing.camControls.switchToCar('02')
      @example
      * // show leader
      * iracing.camControls.switchToCar('leader')
      @example
      * // show car #2 using cam group 3
      * iracing.camControls.switchToCar(2, 3)
    */
    switchToCar: function (carNum, camGroupNum, camNum) {
      camGroupNum = camGroupNum | 0
      camNum = camNum | 0

      if (typeof carNum === 'string') {
        if (isNaN(parseInt(carNum))) {
          carNum = stringToEnum(carNum, Consts.CamFocusAt)
        } else {
          carNum = padCarNum(carNum)
        }
      }
      if (Number.isInteger(carNum)) {
        self.execCmd(BroadcastMsg.CamSwitchNum, carNum, camGroupNum, camNum)
      }
    },
    /** Switch camera, focus on position
      @method
      @param {Integer|IrSdkConsts.CamFocusAt} position Position to focus on
      @param {Integer} [camGroupNum] Select camera group
      @param {Integer} [camNum] Select camera

      @example iracing.camControls.switchToPos(2) // show P2
    */
    switchToPos: function (position, camGroupNum, camNum) {
      camGroupNum = camGroupNum | 0
      camNum = camNum | 0

      if (typeof position === 'string') {
        position = stringToEnum(position, Consts.CamFocusAt)
      }
      if (Number.isInteger(position)) {
        self.execCmd(BroadcastMsg.CamSwitchPos, position, camGroupNum, camNum)
      }
    }
  }

  /** Replay and playback controls
    @type {Object}
  */
  this.playbackControls = {
    /** Play replay
      @method
      @example iracing.playbackControls.play()
    */
    play: function () {
      self.execCmd(BroadcastMsg.ReplaySetPlaySpeed, 1, 0)
    },
    /** Pause replay
      @method
      @example iracing.playbackControls.pause()
    */
    pause: function () {
      self.execCmd(BroadcastMsg.ReplaySetPlaySpeed, 0, 0)
    },
    /** fast-forward replay
      @method
      @param {Integer} [speed=2] FF speed, something between 2-16 works
      @example iracing.playbackControls.fastForward() // double speed FF
    */
    fastForward: function (speed) {
      speed = speed || 2
      self.execCmd(BroadcastMsg.ReplaySetPlaySpeed, speed, 0)
    },
    /** rewind replay
      @method
      @param {Integer} [speed=2] RW speed, something between 2-16 works
      @example iracing.playbackControls.rewind() // double speed RW
    */
    rewind: function (speed) {
      speed = speed || 2
      self.execCmd(BroadcastMsg.ReplaySetPlaySpeed, -1 * speed, 0)
    },
    /** slow-forward replay, slow motion
      @method
      @param {Integer} [divider=2] divider of speed, something between 2-17 works
      @example iracing.playbackControls.slowForward(2) // half speed
    */
    slowForward: function (divider) {
      divider = divider || 2
      divider -= 1
      self.execCmd(BroadcastMsg.ReplaySetPlaySpeed, divider, 1)
    },
    /** slow-backward replay, reverse slow motion
      @method
      @param {Integer} [divider=2] divider of speed, something between 2-17 works
      @example iracing.playbackControls.slowBackward(2) // half speed RW
    */
    slowBackward: function (divider) {
      divider = divider || 2
      divider -= 1
      self.execCmd(BroadcastMsg.ReplaySetPlaySpeed, -1 * divider, 1)
    },
    /** Search things from replay
      @method
      @param {IrSdkConsts.RpySrchMode} searchMode what to search
      @example iracing.playbackControls.search('nextIncident')
    */
    search: function (searchMode) {
      if (typeof searchMode === 'string') {
        searchMode = stringToEnum(searchMode, Consts.RpySrchMode)
      }
      if (Number.isInteger(searchMode)) {
        self.execCmd(BroadcastMsg.ReplaySearch, searchMode)
      }
    },
    /** Search timestamp
      @method
      @param {Integer} sessionNum Session number
      @param {Integer} sessionTimeMS Session time in milliseconds
      @example
      * // jump to 2nd minute of 3rd session
      * iracing.playbackControls.searchTs(2, 2*60*1000)
    */
    searchTs: function (sessionNum, sessionTimeMS) {
      self.execCmd(BroadcastMsg.ReplaySearchSessionTime, sessionNum, sessionTimeMS)
    },
    /** Go to frame. Frame counting can be relative to begin, end or current.
      @method
      @param {Integer} frameNum Frame number
      @param {IrSdkConsts.RpyPosMode} rpyPosMode Is frame number relative to begin, end or current frame
      @example iracing.playbackControls.searchFrame(1, 'current') // go to 1 frame forward
    */
    searchFrame: function (frameNum, rpyPosMode) {
      if (typeof rpyPosMode === 'string') {
        rpyPosMode = stringToEnum(rpyPosMode, Consts.RpyPosMode)
      }
      if (Number.isInteger(rpyPosMode)) {
        self.execCmd(BroadcastMsg.ReplaySetPlayPosition, rpyPosMode, frameNum)
      }
    }
  }

  /** Reload all car textures
    @method
    @example iracing.reloadTextures() // reload all paints
  */
  this.reloadTextures = function () {
    this.execCmd(BroadcastMsg.ReloadTextures, Consts.ReloadTexturesMode.All)
  }

  /** Reload car's texture
    @method
    @param {Integer} carIdx car to reload
    @example iracing.reloadTexture(1) // reload paint of carIdx=1
  */
  this.reloadTexture = function (carIdx) {
    this.execCmd(BroadcastMsg.ReloadTextures, Consts.ReloadTexturesMode.CarIdx, carIdx)
  }

  /** Execute chat command
    @param {IrSdkConsts.ChatCommand} cmd
    @param {Integer} [arg] Command argument, if needed
    @example iracing.execChatCmd('cancel') // close chat window
  */
  this.execChatCmd = function (cmd, arg) {
    arg = arg || 0
    if (typeof cmd === 'string') {
      cmd = stringToEnum(cmd, Consts.ChatCommand)
    }
    if (Number.isInteger(cmd)) {
      this.execCmd(BroadcastMsg.ChatComand, cmd, arg)
    }
  }

  /** Execute chat macro
    @param {Integer} num Macro's number (0-15)
    @example iracing.execChatMacro(1) // macro 1
  */
  this.execChatMacro = function (num) {
    this.execChatCmd('macro', num)
  }

  /** Execute pit command
    @param {IrSdkConsts.PitCommand} cmd
    @param {Integer} [arg] Command argument, if needed
    @example
    * // full tank, no tires, no tear off
    * iracing.execPitCmd('clear')
    * iracing.execPitCmd('fuel', 999) // 999 liters
    * iracing.execPitCmd('lf') // new left front
    * iracing.execPitCmd('lr', 200) // new left rear, 200 kPa
  */
  this.execPitCmd = function (cmd, arg) {
    arg = arg || 0
    if (typeof cmd === 'string') {
      cmd = stringToEnum(cmd, Consts.PitCommand)
    }
    if (Number.isInteger(cmd)) {
      this.execCmd(BroadcastMsg.PitCommand, cmd, arg)
    }
  }

  /** Control telemetry logging (ibt file)
    @param {IrSdkConsts.TelemCommand} cmd Command: start/stop/restart
    @example iracing.execTelemetryCmd('restart')
  */
  this.execTelemetryCmd = function (cmd) {
    if (typeof cmd === 'string') {
      cmd = stringToEnum(cmd, Consts.TelemCommand)
    }
    if (Number.isInteger(cmd)) {
      this.execCmd(BroadcastMsg.TelemCommand, cmd)
    }
  }

  var self = this
  opts = opts || {}

  /**
   Parser for SessionInfo YAML
   @callback iracing~sessionInfoParser
   @param {String} sessionInfo SessionInfo YAML
   @returns {Object} parsed session info
  */
  var parseSessionInfo = opts.sessionInfoParser
  if (!parseSessionInfo) parseSessionInfo = createSessionInfoParser()

  var connected = false // if irsdk is available

  var startIntervalId = setInterval(function () {
    if (!IrSdkWrapper.isInitialized()) {
      IrSdkWrapper.start()
    }
  }, 10000)

  IrSdkWrapper.start()

  /** Latest telemetry, may be null or undefined

  */
  this.telemetry = null

  /** Latest telemetry, may be null or undefined

  */
  this.telemetryDescription = null

  /** Latest telemetry, may be null or undefined

  */
  this.sessionInfo = null

  var checkConnection = function () {
    if (IrSdkWrapper.isInitialized() && IrSdkWrapper.isConnected()) {
      if (!connected) {
        connected = true
        /**
          iRacing, sim, is started
          @event iracing#Connected
          @example
          * iracing.on('Connected', function (evt) {
          *   console.log(evt)
          * })
        */
        self.emit('update', {type: 'Connected', timestamp: new Date()})
      }
    } else {
      if (connected) {
        connected = false
        /**
          iRacing, sim, was closed
          @event iracing#Disconnected
          @example
          * iracing.on('Disconnected', function (evt) {
          *   console.log(evt)
          * })
        */
        self.emit('update', {type: 'Disconnected', timestamp: new Date()})

        IrSdkWrapper.shutdown()
        self.telemetryDescription = null
      }
    }
  }

  var telemetryIntervalId = setInterval(function () {
    checkConnection()
    if (connected && IrSdkWrapper.updateTelemetry()) {
      var now = new Date() // date gives ms accuracy
      self.telemetry = IrSdkWrapper.getTelemetry()
      // replace ctime timestamp
      self.telemetry.timestamp = now

      setImmediate(function () {
        if (!self.telemetryDescription) {
          self.telemetryDescription = IrSdkWrapper.getTelemetryDescription()
          /**
            Telemetry description, contains description of available telemetry values
            @event iracing#TelemetryDescription
            @type Object
            @example
            * iracing.on('TelemetryDescription', function (data) {
            *   console.log(evt)
            * })
          */
          self.emit('update', {type: 'TelemetryDescription', data: self.telemetryDescription, timestamp: now})
        }
        /**
          Telemetry update
          @event iracing#Telemetry
          @type Object
          @example
          * iracing.on('Telemetry', function (evt) {
          *   console.log(evt)
          * })
        */
        self.emit('update', {type: 'Telemetry', data: self.telemetry.values, timestamp: now})
      })
    }
  }, opts.telemetryUpdateInterval)

  var sessionInfoIntervalId = setInterval(function () {
    checkConnection()
    if (connected && IrSdkWrapper.updateSessionInfo()) {
      var now = new Date()
      var sessionInfo = IrSdkWrapper.getSessionInfo()
      var doc
      setImmediate(function () {
        try {
          doc = parseSessionInfo(sessionInfo)
        } catch (ex) {
          // TODO: log faulty yaml
          console.error('js-irsdk: yaml error: \n' + ex)
        }

        if (doc) {
          self.sessionInfo = { timestamp: now, data: doc }
          /**
            SessionInfo update
            @event iracing#SessionInfo
            @type Object
            @example
            * iracing.on('SessionInfo', function (evt) {
            *   console.log(evt)
            * })
          */
          self.emit('update', {type: 'SessionInfo', data: self.sessionInfo.data, timestamp: now})
        }
      })
    }
  }, opts.sessionInfoUpdateInterval)

  /**
    any update event
    @event iracing#update
    @type Object
    @example
    * iracing.on('update', function (evt) {
    *   console.log(evt)
    * })
    */
  self.on('update', evt => {
    // fire old events as well.
    const timestamp = evt.timestamp
    const data = evt.data
    const type = evt.type

    switch (type) {
      case 'SessionInfo':
        self.emit('SessionInfo', {timestamp, data})
        break
      case 'Telemetry':
        self.emit('Telemetry', {timestamp, values: data})
        break
      case 'TelemetryDescription':
        self.emit('TelemetryDescription', data)
        break
      case 'Connected':
        self.emit('Connected')
        break
      case 'Disconnected':
        self.emit('Disconnected')
        break
      default:
        break
    }
  })

  /**
    Stops JsIrSdk, no new events are fired after calling this
    @method
    @private
  */
  this._stop = function () {
    clearInterval(telemetryIntervalId)
    clearInterval(sessionInfoIntervalId)
    clearInterval(startIntervalId)
    IrSdkWrapper.shutdown()
  }

  /** pad car number
    @function
    @private
  */
  function padCarNum (numStr) {
    if (typeof numStr === 'string') {
      var num = parseInt(numStr)
      var zeros = numStr.length - num.toString().length
      if (!zeros) return num

      var numPlaces = 1
      if (num > 9) numPlaces = 2
      if (num > 99) numPlaces = 3

      return (numPlaces + zeros) * 1000 + num
    }
  }
}

util.inherits(JsIrSdk, events.EventEmitter)

module.exports = JsIrSdk

function stringToEnum (input, enumObj) {
  var enumKey = Object.keys(enumObj).find(function (key) {
    return key.toLowerCase() === input.toLowerCase()
  })
  if (enumKey) {
    return enumObj[enumKey]
  }
}
