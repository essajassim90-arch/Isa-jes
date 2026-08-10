import { useState } from 'react'
import { WalletButton } from '@vechain/vechain-kit'
import { Passport } from './Passport.tsx'
import { Marketplace } from './Marketplace.tsx'
import { ESG } from './ESG.tsx'
import { EnterpriseDashboard } from './EnterpriseDashboard.tsx'
import { ProducerMobileUI } from './ProducerMobileUI.tsx'
import { Circular } from './Circular.tsx'
import { LeafNLogo } from '../components/LeafNLogo.tsx'

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
      <header className="header" style={{ background: mode === 'enterprise' ? '#0F172A' : 'rgba(15,17,23,0.92)' }}>
        <div className="header-brand">
          <LeafNLogo
            variant={mode === 'enterprise' ? 'enterprise' : 'reversed'}
            showTagline={true}
            language={mode === 'producer' ? 'ar' : 'bilingual'}
            size={32}
          />
        </div>
        <div className="header-controls">
          <div className="mode-switcher">
            <button
              className={`mode-toggle ${mode === 'enterprise' ? 'active active-enterprise' : ''}`}
              onClick={() => switchMode('enterprise')}
              aria-pressed={mode === 'enterprise'}
            >
              Enterprise
            </button>
            <button
              className={`mode-toggle ${mode === 'producer' ? 'active active-producer' : ''}`}
              onClick={() => switchMode('producer')}
              aria-pressed={mode === 'producer'}
            >
              <span lang="ar" aria-hidden="true" style={{ fontFamily: 'var(--font-arabic, sans-serif)' }}>منتج</span>
              {' '}Producer
            </button>
          </div>
          <nav className="header-nav" aria-label="Page navigation">
            {navItems.map((n) => (
            <button
              key={n.id}
              className={`nav-btn ${page === n.id ? 'active' : ''}`}
              onClick={() => setPage(n.id)}
              aria-current={page === n.id ? 'page' : undefined}
            >
              {n.label}
            </button>
          ))}
          </nav>
          <WalletButton />
        </div>
      </header>

      <main className="main" id="main-content">{renderPage()}</main>
    </>
  )
}
