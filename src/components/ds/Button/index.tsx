import React, { forwardRef } from 'react';
import { Loader2Icon } from 'lucide-react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'secondary' | 'tertiary';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 font-mono uppercase tracking-[0.14em] leading-none whitespace-nowrap select-none transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-40';

const variantClasses: Record<ButtonVariant, string> = {
  secondary:
    'border border-border-strong bg-transparent text-ink hover:bg-ink hover:text-background hover:border-ink active:bg-ink-2 disabled:hover:bg-transparent disabled:hover:text-ink',
  tertiary:
    'border border-transparent bg-transparent text-ink-2 underline-offset-4 hover:text-ink hover:underline active:text-ink disabled:hover:no-underline disabled:hover:text-ink-2',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[11px]',
  md: 'h-10 px-4 text-xs',
  lg: 'h-12 px-6 text-sm',
};

const iconSize: Record<ButtonSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'secondary',
    size = 'md',
    loading = false,
    fullWidth = false,
    leadingIcon,
    trailingIcon,
    disabled,
    className = '',
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading;
  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(
        base,
        variantClasses[variant],
        sizeClasses[size],
        variant === 'tertiary' && 'px-1',
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading ? (
        <Loader2Icon className={`${iconSize[size]} animate-spin`} aria-hidden="true" />
      ) : (
        leadingIcon && (
          <span
            className={`${iconSize[size]} inline-flex items-center justify-center [&>svg]:h-full [&>svg]:w-full`}
            aria-hidden="true"
          >
            {leadingIcon}
          </span>
        )
      )}
      <span>{children}</span>
      {trailingIcon && !loading && (
        <span
          className={`${iconSize[size]} inline-flex items-center justify-center [&>svg]:h-full [&>svg]:w-full`}
          aria-hidden="true"
        >
          {trailingIcon}
        </span>
      )}
    </button>
  );
});
