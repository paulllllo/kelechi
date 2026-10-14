import React, { forwardRef, useId } from 'react';
import { cn } from '@/lib/cn';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  size?: InputSize;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  containerClassName?: string;
}

const sizeClasses: Record<InputSize, string> = {
  sm: 'h-8 text-xs px-3',
  md: 'h-11 text-sm px-3.5',
  lg: 'h-12 text-base px-4',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, size = 'md', leadingIcon, trailingIcon, disabled, id, className = '', containerClassName = '', required, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  const stateClasses = error
    ? 'border-error focus-within:border-error focus-within:shadow-[0_0_0_2px_rgba(209,67,67,0.35)]'
    : 'border-border hover:border-border-strong focus-within:border-ember focus-within:shadow-[0_0_0_2px_rgba(255,90,54,0.35)] focus-within:bg-surface-raised';

  return (
    <div className={cn('flex w-full flex-col gap-2', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2">
          {label}
          {required && (
            <span aria-hidden="true" className="text-ember">
              *
            </span>
          )}
        </label>
      )}
      <div
        className={cn(
          'flex items-center gap-2 rounded-sm border bg-surface text-ink transition-[border-color,box-shadow,background-color] duration-150',
          stateClasses,
          sizeClasses[size],
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        {leadingIcon && (
          <span className="flex shrink-0 items-center text-ink-3" aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            'h-full w-full min-w-0 bg-transparent font-mono text-ink caret-ember outline-none placeholder:text-ink-3 disabled:cursor-not-allowed',
            className,
          )}
          {...rest}
        />
        {trailingIcon && <span className="flex shrink-0 items-center text-ink-3">{trailingIcon}</span>}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="font-mono text-[11px] text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="font-mono text-[11px] text-ink-3">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
