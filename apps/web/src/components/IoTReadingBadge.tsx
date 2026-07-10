import type { IoTReading } from '@nama/shared'
import type { IoTState } from '../hooks/useIoT.ts'

interface IoTReadingBadgeProps {
  reading: IoTReading
  state?: IoTState
}

const STATE_STYLES: Record<IoTState, { bg: string; border: string; color: string }> = {
  optimal: { bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)', color: '#22c55e' },
  warning: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', color: '#f59e0b' },
  critical: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', color: '#ef4444' },
}

export function IoTReadingBadge({ reading, state = 'optimal' }: IoTReadingBadgeProps) {
  const styles = STATE_STYLES[state]
  const label =
    reading.type === 'temperature'
      ? `🌡 ${reading.value}°C`
      : reading.type === 'humidity'
        ? `💧 ${reading.value}%`
        : `📍 ${reading.value}`

  return (
    <span
      title={`${reading.type} · ${state} · ${new Date(reading.timestamp).toLocaleString()}`}
      style={{
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '0.78rem',
        background: styles.bg,
        border: `1px solid ${styles.border}`,
        color: styles.color,
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  )
}
