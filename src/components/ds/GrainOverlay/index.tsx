import React from 'react';

export type GrainOverlayProps = {
  /** Opacity of the noise grain layer (0–1). */
  grainOpacity?: number;
  /** Render horizontal CRT scanlines. */
  scanlines?: boolean;
  /** Opacity of the scanline layer (0–1). */
  scanlineOpacity?: number;
  /** Distance between scanlines in px. */
  scanlineSpacing?: number;
  /** Animate the grain with a subtle jitter. Respects prefers-reduced-motion. */
  animated?: boolean;
  /** Add a soft dark vignette at the edges. */
  vignette?: boolean;
  /** 'fixed' covers the viewport; 'absolute' fills the nearest positioned parent. */
  position?: 'fixed' | 'absolute';
  /** Grain blend mode. */
  blendMode?: React.CSSProperties['mixBlendMode'];
  zIndex?: number;
  className?: string;
};

const NOISE_SVG = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
);
const NOISE_URL = `url("data:image/svg+xml,${NOISE_SVG}")`;

const KEYFRAMES = `
@keyframes grain-overlay-jitter {
  0%,100% { transform: translate(0,0); }
  10% { transform: translate(-2%,-3%); }
  20% { transform: translate(-4%,2%); }
  30% { transform: translate(3%,-4%); }
  40% { transform: translate(-2%,5%); }
  50% { transform: translate(-4%,1%); }
  60% { transform: translate(4%,0); }
  70% { transform: translate(0,3%); }
  80% { transform: translate(1%,4%); }
  90% { transform: translate(-3%,2%); }
}
@media (prefers-reduced-motion: reduce) {
  .grain-overlay-animated { animation: none !important; }
}
`;

export function GrainOverlay({
  grainOpacity = 0.07,
  scanlines = true,
  scanlineOpacity = 0.08,
  scanlineSpacing = 3,
  animated = true,
  vignette = false,
  position = 'fixed',
  blendMode = 'overlay',
  zIndex = 50,
  className = '',
}: GrainOverlayProps) {
  const posClass = position === 'fixed' ? 'fixed' : 'absolute';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none inset-0 select-none overflow-hidden ${posClass} ${className}`}
      style={{ zIndex }}
    >
      {animated && <style>{KEYFRAMES}</style>}

      <div
        className={`absolute ${animated ? 'grain-overlay-animated' : ''}`}
        style={{
          inset: '-10%',
          width: '120%',
          height: '120%',
          backgroundImage: NOISE_URL,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: clamp(grainOpacity),
          mixBlendMode: blendMode,
          animation: animated ? 'grain-overlay-jitter 1s steps(6) infinite' : undefined,
        }}
      />

      {scanlines && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(to bottom, rgba(0,0,0,1) 0px, rgba(0,0,0,1) 1px, transparent 1px, transparent ${Math.max(2, scanlineSpacing)}px)`,
            opacity: clamp(scanlineOpacity),
          }}
        />
      )}

      {vignette && (
        <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 160px 40px rgba(0,0,0,0.55)' }} />
      )}
    </div>
  );
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}
