import { useMarketplace } from '../hooks/useMarketplace.ts'
import type { MarketplaceListing } from '@nama/shared'

function ListingCard({ listing }: { listing: MarketplaceListing }) {
  const date = new Date(listing.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  return (
    <div className="sa-card" style={{ maxWidth: '100%', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div className="sa-network">Listing</div>
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
        <div className="wallet-row">
          <span className="wallet-label">Created</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{date}</span>
        </div>
      </div>
      <div style={{ marginTop: '14px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        ⛓️ Order settlement via Marketplace.sol — available after contract deployment (Phase 2)
      </div>
    </div>
  )
}

export function Marketplace() {
  const { listings, loading, error, refetch } = useMarketplace()

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>🛒 Smart Procurement Marketplace</h2>
          <span className="badge-roadmap">Phase 1D</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Browse B2B procurement listings from verified producers. IoT-condition-verified
          settlements via Marketplace.sol on VeChainThor.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          {loading ? 'Loading…' : `${listings.length} active listing${listings.length !== 1 ? 's' : ''}`}
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

      {!loading && !error && listings.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>
          No open listings found.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {listings.map((listing) => (
          <ListingCard key={listing.listingId} listing={listing} />
        ))}
      </div>
    </div>
  )
}
