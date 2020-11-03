import { expect } from '../setup'

/* External Imports */
import { ethers } from '@nomiclabs/buidler'
import { Signer, ContractFactory, Contract } from 'ethers'

describe('EOA L1 <-> L2 Message Passing', () => {
  let L1Wallet: Signer
  let L2Wallet: Signer
  before(async () => {
    // TODO: Update this to attach to different ethers providers within buidler
    // as to properly simulate cross domain calls.
    ;[L1Wallet, L2Wallet] = await ethers.getSigners()
  })

  let ERC20Factory: ContractFactory
  let L2ERC20Factory: ContractFactory
  let L1ERC20DepositFactory: ContractFactory
  before(async () => {
    ERC20Factory = await ethers.getContractFactory('ERC20')
    L2ERC20Factory = await ethers.getContractFactory('L2ERC20')
    L1ERC20DepositFactory = await ethers.getContractFactory('L1ERC20Deposit')
  })

  let L1ERC20: Contract
  let L2ERC20: Contract
  let L1ERC20Deposit: Contract
  beforeEach(async () => {
    L1ERC20 = await ERC20Factory.deploy(
      10000,
      'TEST TOKEN',
      0,
      'TEST',
    )
    L2ERC20 = await L2ERC20Factory.deploy(
      0,
      'TEST TOKEN',
      0,
      'TEST',
    )
    L1ERC20Deposit = await L1ERC20DepositFactory.deploy(
      L1ERC20.address,
      L2ERC20.address,
    )
    L2ERC20.init(L1ERC20Deposit.address);
  })

  describe('deposit and withdrawal', () => {
    it('should allow an EOA to deposit and withdraw between domains', async () => {
      let l2balance = await L2ERC20.balanceOf(await L1Wallet.getAddress())
      let l1balance = await L1ERC20.balanceOf(await L1Wallet.getAddress())
      console.log('balance on l2', l2balance.toString())
      console.log('balance on l1', l1balance.toString())

      await L1ERC20.approve(L1ERC20Deposit.address, 5000)
      await L1ERC20Deposit.deposit(L1Wallet.getAddress(), 5000)

      console.log('deposited 5000 coins')
      
      l2balance = await L2ERC20.balanceOf(await L1Wallet.getAddress())
      l1balance = await L1ERC20.balanceOf(await L1Wallet.getAddress())

      console.log('balance on l2', l2balance.toString())
      console.log('balance on l1', l1balance.toString())

      await L2ERC20.withdraw(L1Wallet.getAddress(), 2000)

      console.log('withdrew 2000 coins')

      l2balance = await L2ERC20.balanceOf(await L1Wallet.getAddress())
      l1balance = await L1ERC20.balanceOf(await L1Wallet.getAddress())

      console.log('balance on l2', l2balance.toString())
      console.log('balance on l1', l1balance.toString())

      expect(l1balance).to.be.eq(7000)
      expect(l2balance).to.be.equal(3000)
    })
  })
})