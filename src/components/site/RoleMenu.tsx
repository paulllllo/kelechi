import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon } from 'lucide-react';
import { ROLE_OPTIONS } from '@/data/roles';
import { useRole } from '@/lib/role';
import { cn } from '@/lib/cn';

/**
 * Compact dropdown version of the lens switcher for the sticky header.
 * The full segmented control lives in the Experience section and the mobile menu.
 */
export function RoleMenu({ className }: { className?: string }) {
  const { role, setRole, profile } = useRole();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Portfolio lens: ${profile.label}`}
        className={cn(
          'group inline-flex h-8 items-center gap-2 border px-2.5 font-mono text-[10px] uppercase tracking-wider transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          open ? 'border-border-strong bg-surface text-ink' : 'border-border text-ink-2 hover:border-border-strong hover:text-ink',
        )}
      >
        <span className="text-ink-3">lens</span>
        <span className="text-ember">◆</span>
        <span className="whitespace-nowrap">{profile.label}</span>
        <ChevronDownIcon className={cn('h-3 w-3 text-ink-3 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Portfolio lens"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 min-w-[180px] border border-border bg-surface p-1 shadow-lg"
          >
            {ROLE_OPTIONS.map((opt) => {
              const active = opt.value === role;
              return (
                <li key={opt.value} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => {
                      setRole(opt.value);
                      setOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between gap-4 px-2.5 py-2 text-left font-mono text-[10px] uppercase tracking-wider transition-colors',
                      active ? 'bg-surface-raised text-ink' : 'text-ink-2 hover:bg-surface-raised hover:text-ink',
                    )}
                  >
                    <span>{opt.label}</span>
                    <span className={cn('text-ember transition-opacity', active ? 'opacity-100' : 'opacity-0')}>◆</span>
                  </button>
                </li>
              );
            })}
            <li className="mt-1 border-t border-border px-2.5 pb-1 pt-2 font-mono text-[9px] text-ink-3">
              shareable via <span className="text-ink-2">?type=</span>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
