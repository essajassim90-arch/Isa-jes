/** VeChainThor Testnet configuration for Phase 1A. */
export const VECHAIN_TESTNET = {
  name: 'VeChainThor Testnet',
  rpcUrl: 'https://testnet.vechain.org',
  explorerUrl: 'https://explore-testnet.vechain.org',
  chainIdHex: '0x27',
} as const

/** Phase 1A contract addresses (set after testnet deployment). */
export const TESTNET_CONTRACT_ADDRESSES = {
  DPP: '',
  Marketplace: '',
} as const
