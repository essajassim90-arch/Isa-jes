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
          🎨 Branding &amp; Visual Asset Status {isOpen ? '▼' : '▶'}
        </span>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {isOpen ? 'Click to collapse' : 'Click to expand'}
        </span>
      </div>

      {isOpen && (
        <div style={{ marginTop: '16px', display: 'grid', gap: '16px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          <div>
            <strong style={{ color: '#16a34a' }}>✅ Production Branding Assets</strong>
            <ul style={{ marginLeft: '20px', marginTop: '4px', color: 'var(--text-muted)' }}>
              <li>Leaf-N logo mark: SVG — N letterform with organic upper-right leaf in Deep Green (#14532D) circle, Light Green (#4ADE80) leaf.</li>
              <li>Favicon: <code style={{color: 'var(--text)'}}>public/favicon.svg</code> — 32×32 Leaf-N on Deep Green circle.</li>
              <li>Logo SVG: <code style={{color: 'var(--text)'}}>public/logo.svg</code> — 160×44 bilingual wordmark (NAMA + نما) with tagline.</li>
              <li>Reversed logo: <code style={{color: 'var(--text)'}}>public/logo-white.svg</code> — white variant for dark surfaces.</li>
              <li>OG image: <code style={{color: 'var(--text)'}}>public/og-image.svg</code> — 1200×630 social share graphic.</li>
              <li>NAMA Design System CSS variables in <code style={{color: 'var(--text)'}}>index.css</code> — all tokens from DESIGN_SYSTEM.md.</li>
              <li>Arabic RTL rendering: taglines, producer mode, and hero section include <code style={{color: 'var(--text)'}}>lang="ar"</code> and <code style={{color: 'var(--text)'}}>direction: rtl</code>.</li>
              <li>Bilingual lockup: NAMA · نما · Sustainable Food Trust · ثقة غذائية مستدامة across header and dashboard hero.</li>
              <li>VeChain verification badge: VeChain Purple (#7C3AED) per DESIGN_SYSTEM.md — used only on DPP on-chain status.</li>
              <li>Responsive header: flex-wrap + mobile breakpoints at 768px and 480px.</li>
              <li>Focus ring: <code style={{color: 'var(--text)'}}>--focus-ring</code> applied via <code style={{color: 'var(--text)'}}>:focus-visible</code>.</li>
              <li>WCAG AA contrast: Deep Green (#14532D) on white ≥ 7:1; white on Dark Navy ≥ 12:1.</li>
            </ul>
          </div>

          <div>
            <strong style={{ color: '#d97706' }}>💡 Demo &amp; Simulation Surfaces</strong>
            <ul style={{ marginLeft: '20px', marginTop: '4px', color: 'var(--text-muted)' }}>
              <li>NFC tag scanning simulator and IoT sensor readings — seeded demo data, not live sensor feeds.</li>
              <li>Smart account cards — links to VeChainThor Testnet Explorer.</li>
            </ul>
          </div>

          <div>
            <strong style={{ color: '#94a3b8' }}>⏳ Missing / Deferred Assets</strong>
            <ul style={{ marginLeft: '20px', marginTop: '4px', color: 'var(--text-muted)' }}>
              <li>Apple touch icon PNG (<code style={{color: 'var(--text)'}}>public/apple-touch-icon.png</code>): referenced in HTML; deferred until raster export tooling is available.</li>
              <li>Circular Economy badge SVG (Phase 2): represented as emoji in current UI.</li>
              <li>Food Sovereignty badge SVG (Phase 2): represented as emoji in current UI.</li>
              <li>Print-ready brand file (AI/EPS/SVG export): deferred to post-Testnet branding sprint.</li>
            </ul>
          </div>

          <div>
            <strong style={{ color: '#dc2626' }}>🚫 Deliberately Omitted (Not Authorized)</strong>
            <ul style={{ marginLeft: '20px', marginTop: '4px', color: 'var(--text-muted)' }}>
              <li>Government, certification authority, or third-party partner badges — no authorized assets supplied.</li>
              <li>Mainnet deployment assets — strictly Testnet / demo scope.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
