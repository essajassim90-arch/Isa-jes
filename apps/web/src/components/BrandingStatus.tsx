import { useState } from 'react'

export function BrandingStatus() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div style={{
      margin: '24px auto',
      maxWidth: '900px',
      width: '100%',
      padding: '16px 20px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      fontSize: '0.88rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)}>
        <span style={{ fontWeight: 700, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🎨 Branding &amp; Visual Asset Audit Status {isOpen ? '▼' : '▶'}
        </span>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {isOpen ? 'Click to collapse' : 'Click to expand'}
        </span>
      </div>

      {isOpen && (
        <div style={{ marginTop: '16px', display: 'grid', gap: '16px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          <div>
            <strong style={{ color: '#16a34a' }}>✅ Implemented Production Branding</strong>
            <ul style={{ marginLeft: '20px', marginTop: '4px', color: 'var(--text-muted)' }}>
              <li>Leaf-N Logo SVG: Upright N with upper-right integrated leaf (programmatic SVG).</li>
              <li>Bilingual Wordmark Lockup: Arabic tagline <b style={{color: 'var(--text)'}}>ثقة غذائية مستدامة</b> &amp; English tagline <b style={{color: 'var(--text)'}}>Sustainable Food Trust</b>.</li>
              <li>Official Palette: Deep Green (<code style={{color: 'var(--text)'}}>#14532D</code>), Dark Navy (<code style={{color: 'var(--text)'}}>#0F172A</code>), and Fresh Green (<code style={{color: 'var(--text)'}}>#16A34A</code>).</li>
              <li>Bilingual Header &amp; Landing presentation (Arabic-first regional for farmers, English-first international for enterprises).</li>
            </ul>
          </div>

          <div>
            <strong style={{ color: '#d97706' }}>💡 Demo &amp; Placeholder Visuals</strong>
            <ul style={{ marginLeft: '20px', marginTop: '4px', color: 'var(--text-muted)' }}>
              <li>NFC Tag scanning simulator &amp; IoT sensor readings dashboard.</li>
              <li>Active pre-Testnet smart account cards and transaction explorer links.</li>
            </ul>
          </div>

          <div>
            <strong style={{ color: '#94a3b8' }}>⏳ Missing / Roadmap Assets (Pending SVG)</strong>
            <ul style={{ marginLeft: '20px', marginTop: '4px', color: 'var(--text-muted)' }}>
              <li>Circular Economy Badge SVG (P1): Represented as text/emojis in current UI.</li>
              <li>Food Security / Sovereignty Badge SVG (P1): Represented as text/emojis in current UI.</li>
              <li>Bilingual outlined lockup files: Integrated programmatically using SVG and standard system fonts.</li>
            </ul>
          </div>

          <div>
            <strong style={{ color: '#dc2626' }}>🚫 Deferred / Omitted (Not Authorized)</strong>
            <ul style={{ marginLeft: '20px', marginTop: '4px', color: 'var(--text-muted)' }}>
              <li>Government, certification, or third-party partner badges: Omitted as no authorized assets are supplied.</li>
              <li>Mainnet deployment workflows: Strictly kept in sandbox/testnet scope.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
