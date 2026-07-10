/** VeChainThor network configuration for the NAMA Protocol. */
export const VECHAIN_NETWORKS = {
  testnet: {
    url: 'https://testnet.vechain.org',
    explorerUrl: 'https://explore-testnet.vechain.org',
    chainId: '0x27',
  },
  mainnet: {
    url: 'https://mainnet.vechain.org',
    explorerUrl: 'https://explore.vechain.org',
    chainId: '0x4a',
  },
} as const

/**
 * Deployed contract addresses.
 * Update after each Testnet / Mainnet deployment via scripts/deploy-testnet.ts.
 */
export const CONTRACT_ADDRESSES = {
  testnet: {
    DPP: '',          // set after deployment
    Marketplace: '',  // set after deployment
  },
  mainnet: {
    DPP: '',          // Phase 4 — Mainnet launch
    Marketplace: '',  // Phase 4 — Mainnet launch
  },
} as const
