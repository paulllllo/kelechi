import React from 'react';
import { cn } from '@/lib/cn';

export type BracketButtonSize = 'sm' | 'md' | 'lg';
export type BracketButtonVariant = 'primary' | 'ghost' | 'outline';

type PolymorphicProps<E extends React.ElementType> = {
  /** Render as a different element, e.g. `as={Link}` or `as="a"`. */
  as?: E;
  /** Label text. Rendered uppercase between the brackets. */
  children: React.ReactNode;
  /** Visual size. Defaults to 'md'. */
  size?: BracketButtonSize;
  /** 'primary' = filled ember glow, 'ghost' = text + bracket only, 'outline' = hairline. */
  variant?: BracketButtonVariant;
  /** Shows a blinking cursor state and disables interaction. */
  loading?: boolean;
  /** Label shown while loading. */
  loadingLabel?: React.ReactNode;
  /** Stretch to container width. */
  fullWidth?: boolean;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<E>, 'as' | 'children' | 'size'>;

export type BracketButtonProps<E extends React.ElementType = 'button'> = PolymorphicProps<E>;

const sizeClasses: Record<BracketButtonSize, string> = {
  sm: 'h-9 px-4 text-[11px] gap-2',
  md: 'h-12 px-6 text-xs gap-3',
  lg: 'h-14 px-8 text-sm gap-4',
};

const variantClasses: Record<BracketButtonVariant, string> = {
  primary:
    'border border-ember/60 bg-ember/10 text-[var(--color-ember-light)] shadow-[0_0_12px_rgba(255,90,54,0.25)] hover:bg-ember/20 hover:border-ember hover:text-[var(--color-ember-lightest)] hover:shadow-[0_0_28px_rgba(255,90,54,0.55),inset_0_0_12px_rgba(255,90,54,0.2)]',
  ghost:
    'border border-transparent bg-transparent text-[var(--color-ember-light)] hover:text-[var(--color-ember-lightest)] hover:[text-shadow:0_0_12px_rgba(255,90,54,0.7)]',
  outline:
    'border border-border-strong bg-transparent text-ink hover:border-ink-2 hover:bg-surface-raised hover:text-ink',
};

export function BracketButton<E extends React.ElementType = 'button'>({
  as,
  children,
  size = 'md',
  variant = 'primary',
  loading = false,
  loadingLabel = 'Connecting',
  fullWidth = false,
  className,
  ...rest
}: BracketButtonProps<E>) {
  const Component = (as ?? 'button') as React.ElementType;
  const isButton = Component === 'button';
  const disabled = (rest as { disabled?: boolean }).disabled || loading;

  const buttonProps = isButton ? { type: (rest as { type?: string }).type ?? 'button', disabled } : {};

  return (
    <Component
      aria-busy={loading || undefined}
      aria-disabled={!isButton && disabled ? true : undefined}
      className={cn(
        'group relative inline-flex select-none items-center justify-center whitespace-nowrap font-mono font-medium uppercase tracking-[0.2em] transition-all duration-200 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'active:scale-[0.98]',
        'disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none',
        disabled && !isButton && 'pointer-events-none opacity-50 shadow-none',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
      {...buttonProps}
    >
      <span
        aria-hidden="true"
        className="inline-block text-ember transition-transform duration-200 ease-out group-hover:-translate-x-1.5 group-focus-visible:-translate-x-1.5"
      >
        [
      </span>
      <span className="relative inline-flex items-center gap-2">
        {loading ? (
          <>
            {loadingLabel}
            <span aria-hidden="true" className="ml-1 inline-block h-[1em] w-[0.55em] animate-blink bg-current" />
          </>
        ) : (
          children
        )}
      </span>
      <span
        aria-hidden="true"
        className="inline-block text-ember transition-transform duration-200 ease-out group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5"
      >
        ]
      </span>
    </Component>
  );
}
