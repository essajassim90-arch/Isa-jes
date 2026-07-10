import { createAppKit } from '@reown/appkit/react'
import { mainnet, arbitrum, polygon } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

const projectId = import.meta.env.VITE_WC_PROJECT_ID ?? 'a0b855ceaf109dbc8426479a52cdaed1'

const metadata = {
  name: 'Isa-Jes dApp',
  description: 'VeChain + EVM multichain dApp',
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
