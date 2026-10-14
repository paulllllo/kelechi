import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

export type StatusBarStatus = 'online' | 'degraded' | 'offline';

export interface StatusBarProps {
  /** System status shown in the leading indicator */
  status?: StatusBarStatus;
  /** Label shown next to the dot, e.g. "Available" */
  statusLabel?: string;
  /** Latency in milliseconds. Pass null to show "—" */
  latencyMs?: number | null;
  /** Location label shown before the clock (e.g. "LAG") */
  location?: string;
  /** IANA time zone for the clock. */
  timeZone?: string;
  /** Label shown after the time (e.g. "WAT"). */
  timeZoneLabel?: string;
  /** Optional fixed date for static rendering; disables the live tick */
  now?: Date;
  /** Optional extra items rendered between latency and the clock */
  extra?: React.ReactNode;
  /** Hide the latency readout. */
  showLatency?: boolean;
  className?: string;
}

const STATUS_META: Record<StatusBarStatus, { label: string; dot: string; text: string }> = {
  online: { label: 'ONLINE', dot: 'bg-phosphor', text: 'text-phosphor' },
  degraded: { label: 'DEGRADED', dot: 'bg-gold', text: 'text-gold' },
  offline: { label: 'OFFLINE', dot: 'bg-error', text: 'text-error' },
};

export function StatusBar({
  status = 'online',
  statusLabel,
  latencyMs = 24,
  location = 'LAG',
  timeZone = 'Africa/Lagos',
  timeZoneLabel = 'WAT',
  now,
  extra,
  showLatency = true,
  className = '',
}: StatusBarProps) {
  const [time, setTime] = useState<Date>(now ?? new Date());

  useEffect(() => {
    if (now) {
      setTime(now);
      return;
    }
    const id = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(id);
  }, [now]);

  const meta = STATUS_META[status];
  const clock = formatTime(time, timeZone);

  return (
    <div
      role="status"
      aria-live="off"
      className={cn('w-full border-b border-border bg-surface-sunken/95 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3 backdrop-blur', className)}
    >
      <div className="container-site flex h-8 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              {status !== 'offline' && <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-60', meta.dot)} />}
              <span className={cn('relative inline-flex h-1.5 w-1.5 rounded-full', meta.dot)} />
            </span>
            <span className="text-ink-3">Status:</span>
            <span className={meta.text}>{statusLabel ?? meta.label}</span>
          </span>

          {showLatency && (
            <>
              <span className="hidden h-3 w-px bg-border sm:block" aria-hidden="true" />
              <span className="hidden whitespace-nowrap sm:inline">
                <span className="text-ink-3">Latency:</span>{' '}
                <span className="text-ink-2">{latencyMs == null ? '—' : `${Math.round(latencyMs)}MS`}</span>
              </span>
            </>
          )}

          {extra && (
            <>
              <span className="hidden h-3 w-px bg-border md:block" aria-hidden="true" />
              <span className="hidden truncate md:inline">{extra}</span>
            </>
          )}
        </div>

        <span className="whitespace-nowrap">
          <span className="text-ink-3">{location}</span>
          <span className="mx-1.5 text-border-strong" aria-hidden="true">
            /
          </span>
          <time dateTime={time.toISOString()} className="tabular-nums text-ink-2">
            {clock}
          </time>{' '}
          <span className="text-ink-3">{timeZoneLabel}</span>
        </span>
      </div>
    </div>
  );
}

export function formatTime(date: Date, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone,
    }).format(date);
  } catch {
    return date.toISOString().slice(11, 19);
  }
}
