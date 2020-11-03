import { expect } from '../setup'

/* External Imports */
import { ethers } from '@nomiclabs/buidler'
import { Signer, ContractFactory, Contract } from 'ethers'
import { assert } from 'console'

describe('EOA L1 <-> L2 Message Passing', () => {
  let AliceL1Wallet: Signer
  let BobL1Wallet: Signer
  let MalloryL1Wallet: Signer
  before(async () => {
    // TODO: Update this to attach to different ethers providers within buidler
    // as to properly simulate cross domain calls.
    ;[AliceL1Wallet, BobL1Wallet, MalloryL1Wallet] = await ethers.getSigners()
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
    L2ERC20.init(L1ERC20Deposit.address); //,L1ERC20.address);


  })

  // can nest describes
  describe('deposit and withdrawal, one wallet', () => {

    it('should allow an EOA to deposit and withdraw between one wallet', async () => {
      let l2balance = await L2ERC20.balanceOf(await AliceL1Wallet.getAddress())
      let l1balance = await L1ERC20.balanceOf(await AliceL1Wallet.getAddress())

      await L1ERC20.approve(L1ERC20Deposit.address, 5000)
      await L1ERC20Deposit.deposit(AliceL1Wallet.getAddress(), 5000)
      console.log('deposited 5000 coins')
      
      l2balance = await L2ERC20.balanceOf(await AliceL1Wallet.getAddress())
      l1balance = await L1ERC20.balanceOf(await AliceL1Wallet.getAddress())
      console.log('balance on l2', l2balance.toString())
      console.log('balance on l1', l1balance.toString())
     
      await L2ERC20.withdraw(AliceL1Wallet.getAddress(), 2000)    
      console.log('withdrew 2000 coins')

      l2balance = await L2ERC20.balanceOf(await AliceL1Wallet.getAddress())
      l1balance = await L1ERC20.balanceOf(await AliceL1Wallet.getAddress())
      console.log('balance on l2', l2balance.toString())
      console.log('balance on l1', l1balance.toString())

      expect(l1balance).to.be.eq(7000)
      expect(l2balance).to.be.equal(3000)
    })

    it('should allow an EOA to deposit and withdraw between two wallets', async () => {
      await L1ERC20.approve(L1ERC20Deposit.address, 5000)
      await L1ERC20Deposit.deposit(AliceL1Wallet.getAddress(), 5000)
      console.log('Alice deposited 5000 coins to L2')

      let alice_l2balance = await L2ERC20.balanceOf(await AliceL1Wallet.getAddress())
      let alice_l1balance = await L1ERC20.balanceOf(await AliceL1Wallet.getAddress())
      console.log('Alice balance on l2', alice_l2balance.toString())
      console.log('Alice balance on l1', alice_l1balance.toString())

      L2ERC20.transfer(BobL1Wallet.getAddress(), 2000)
      console.log('Alice transfer 2000 to Bob')

      alice_l2balance = await L2ERC20.balanceOf(await AliceL1Wallet.getAddress())
      alice_l1balance = await L1ERC20.balanceOf(await AliceL1Wallet.getAddress())
      let bob_l2balance = await L2ERC20.balanceOf(await BobL1Wallet.getAddress())
      let bob_l1balance = await L1ERC20.balanceOf(await BobL1Wallet.getAddress())
      console.log('Alice balance on l2', alice_l2balance.toString())
      console.log('Alice balance on l1', alice_l1balance.toString())
      console.log('Bob balance on l2', bob_l2balance.toString())
      console.log('Bob balance on l1', bob_l1balance.toString())

      await L2ERC20.withdraw(BobL1Wallet.getAddress(), 1000)
      console.log('Bob withdrew 1000')

      bob_l2balance = await L2ERC20.balanceOf(await BobL1Wallet.getAddress())
      bob_l1balance = await L1ERC20.balanceOf(await BobL1Wallet.getAddress())      
      console.log('Bob balance on l2', bob_l2balance.toString())
      console.log('Bob balance on l1', bob_l1balance.toString())

      expect(alice_l2balance).to.be.eq(3000)
      expect(alice_l1balance).to.be.eq(5000)
      expect(bob_l2balance).to.be.eq(1000)
      expect(bob_l1balance).to.be.eq(1000)
    })

    it('should not allow alice to withdraw transferred $', async () => {
      await L1ERC20.approve(L1ERC20Deposit.address, 5000)
      await L1ERC20Deposit.deposit(AliceL1Wallet.getAddress(), 5000)
      console.log('Alice deposited 5000 coins to L2')

      L2ERC20.transfer(BobL1Wallet.getAddress(), 5000)
      console.log('Alice transfer 5000 to Bob')

      let alice_l2balance = await L2ERC20.balanceOf(await AliceL1Wallet.getAddress())
      let alice_l1balance = await L1ERC20.balanceOf(await AliceL1Wallet.getAddress())
      console.log('Alice balance on l2', alice_l2balance.toString())
      console.log('Alice balance on l1', alice_l1balance.toString())

      console.log('Alice tries to withdraw $ she doesnt have')
      await expect(L2ERC20.withdraw(AliceL1Wallet.getAddress(), 2000)).to.be.revertedWith("account doesn't have enough coins to burn")
    })

    it('should not allow bob to withdraw twice', async () => {
      await L1ERC20.approve(L1ERC20Deposit.address, 5000)
      await L1ERC20Deposit.deposit(AliceL1Wallet.getAddress(), 5000)
      console.log('Alice deposited 5000 coins to L2')
      
      L2ERC20.transfer(BobL1Wallet.getAddress(), 3000)
      console.log('Alice transfer 3000 to Bob')

      let alice_l2balance = await L2ERC20.balanceOf(await AliceL1Wallet.getAddress())
      let alice_l1balance = await L1ERC20.balanceOf(await AliceL1Wallet.getAddress())
      console.log('Alice balance on l2', alice_l2balance.toString())
      console.log('Alice balance on l1', alice_l1balance.toString())

      await L2ERC20.withdraw(BobL1Wallet.getAddress(), 3000)
      console.log('Bob withdrew 3000')

      let bob_l2balance = await L2ERC20.balanceOf(await BobL1Wallet.getAddress())
      let bob_l1balance = await L1ERC20.balanceOf(await BobL1Wallet.getAddress())
      console.log('Bob balance on l2', bob_l2balance.toString())
      console.log('Bob balance on l1', bob_l1balance.toString())

      await expect(L2ERC20.withdraw(BobL1Wallet.getAddress(), 3000)).to.be.revertedWith("account doesn't have enough coins to burn")

    })

    it('should not allow mallory to call withdraw', async () => {
      await L1ERC20.approve(L1ERC20Deposit.address, 5000)
      await L1ERC20Deposit.deposit(AliceL1Wallet.getAddress(), 5000)
      await expect(L2ERC20.withdraw(MalloryL1Wallet.getAddress(), 3000)).to.be.revertedWith("account doesn't have enough coins to burn")
    })



  })
})