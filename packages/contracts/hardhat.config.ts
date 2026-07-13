import '@nomicfoundation/hardhat-toolbox'
import '@vechain/sdk-hardhat-plugin'
import { config as dotenvConfig } from 'dotenv'
import type { HardhatUserConfig } from 'hardhat/config'

dotenvConfig()

const vechainTestnetRpcUrl = process.env.VECHAIN_TESTNET_RPC_URL ?? 'https://testnet.vechain.org'
const rawDeployerPrivateKey =
  process.env.DEPLOYER_PRIVATE_KEY ?? process.env.VECHAIN_TESTNET_PRIVATE_KEY

function normalizePrivateKey(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined
  }

  const trimmedValue = value.trim()
  const privateKey = trimmedValue.startsWith('0x') ? trimmedValue.slice(2) : trimmedValue

  if (!/^[0-9a-fA-F]{64}$/.test(privateKey)) {
    throw new Error(
      'DEPLOYER_PRIVATE_KEY must be exactly 64 hexadecimal characters, optionally prefixed with 0x.',
    )
  }

  return `0x${privateKey}`
}

const deployerPrivateKey = normalizePrivateKey(rawDeployerPrivateKey)

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.26',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    vechain_testnet: {
      url: vechainTestnetRpcUrl,
      accounts: deployerPrivateKey ? [deployerPrivateKey] : [],
      gas: 'auto',
      gasPrice: 'auto',
      gasMultiplier: 1,
      timeout: 20000,
      httpHeaders: {},
    },
  },
}

export default config
