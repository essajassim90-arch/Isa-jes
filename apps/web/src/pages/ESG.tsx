import { useESG } from '../hooks/useESG.ts'
import { ESGSummary } from '../components/ESGSummary.tsx'

const DEMO_ORG_ID = 'demo-batch-001'

export function ESG() {
  const { report, loading, error } = useESG(DEMO_ORG_ID)

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>🌱 ESG & Sustainability Intelligence</h2>
          <span className="badge-roadmap">Phase 1 MVP Demo</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Real-time carbon footprint tracking, compliance scoring, and sustainability metrics
          derived from IoT sensor data for batch {DEMO_ORG_ID}.
        </p>
      </div>

      {loading && (
        <div style={{ color: 'var(--text-muted)', padding: '40px 0', textAlign: 'center' }}>
          Loading ESG report…
        </div>
      )}

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

      {report && (
        <div>
          <ESGSummary report={report} />
          <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            📊 Metrics derived from IoT sensor readings · AI-powered ESG analytics arrive in Phase 3
          </div>
        </div>
      )}
    </div>
  )
}
