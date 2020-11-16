"use strict";
exports.__esModule = true;
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
var config = {
    mocha: {
        timeout: 50000
    },
    solidity: {
        version: "0.5.16",
        settings: {
            optimizer: { enabled: true, runs: 200 }
        }
    },
    networks: {
        hardhat: {
            blockGasLimit: 15000000
        }
    }
};
exports["default"] = config;
