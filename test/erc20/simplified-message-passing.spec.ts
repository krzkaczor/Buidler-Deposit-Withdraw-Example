import { expect } from '../setup'

/* External Imports */
import { ethers } from '@nomiclabs/buidler'
import { Signer, ContractFactory, Contract } from 'ethers'
import { waffleV3 } from '@eth-optimism/ovm-toolchain'

/* Internal Imports */
import { increaseEthTime } from '../helpers'

const l1ToL2MessageDelay = 100
const l2ToL1MessageDelay = 1000

describe('L1 <=> L2 ERC20 (Simplified Example)', () => {
  let signer: Signer
  before(async () => {
    ;[signer] = await ethers.getSigners()
  })

  let ERC20Factory: ContractFactory
  before(async () => {
    ERC20Factory = await ethers.getContractFactory('L2ReadyERC20')
  })

  let L1_CrossDomainMessenger: Contract
  let L2_CrossDomainMessenger: Contract
  beforeEach(async () => {
    const messengers = await waffleV3.initCrossDomainMessengers(
      l1ToL2MessageDelay,
      l2ToL1MessageDelay,
      signer
    )

    L1_CrossDomainMessenger = messengers.l1CrossDomainMessenger
    L2_CrossDomainMessenger = messengers.l2CrossDomainMessenger
  })

  let L1_ERC20: Contract
  let L2_ERC20: Contract
  beforeEach(async () => {
    L1_ERC20 = await ERC20Factory.deploy(
      10000,
      'TEST TOKEN',
      0,
      'TEST'
    )

    L2_ERC20 = await ERC20Factory.deploy(
      10000,
      'TEST TOKEN',
      0,
      'TEST'
    )

    await L1_ERC20.init(
      L1_CrossDomainMessenger.address,
      L2_ERC20.address
    )

    await L2_ERC20.init(
      L2_CrossDomainMessenger.address,
      L1_ERC20.address
    )
  })

  describe('cross domain transfers', () => {
    it('should allow a user to transfer a balance from L1 to L2', async () => {
      const originalL1Balance = await L1_ERC20.balanceOf(await signer.getAddress())
      const originalL2Balance = await L2_ERC20.balanceOf(await signer.getAddress())

      // Initiate the transfer.
      await L1_ERC20.xDomainTransfer(originalL1Balance)

      // Wait for the delay to pass, otherwise the message won't exist.
      await increaseEthTime(l1ToL2MessageDelay + 1)
      
      // Use the simplified API, assume that messages are being relayed by a service.
      await waffleV3.waitForCrossDomainMessages(signer)

      const finalL1Balance = await L1_ERC20.balanceOf(await signer.getAddress())
      const finalL2Balance = await L2_ERC20.balanceOf(await signer.getAddress())

      expect(finalL1Balance).to.equal(0)
      expect(finalL2Balance).to.equal(originalL1Balance.add(originalL2Balance))
    })

    it('should allow a user to transfer a balance from L2 to L1', async () => {
      const originalL1Balance = await L1_ERC20.balanceOf(await signer.getAddress())
      const originalL2Balance = await L2_ERC20.balanceOf(await signer.getAddress())

      // Initiate the transfer.
      await L2_ERC20.xDomainTransfer(originalL1Balance)

      // Wait for the delay to pass, otherwise the message won't exist.
      await increaseEthTime(l2ToL1MessageDelay + 1)

      // Use the simplified API, assume that messages are being relayed by a service.
      await waffleV3.waitForCrossDomainMessages(signer)

      const finalL1Balance = await L1_ERC20.balanceOf(await signer.getAddress())
      const finalL2Balance = await L2_ERC20.balanceOf(await signer.getAddress())

      expect(finalL2Balance).to.equal(0)
      expect(finalL1Balance).to.equal(originalL1Balance.add(originalL2Balance))
    })

    it('should have to wait for the delay period to pass', async () => {
      const originalL1Balance = await L1_ERC20.balanceOf(await signer.getAddress())
      const originalL2Balance = await L2_ERC20.balanceOf(await signer.getAddress())

      // Initiate the transfer.
      await L1_ERC20.xDomainTransfer(originalL1Balance)

      // Here we *don't* wait for the delay to pass, meaning the message doesn't exist yet.
      // Use the simplified API, assume that messages are being relayed by a service.
      await waffleV3.waitForCrossDomainMessages(signer)

      const intermediateL1Balance = await L1_ERC20.balanceOf(await signer.getAddress())
      const intermediateL2Balance = await L2_ERC20.balanceOf(await signer.getAddress())
      
      // We burn immediately, so the L1 balance will already be zero even though the L2 balance
      // hasn't been updated yet.
      expect(intermediateL1Balance).to.equal(0)
      expect(intermediateL2Balance).to.equal(originalL2Balance)

      // Now we actually wait for the delay and try again.
      await increaseEthTime(l2ToL1MessageDelay + 1)
      await waffleV3.waitForCrossDomainMessages(signer)

      const finalL1Balance = await L1_ERC20.balanceOf(await signer.getAddress())
      const finalL2Balance = await L2_ERC20.balanceOf(await signer.getAddress())

      expect(finalL1Balance).to.equal(0)
      expect(finalL2Balance).to.equal(originalL1Balance.add(originalL2Balance))
    })
  })
})
