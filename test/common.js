"use strict";

global.chai = require("chai");
global.should = chai.should();
global.expect = chai.expect;

var sinonChai = require("sinon-chai");
chai.use(sinonChai);

global.sinon = require("sinon");