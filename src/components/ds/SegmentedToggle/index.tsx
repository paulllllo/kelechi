import React, { useId, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

export type SegmentedToggleOption<T extends string = string> = {
  value: T;
  label: string;
  icon?: LucideIcon;
  disabled?: boolean;
};

export type SegmentedToggleSize = 'sm' | 'md' | 'lg';

export type SegmentedToggleProps<T extends string = string> = {
  options: SegmentedToggleOption<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  size?: SegmentedToggleSize;
  fullWidth?: boolean;
  showIcons?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
  className?: string;
};

const sizeStyles: Record<SegmentedToggleSize, { root: string; item: string; icon: string }> = {
  sm: {
    root: 'p-0.5',
    item: 'h-7 px-2.5 text-[10px] gap-1.5',
    icon: 'h-3 w-3',
  },
  md: {
    root: 'p-1',
    item: 'h-8 px-3.5 text-[11px] gap-2',
    icon: 'h-3.5 w-3.5',
  },
  lg: {
    root: 'p-1',
    item: 'h-10 px-5 text-xs gap-2',
    icon: 'h-4 w-4',
  },
};

export function SegmentedToggle<T extends string = string>({
  options,
  value,
  defaultValue,
  onChange,
  size = 'md',
  fullWidth = false,
  showIcons = true,
  disabled = false,
  'aria-label': ariaLabel = 'View mode',
  className,
}: SegmentedToggleProps<T>) {
  const groupId = useId();
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<T | undefined>(defaultValue ?? options.find((o) => !o.disabled)?.value);
  const selected = isControlled ? value : internal;
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const styles = sizeStyles[size];

  const select = (next: T) => {
    if (next === selected) return;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const enabled = options.map((o, i) => ({ o, i })).filter(({ o }) => !o.disabled);
    if (!enabled.length) return;
    const pos = enabled.findIndex(({ i }) => i === index);
    let target = pos;
    if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = enabled.length - 1;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') target = (pos + 1) % enabled.length;
    else target = (pos - 1 + enabled.length) % enabled.length;
    const { o, i } = enabled[target];
    refs.current[i]?.focus();
    select(o.value);
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      className={cn(
        'relative inline-flex items-center rounded-sm border border-border bg-surface-sunken font-mono uppercase tracking-[0.14em]',
        styles.root,
        fullWidth && 'flex w-full',
        disabled && 'opacity-50',
        className,
      )}
    >
      {options.map((option, index) => {
        const isSelected = option.value === selected;
        const isDisabled = disabled || option.disabled;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={isDisabled}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => select(option.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              'relative inline-flex select-none items-center justify-center whitespace-nowrap rounded-sm font-medium transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              styles.item,
              fullWidth && 'flex-1',
              isSelected ? 'text-background' : 'text-ink-2 hover:text-ink',
              isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
              option.disabled && !disabled && 'opacity-40 hover:text-ink-2',
            )}
          >
            {isSelected && (
              <motion.span
                layoutId={`segmented-indicator-${groupId}`}
                aria-hidden="true"
                className="absolute inset-0 rounded-sm bg-ember shadow-[0_0_14px_rgba(255,90,54,0.45)]"
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-[inherit]">
              {showIcons && Icon && <Icon className={styles.icon} aria-hidden="true" />}
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
