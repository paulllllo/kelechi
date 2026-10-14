import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

export type LogoSize = 'sm' | 'md' | 'lg';

export interface LogoProps {
  /** Primary name shown before the separator */
  name?: string;
  /** Role/descriptor shown after the separator */
  descriptor?: string;
  /** Visual size of the wordmark */
  size?: LogoSize;
  /** Hide the descriptor (useful on small screens or tight spaces) */
  compact?: boolean;
  /** Optional link target — renders a router link when provided */
  to?: string;
  className?: string;
}

const sizeClasses: Record<LogoSize, { name: string; descriptor: string; gap: string }> = {
  sm: { name: 'text-sm', descriptor: 'text-[10px]', gap: 'gap-1.5' },
  md: { name: 'text-base', descriptor: 'text-[11px]', gap: 'gap-2' },
  lg: { name: 'text-xl', descriptor: 'text-sm', gap: 'gap-2.5' },
};

export function Logo({
  name = 'KELECHI ODIGBO',
  descriptor = 'SOFTWARE ENGINEER',
  size = 'md',
  compact = false,
  to,
  className = '',
}: LogoProps) {
  const s = sizeClasses[size];
  const label = compact ? name : `${name} — ${descriptor}`;

  const content = (
    <>
      <span className={cn(s.name, 'whitespace-nowrap font-heading font-semibold tracking-tight text-ink')}>{name}</span>
      {!compact && (
        <>
          <span aria-hidden="true" className={cn(s.descriptor, 'font-mono text-ember')}>
            //
          </span>
          <span className={cn(s.descriptor, 'whitespace-nowrap font-mono font-medium uppercase tracking-[0.14em] text-ink-2')}>
            {descriptor}
          </span>
        </>
      )}
    </>
  );

  const base = cn('inline-flex shrink-0 items-baseline leading-none select-none', s.gap, className);

  if (to) {
    return (
      <Link
        to={to}
        aria-label={label}
        className={cn(
          base,
          'rounded-sm transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        )}
      >
        {content}
      </Link>
    );
  }

  return (
    <span className={base} aria-label={label} role="img">
      {content}
    </span>
  );
}
