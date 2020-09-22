import { expect } from './setup'

/* External Imports */
import { ethers } from '@nomiclabs/buidler'
import { Signer, ContractFactory, Contract } from 'ethers'
import { getContractFactory } from '@eth-optimism/rollup-contracts'

describe('EOA L1 <-> L2 Message Passing', () => {
  let L1Wallet: Signer
  let L2Wallet: Signer
  before(async () => {
    // TODO: Update this to attach to different ethers providers within buidler
    // as to properly simulate cross domain calls.
    ;[L1Wallet, L2Wallet] = await ethers.getSigners()
  })

  let L1CrossDomainMessengerFactory: ContractFactory
  let L2CrossDomainMessengerFactory: ContractFactory
  let ERC20Factory: ContractFactory
  let DepositedERC20Factory: ContractFactory
  let L1ERC20DepositFactory: ContractFactory
  before(async () => {
    L1CrossDomainMessengerFactory = getContractFactory('L1MockCrossDomainMessenger', L1Wallet)
    L2CrossDomainMessengerFactory = getContractFactory('L2MockCrossDomainMessenger', L2Wallet)
    ERC20Factory = await ethers.getContractFactory('ERC20')
    DepositedERC20Factory = await ethers.getContractFactory('DepositedERC20')
    L1ERC20DepositFactory = await ethers.getContractFactory('L1ERC20Deposit')
  })

  let L1CrossDomainMessenger: Contract
  let L2CrossDomainMessenger: Contract
  beforeEach(async () => {
    L1CrossDomainMessenger = await L1CrossDomainMessengerFactory.deploy()
    L2CrossDomainMessenger = await L2CrossDomainMessengerFactory.deploy()

    await L1CrossDomainMessenger.setTargetMessenger(L2CrossDomainMessenger.address)
    await L2CrossDomainMessenger.setTargetMessenger(L1CrossDomainMessenger.address)
  })

  let L1ERC20: Contract
  let L2DepositedERC20: Contract
  let L1ERC20Deposit: Contract
  beforeEach(async () => {
    L1ERC20 = await ERC20Factory.deploy(
      10000,
      'TEST TOKEN',
      0,
      'TEST',
    )
    L2DepositedERC20 = await DepositedERC20Factory.deploy(
      0,
      'TEST TOKEN',
      0,
      'TEST',
    )
    L1ERC20Deposit = await L1ERC20DepositFactory.deploy(
      L1CrossDomainMessenger.address,
      L1ERC20.address,
      L2DepositedERC20.address,
    )
    await L2DepositedERC20.init(
      L1ERC20Deposit.address,
      L2CrossDomainMessenger.address,
    )

  })

  describe('deposit and withdrawal', () => {
    it('should allow an EOA to transfer between domains', async () => {
      let l2balance = await L2DepositedERC20.balanceOf(await L1Wallet.getAddress())
      let l1balance = await L1ERC20.balanceOf(await L1Wallet.getAddress())

      console.log('balance on l2', l2balance.toString())
      console.log('balance on l1', l1balance.toString())

      await L1ERC20.approve(L1ERC20Deposit.address, 5000)
      await L1ERC20Deposit.deposit(L1Wallet.getAddress(), 5000)

      console.log('deposited 5000 coins')
      
      l2balance = await L2DepositedERC20.balanceOf(await L1Wallet.getAddress())
      l1balance = await L1ERC20.balanceOf(await L1Wallet.getAddress())

      console.log('balance on l2', l2balance.toString())
      console.log('balance on l1', l1balance.toString())

      await L2DepositedERC20.withdraw(2000)

      console.log('withdrew 2000 coins')

      l2balance = await L2DepositedERC20.balanceOf(await L1Wallet.getAddress())
      l1balance = await L1ERC20.balanceOf(await L1Wallet.getAddress())

      console.log('balance on l2', l2balance.toString())
      console.log('balance on l1', l1balance.toString())
    })
  })
})