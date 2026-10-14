import React from 'react';
import { format, isValid } from 'date-fns';
import { ArrowUpRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

export type LogEntryStatus = 'shipped' | 'in-progress' | 'draft' | 'archived';

export interface LogEntryCardProps {
  /** Entry date. Date objects / ISO strings are formatted as YYYY.MM.DD; other strings are rendered as-is. */
  date: Date | string;
  /** Log number. Numbers are zero-padded to 3 digits (84 → LOG_084). */
  logNumber: number | string;
  /** Entry title. */
  title: string;
  /** Optional prefix for the log id. Defaults to "LOG". */
  prefix?: string;
  /** Short body / summary. Can also be passed as children. */
  summary?: React.ReactNode;
  children?: React.ReactNode;
  /** Small tags rendered in the footer. */
  tags?: string[];
  /** Optional status indicator. */
  status?: LogEntryStatus;
  /** Makes the whole card a link (internal route). */
  to?: string;
  /** Makes the whole card an external link. */
  href?: string;
  /** Click handler — renders the card as a button when no href is provided. */
  onClick?: () => void;
  /** Compact layout with tighter spacing and no body. */
  compact?: boolean;
  /** Optional reading time / meta shown at the far right of the header. */
  meta?: React.ReactNode;
  className?: string;
}

const STATUS_STYLES: Record<LogEntryStatus, { label: string; dot: string; text: string }> = {
  shipped: { label: 'SHIPPED', dot: 'bg-phosphor', text: 'text-phosphor' },
  'in-progress': { label: 'IN_PROGRESS', dot: 'bg-gold', text: 'text-gold' },
  draft: { label: 'DRAFT', dot: 'bg-ink-3', text: 'text-ink-3' },
  archived: { label: 'ARCHIVED', dot: 'bg-border-strong', text: 'text-ink-3' },
};

export function LogEntryCard({
  date,
  logNumber,
  title,
  prefix = 'LOG',
  summary,
  children,
  tags,
  status,
  to,
  href,
  onClick,
  compact = false,
  meta,
  className,
}: LogEntryCardProps) {
  const formattedDate = formatLogDate(date);
  const logId = formatLogId(prefix, logNumber);
  const body = summary ?? children;
  const interactive = Boolean(href || to || onClick);
  const isoDate = date instanceof Date && isValid(date) ? date.toISOString() : undefined;

  const content = (
    <>
      <header className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-wider text-ink-3">
          <time dateTime={isoDate}>{formattedDate}</time>
          <span aria-hidden="true" className="mx-2 text-border-strong">
            //
          </span>
          <span className="text-ink-2">{logId}</span>
        </p>
        <div className="flex items-center gap-3">
          {meta && <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3">{meta}</span>}
          {status && <StatusBadge status={status} />}
          {interactive && (
            <ArrowUpRightIcon
              aria-hidden="true"
              className="h-4 w-4 text-ink-3 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember"
            />
          )}
        </div>
      </header>

      <h3
        className={cn(
          'font-heading font-semibold tracking-tight text-ink transition-colors group-hover:text-ember',
          compact ? 'mt-2 text-base' : 'mt-4 text-xl',
        )}
      >
        {title}
      </h3>

      {!compact && body && <div className="mt-2 text-sm leading-relaxed text-ink-2">{body}</div>}

      {tags && tags.length > 0 && (
        <ul className={cn('flex flex-wrap gap-1.5', compact ? 'mt-3' : 'mt-5')} aria-label="Tags">
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-sm border border-border bg-surface-raised px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-ink-3"
            >
              #{tag}
            </li>
          ))}
        </ul>
      )}
    </>
  );

  const baseClasses = cn(
    'group relative block w-full border border-border bg-surface/70 text-left backdrop-blur-sm',
    compact ? 'p-4' : 'p-5 sm:p-6',
    interactive &&
      'transition-all duration-300 hover:border-border-strong hover:bg-surface-raised/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    className,
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={baseClasses}>
        <article>{content}</article>
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} onClick={onClick} className={baseClasses} target="_blank" rel="noreferrer">
        <article>{content}</article>
      </a>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={baseClasses}>
        <article>{content}</article>
      </button>
    );
  }

  return <article className={baseClasses}>{content}</article>;
}

function StatusBadge({ status }: { status: LogEntryStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider', s.text)}>
      <span aria-hidden="true" className={cn('h-1.5 w-1.5 rounded-full', s.dot, status === 'in-progress' && 'animate-pulse')} />
      {s.label}
    </span>
  );
}

export function formatLogDate(date: Date | string): string {
  if (date instanceof Date) {
    return isValid(date) ? format(date, 'yyyy.MM.dd') : 'INVALID_DATE';
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(date)) {
    const parsed = new Date(date.length === 10 ? `${date}T00:00:00` : date);
    if (isValid(parsed)) return format(parsed, 'yyyy.MM.dd');
  }
  return date;
}

export function formatLogId(prefix: string, logNumber: number | string): string {
  const num = typeof logNumber === 'number' ? String(logNumber).padStart(3, '0') : logNumber;
  return `${prefix.toUpperCase()}_${num}`;
}
