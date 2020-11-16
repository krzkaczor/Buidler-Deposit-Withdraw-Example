import { ethers } from 'hardhat'
import { providers, Wallet } from 'ethers/lib/index'
import { OptimismProvider } from '@eth-optimism/provider'

export function getL2Signers(provider: providers.BaseProvider): Wallet[] {
  const mnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'

  const wallet = ethers.Wallet.fromMnemonic(mnemonic)

  const connectedWallet = wallet.connect(provider)

  return [connectedWallet]
}

export async function getL2Provider(): Promise<providers.BaseProvider> {
  const l2 = new OptimismProvider('http://localhost:8545')
  const latestBlockNumber = await l2.getBlockNumber()

  console.log(`L2 latest block number: ${latestBlockNumber}`)
  return l2
}
