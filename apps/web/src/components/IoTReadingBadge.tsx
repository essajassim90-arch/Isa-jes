import type { IoTReading } from '@nama/shared'

interface IoTReadingBadgeProps {
  reading: IoTReading
}

// TODO (Phase 1): Style + animate live readings from IoT simulation.
export function IoTReadingBadge({ reading }: IoTReadingBadgeProps) {
  const label =
    reading.type === 'temperature'
      ? `🌡 ${reading.value}°C`
      : reading.type === 'humidity'
        ? `💧 ${reading.value}%`
        : `📍 ${reading.value}`

  return (
    <span
      style={{
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '0.78rem',
        background: 'rgba(59,130,246,0.12)',
        border: '1px solid rgba(59,130,246,0.3)',
        color: '#3b82f6',
      }}
    >
      {label}
    </span>
  )
}
