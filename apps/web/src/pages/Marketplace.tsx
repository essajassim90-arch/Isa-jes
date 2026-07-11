import { useState } from 'react'
import { useMarketplace } from '../hooks/useMarketplace.ts'
import type { MarketplaceListing, ListingType } from '@nama/shared'

type FilterTab = 'all' | ListingType

function ListingCard({ listing }: { listing: MarketplaceListing }) {
  const date = new Date(listing.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  const isCircular = listing.listingType === 'circular'
  return (
    <div className="sa-card" style={{ maxWidth: '100%', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div className="sa-network" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span>Listing</span>
            {isCircular
              ? <span className="badge-roadmap" style={{ color: '#10b981' }}>♻️ Circular / Diversion</span>
              : <span className="badge-roadmap">🏢 Commercial</span>
            }
          </div>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '4px' }}>
            {listing.quantity.toLocaleString()} units
          </div>
        </div>
        <div className={`sa-status ${listing.status === 'open' ? 'deployed' : 'pending'}`} style={{ textTransform: 'capitalize' }}>
          {listing.status}
        </div>
      </div>
      <div className="wallet-info">
        <div className="wallet-row">
          <span className="wallet-label">Listing ID</span>
          <span className="sa-address">{listing.listingId}</span>
        </div>
        <div className="wallet-row">
          <span className="wallet-label">DPP ID</span>
          <span className="sa-address">{listing.dppId}</span>
        </div>
        <div className="wallet-row">
          <span className="wallet-label">Seller</span>
          <span>{listing.sellerOrgId}</span>
        </div>
        <div className="wallet-row">
          <span className="wallet-label">Unit Price</span>
          <span className="wallet-balance">{listing.unitPriceVET} {listing.currency}</span>
        </div>
        <div className="wallet-row">
          <span className="wallet-label">Total Value</span>
          <span className="wallet-balance">
            {(listing.quantity * Number(listing.unitPriceVET)).toLocaleString()} {listing.currency}
          </span>
        </div>
        {isCircular && listing.kgAvailable !== undefined && (
          <div className="wallet-row">
            <span className="wallet-label">kg available</span>
            <span className="wallet-balance">{listing.kgAvailable} kg</span>
          </div>
        )}
        {isCircular && listing.circularSdgGoals && listing.circularSdgGoals.length > 0 && (
          <div className="wallet-row">
            <span className="wallet-label">SDG goals</span>
            <span>{listing.circularSdgGoals.map((g) => `SDG ${g}`).join(', ')}</span>
          </div>
        )}
        {!isCircular && (
          <>
            <div className="wallet-row">
              <span className="wallet-label">AII Quality Indicator</span>
              <span className="badge-roadmap">{listing.aiiQualityIndicator ?? 'watchlist'}</span>
            </div>
            <div className="wallet-row">
              <span className="wallet-label">Procurement Signal</span>
              <span className="badge-roadmap">{listing.procurementSignal ?? 'review'}</span>
            </div>
          </>
        )}
        <div className="wallet-row">
          <span className="wallet-label">Created</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{date}</span>
        </div>
      </div>
      <div style={{ marginTop: '14px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        {isCircular
          ? '♻️ Circular diversion via Marketplace.sol — certification-based, no new contracts'
          : '⛓️ Order settlement via Marketplace.sol — available after contract deployment (Phase 2)'
        }
      </div>
    </div>
  )
}

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: '📋 All' },
  { id: 'commercial', label: '🏢 Commercial' },
  { id: 'circular', label: '♻️ Circular / Diversion' },
]

export function Marketplace() {
  const { listings, loading, error, refetch } = useMarketplace()
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')

  const filtered = activeFilter === 'all'
    ? listings
    : listings.filter((l) => (l.listingType ?? 'commercial') === activeFilter)

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>🛒 Smart Procurement Marketplace</h2>
          <span className="badge-roadmap">Phase 2M</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Browse B2B procurement and circular diversion listings from verified producers.
          IoT-condition-verified settlements via Marketplace.sol on VeChainThor.
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: `1px solid ${activeFilter === tab.id ? 'var(--accent)' : 'var(--border)'}`,
              background: activeFilter === tab.id ? 'rgba(59,130,246,0.12)' : 'transparent',
              color: activeFilter === tab.id ? 'var(--accent)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: activeFilter === tab.id ? 700 : 400,
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          {loading ? 'Loading…' : `${filtered.length} listing${filtered.length !== 1 ? 's' : ''}`}
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          style={{
            padding: '7px 14px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-muted)',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '0.82rem',
          }}
        >
          ↺ Refresh
        </button>
      </div>

      {error && (
        <div style={{ color: 'var(--red)', padding: '16px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: '16px' }}>
          ⚠️ {error}
          {error.includes('fetch') && (
            <div style={{ marginTop: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Make sure the NAMA API is running on port 3001.
            </div>
          )}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>
          No listings found for the selected filter.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map((listing) => (
          <ListingCard key={listing.listingId} listing={listing} />
        ))}
      </div>
    </div>
  )
}

