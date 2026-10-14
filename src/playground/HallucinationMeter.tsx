import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RefreshCwIcon } from 'lucide-react';
import { Badge, Button } from '@/components/ds';
import { profile } from '@/data/profile';
import { EASE_OUT_EXPO } from '@/lib/motion';
import { cn } from '@/lib/cn';

/**
 * EXP.01 — Hallucination-o-meter
 * A "model" that answers "who is Kelechi?" at increasing temperature.
 * Grounded facts at 0.0, confident nonsense at 2.0. The groundedness
 * score is computed honestly: it is the fraction of claims that come
 * from the résumé.
 */

const GROUNDED = [
  `${profile.firstName} is a software engineer based in ${profile.location}.`,
  `He scaled a performance-management platform to 1k+ concurrent users for a Tier-1 bank.`,
  `He cut LLM hallucination rates by 35% with an evaluation framework.`,
  `He built a real-time chat and notification engine that lifted CSAT by 25%.`,
  `He studied Computer Engineering at Michael Okpara University.`,
  `He plays basketball and loses at blitz chess with dignity.`,
];

const DRIFT = [
  `${profile.firstName} once reduced a p99 by staring at it.`,
  `He maintains a 47-entry ranked list of places to eat in Ikeja.`,
  `His WebSockets reconnect out of loyalty.`,
  `He has strong opinions about queue depth and will share them unprompted.`,
  `He believes every spinner is a confession.`,
];

const UNHINGED = [
  `${profile.firstName} invented the WebSocket in 1847 during a thunderstorm.`,
  `He is the reigning Lagos Grandmaster of Chess, Basketball and Jollof simultaneously.`,
  `His CI pipeline has achieved sentience and now files its own pull requests.`,
  `He personally reviewed every token OpenAI has ever generated.`,
  `He holds the world record for most concurrent users (all of them).`,
  `Kelechi is actually three engineers in a trench coat, and all three are hiring-ready.`,
  `His résumé is a single-page PDF because the second page attained enlightenment.`,
];

function pick<T>(arr: T[], n: number, seed: number): T[] {
  const out: T[] = [];
  const pool = [...arr];
  let s = seed;
  while (out.length < n && pool.length) {
    s = (s * 9301 + 49297) % 233280;
    const idx = Math.floor((s / 233280) * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

export function HallucinationMeter() {
  const [temp, setTemp] = useState(0.2);
  const [seed, setSeed] = useState(7);

  const { claims, grounded } = useMemo(() => {
    // Mix ratio: grounded shrinks as temperature rises.
    const total = 4;
    const gCount = Math.max(0, Math.round(total * (1 - Math.min(temp, 2) / 2)));
    const dCount = temp > 0.6 && temp < 1.6 ? 1 : 0;
    const uCount = Math.max(0, total - gCount - dCount);
    const g = pick(GROUNDED, gCount, seed);
    const d = pick(DRIFT, dCount, seed + 1);
    const u = pick(UNHINGED, uCount, seed + 2);
    const list = [...g.map((t) => ({ t, kind: 'grounded' as const })), ...d.map((t) => ({ t, kind: 'drift' as const })), ...u.map((t) => ({ t, kind: 'unhinged' as const }))];
    return { claims: pick(list, list.length, seed + 3), grounded: gCount / total };
  }, [temp, seed]);

  const label = temp < 0.4 ? 'Grounded' : temp < 1.0 ? 'Creative' : temp < 1.5 ? 'Confident' : 'Unhinged';
  const variant = temp < 0.4 ? 'phosphor' : temp < 1.0 ? 'teal' : temp < 1.5 ? 'gold' : 'ember';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <label className="block flex-1">
          <span className="label-mono flex items-center justify-between">
            <span>Temperature</span>
            <span className="tabular-nums text-ink">{temp.toFixed(2)}</span>
          </span>
          <input
            type="range"
            min={0}
            max={2}
            step={0.05}
            value={temp}
            onChange={(e) => setTemp(Number(e.target.value))}
            className="mt-3 w-full accent-[var(--accent-amber)]"
            aria-label="Temperature"
          />
          <div className="mt-1 flex justify-between font-mono text-[9px] uppercase tracking-wider text-ink-3">
            <span>0.0 · résumé</span>
            <span>1.0 · vibes</span>
            <span>2.0 · lore</span>
          </div>
        </label>
        <div className="flex items-center gap-3">
          <Badge variant={variant} dot>
            {label}
          </Badge>
          <Button size="sm" leadingIcon={<RefreshCwIcon />} onClick={() => setSeed((s) => s + 11)}>
            Re-sample
          </Button>
        </div>
      </div>

      <div className="border border-border bg-surface-sunken p-5 font-mono text-sm">
        <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-ink-3">
          <span className="text-phosphor">user</span> › who is {profile.firstName}?
        </p>
        <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-ink-3">
          <span className="text-ember">model</span> › temperature={temp.toFixed(2)}
        </p>
        <AnimatePresence mode="popLayout">
          <ul className="space-y-2">
            {claims.map((c, i) => (
              <motion.li
                key={c.t}
                layout
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE_OUT_EXPO, delay: i * 0.05 }}
                className={cn('flex gap-3 leading-relaxed', c.kind === 'grounded' ? 'text-ink' : c.kind === 'drift' ? 'text-gold' : 'text-ember')}
              >
                <span aria-hidden="true" className="shrink-0 text-ink-3">
                  {c.kind === 'grounded' ? '✓' : c.kind === 'drift' ? '~' : '✗'}
                </span>
                <span>{c.t}</span>
              </motion.li>
            ))}
          </ul>
        </AnimatePresence>
      </div>

      <div>
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">
          <span>Groundedness</span>
          <span className={cn('tabular-nums', grounded >= 0.75 ? 'text-phosphor' : grounded >= 0.5 ? 'text-gold' : 'text-ember')}>{Math.round(grounded * 100)}%</span>
        </div>
        <div className="mt-2 h-1 w-full bg-border">
          <motion.div className={cn('h-1', grounded >= 0.75 ? 'bg-phosphor' : grounded >= 0.5 ? 'bg-gold' : 'bg-ember')} animate={{ width: `${grounded * 100}%` }} transition={{ duration: 0.5, ease: EASE_OUT_EXPO }} />
        </div>
        <p className="mt-3 font-sans text-xs leading-relaxed text-ink-3">
          Groundedness = supported claims ÷ total claims. In production this score gated every prompt change. Here it gates nothing, which is why the model gets to invent the WebSocket.
        </p>
      </div>
    </div>
  );
}
