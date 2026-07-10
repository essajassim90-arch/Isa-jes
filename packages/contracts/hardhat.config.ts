import { config as dotenvConfig } from 'dotenv'
import '@nomicfoundation/hardhat-toolbox'
import type { HardhatUserConfig } from 'hardhat/config'

dotenvConfig()

const vechainTestnetRpcUrl = process.env.VECHAIN_TESTNET_RPC_URL ?? 'https://testnet.vechain.org'
const deployerPrivateKey = process.env.VECHAIN_TESTNET_PRIVATE_KEY

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.24',
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
    },
  },
}

export default config
