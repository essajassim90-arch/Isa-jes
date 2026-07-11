import { useMemo, useState } from 'react'
import { DPPCard } from '../components/DPPCard.tsx'
import { useProducerWorkspace } from '../hooks/useProducerWorkspace.ts'

export function ProducerWorkspace() {
  const { workspace, loading, error } = useProducerWorkspace()
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('producer-dpp-standard-v1')

  const selectedWorkflow = useMemo(
    () => workspace?.workflows.find((workflow) => workflow.workflowId === selectedWorkflowId) ?? workspace?.workflows[0],
    [selectedWorkflowId, workspace?.workflows]
  )

  const matchingPassport = workspace?.passports.find(
    (passport) => passport.workflowId === selectedWorkflow?.workflowId || passport.profile === selectedWorkflow?.profile
  )

  if (loading) {
    return <div className="page-empty">Loading producer workspace…</div>
  }

  if (error) {
    return <div className="page-error">⚠️ {error}</div>
  }

  if (!workspace || !selectedWorkflow) {
    return <div className="page-empty">No producer workflow data available.</div>
  }

  return (
    <div className="stack-lg">
      <section className="panel hero-panel">
        <div>
          <div className="badge-roadmap">Producer interface</div>
          <h1 className="page-title">Mobile-first assisted capture</h1>
          <p className="page-subtitle">
            Wallet-light and wallet-free assisted flows for producer DPP capture, Aqua-DPP metadata,
            NFC simulation, and minimal telemetry verification tasks.
          </p>
        </div>
        <div className="mode-preset-grid">
          {workspace.presets.map((preset) => (
            <div key={preset.mode} className="metric-card">
              <div className="metric-label">{preset.label}</div>
              <div className="muted-text">{preset.summary}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="workflow-switcher">
        {workspace.workflows.map((workflow) => (
          <button
            key={workflow.workflowId}
            className={`mode-toggle ${selectedWorkflow.workflowId === workflow.workflowId ? 'active' : ''}`}
            onClick={() => setSelectedWorkflowId(workflow.workflowId)}
          >
            {workflow.name}
          </button>
        ))}
      </section>

      <section className="two-column-grid">
        <div className="panel">
          <div className="section-title-row">
            <h2>{selectedWorkflow.name}</h2>
            <span className="badge-roadmap">{selectedWorkflow.walletMode}</span>
          </div>
          <p className="muted-text">{selectedWorkflow.summary}</p>
          <div className="stack-sm" style={{ marginTop: '16px' }}>
            {selectedWorkflow.steps.map((step) => (
              <div key={step.id} className="step-card">
                <strong>{step.title}</strong>
                <div className="muted-text">{step.description}</div>
                <div className="field-grid">
                  {step.fields.map((field) => (
                    <div key={field.key} className="data-chip">
                      <span className="data-chip-label">{field.label}</span>
                      <span className="data-chip-value">{field.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-title-row">
            <h2>NFC + telemetry tasks</h2>
            <span className="badge-roadmap">{selectedWorkflow.profile}</span>
          </div>
          <div className="stack-sm">
            <div className="audit-card">
              <div className="list-row">
                <strong>{selectedWorkflow.nfcSimulation.tagId}</strong>
                <span className={`status-pill ${selectedWorkflow.nfcSimulation.status === 'verified' ? 'good' : 'warn'}`}>
                  {selectedWorkflow.nfcSimulation.status}
                </span>
              </div>
              <div className="muted-text">
                Last scan {selectedWorkflow.nfcSimulation.lastScannedAt ?? 'pending'} · hash {selectedWorkflow.nfcSimulation.payloadHash ?? '—'}
              </div>
            </div>

            {selectedWorkflow.telemetryTasks.map((task) => (
              <div key={task.id} className="list-row">
                <div>
                  <strong>{task.title}</strong>
                  <div className="muted-text">{task.guidance}</div>
                </div>
                <span className={`status-pill ${task.status === 'verified' || task.status === 'completed' ? 'good' : 'warn'}`}>
                  {task.status}
                </span>
              </div>
            ))}

            <div className="panel-note">
              Recommended tags: {selectedWorkflow.recommendedMetadataTags.join(', ')}
            </div>
          </div>
        </div>
      </section>

      {matchingPassport && (
        <section className="panel">
          <div className="section-title-row">
            <h2>Workflow preview passport</h2>
            <span className="badge-roadmap">{matchingPassport.batchId}</span>
          </div>
          <DPPCard dpp={matchingPassport} />
        </section>
      )}
    </div>
  )
}
