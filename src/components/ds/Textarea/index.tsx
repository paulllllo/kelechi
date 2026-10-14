import React, { forwardRef, useId, useState } from 'react';
import { cn } from '@/lib/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Mono uppercase label shown above the field */
  label?: string;
  /** Helper text shown below the field */
  helperText?: string;
  /** Error message; puts the field in an error state */
  error?: string;
  /** Show a live character counter (uses maxLength when provided) */
  showCount?: boolean;
  /** Allow vertical resizing */
  resizable?: boolean;
  /** Class applied to the outer wrapper */
  wrapperClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    helperText,
    error,
    showCount = false,
    resizable = true,
    required,
    disabled,
    maxLength,
    rows = 5,
    id,
    value,
    defaultValue,
    onChange,
    className = '',
    wrapperClassName = '',
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? `textarea-${autoId}`;
  const helperId = `${fieldId}-helper`;
  const hasError = Boolean(error);

  const [internalLength, setInternalLength] = useState<number>(String(defaultValue ?? '').length);
  const length = value !== undefined ? String(value).length : internalLength;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (value === undefined) setInternalLength(e.target.value.length);
    onChange?.(e);
  };

  const describedBy = error || helperText ? helperId : undefined;

  return (
    <div className={cn('flex w-full flex-col gap-2', wrapperClassName)}>
      {label && (
        <label htmlFor={fieldId} className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2">
          {label}
          {required && (
            <span aria-hidden="true" className="text-ember">
              *
            </span>
          )}
        </label>
      )}

      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        className={cn(
          'block w-full rounded-sm border bg-surface px-4 py-3 font-mono text-sm leading-relaxed text-ink',
          'placeholder:text-ink-3 outline-none transition-[border-color,box-shadow,background-color] duration-150',
          resizable ? 'resize-y min-h-[96px]' : 'resize-none',
          hasError
            ? 'border-error focus:border-error focus:shadow-[0_0_0_2px_rgba(209,67,67,0.35)]'
            : 'border-border hover:border-border-strong focus:border-ember focus:shadow-[0_0_0_2px_rgba(255,90,54,0.35)] focus:bg-surface-raised',
          disabled && 'cursor-not-allowed opacity-50 hover:border-border',
          className,
        )}
        {...rest}
      />

      {(error || helperText || showCount) && (
        <div className="flex items-start justify-between gap-4 font-mono text-[11px] tracking-[0.04em]">
          <p id={describedBy} role={hasError ? 'alert' : undefined} className={hasError ? 'text-error' : 'text-ink-3'}>
            {error ?? helperText}
          </p>
          {showCount && (
            <span aria-live="polite" className={cn('shrink-0 tabular-nums', maxLength && length >= maxLength ? 'text-ember' : 'text-ink-3')}>
              {maxLength ? `${String(length).padStart(3, '0')}/${maxLength}` : String(length).padStart(3, '0')}
            </span>
          )}
        </div>
      )}
    </div>
  );
});
