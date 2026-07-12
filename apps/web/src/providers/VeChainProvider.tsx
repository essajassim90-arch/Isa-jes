import { VeChainKitProvider } from '@vechain/vechain-kit'
import '@vechain/vechain-kit/assets'

const projectId = import.meta.env.VITE_WC_PROJECT_ID as string | undefined

const walletConnectMetadata = {
  name: 'NAMA Protocol',
  description:
    'NAMA is a VeChainThor-powered trust infrastructure for sustainable food systems, Digital Product Passports, ESG intelligence, IoT traceability, and circular economy tracking.',
  url: typeof window !== 'undefined' ? window.location.origin : '',
  icons: ['https://avatars.githubusercontent.com/u/148128029'],
}

export function VeChainProvider({ children }: { children: React.ReactNode }) {
  return (
    <VeChainKitProvider
      network={{ type: 'test' }}
      dappKit={{
        allowedWallets: projectId
          ? ['veworld', 'sync2', 'wallet-connect']
          : ['veworld', 'sync2'],
        ...(projectId && {
          walletConnectOptions: {
            projectId,
            metadata: walletConnectMetadata,
          },
        }),
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
