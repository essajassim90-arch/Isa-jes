import { WagmiProvider } from 'wagmi'
import type { Config } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { wagmiAdapter, queryClient, walletConnectAvailable } from './appkit-config.ts'

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  if (!walletConnectAvailable || !wagmiAdapter) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as unknown as Config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
