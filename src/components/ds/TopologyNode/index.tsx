import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

export type TopologyStatus = 'idle' | 'active' | 'degraded' | 'error';
export type TopologyNodeShape = 'circle' | 'square' | 'diamond';

export interface TopologyPoint {
  x: number;
  y: number;
}

export interface TopologyNodeProps {
  /** Center x coordinate in diagram units */
  x: number;
  /** Center y coordinate in diagram units */
  y: number;
  /** Primary label rendered under the node */
  label?: string;
  /** Secondary, monospaced label (e.g. region, port, role) */
  sublabel?: string;
  status?: TopologyStatus;
  shape?: TopologyNodeShape;
  /** Node radius / half-width in diagram units */
  size?: number;
  /** Show a soft radiating pulse ring (auto-on for active nodes) */
  pulse?: boolean;
  /** Where labels sit relative to the node */
  labelPosition?: 'bottom' | 'top' | 'right' | 'left';
  className?: string;
  onClick?: () => void;
}

export interface TopologySignalProps {
  from: TopologyPoint;
  to: TopologyPoint;
  status?: TopologyStatus;
  /** Perpendicular bend amount. 0 = straight line */
  curve?: number;
  /** Seconds per dash cycle — lower is faster */
  speed?: number;
  direction?: 'forward' | 'reverse';
  /** Render a travelling packet dot along the line */
  packet?: boolean;
  className?: string;
}

export interface TopologyDiagramProps {
  width?: number;
  height?: number;
  /** Accessible title for the diagram */
  title: string;
  description?: string;
  /** Show a faint dot grid behind the diagram */
  grid?: boolean;
  /** Draw the outer frame + background */
  framed?: boolean;
  className?: string;
  children: React.ReactNode;
}

const nodeStyles: Record<TopologyStatus, { body: string; core: string; ring: string }> = {
  idle: { body: 'fill-[var(--surface-raised)] stroke-[var(--border-strong)]', core: 'fill-[var(--text-tertiary)]', ring: 'stroke-[var(--border-strong)]' },
  active: { body: 'fill-[var(--surface-raised)] stroke-[var(--accent-green)]', core: 'fill-[var(--accent-green)]', ring: 'stroke-[var(--accent-green)]' },
  degraded: { body: 'fill-[var(--surface-raised)] stroke-[var(--accent-gold)]', core: 'fill-[var(--accent-gold)]', ring: 'stroke-[var(--accent-gold)]' },
  error: { body: 'fill-[var(--surface-raised)] stroke-[var(--error)]', core: 'fill-[var(--error)]', ring: 'stroke-[var(--error)]' },
};

const signalStyles: Record<TopologyStatus, { track: string; flow: string; packet: string }> = {
  idle: { track: 'stroke-[var(--border)]', flow: 'stroke-[var(--border-strong)]', packet: 'fill-[var(--text-tertiary)]' },
  active: { track: 'stroke-[var(--border)]', flow: 'stroke-[var(--accent-green)]', packet: 'fill-[var(--accent-green)]' },
  degraded: { track: 'stroke-[var(--border)]', flow: 'stroke-[var(--accent-gold)]', packet: 'fill-[var(--accent-gold)]' },
  error: { track: 'stroke-[rgba(209,67,67,0.25)]', flow: 'stroke-[var(--error)]', packet: 'fill-[var(--error)]' },
};

export function TopologyDiagram({ width = 480, height = 280, title, description, grid = true, framed = true, className, children }: TopologyDiagramProps) {
  const id = React.useId().replace(/:/g, '');
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-labelledby={`${id}-title${description ? ` ${id}-desc` : ''}`}
      className={cn('h-auto w-full max-w-full', framed && 'rounded border border-border bg-surface-sunken', className)}
    >
      <title id={`${id}-title`}>{title}</title>
      {description && <desc id={`${id}-desc`}>{description}</desc>}
      {grid && (
        <>
          <defs>
            <pattern id={`${id}-grid`} width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" className="fill-[var(--border)]" />
            </pattern>
          </defs>
          <rect width={width} height={height} fill={`url(#${id}-grid)`} />
        </>
      )}
      {children}
    </svg>
  );
}

export function TopologyNode({
  x,
  y,
  label,
  sublabel,
  status = 'idle',
  shape = 'circle',
  size = 14,
  pulse,
  labelPosition = 'bottom',
  className,
  onClick,
}: TopologyNodeProps) {
  const reduceMotion = useReducedMotion();
  const styles = nodeStyles[status];
  const showPulse = (pulse ?? status === 'active') && !reduceMotion;
  const core = Math.max(3, size * 0.32);

  const body = renderShape(shape, x, y, size, cn('stroke-[1.5]', styles.body));
  const ring = renderShape(shape, x, y, size, cn('fill-none stroke-[1.5]', styles.ring));

  const { tx, ty, anchor } = labelPlacement(labelPosition, x, y, size);
  const interactive = Boolean(onClick);

  return (
    <g
      className={cn(interactive && 'cursor-pointer outline-none', className)}
      onClick={onClick}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : 'group'}
      aria-label={[label, sublabel, status].filter(Boolean).join(', ')}
    >
      {showPulse && (
        <motion.g
          style={{ transformOrigin: `${x}px ${y}px`, transformBox: 'view-box' }}
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        >
          {ring}
        </motion.g>
      )}
      {body}
      <circle cx={x} cy={y} r={core} className={styles.core} />
      {(label || sublabel) && (
        <text x={tx} y={ty} textAnchor={anchor} className="select-none">
          {label && (
            <tspan x={tx} className="fill-[var(--text-primary)] font-heading text-[11px] font-medium">
              {label}
            </tspan>
          )}
          {sublabel && (
            <tspan x={tx} dy={label ? 13 : 0} className="fill-[var(--text-tertiary)] font-mono text-[9px] uppercase tracking-wider">
              {sublabel}
            </tspan>
          )}
        </text>
      )}
    </g>
  );
}

export function TopologySignal({ from, to, status = 'active', curve = 0, speed = 1.2, direction = 'forward', packet = false, className }: TopologySignalProps) {
  const reduceMotion = useReducedMotion();
  const styles = signalStyles[status];
  const d = buildPath(from, to, curve);
  const animated = status !== 'idle' && !reduceMotion;
  const dashTotal = 10;
  const sign = direction === 'forward' ? -1 : 1;
  const pathId = React.useId().replace(/:/g, '');

  return (
    <g className={className} aria-hidden="true">
      <path id={pathId} d={d} className={cn('fill-none stroke-[1.5]', styles.track)} strokeLinecap="round" />
      {status !== 'idle' && (
        <motion.path
          d={d}
          className={cn('fill-none stroke-[1.5]', styles.flow)}
          strokeLinecap="round"
          strokeDasharray={status === 'error' ? '2 8' : '4 6'}
          initial={{ strokeDashoffset: 0 }}
          animate={animated ? { strokeDashoffset: sign * dashTotal } : undefined}
          transition={{ duration: speed / 2, repeat: Infinity, ease: 'linear' }}
        />
      )}
      {packet && animated && (
        <circle r={3} className={styles.packet}>
          <animateMotion dur={`${speed * 2}s`} repeatCount="indefinite" keyPoints={direction === 'forward' ? '0;1' : '1;0'} keyTimes="0;1" calcMode="linear">
            <mpath href={`#${pathId}`} />
          </animateMotion>
        </circle>
      )}
    </g>
  );
}

function renderShape(shape: TopologyNodeShape, x: number, y: number, size: number, className: string) {
  if (shape === 'square') {
    return <rect x={x - size} y={y - size} width={size * 2} height={size * 2} rx={size * 0.15} className={className} />;
  }
  if (shape === 'diamond') {
    const s = size * 1.15;
    return <polygon points={`${x},${y - s} ${x + s},${y} ${x},${y + s} ${x - s},${y}`} strokeLinejoin="round" className={className} />;
  }
  return <circle cx={x} cy={y} r={size} className={className} />;
}

function labelPlacement(pos: TopologyNodeProps['labelPosition'], x: number, y: number, size: number) {
  const gap = 10;
  switch (pos) {
    case 'top':
      return { tx: x, ty: y - size - gap - 13, anchor: 'middle' as const };
    case 'right':
      return { tx: x + size + gap, ty: y - 2, anchor: 'start' as const };
    case 'left':
      return { tx: x - size - gap, ty: y - 2, anchor: 'end' as const };
    default:
      return { tx: x, ty: y + size + gap + 8, anchor: 'middle' as const };
  }
}

function buildPath(from: TopologyPoint, to: TopologyPoint, curve: number) {
  if (!curve) return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx + (-dy / len) * curve;
  const cy = my + (dx / len) * curve;
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
}
