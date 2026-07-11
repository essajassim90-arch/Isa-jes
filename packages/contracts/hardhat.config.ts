import { config as dotenvConfig } from 'dotenv'
import '@nomicfoundation/hardhat-toolbox'
import type { HardhatUserConfig } from 'hardhat/config'

dotenvConfig()

const vechainTestnetRpcUrl = process.env.VECHAIN_TESTNET_RPC_URL ?? 'https://testnet.vechain.org'
const deployerPrivateKey =
  process.env.DEPLOYER_PRIVATE_KEY ?? process.env.VECHAIN_TESTNET_PRIVATE_KEY

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
