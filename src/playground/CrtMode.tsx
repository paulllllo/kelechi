import { useEffect, useState } from 'react';
import { Badge } from '@/components/ds';
import { cn } from '@/lib/cn';

/**
 * EXP.04 — CRT mode
 * Cranks the retro: heavier scanlines, chromatic fringe, a slow flicker
 * and a bulge vignette. Applied as a class on <html> so it survives
 * navigation; persisted in localStorage. Respects reduced motion.
 */

const KEY = 'kelechi:crt';

const CSS = `
html.crt body { animation: flicker 7s linear infinite; }
html.crt #root { filter: contrast(1.06) saturate(1.08); }
html.crt::before {
  content: ''; pointer-events: none; position: fixed; inset: 0; z-index: 80;
  background:
    repeating-linear-gradient(to bottom, rgba(0,0,0,0.28) 0 1px, transparent 1px 3px),
    radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%);
  mix-blend-mode: multiply;
}
html.crt::after {
  content: ''; pointer-events: none; position: fixed; inset: 0; z-index: 81;
  background: linear-gradient(90deg, rgba(255,90,54,0.06), transparent 30%, transparent 70%, rgba(45,212,191,0.06));
  mix-blend-mode: screen;
}
html.crt h1, html.crt h2, html.crt .serif-accent {
  text-shadow: 1px 0 rgba(255,90,54,0.35), -1px 0 rgba(45,212,191,0.35);
}
@media (prefers-reduced-motion: reduce) { html.crt body { animation: none; } }
`;

export function useCrt() {
  const [on, setOn] = useState<boolean>(() => typeof window !== 'undefined' && localStorage.getItem(KEY) === '1');
  useEffect(() => {
    document.documentElement.classList.toggle('crt', on);
    localStorage.setItem(KEY, on ? '1' : '0');
  }, [on]);
  return [on, setOn] as const;
}

export function CrtStyles() {
  return <style>{CSS}</style>;
}

export function CrtMode() {
  const [on, setOn] = useCrt();
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          role="switch"
          aria-checked={on}
          onClick={() => setOn(!on)}
          className={cn(
            'group relative flex h-24 w-full items-center justify-between overflow-hidden border px-6 font-mono uppercase tracking-[0.2em] transition-all sm:w-auto sm:min-w-[320px]',
            on ? 'border-ember bg-ember/10 text-ink shadow-[0_0_40px_-8px_rgba(255,90,54,0.6)]' : 'border-border-strong bg-surface text-ink-2 hover:text-ink',
          )}
        >
          <span className="text-left">
            <span className="block text-[10px] text-ink-3">Display</span>
            <span className="block text-lg font-semibold">{on ? 'CRT · ON' : 'LCD · FLAT'}</span>
          </span>
          <span className={cn('relative h-8 w-14 rounded-pill border transition-colors', on ? 'border-ember bg-ember/30' : 'border-border-strong bg-surface-sunken')}>
            <span className={cn('absolute top-[3px] h-6 w-6 rounded-full transition-all', on ? 'left-[27px] bg-ember shadow-[0_0_12px_rgba(255,90,54,0.9)]' : 'left-[3px] bg-ink-3')} />
          </span>
          {on && <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 h-10 animate-scan bg-gradient-to-b from-transparent via-ink/10 to-transparent" />}
        </button>
        <Badge variant={on ? 'ember' : 'neutral'} dot={on}>
          {on ? 'Phosphor burn-in imminent' : 'Safe for work'}
        </Badge>
      </div>
      <p className="font-sans text-xs leading-relaxed text-ink-3">
        Heavier scanlines, a chromatic fringe on headings, a 7-second flicker and a bulge vignette. Persists across pages. Disabled under <code className="font-mono">prefers-reduced-motion</code>. Not recommended for reading long case studies; strongly recommended for feeling like it is 1987.
      </p>
    </div>
  );
}
