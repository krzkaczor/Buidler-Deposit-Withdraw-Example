import { HardhatUserConfig } from 'hardhat/config'

import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'

const config: HardhatUserConfig = {
  mocha: {
    timeout: 50000,
  },
  solidity: {
    version: "0.5.16",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    }
  },
  networks: {
    optimismL1: {
      url: "http://localhost:9545",
    },
    optimismL2: {
      url: "http://localhost:8545",
    },
    hardhat: {
      blockGasLimit: 15000000
    }
  }
}

export default config
