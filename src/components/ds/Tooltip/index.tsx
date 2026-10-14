import React, { cloneElement, isValidElement, useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** Tooltip body. Rendered in mono, uppercase by default. */
  content: React.ReactNode;
  /** Optional small label shown before the content, e.g. "SYS" or "01". */
  label?: string;
  /** Optional keyboard shortcut shown at the end. */
  shortcut?: string;
  /** Placement relative to the trigger. */
  side?: TooltipSide;
  /** Hover delay in ms before showing. */
  delay?: number;
  /** Disable the tooltip entirely. */
  disabled?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Callback for open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Keep text in original case instead of uppercase. */
  preserveCase?: boolean;
  /** Extra classes for the tooltip panel. */
  className?: string;
  /** The trigger element. Should be focusable (button, link, input). */
  children: React.ReactElement;
}

const sidePosition: Record<TooltipSide, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const sideOffset: Record<TooltipSide, { x?: number; y?: number }> = {
  top: { y: 4 },
  bottom: { y: -4 },
  left: { x: 4 },
  right: { x: -4 },
};

const tickPosition: Record<TooltipSide, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 h-2 w-px',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 h-2 w-px',
  left: 'left-full top-1/2 -translate-y-1/2 w-2 h-px',
  right: 'right-full top-1/2 -translate-y-1/2 w-2 h-px',
};

export function Tooltip({
  content,
  label,
  shortcut,
  side = 'top',
  delay = 250,
  disabled = false,
  open: openProp,
  onOpenChange,
  preserveCase = false,
  className,
  children,
}: TooltipProps) {
  const id = useId();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isControlled = openProp !== undefined;
  const open = !disabled && (isControlled ? openProp : uncontrolledOpen);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const show = (immediate = false) => {
    if (disabled) return;
    clear();
    if (immediate || delay <= 0) setOpen(true);
    else timer.current = setTimeout(() => setOpen(true), delay);
  };

  const hide = useCallback(() => {
    clear();
    setOpen(false);
  }, [setOpen]);

  useEffect(() => clear, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, hide]);

  const trigger = isValidElement<{ 'aria-describedby'?: string }>(children)
    ? cloneElement(children, {
        'aria-describedby': open ? [children.props['aria-describedby'], id].filter(Boolean).join(' ') : children.props['aria-describedby'],
      })
    : children;

  return (
    <span className="relative inline-flex" onMouseEnter={() => show()} onMouseLeave={hide} onFocus={() => show(true)} onBlur={hide}>
      {trigger}
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, ...sideOffset[side] }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, ...sideOffset[side] }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className={cn(
              'pointer-events-none absolute z-50 flex items-center gap-2 whitespace-nowrap',
              'border border-border-strong bg-surface-sunken px-2 py-1',
              'font-mono text-[10px] leading-4 tracking-[0.12em] text-ink',
              !preserveCase && 'uppercase',
              sidePosition[side],
              className,
            )}
          >
            <span aria-hidden="true" className={cn('absolute bg-border-strong', tickPosition[side])} />
            {label && (
              <span className="flex items-center gap-2 text-ink-3">
                {label}
                <span aria-hidden="true" className="h-3 w-px bg-border-strong" />
              </span>
            )}
            <span>{content}</span>
            {shortcut && <kbd className="ml-1 border border-border-strong px-1 font-mono text-[9px] leading-[14px] text-ink-3">{shortcut}</kbd>}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
