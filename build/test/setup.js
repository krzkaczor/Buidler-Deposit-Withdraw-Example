"use strict";
exports.__esModule = true;
exports.expect = exports.should = void 0;
/* External Imports */
var chai = require("chai");
var ethereum_waffle_1 = require("ethereum-waffle");
chai.use(ethereum_waffle_1.solidity);
var should = chai.should();
exports.should = should;
var expect = chai.expect;
exports.expect = expect;
