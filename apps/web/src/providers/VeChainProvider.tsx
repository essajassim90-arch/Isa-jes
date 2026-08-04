import { VeChainKitProvider } from '@vechain/vechain-kit'
import '@vechain/vechain-kit/assets'
import type { ComponentProps } from 'react'

const projectId = import.meta.env.VITE_WC_PROJECT_ID?.trim() || undefined
const privyAppId = import.meta.env.VITE_PRIVY_APP_ID?.trim() || undefined
const privyClientId = import.meta.env.VITE_PRIVY_CLIENT_ID?.trim() || undefined

const walletConnectMetadata = {
  name: 'NAMA Protocol',
  description:
    'NAMA is a VeChainThor-powered trust infrastructure for sustainable food systems, Digital Product Passports, ESG intelligence, IoT traceability, and circular economy tracking.',
  url: typeof window !== 'undefined' ? window.location.origin : '',
  icons: ['https://avatars.githubusercontent.com/u/148128029'],
}

type VeChainKitProviderProps = ComponentProps<typeof VeChainKitProvider>

const privyConfig: VeChainKitProviderProps['privy'] =
  privyAppId && privyClientId
    ? {
        appId: privyAppId,
        clientId: privyClientId,
        appearance: {
          loginMessage: 'Sign in to NAMA Protocol',
          logo: walletConnectMetadata.icons[0],
        },
        loginMethods: ['google', 'email'],
      }
    : undefined

const loginMethods: VeChainKitProviderProps['loginMethods'] = privyConfig
  ? [
      { method: 'veworld', gridColumn: 4 },
      { method: 'google', gridColumn: 4 },
      { method: 'email', gridColumn: 4 },
      { method: 'more', gridColumn: 4 },
    ]
  : [
      { method: 'veworld', gridColumn: 6 },
      { method: 'sync2', gridColumn: 6 },
    ]

export function VeChainProvider({ children }: { children: React.ReactNode }) {
  return (
    <VeChainKitProvider
      network={{ type: 'test' }}
      privy={privyConfig}
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
      loginMethods={loginMethods}
      theme={{ accent: '#3b82f6' }}
    >
      {children}
    </VeChainKitProvider>
  )
}
