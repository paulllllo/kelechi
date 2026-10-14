import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

export type ProtocolNavLinkSize = 'sm' | 'md' | 'lg';

export interface ProtocolNavLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'href'> {
  /** Numeric or string index rendered as a zero-padded prefix, e.g. 1 → "01" */
  index: number | string;
  /** Command label, rendered uppercase, e.g. "Works" */
  label: string;
  /** Router destination. */
  to: string;
  /** Marks the link as the current page */
  active?: boolean;
  /** Disables interaction and dims the link */
  disabled?: boolean;
  /** Text size */
  size?: ProtocolNavLinkSize;
  /** Show the leading caret cursor when active/hovered */
  showCaret?: boolean;
  /** Label only — no index, caret, or brackets. For a quieter bar. */
  plain?: boolean;
}

const sizeClasses: Record<ProtocolNavLinkSize, string> = {
  sm: 'text-[11px] gap-1.5 py-1',
  md: 'text-xs gap-2 py-1.5',
  lg: 'text-sm gap-2.5 py-2',
};

export const formatProtocolIndex = (index: number | string): string =>
  typeof index === 'number' ? String(index).padStart(2, '0') : index;

export function ProtocolNavLink({
  index,
  label,
  active = false,
  disabled = false,
  size = 'md',
  showCaret = true,
  plain = false,
  to,
  className = '',
  onClick,
  ...rest
}: ProtocolNavLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const stateClasses = disabled
    ? 'text-ink-3 cursor-not-allowed'
    : active
      ? 'text-ink'
      : 'text-ink-2 hover:text-ink';

  return (
    <Link
      to={disabled ? '#' : to}
      aria-current={active ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      onClick={handleClick}
      className={cn(
        'group relative inline-flex items-center font-mono uppercase tracking-wider leading-none whitespace-nowrap',
        'transition-colors duration-150 rounded-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        sizeClasses[size],
        stateClasses,
        className,
      )}
      {...rest}
    >
      {plain ? (
        <span className="relative">
          {label}
          <span
            aria-hidden="true"
            className={cn(
              'absolute -bottom-1.5 left-0 h-px bg-ember transition-all duration-300',
              active ? 'w-full' : 'w-0 group-hover:w-full',
            )}
          />
        </span>
      ) : (
        <>
      {showCaret && (
        <span
          aria-hidden="true"
          className={cn(
            'inline-block w-[1ch] text-ember transition-opacity duration-150',
            active ? 'opacity-100' : 'opacity-0',
            !disabled && !active && 'group-hover:opacity-100',
          )}
        >
          &gt;
        </span>
      )}
      <span className="inline-flex items-center">
        <span aria-hidden="true" className="text-ink-3">
          [
        </span>
        <span className={cn('tabular-nums', active ? 'text-ember' : 'text-ink-3', !disabled && !active && 'group-hover:text-ink-2')}>
          {formatProtocolIndex(index)}.
        </span>
        <span className={cn('ml-[1ch]', active && 'underline decoration-ember decoration-1 underline-offset-4')}>{label}</span>
        <span aria-hidden="true" className="text-ink-3">
          ]
        </span>
      </span>
        </>
      )}
    </Link>
  );
}
