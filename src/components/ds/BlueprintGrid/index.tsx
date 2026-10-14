import React from 'react';

export type BlueprintGridFade = 'none' | 'radial' | 'top' | 'bottom' | 'edges';

export interface BlueprintGridProps {
  /** Size of the minor grid cell in px. */
  cellSize?: number;
  /** Draw a stronger major line every N minor cells. Set 0 to disable. */
  majorEvery?: number;
  /** Line color (any CSS color). Defaults to current text color. */
  color?: string;
  /** Opacity of minor lines (0–1). */
  minorOpacity?: number;
  /** Opacity of major lines (0–1). */
  majorOpacity?: number;
  /** Mask fade applied to soften the grid edges. */
  fade?: BlueprintGridFade;
  /** Render as absolutely positioned layer filling its parent. */
  absolute?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function BlueprintGrid({
  cellSize = 24,
  majorEvery = 4,
  color = 'currentColor',
  minorOpacity = 0.08,
  majorOpacity = 0.16,
  fade = 'radial',
  absolute = true,
  className = '',
  style,
}: BlueprintGridProps) {
  const minor = withOpacity(color, minorOpacity);
  const major = withOpacity(color, majorOpacity);
  const majorSize = cellSize * Math.max(majorEvery, 1);

  const layers: string[] = [];
  const sizes: string[] = [];
  if (majorEvery > 0) {
    layers.push(
      `linear-gradient(to right, ${major} 1px, transparent 1px)`,
      `linear-gradient(to bottom, ${major} 1px, transparent 1px)`,
    );
    sizes.push(`${majorSize}px ${majorSize}px`, `${majorSize}px ${majorSize}px`);
  }
  layers.push(
    `linear-gradient(to right, ${minor} 1px, transparent 1px)`,
    `linear-gradient(to bottom, ${minor} 1px, transparent 1px)`,
  );
  sizes.push(`${cellSize}px ${cellSize}px`, `${cellSize}px ${cellSize}px`);

  const mask = getMask(fade);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none ${absolute ? 'absolute inset-0' : 'h-full w-full'} ${className}`}
      style={{
        backgroundImage: layers.join(', '),
        backgroundSize: sizes.join(', '),
        backgroundPosition: '-1px -1px',
        WebkitMaskImage: mask,
        maskImage: mask,
        ...style,
      }}
    />
  );
}

function withOpacity(color: string, opacity: number): string {
  const pct = Math.round(Math.min(Math.max(opacity, 0), 1) * 100);
  return `color-mix(in srgb, ${color} ${pct}%, transparent)`;
}

function getMask(fade: BlueprintGridFade): string | undefined {
  switch (fade) {
    case 'radial':
      return 'radial-gradient(ellipse at center, #000 40%, transparent 85%)';
    case 'top':
      return 'linear-gradient(to bottom, transparent, #000 40%)';
    case 'bottom':
      return 'linear-gradient(to top, transparent, #000 40%)';
    case 'edges':
      return 'linear-gradient(to right, transparent, #000 15%, #000 85%, transparent)';
    default:
      return undefined;
  }
}
