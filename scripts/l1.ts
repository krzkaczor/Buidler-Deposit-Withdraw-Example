import { ethers } from 'hardhat'
import { providers, Wallet } from 'ethers/lib/index'

export function getL1Signers(provider: providers.BaseProvider): Wallet[] {
  const pkeys = [
    '0xd2ab07f7c10ac88d5f86f1b4c1035d5195e81f27dbe62ad65e59cbf88205629b',
    '0x23d9aeeaa08ab710a57972eb56fc711d9ab13afdecc92c89586e0150bfa380a6',
  ]

  const connectedWallets = pkeys.map((pkey) => {
    return new ethers.Wallet(pkey, provider)
  })

  return connectedWallets
}

export async function getL1Provider(): Promise<providers.BaseProvider> {
  const l1 = new ethers.providers.JsonRpcProvider('http://localhost:9545')
  const latestBlockNumber = await l1.getBlockNumber()

  console.log(`L1 latest block number: ${latestBlockNumber}`)
  return l1
}
