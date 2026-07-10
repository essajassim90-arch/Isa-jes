import { useState } from 'react'
import { WalletButton, useWallet } from '@vechain/vechain-kit'
import './App.css'
import { Home } from './pages/Home.tsx'
import { Passport } from './pages/Passport.tsx'
import { Marketplace } from './pages/Marketplace.tsx'
import { ESG } from './pages/ESG.tsx'
import { Circular } from './pages/Circular.tsx'

type Page = 'home' | 'passport' | 'marketplace' | 'esg' | 'circular'

const NAV_ITEMS: { id: Page; label: string }[] = [
  { id: 'home', label: '🏠 Home' },
  { id: 'passport', label: '📦 Passport' },
  { id: 'marketplace', label: '🛒 Marketplace' },
  { id: 'esg', label: '🌱 ESG' },
  { id: 'circular', label: '♻️ Circular' },
]

function App() {
  const { account } = useWallet()
  const [page, setPage] = useState<Page>('home')

  const renderPage = () => {
    switch (page) {
      case 'passport':    return <Passport />
      case 'marketplace': return <Marketplace />
      case 'esg':         return <ESG />
      case 'circular':    return <Circular />
      default:            return <Home />
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <span className="logo">⚡ NAMA Protocol</span>
          <span className="tagline">VeChain Ecosystem MVP</span>
        </div>
        <nav className="header-nav">
          {account &&
            NAV_ITEMS.filter((n) => n.id !== 'home').map((n) => (
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
