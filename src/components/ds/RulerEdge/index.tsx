import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

export type RulerEdgeSide = 'top' | 'bottom' | 'left' | 'right';
export type RulerEdgeTone = 'muted' | 'default' | 'strong';

export interface RulerEdgeProps {
  /** Which edge of the frame the ruler sits on. Ticks grow away from that edge. */
  side?: RulerEdgeSide;
  /** Distance in px between minor ticks. */
  spacing?: number;
  /** Every Nth tick is a major tick. */
  majorEvery?: number;
  /** Show numeric labels at each major tick. */
  showLabels?: boolean;
  /** Value step per major tick for labels (e.g. 10 → 0, 10, 20). */
  labelStep?: number;
  /** Optional unit suffix appended to the first label (e.g. "px", "cm"). */
  unit?: string;
  /** Show a solid baseline along the edge. */
  baseline?: boolean;
  /** Thickness of the strip in px. */
  size?: number;
  /** Ink strength. */
  tone?: RulerEdgeTone;
  className?: string;
  style?: React.CSSProperties;
}

const toneClass: Record<RulerEdgeTone, string> = {
  muted: 'text-border',
  default: 'text-border-strong',
  strong: 'text-ink-3',
};

export function RulerEdge({
  side = 'top',
  spacing = 8,
  majorEvery = 10,
  showLabels = false,
  labelStep = 10,
  unit,
  baseline = true,
  size = 20,
  tone = 'default',
  className = '',
  style,
}: RulerEdgeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [length, setLength] = useState(0);
  const horizontal = side === 'top' || side === 'bottom';

  useEffect(() => {
    const el = ref.current;
    if (!el || !showLabels) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      setLength(horizontal ? rect.width : rect.height);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [horizontal, showLabels]);

  const minor = Math.round(size * 0.3);
  const mid = Math.round(size * 0.5);
  const major = showLabels ? Math.round(size * 0.55) : Math.round(size * 0.8);
  const majorPx = spacing * majorEvery;
  const midPx = majorEvery % 2 === 0 ? majorPx / 2 : 0;

  const dir = horizontal ? 'to right' : 'to bottom';
  const tick = `linear-gradient(${dir}, currentColor 1px, transparent 1px)`;
  const anchor = side;

  const layer = (period: number, len: number) => ({
    image: tick,
    size: horizontal ? `${period}px ${len}px` : `${len}px ${period}px`,
    position: horizontal ? `left ${anchor}` : `${anchor} top`,
    repeat: horizontal ? 'repeat-x' : 'repeat-y',
  });

  const layers = [layer(majorPx, major), ...(midPx ? [layer(midPx, mid)] : []), layer(spacing, minor)];

  const bgStyle: React.CSSProperties = {
    backgroundImage: layers.map((l) => l.image).join(', '),
    backgroundSize: layers.map((l) => l.size).join(', '),
    backgroundPosition: layers.map((l) => l.position).join(', '),
    backgroundRepeat: layers.map((l) => l.repeat).join(', '),
  };

  const labelCount = showLabels && majorPx > 0 ? Math.floor(length / majorPx) + 1 : 0;

  const baselineClass = baseline
    ? {
        top: 'border-t',
        bottom: 'border-b',
        left: 'border-l',
        right: 'border-r',
      }[side]
    : '';

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        'relative shrink-0 select-none pointer-events-none overflow-hidden border-current',
        horizontal ? 'w-full' : 'h-full',
        toneClass[tone],
        baselineClass,
        className,
      )}
      style={{
        ...(horizontal ? { height: size } : { width: size }),
        ...bgStyle,
        ...style,
      }}
    >
      {Array.from({ length: labelCount }).map((_, i) => {
        const pos = i * majorPx;
        const text = `${i * labelStep}${i === 0 && unit ? unit : ''}`;
        const labelStyle: React.CSSProperties = horizontal
          ? { left: pos + 3, [side === 'top' ? 'bottom' : 'top']: 1 }
          : {
              top: pos + 3,
              [side === 'left' ? 'right' : 'left']: 1,
              writingMode: 'vertical-rl',
              transform: side === 'left' ? 'rotate(180deg)' : undefined,
            };
        return (
          <span key={i} className="absolute font-mono text-[9px] leading-none tracking-tight tabular-nums text-ink-3" style={labelStyle}>
            {text}
          </span>
        );
      })}
    </div>
  );
}
