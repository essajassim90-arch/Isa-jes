import type { DPP } from '@nama/shared'

interface DPPCardProps {
  dpp: DPP
}

// TODO (Phase 1): Render full DPP lifecycle timeline once API is connected.
export function DPPCard({ dpp }: DPPCardProps) {
  return (
    <div className="sa-card">
      <div className="sa-network">DPP</div>
      <div className="sa-label">Batch ID</div>
      <span className="sa-address">{dpp.batchId}</span>
      <div className="sa-label">Origin</div>
      <span>{dpp.origin}</span>
      <div className={`sa-status ${dpp.status === 'active' ? 'deployed' : 'pending'}`}>
        {dpp.status}
      </div>
    </div>
  )
}
