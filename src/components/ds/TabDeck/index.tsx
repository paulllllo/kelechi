import React, { useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export type TabDeckItem = {
  id: string;
  label: string;
  description?: string;
  content: React.ReactNode;
  disabled?: boolean;
};

export type TabDeckProps = {
  items: TabDeckItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  /** Number of columns at md+ (defaults to item count, max 4) */
  columns?: 2 | 3 | 4;
  className?: string;
  'aria-label'?: string;
};

export function TabDeck({ items, value, defaultValue, onValueChange, columns, className = '', 'aria-label': ariaLabel = 'Content sections' }: TabDeckProps) {
  const baseId = useId();
  const firstEnabled = items.find((i) => !i.disabled)?.id;
  const [internal, setInternal] = useState<string | undefined>(defaultValue ?? firstEnabled);
  const active = value ?? internal;
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const cols = columns ?? (Math.min(items.length, 4) as 2 | 3 | 4);

  const select = (id: string) => {
    if (value === undefined) setInternal(id);
    onValueChange?.(id);
  };

  const focusAt = (start: number, step: number) => {
    const n = items.length;
    for (let k = 1; k <= n; k++) {
      const idx = (start + step * k + n * n) % n;
      if (!items[idx].disabled) {
        tabRefs.current[idx]?.focus();
        select(items[idx].id);
        return;
      }
    }
  };

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      focusAt(index, 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      focusAt(index, -1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusAt(-1, 1);
    } else if (e.key === 'End') {
      e.preventDefault();
      focusAt(items.length, -1);
    }
  };

  const activeItem = items.find((i) => i.id === active);
  const gridCols = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' }[cols];

  return (
    <div className={cn('w-full', className)}>
      <div role="tablist" aria-label={ariaLabel} className={cn('grid grid-cols-2 gap-3', gridCols)}>
        {items.map((item, index) => {
          const selected = item.id === active;
          const num = String(index + 1).padStart(2, '0');
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              id={`${baseId}-tab-${item.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              disabled={item.disabled}
              onClick={() => select(item.id)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={cn(
                'group relative flex flex-col items-start gap-3 border p-4 text-left transition-all duration-300',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                'disabled:cursor-not-allowed disabled:opacity-40',
                selected
                  ? 'border-ember/70 bg-ember/[0.06] shadow-[inset_0_0_24px_rgba(255,90,54,0.08)]'
                  : 'border-border bg-surface/60 hover:border-border-strong hover:bg-surface-raised/70',
              )}
            >
              <span className={cn('font-mono text-[10px] font-medium tracking-[0.2em]', selected ? 'text-ember' : 'text-ink-3')}>{num}</span>
              <span className="flex flex-col gap-1">
                <span className="font-heading text-sm font-semibold text-ink">{item.label}</span>
                {item.description && <span className="text-xs leading-relaxed text-ink-2">{item.description}</span>}
              </span>
              {selected && (
                <motion.span
                  layoutId={`${baseId}-tab-indicator`}
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-ember shadow-[0_0_10px_rgba(255,90,54,0.6)]"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {activeItem ? (
          <motion.div
            key={activeItem.id}
            role="tabpanel"
            id={`${baseId}-panel-${activeItem.id}`}
            aria-labelledby={`${baseId}-tab-${activeItem.id}`}
            tabIndex={0}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 border border-border bg-surface/70 p-6 text-ink-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
          >
            {activeItem.content}
          </motion.div>
        ) : (
          <div className="mt-4 border border-dashed border-border p-6 font-mono text-sm text-ink-3">No section selected.</div>
        )}
      </AnimatePresence>
    </div>
  );
}
