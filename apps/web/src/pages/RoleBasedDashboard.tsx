import { useState } from 'react'
import { WalletButton } from '@vechain/vechain-kit'
import { Passport } from './Passport.tsx'
import { Marketplace } from './Marketplace.tsx'
import { ESG } from './ESG.tsx'
import { EnterpriseDashboard } from './EnterpriseDashboard.tsx'
import { ProducerMobileUI } from './ProducerMobileUI.tsx'
import { Circular } from './Circular.tsx'

type InterfaceMode = 'enterprise' | 'producer'
type EnterprisePage = 'dashboard' | 'passport' | 'marketplace' | 'esg' | 'circular'
type ProducerPage = 'workspace' | 'passport'
type Page = EnterprisePage | ProducerPage

const ENTERPRISE_NAV_ITEMS: { id: EnterprisePage; label: string }[] = [
  { id: 'dashboard', label: '🏢 Dashboard' },
  { id: 'passport', label: '📦 Passport' },
  { id: 'marketplace', label: '🛒 Marketplace' },
  { id: 'esg', label: '🌱 ESG' },
  { id: 'circular', label: '♻️ Circular' },
]

const PRODUCER_NAV_ITEMS: { id: ProducerPage; label: string }[] = [
  { id: 'workspace', label: '📱 Mobile UI' },
  { id: 'passport', label: '📦 Passport' },
]

export function RoleBasedDashboard() {
  const [mode, setMode] = useState<InterfaceMode>('enterprise')
  const [page, setPage] = useState<Page>('dashboard')

  const navItems = mode === 'enterprise' ? ENTERPRISE_NAV_ITEMS : PRODUCER_NAV_ITEMS

  const renderPage = () => {
    if (mode === 'producer') {
      switch (page) {
        case 'passport':
          return <Passport />
        default:
          return <ProducerMobileUI />
      }
    }

    switch (page as EnterprisePage) {
      case 'passport':
        return <Passport />
      case 'marketplace':
        return <Marketplace />
      case 'esg':
        return <ESG />
      case 'circular':
        return <Circular />
      default:
        return <EnterpriseDashboard />
    }
  }

  const switchMode = (nextMode: InterfaceMode) => {
    setMode(nextMode)
    setPage(nextMode === 'enterprise' ? 'dashboard' : 'workspace')
  }

  return (
    <>
      <header className="header">
        <div className="header-left">
          <span className="logo">⚡ NAMA Protocol</span>
          <span className="tagline">Role-aware enterprise + producer pre-Testnet shell</span>
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
    </>
  )
}
