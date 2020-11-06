import { usePlugin, BuidlerConfig } from '@nomiclabs/buidler/config'

usePlugin('@nomiclabs/buidler-ethers')
usePlugin('@nomiclabs/buidler-waffle')

const config: BuidlerConfig = {
  mocha: {
    timeout: 50000,
  },
  solc: {
    version: "0.5.16",
    optimizer: { enabled: true, runs: 200 },
  },
}

export default config
