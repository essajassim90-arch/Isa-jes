import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { wagmiAdapter, queryClient } from './appkit-config'

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <WagmiProvider config={wagmiAdapter.wagmiConfig as any}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
