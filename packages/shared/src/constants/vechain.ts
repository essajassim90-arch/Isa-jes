/** VeChainThor Testnet configuration for Phase 1A. */
export const VECHAIN_TESTNET = {
  name: 'VeChainThor Testnet',
  rpcUrl: 'https://testnet.vechain.org',
  explorerUrl: 'https://explore-testnet.vechain.org',
  chainIdHex: '0x27',
} as const

/**
 * Deployed contract addresses on VeChainThor Testnet.
 *
 * Single source of truth for contract addresses across all consumers:
 *   - API (apps/api):     imports directly from @nama/shared at runtime
 *   - Frontend (apps/web): imports directly from @nama/shared at bundle time
 *   - Indexer (apps/indexer): reads via DPP_CONTRACT_ADDRESS and
 *       MARKETPLACE_CONTRACT_ADDRESS environment variables — populate those
 *       vars from the values below after deployment
 *
 * After testnet deployment update the empty strings below with the deployed
 * addresses (0x-prefixed, 40 hex chars) and re-deploy / restart all services.
 */
export const TESTNET_CONTRACT_ADDRESSES = {
  DPP: '',
  Marketplace: '',
} as const
