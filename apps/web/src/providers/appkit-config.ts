import { createAppKit } from '@reown/appkit/react'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { mainnet, arbitrum, polygon } from 'viem/chains'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

const projectId = import.meta.env.VITE_WC_PROJECT_ID?.trim() || undefined

const metadata = {
  name: 'NAMA Protocol',
  description:
    'NAMA is a VeChainThor-powered trust infrastructure for sustainable food systems, Digital Product Passports, ESG intelligence, IoT traceability, and circular economy tracking.',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://essajassim90-arch.github.io',
  icons: ['https://avatars.githubusercontent.com/u/148128029'],
}

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, arbitrum, polygon]

// WalletConnect / AppKit is only initialized when a project ID is available.
// In CI and demo builds without VITE_WC_PROJECT_ID the EVM wallet integration
// is skipped and wagmiAdapter is null.
export const walletConnectAvailable = Boolean(projectId)

export const wagmiAdapter = walletConnectAvailable
  ? new WagmiAdapter({ networks, projectId: projectId! })
  : null

if (walletConnectAvailable && wagmiAdapter) {
  createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId: projectId!,
    metadata,
    features: {
      analytics: true,
    },
  })
}
