// Programmatic bilingual logo component conforming to BRAND_SYSTEM.md
// Leaf-N mark: upright N letterform with integrated leaf emerging from upper-right diagonal.

interface LeafNLogoProps {
  size?: number
  variant?: 'primary' | 'reversed' | 'enterprise'
  showText?: boolean
  showTagline?: boolean
  language?: 'ar' | 'en' | 'bilingual'
  className?: string
}

export function LeafNLogo({
  size = 32,
  variant = 'primary',
  showText = true,
  showTagline = false,
  language = 'en',
  className,
}: LeafNLogoProps) {
  // Colour mapping per BRAND_SYSTEM.md
  // primary:    Deep Green on White / transparent
  // reversed:   White on Deep Green
  // enterprise: White on Dark Navy
  const isDark = variant === 'reversed' || variant === 'enterprise'
  const circleFill = variant === 'reversed' ? '#14532D' : variant === 'enterprise' ? '#0F172A' : '#14532D'
  const nFill = '#FFFFFF'
  const leafFill = isDark ? '#4ADE80' : '#4ADE80'
  const wordmarkColor = isDark ? '#FFFFFF' : '#14532D'
  const arabicColor = isDark ? '#FFFFFF' : '#14532D'
  const taglineColor = isDark ? 'rgba(255,255,255,0.6)' : '#475569'

  const iconSize = size
  const textScale = size / 32

  return (
    <div
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(8 * textScale) + 'px' }}
      aria-label="NAMA Protocol"
    >
      {/* Leaf-N SVG mark */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle cx="16" cy="16" r="16" fill={circleFill} />
        {/* N letterform — clean strokes */}
        <path d="M8 24V8h5.2L20 18.5V8H24V24h-5.2L12 13.5V24H8Z" fill={nFill} />
        {/* Leaf motif: organic curve from upper-right diagonal of N */}
        <path d="M20 12.5C20 8.5 23 6.5 27 6C27 9.5 24.5 12 20 12.5Z" fill={leafFill} />
      </svg>

      {showText && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            lineHeight: 1.1,
            textAlign: 'left',
            gap: '1px',
          }}
        >
          {/* Primary wordmark row: NAMA + optional Arabic نما */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: Math.round(6 * textScale) + 'px' }}>
            <span
              style={{
                fontSize: Math.round(18 * textScale) + 'px',
                fontWeight: 800,
                color: wordmarkColor,
                letterSpacing: '-0.5px',
                fontFamily: 'var(--font-sans)',
              }}
            >
              NAMA
            </span>
            {language !== 'en' && (
              <span
                style={{
                  fontSize: Math.round(16 * textScale) + 'px',
                  fontWeight: 700,
                  color: arabicColor,
                  fontFamily: 'var(--font-arabic, "IBM Plex Arabic", "Geeza Pro", Arial, sans-serif)',
                  direction: 'rtl',
                  unicodeBidi: 'isolate',
                }}
                lang="ar"
              >
                نما
              </span>
            )}
          </div>

          {/* Tagline row */}
          {showTagline && (
            <div
              style={{
                fontSize: Math.round(10 * textScale) + 'px',
                color: taglineColor,
                fontWeight: 500,
                letterSpacing: '0.02em',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {language === 'ar' && (
                <span
                  lang="ar"
                  style={{ fontFamily: 'var(--font-arabic, "IBM Plex Arabic", "Geeza Pro", Arial, sans-serif)', direction: 'rtl', unicodeBidi: 'isolate' }}
                >
                  ثقة غذائية مستدامة
                </span>
              )}
              {language === 'en' && 'Sustainable Food Trust'}
              {language === 'bilingual' && (
                <>
                  Sustainable Food Trust
                  <span
                    lang="ar"
                    style={{
                      marginLeft: '6px',
                      fontFamily: 'var(--font-arabic, "IBM Plex Arabic", "Geeza Pro", Arial, sans-serif)',
                      direction: 'rtl',
                      unicodeBidi: 'isolate',
                      opacity: 0.8,
                    }}
                  >
                    · ثقة غذائية مستدامة
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
