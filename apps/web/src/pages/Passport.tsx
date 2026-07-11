import { useState } from 'react'
import { useDPP } from '../hooks/useDPP.ts'
import { useIoT } from '../hooks/useIoT.ts'
import { DPPCard } from '../components/DPPCard.tsx'
import { IoTReadingBadge } from '../components/IoTReadingBadge.tsx'

const DEMO_BATCH_ID = 'demo-batch-001'
const AQUA_BATCH_ID = 'aqua-batch-001'

export function Passport() {
  const [input, setInput] = useState(DEMO_BATCH_ID)
  const [batchId, setBatchId] = useState<string>(DEMO_BATCH_ID)

  const { dpp, loading: dppLoading, error: dppError } = useDPP(batchId)
  const { readings, loading: iotLoading, error: iotError } = useIoT(batchId)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (trimmed) setBatchId(trimmed)
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>📦 Digital Product Passport</h2>
          <span className="badge-roadmap">Phase 1 MVP Demo</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Search and view the on-chain lifecycle of any product batch — from origin through IoT
          readings to final delivery.
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
          <span className="badge-roadmap">{DEMO_BATCH_ID}</span>
          <span className="badge-roadmap">{AQUA_BATCH_ID}</span>
        </div>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter batch ID (e.g. demo-batch-001 or aqua-batch-001)"
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--bg-card)',
            color: 'var(--text)',
            fontSize: '0.9rem',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          Search
        </button>
        {batchId !== DEMO_BATCH_ID && (
          <button
            type="button"
            onClick={() => { setInput(DEMO_BATCH_ID); setBatchId(DEMO_BATCH_ID) }}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            Reset Demo
          </button>
        )}
      </form>

      {dppLoading && (
        <div style={{ color: 'var(--text-muted)', padding: '40px 0', textAlign: 'center' }}>
          Loading DPP…
        </div>
      )}

      {dppError && (
        <div style={{ color: 'var(--red)', padding: '16px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: '16px' }}>
          ⚠️ {dppError}
          {dppError.includes('fetch') && (
            <div style={{ marginTop: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Make sure the NAMA API is running on port 3001.
            </div>
          )}
        </div>
      )}

      {dpp && <DPPCard dpp={dpp} />}

      {(readings.length > 0 || iotLoading || iotError) && (
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '12px', fontSize: '1rem' }}>
            📡 IoT Sensor Readings
          </h3>
          {iotLoading && (
            <div style={{ color: 'var(--text-muted)' }}>Loading readings…</div>
          )}
          {iotError && (
            <div style={{ color: 'var(--red)', fontSize: '0.85rem' }}>⚠️ {iotError}</div>
          )}
          {readings.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {readings.map(({ reading, state }) => (
                <IoTReadingBadge key={reading.readingId} reading={reading} state={state} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
