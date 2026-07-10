import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppKitProvider } from './providers/AppKitProvider.tsx'
import { VeChainProvider } from './providers/VeChainProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppKitProvider>
      <VeChainProvider>
        <App />
      </VeChainProvider>
    </AppKitProvider>
  </StrictMode>,
)
