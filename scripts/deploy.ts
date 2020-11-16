import { ethers } from 'hardhat'
import { getL1Provider, getL1Signers } from './l1'
import { getL2Provider, getL2Signers } from './l2'
import { q18 } from './utils'

async function main() {
  // const l1Provider = await getL1Provider()
  // const [l1Deployer] = getL1Signers(l1Provider)
  // console.log('L1 deployer info: ', {
  //   address: l1Deployer.address,
  //   balance: (await l1Deployer.getBalance()).toString(),
  // })

  // const l1TokenFactory = await ethers.getContractFactory('ERC20', l1Deployer)
  // const l1Dai = await l1TokenFactory.deploy(q18(1000), 'DAI', 18, 'DAI')
  // console.log('DAI deployed on L1: ', l1Dai.address)

  const l2Provider = await getL2Provider()
  const [l2Deployer] = getL2Signers(l2Provider)
  console.log('L2 deployer info: ', {
    address: l2Deployer.address,
    balance: (await l2Deployer.getBalance()).toString(),
  })

  const l2TokenFactory = await ethers.getContractFactory('L2ERC20', l2Deployer)
  const l2Dai = await l2TokenFactory.deploy('DAI', 18, 'DAI', { gasPrice: 0 })
  console.log('DAI deployed on L2: ', l2Dai.address)
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
