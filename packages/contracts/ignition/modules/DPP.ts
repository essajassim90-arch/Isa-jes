import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

/**
 * Hardhat Ignition module for the DPP (Digital Product Passport) contract.
 *
 * Deploy to VeChainThor Testnet (do NOT deploy to mainnet):
 *   npx hardhat ignition deploy ignition/modules/DPP.ts --network vechain_testnet
 *
 * Dry-run (no broadcast):
 *   npx hardhat ignition deploy ignition/modules/DPP.ts --network vechain_testnet --dry-run
 *
 * Required env vars:
 *   DEPLOYER_PRIVATE_KEY   — deployer account private key (preferred)
 *   VECHAIN_TESTNET_RPC_URL — optional, defaults to https://testnet.vechain.org
 */
const DPPModule = buildModule('DPP', (m) => {
  const dpp = m.contract('DPP')

  return { dpp }
})

export default DPPModule
