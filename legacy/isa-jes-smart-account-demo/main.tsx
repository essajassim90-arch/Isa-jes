import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { VeChainKitProvider } from '@vechain/vechain-kit'
import '@vechain/vechain-kit/assets'
import './index.css'
import App from './App.tsx'
import { AppKitProvider } from './AppKitProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppKitProvider>
      <VeChainKitProvider
        network={{
          type: 'test',
        }}
        dappKit={{
          allowedWallets: ['veworld', 'sync2', 'wallet-connect'],
          walletConnectOptions: {
            projectId: import.meta.env.VITE_WC_PROJECT_ID,
            metadata: {
              name: 'NAMA Protocol',
              description:
                'NAMA is a VeChainThor-powered trust infrastructure for sustainable food systems, Digital Product Passports, ESG intelligence, IoT traceability, and circular economy tracking.',
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
        <App />
      </VeChainKitProvider>
    </AppKitProvider>
  </StrictMode>,
)
