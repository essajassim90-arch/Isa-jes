import { createAppKit } from '@reown/appkit/react'
import { mainnet, arbitrum, polygon } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

const projectId = import.meta.env.VITE_WC_PROJECT_ID

const metadata = {
  name: 'NAMA Protocol',
  description:
    'NAMA is a VeChainThor-powered trust infrastructure for sustainable food systems, Digital Product Passports, ESG intelligence, IoT traceability, and circular economy tracking.',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://essajassim90-arch.github.io',
  icons: ['https://avatars.githubusercontent.com/u/148128029'],
}

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, arbitrum, polygon]

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
})

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
  },
})
