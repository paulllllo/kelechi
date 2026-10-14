import React, { useEffect, useId, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangleIcon, ArrowDownRightIcon, ArrowUpRightIcon, MinusIcon, RefreshCwIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

export type TelemetryStatus = 'nominal' | 'warning' | 'critical' | 'offline';
export type TelemetryTrend = 'up' | 'down' | 'flat';

export interface TelemetryMetric {
  label: string;
  value: string | number;
  unit?: string;
  trend?: TelemetryTrend;
  delta?: string;
  /** Optional 0–100 fill for a compact usage bar */
  progress?: number;
}

export interface TelemetryDetail {
  label: string;
  value: React.ReactNode;
}

export interface TelemetryDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  status?: TelemetryStatus;
  metrics?: TelemetryMetric[];
  details?: TelemetryDetail[];
  lastUpdated?: string;
  side?: 'right' | 'left';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  /** Render inside the nearest positioned parent instead of the viewport */
  contained?: boolean;
  className?: string;
}

const sizeClasses = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' };

const statusStyles: Record<TelemetryStatus, { label: string; dot: string; pill: string }> = {
  nominal: { label: 'Nominal', dot: 'bg-phosphor', pill: 'bg-phosphor/10 text-phosphor ring-phosphor/30' },
  warning: { label: 'Warning', dot: 'bg-gold', pill: 'bg-gold/10 text-gold ring-gold/30' },
  critical: { label: 'Critical', dot: 'bg-error', pill: 'bg-error/10 text-error ring-error/30' },
  offline: { label: 'Offline', dot: 'bg-ink-3', pill: 'bg-surface-raised text-ink-2 ring-border' },
};

export function TelemetryDrawer({
  open,
  onClose,
  title,
  subtitle,
  status,
  metrics = [],
  details = [],
  lastUpdated,
  side = 'right',
  size = 'md',
  loading = false,
  error,
  onRetry,
  footer,
  children,
  contained = false,
  className,
}: TelemetryDrawerProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const offset = side === 'right' ? '100%' : '-100%';
  const position = contained ? 'absolute' : 'fixed';

  return (
    <AnimatePresence>
      {open && (
        <div className={cn(position, 'inset-0 z-[60] flex overflow-hidden', side === 'right' ? 'justify-end' : 'justify-start')}>
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-background/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />

          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ x: offset }}
            animate={{ x: 0 }}
            exit={{ x: offset }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            className={cn(
              'relative flex h-full w-full flex-col bg-surface font-mono text-ink shadow-2xl outline-none',
              side === 'right' ? 'border-l border-border-strong' : 'border-r border-border-strong',
              sizeClasses[size],
              className,
            )}
          >
            <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 id={titleId} className="truncate font-heading text-base font-semibold text-ink">
                    {title}
                  </h2>
                  {status && (
                    <span className={cn('inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-wider ring-1 ring-inset', statusStyles[status].pill)}>
                      <span className={cn('h-1.5 w-1.5 rounded-full', statusStyles[status].dot)} />
                      {statusStyles[status].label}
                    </span>
                  )}
                </div>
                {subtitle && <p className="mt-0.5 truncate text-xs text-ink-3">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close drawer"
                className="-mr-1 rounded-sm p-1.5 text-ink-3 transition-colors hover:bg-surface-raised hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-5" aria-busy={loading}>
              {loading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState message={error} onRetry={onRetry} />
              ) : (
                <div className="space-y-6">
                  {metrics.length > 0 && (
                    <section aria-label="Metrics" className="grid grid-cols-2 gap-3">
                      {metrics.map((m) => (
                        <MetricCard key={m.label} metric={m} />
                      ))}
                    </section>
                  )}
                  {details.length > 0 && (
                    <section aria-label="Details">
                      <h3 className="mb-2 text-[10px] uppercase tracking-[0.16em] text-ink-3">Details</h3>
                      <dl className="divide-y divide-border rounded-sm border border-border">
                        {details.map((d) => (
                          <div key={d.label} className="flex items-center justify-between gap-4 px-3 py-2.5 text-xs">
                            <dt className="text-ink-3">{d.label}</dt>
                            <dd className="truncate text-right text-ink">{d.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </section>
                  )}
                  {children}
                </div>
              )}
            </div>

            {(footer || lastUpdated) && (
              <footer className="flex items-center justify-between gap-3 border-t border-border px-5 py-3">
                {lastUpdated ? <span className="text-[10px] uppercase tracking-wider text-ink-3">Updated {lastUpdated}</span> : <span />}
                {footer && <div className="flex items-center gap-2">{footer}</div>}
              </footer>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

function MetricCard({ metric }: { metric: TelemetryMetric }) {
  const TrendIcon = metric.trend === 'up' ? ArrowUpRightIcon : metric.trend === 'down' ? ArrowDownRightIcon : MinusIcon;
  const trendColor = metric.trend === 'up' ? 'text-phosphor' : metric.trend === 'down' ? 'text-error' : 'text-ink-3';
  return (
    <div className="rounded-sm border border-border bg-surface-sunken p-3">
      <p className="truncate text-[10px] uppercase tracking-wider text-ink-3">{metric.label}</p>
      <p className="mt-1 flex items-baseline gap-1">
        <span className="font-heading text-xl font-semibold tabular-nums text-ink">{metric.value}</span>
        {metric.unit && <span className="text-[10px] text-ink-3">{metric.unit}</span>}
      </p>
      {metric.delta && (
        <p className={cn('mt-1 inline-flex items-center gap-0.5 text-[10px]', trendColor)}>
          <TrendIcon className="h-3 w-3" aria-hidden="true" />
          {metric.delta}
        </p>
      )}
      {typeof metric.progress === 'number' && (
        <div
          className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface-raised"
          role="progressbar"
          aria-label={`${metric.label} usage`}
          aria-valuenow={metric.progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={cn('h-full rounded-full', metric.progress >= 90 ? 'bg-error' : metric.progress >= 70 ? 'bg-gold' : 'bg-phosphor')}
            style={{ width: `${Math.min(100, Math.max(0, metric.progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading telemetry">
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-sm bg-surface-raised" />
        ))}
      </div>
      <div className="space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-9 animate-pulse rounded-sm bg-surface-raised" />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center gap-3 rounded-sm border border-error/40 bg-error/10 px-4 py-8 text-center">
      <AlertTriangleIcon className="h-5 w-5 text-error" aria-hidden="true" />
      <p className="text-sm text-error">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-sm border border-error/40 bg-surface px-3 py-1.5 text-xs uppercase tracking-wider text-error transition-colors hover:bg-error/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
        >
          <RefreshCwIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Retry
        </button>
      )}
    </div>
  );
}
