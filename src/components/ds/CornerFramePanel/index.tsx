import React from 'react';
import { cn } from '@/lib/cn';

export type CornerFramePanelTone = 'default' | 'accent' | 'ember' | 'muted';
export type CornerFramePanelPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CornerFramePanelProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Small uppercase label shown in the header (e.g. "SYS.01") */
  label?: React.ReactNode;
  /** Panel heading */
  title?: React.ReactNode;
  /** Right-aligned meta text in the header (e.g. index, status) */
  meta?: React.ReactNode;
  /** Footer content rendered under a dashed divider */
  footer?: React.ReactNode;
  /** Color treatment of the frame */
  tone?: CornerFramePanelTone;
  /** Inner padding */
  padding?: CornerFramePanelPadding;
  /** Show crosshair ticks at the mid-points of each edge */
  crosshairs?: boolean;
  /** Bracket arm length in px */
  cornerSize?: number;
  /** Adds hover/focus affordances — use for clickable project tiles */
  interactive?: boolean;
  /** Root element */
  as?: React.ElementType;
  href?: string;
  to?: string;
  children?: React.ReactNode;
}

const toneClasses: Record<CornerFramePanelTone, { frame: string; surface: string; label: string }> = {
  default: {
    frame: 'text-ink-2',
    surface: 'bg-surface/80 border-border',
    label: 'text-ink-3',
  },
  accent: {
    frame: 'text-phosphor',
    surface: 'bg-surface/80 border-phosphor/20',
    label: 'text-phosphor/80',
  },
  ember: {
    frame: 'text-ember',
    surface: 'bg-surface/80 border-ember/25',
    label: 'text-ember/80',
  },
  muted: {
    frame: 'text-ink-3',
    surface: 'bg-surface/50 border-border/70',
    label: 'text-ink-3',
  },
};

const paddingClasses: Record<CornerFramePanelPadding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

export function CornerFramePanel({
  label,
  title,
  meta,
  footer,
  tone = 'default',
  padding = 'md',
  crosshairs = true,
  cornerSize = 14,
  interactive = false,
  as = 'div',
  className = '',
  children,
  ...rest
}: CornerFramePanelProps) {
  const t = toneClasses[tone];
  const Root = as as React.ElementType;
  const hasHeader = label || title || meta;

  return (
    <Root
      className={cn(
        'group relative block w-full border font-mono text-ink text-left',
        t.surface,
        interactive &&
          'cursor-pointer transition-all duration-300 hover:bg-surface-raised/90 hover:border-border-strong focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
      {...rest}
    >
      <CornerBrackets size={cornerSize} className={t.frame} interactive={interactive} />
      {crosshairs && <CrosshairTicks className={t.frame} />}

      <div className={cn('relative h-full', paddingClasses[padding])}>
        {hasHeader && (
          <header className="mb-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              {label && <div className={cn('text-[10px] uppercase tracking-[0.2em]', t.label)}>{label}</div>}
              {title && (
                <h3 className="mt-1 truncate font-heading text-sm font-semibold uppercase tracking-wider text-ink">
                  {title}
                </h3>
              )}
            </div>
            {meta && <div className={cn('shrink-0 text-[10px] uppercase tracking-[0.2em]', t.label)}>{meta}</div>}
          </header>
        )}

        {children}

        {footer && (
          <footer className={cn('mt-4 border-t border-dashed border-border pt-3 text-[11px] uppercase tracking-widest', t.label)}>
            {footer}
          </footer>
        )}
      </div>
    </Root>
  );
}

function CornerBrackets({ size, className, interactive }: { size: number; className: string; interactive: boolean }) {
  const base = 'pointer-events-none absolute border-current transition-all duration-300';
  const offset = interactive ? 'group-hover:scale-125' : '';
  const style = { width: size, height: size };
  return (
    <span aria-hidden="true" className={className}>
      <span style={style} className={`${base} ${offset} -left-px -top-px origin-top-left border-l-2 border-t-2`} />
      <span style={style} className={`${base} ${offset} -right-px -top-px origin-top-right border-r-2 border-t-2`} />
      <span style={style} className={`${base} ${offset} -bottom-px -left-px origin-bottom-left border-b-2 border-l-2`} />
      <span style={style} className={`${base} ${offset} -bottom-px -right-px origin-bottom-right border-b-2 border-r-2`} />
    </span>
  );
}

function CrosshairTicks({ className }: { className: string }) {
  const tick = 'pointer-events-none absolute bg-current opacity-60';
  return (
    <span aria-hidden="true" className={className}>
      <span className={`${tick} left-1/2 top-0 h-1.5 w-px -translate-x-1/2`} />
      <span className={`${tick} bottom-0 left-1/2 h-1.5 w-px -translate-x-1/2`} />
      <span className={`${tick} left-0 top-1/2 h-px w-1.5 -translate-y-1/2`} />
      <span className={`${tick} right-0 top-1/2 h-px w-1.5 -translate-y-1/2`} />
    </span>
  );
}
