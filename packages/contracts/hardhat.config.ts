import { config as dotenvConfig } from 'dotenv'
import '@nomicfoundation/hardhat-toolbox'
import type { HardhatUserConfig } from 'hardhat/config'

dotenvConfig()

const vechainTestnetRpcUrl = process.env.VECHAIN_TESTNET_RPC_URL ?? 'https://testnet.vechain.org'

/**
 * Validate and normalise a raw private-key string.
 *
 * Accepts keys with or without a leading "0x" prefix.
 * Returns the key with "0x" prefix when valid (exactly 32 bytes / 64 hex
 * characters), or undefined when the value is absent or malformed.
 *
 * Returning undefined instead of throwing prevents Hardhat from crashing at
 * config-load time with the unhelpful "HH8: private key too short" error when
 * a placeholder or truncated secret is stored in CI.
 */
function parsePrivateKey(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  const key = raw.startsWith('0x') ? raw : `0x${raw}`
  if (!/^0x[0-9a-fA-F]{64}$/.test(key)) {
    const byteLen = Math.floor((key.length - 2) / 2)
    console.error(
      `[hardhat.config] DEPLOYER_PRIVATE_KEY is not a valid 32-byte hex private key ` +
        `(decoded to ~${byteLen} bytes). Proceeding with no deployer account – ` +
        `set a 64-character hex key (with or without 0x prefix) to enable deployment.`,
    )
    return undefined
  }
  return key
}

const deployerPrivateKey = parsePrivateKey(
  process.env.DEPLOYER_PRIVATE_KEY ?? process.env.VECHAIN_TESTNET_PRIVATE_KEY,
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
      // VeChainThor Testnet chain ID (0x27 = 39).
      // Required so Hardhat does not auto-detect via eth_chainId on startup.
      chainId: 39,
      // VeChainThor does not support EIP-1559 (no eth_feeHistory / maxFeePerGas).
      // Setting gasPrice forces Hardhat Ignition to send legacy (type-0) transactions.
      gasPrice: 1_000_000_000,
    },
  },
}

export default config
