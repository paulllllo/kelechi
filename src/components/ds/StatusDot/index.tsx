import { cn } from '@/lib/cn';

export type StatusDotColor = 'ember' | 'teal' | 'green' | 'gold';
export type StatusDotStatus = 'online' | 'active' | 'idle' | 'busy';
export type StatusDotSize = 'sm' | 'md' | 'lg';

export interface StatusDotProps {
  /** Semantic state. Maps to a default color: online → green, active → ember, idle → teal, busy → gold. */
  status?: StatusDotStatus;
  /** Explicit color override. Takes precedence over `status`. */
  color?: StatusDotColor;
  /** Dot size. */
  size?: StatusDotSize;
  /** Whether to show the pulsing ring. Defaults to true except for `idle`. */
  pulse?: boolean;
  /** Accessible label. Defaults to the status name. Pass `null` to mark decorative. */
  label?: string | null;
  className?: string;
}

export const statusColorMap: Record<StatusDotStatus, StatusDotColor> = {
  online: 'green',
  active: 'ember',
  idle: 'teal',
  busy: 'gold',
};

const colorClasses: Record<StatusDotColor, { dot: string; ring: string }> = {
  ember: { dot: 'bg-ember', ring: 'bg-ember' },
  teal: { dot: 'bg-teal', ring: 'bg-teal' },
  green: { dot: 'bg-phosphor', ring: 'bg-phosphor' },
  gold: { dot: 'bg-gold', ring: 'bg-gold' },
};

const sizeClasses: Record<StatusDotSize, string> = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
  lg: 'h-3 w-3',
};

export function StatusDot({ status = 'online', color, size = 'md', pulse, label, className = '' }: StatusDotProps) {
  const resolvedColor = color ?? statusColorMap[status];
  const shouldPulse = pulse ?? status !== 'idle';
  const { dot, ring } = colorClasses[resolvedColor];
  const sizeClass = sizeClasses[size];
  const accessibleLabel = label === undefined ? status : label;
  const isDecorative = accessibleLabel === null;

  return (
    <span
      className={cn('relative inline-flex shrink-0', sizeClass, className)}
      role={isDecorative ? undefined : 'status'}
      aria-label={isDecorative ? undefined : accessibleLabel}
      aria-hidden={isDecorative ? true : undefined}
    >
      {shouldPulse && <span className={cn('absolute inline-flex h-full w-full rounded-full opacity-75 motion-safe:animate-ping', ring)} aria-hidden="true" />}
      <span className={cn('relative inline-flex rounded-full', sizeClass, dot)} aria-hidden="true" />
    </span>
  );
}
