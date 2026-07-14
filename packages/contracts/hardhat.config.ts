import '@nomicfoundation/hardhat-toolbox'
import '@vechain/sdk-hardhat-plugin'
import { config as dotenvConfig } from 'dotenv'
import type { HardhatUserConfig } from 'hardhat/config'

dotenvConfig()

const vechainTestnetRpcUrl = process.env.VECHAIN_TESTNET_RPC_URL ?? 'https://testnet.vechain.org'
const rawDeployerPrivateKey =
  process.env.DEPLOYER_PRIVATE_KEY ?? process.env.VECHAIN_TESTNET_PRIVATE_KEY
const deployerPrivateKeySource =
  process.env.DEPLOYER_PRIVATE_KEY !== undefined
    ? 'DEPLOYER_PRIVATE_KEY'
    : process.env.VECHAIN_TESTNET_PRIVATE_KEY !== undefined
      ? 'VECHAIN_TESTNET_PRIVATE_KEY'
      : undefined

function normalizePrivateKey(
  value: string | undefined,
  sourceName: string | undefined,
): string | undefined {
  if (value === undefined) {
    return undefined
  }

  const trimmedValue = value.trim()
  if (trimmedValue === '') {
    return undefined
  }

  const privateKey = trimmedValue.startsWith('0x') ? trimmedValue.slice(2) : trimmedValue

  if (!/^[0-9a-fA-F]{64}$/.test(privateKey)) {
    const configuredSource = sourceName ?? 'Configured deployer private key'
    const byteLen = Math.floor(privateKey.length / 2)

    console.error(
      `[hardhat.config] ${configuredSource} is not a valid 32-byte hex private key ` +
        `(decoded to ~${byteLen} bytes). Proceeding with no deployer account – ` +
        `set a 64-character hex key (with or without 0x prefix) to enable deployment.`,
    )
    return undefined
  }

  return `0x${privateKey}`
}

const deployerPrivateKey = normalizePrivateKey(
  rawDeployerPrivateKey,
  deployerPrivateKeySource,
)

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
