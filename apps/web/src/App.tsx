import { useState } from 'react'
import { WalletButton } from '@vechain/vechain-kit'
import './App.css'
import { Passport } from './pages/Passport.tsx'
import { Marketplace } from './pages/Marketplace.tsx'
import { ESG } from './pages/ESG.tsx'
import { EnterpriseDashboard } from './pages/EnterpriseDashboard.tsx'
import { ProducerWorkspace } from './pages/ProducerWorkspace.tsx'

type InterfaceMode = 'enterprise' | 'producer'
type EnterprisePage = 'dashboard' | 'passport' | 'marketplace' | 'esg'
type ProducerPage = 'workspace' | 'passport'
type Page = EnterprisePage | ProducerPage

const ENTERPRISE_NAV_ITEMS: { id: EnterprisePage; label: string }[] = [
  { id: 'dashboard', label: '🏢 Dashboard' },
  { id: 'passport', label: '📦 Passport' },
  { id: 'marketplace', label: '🛒 Marketplace' },
  { id: 'esg', label: '🌱 ESG' },
]

const PRODUCER_NAV_ITEMS: { id: ProducerPage; label: string }[] = [
  { id: 'workspace', label: '📱 Workspace' },
  { id: 'passport', label: '📦 Passport' },
]

function App() {
  const [mode, setMode] = useState<InterfaceMode>('enterprise')
  const [page, setPage] = useState<Page>('dashboard')

  const navItems = mode === 'enterprise' ? ENTERPRISE_NAV_ITEMS : PRODUCER_NAV_ITEMS

  const renderPage = () => {
    if (mode === 'producer') {
      switch (page) {
        case 'passport':
          return <Passport />
        default:
          return <ProducerWorkspace />
      }
    }

    switch (page as EnterprisePage) {
      case 'passport':
        return <Passport />
      case 'marketplace':
        return <Marketplace />
      case 'esg':
        return <ESG />
      default:
        return <EnterpriseDashboard />
    }
  }

  const switchMode = (nextMode: InterfaceMode) => {
    setMode(nextMode)
    setPage(nextMode === 'enterprise' ? 'dashboard' : 'workspace')
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <span className="logo">⚡ NAMA Protocol</span>
          <span className="tagline">Unified enterprise + producer pre-Testnet shell</span>
        </div>
        <div className="header-controls">
          <div className="mode-switcher">
            <button
              className={`mode-toggle ${mode === 'enterprise' ? 'active' : ''}`}
              onClick={() => switchMode('enterprise')}
            >
              Enterprise
            </button>
            <button
              className={`mode-toggle ${mode === 'producer' ? 'active' : ''}`}
              onClick={() => switchMode('producer')}
            >
              Producer
            </button>
          </div>
          <nav className="header-nav">
            {navItems.map((n) => (
            <button
              key={n.id}
              className={`nav-btn ${page === n.id ? 'active' : ''}`}
              onClick={() => setPage(n.id)}
            >
              {n.label}
            </button>
          ))}
          </nav>
          <WalletButton />
        </div>
      </header>

      <main className="main">{renderPage()}</main>

      <footer className="footer">
        <span>NAMA Protocol — </span>
        <a href="https://vechain.org" target="_blank" rel="noopener noreferrer">
          VeChainThor
        </a>
        <span> · </span>
        <a href="https://explore-testnet.vechain.org" target="_blank" rel="noopener noreferrer">
          Testnet Explorer
        </a>
        <span> · </span>
        <a href="https://github.com/essajassim90-arch/Isa-jes" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </footer>
    </div>
  )
}

export default App
