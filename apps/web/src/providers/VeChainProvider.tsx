import { VeChainKitProvider } from '@vechain/vechain-kit'
import '@vechain/vechain-kit/assets'

export function VeChainProvider({ children }: { children: React.ReactNode }) {
  return (
    <VeChainKitProvider
      network={{ type: 'test' }}
      dappKit={{
        allowedWallets: ['veworld', 'sync2', 'wallet-connect'],
        walletConnectOptions: {
          projectId: import.meta.env.VITE_WC_PROJECT_ID ?? 'a0b855ceaf109dbc8426479a52cdaed1',
          metadata: {
            name: 'NAMA Protocol',
            description: 'Decentralized ecosystem for global food security & sustainable supply chains',
            url: typeof window !== 'undefined' ? window.location.origin : '',
            icons: ['https://avatars.githubusercontent.com/u/148128029'],
          },
        },
      }}
      loginMethods={[
        { method: 'veworld', gridColumn: 4 },
        { method: 'google', gridColumn: 4 },
        { method: 'email', gridColumn: 4 },
        { method: 'more', gridColumn: 4 },
      ]}
      theme={{ accent: '#3b82f6' }}
    >
      {children}
    </VeChainKitProvider>
  )
}
