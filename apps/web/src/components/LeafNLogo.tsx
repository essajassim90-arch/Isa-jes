// Programmatic bilingual logo component conforming to BRAND_SYSTEM.md

interface LeafNLogoProps {
  size?: number
  variant?: 'primary' | 'reversed' | 'enterprise'
  showText?: boolean
  showTagline?: boolean
  language?: 'ar' | 'en' | 'bilingual'
}

export function LeafNLogo({
  size = 32,
  variant = 'primary',
  showText = true,
  showTagline = false,
  language = 'en',
}: LeafNLogoProps) {
  // Colour mapping based on BRAND_SYSTEM.md
  // Primary: Deep Green on White
  // Reversed: White on Deep Green
  // Enterprise: White on Dark Navy
  const iconColor = variant === 'primary' ? '#14532D' : '#FFFFFF'
  const leafColor = variant === 'primary' ? '#16A34A' : '#4ADE80'
  const textColor = variant === 'primary' ? '#0F172A' : '#FFFFFF'

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <path d="M6 26V6H11L21 20V6H26V26H21L11 12V26H6Z" fill={iconColor} />
        <path d="M21 11.5C21 7 24 4.5 28 4C28 8 25.5 11 21 11.5Z" fill={leafColor} />
      </svg>
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: textColor, letterSpacing: '-0.5px' }}>
              NAMA
            </span>
            {language !== 'en' && (
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: textColor, fontFamily: 'sans-serif' }}>
                نما
              </span>
            )}
          </div>
          {showTagline && (
            <div style={{ fontSize: '0.75rem', color: variant === 'primary' ? '#64748B' : '#94A3B8', marginTop: '2px', fontWeight: 500 }}>
              {language === 'ar' && 'ثقة غذائية مستدامة'}
              {language === 'en' && 'Sustainable Food Trust'}
              {language === 'bilingual' && 'Sustainable Food Trust / ثقة غذائية مستدامة'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
