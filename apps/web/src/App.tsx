import './App.css'
import { RoleBasedDashboard } from './pages/RoleBasedDashboard.tsx'

function App() {
  return (
    <div className="app">
      <RoleBasedDashboard />

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
