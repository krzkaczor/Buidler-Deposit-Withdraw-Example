import { ethers } from 'hardhat'

export function q18(n: number) {
  return ethers.BigNumber.from(10).pow(18).mul(n).toString()
}
