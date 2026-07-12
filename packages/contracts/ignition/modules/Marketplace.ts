import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

/**
 * Hardhat Ignition module for the Marketplace contract.
 *
 * Deploy to VeChainThor Testnet (do NOT deploy to mainnet):
 *   npx hardhat ignition deploy ignition/modules/Marketplace.ts --network vechain_testnet
 *
 * Dry-run (no broadcast):
 *   npx hardhat ignition deploy ignition/modules/Marketplace.ts --network vechain_testnet --dry-run
 *
 * Required env vars:
 *   DEPLOYER_PRIVATE_KEY   — deployer account private key (preferred)
 *   VECHAIN_TESTNET_RPC_URL — optional, defaults to https://testnet.vechain.org
 */
const MarketplaceModule = buildModule('Marketplace', (m) => {
  const marketplace = m.contract('Marketplace')

  return { marketplace }
})

export default MarketplaceModule
