import { useEffect, useRef, useState } from 'react';
import { Badge, Button } from '@/components/ds';
import { cn } from '@/lib/cn';

/**
 * EXP.02 — Backpressure Lab
 * A tiny queueing simulation. Requests arrive at `rate`/s, `workers`
 * each take `serviceMs` to finish. With the queue off, overflow is
 * dropped; with it on, overflow waits and latency rises instead.
 * This is the whole "make the peak boring" argument in one toy.
 */

interface Sample {
  t: number;
  depth: number;
  p95: number;
  dropped: number;
}

const QUEUE_CAP = 400;
const HISTORY = 90;

export function BackpressureLab() {
  const [rate, setRate] = useState(40);
  const [workers, setWorkers] = useState(4);
  const [serviceMs, setServiceMs] = useState(80);
  const [queueOn, setQueueOn] = useState(true);
  const [spike, setSpike] = useState(false);

  const [stats, setStats] = useState({ depth: 0, p95: 0, dropped: 0, served: 0, inFlight: 0 });
  const [history, setHistory] = useState<Sample[]>([]);

  const sim = useRef({ queue: [] as number[], busyUntil: [] as number[], latencies: [] as number[], dropped: 0, served: 0, acc: 0, last: 0 });

  // Reset workers array when count changes
  useEffect(() => {
    sim.current.busyUntil = Array.from({ length: workers }, () => 0);
  }, [workers]);

  useEffect(() => {
    const s = sim.current;
    s.last = performance.now();

    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.1, (now - s.last) / 1000);
      s.last = now;

      // Arrivals (Poisson-ish via accumulator)
      const effRate = spike ? rate * 4 : rate;
      s.acc += effRate * dt;
      while (s.acc >= 1) {
        s.acc -= 1;
        if (s.queue.length < (queueOn ? QUEUE_CAP : 0) || s.busyUntil.some((b) => b <= now)) {
          s.queue.push(now);
        } else {
          s.dropped += 1;
        }
      }

      // Service
      for (let i = 0; i < s.busyUntil.length; i++) {
        if (s.busyUntil[i] <= now && s.queue.length) {
          const arrived = s.queue.shift()!;
          s.busyUntil[i] = now + serviceMs;
          s.latencies.push(now - arrived + serviceMs);
          s.served += 1;
        }
      }
      if (s.latencies.length > 400) s.latencies.splice(0, s.latencies.length - 400);

      // Stats at ~10Hz
      if (Math.floor(now / 100) !== Math.floor((now - dt * 1000) / 100)) {
        const sorted = [...s.latencies].sort((a, b) => a - b);
        const p95 = sorted.length ? sorted[Math.floor(sorted.length * 0.95)] : 0;
        const inFlight = s.busyUntil.filter((b) => b > now).length;
        setStats({ depth: s.queue.length, p95, dropped: s.dropped, served: s.served, inFlight });
        setHistory((h) => [...h.slice(-(HISTORY - 1)), { t: now, depth: s.queue.length, p95, dropped: s.dropped }]);
      }
    };

    // A timer rather than rAF: the sim should keep ticking (and stay honest)
    // even when the tab is throttled or not being painted.
    const id = window.setInterval(tick, 33);
    return () => window.clearInterval(id);
  }, [rate, workers, serviceMs, queueOn, spike]);

  const capacity = (workers * 1000) / serviceMs;
  const effRate = spike ? rate * 4 : rate;
  const utilisation = Math.min(999, Math.round((effRate / capacity) * 100));
  const healthy = utilisation < 85;

  const reset = () => {
    const s = sim.current;
    s.queue = [];
    s.latencies = [];
    s.dropped = 0;
    s.served = 0;
    s.busyUntil = Array.from({ length: workers }, () => 0);
    setHistory([]);
  };

  const maxDepth = Math.max(50, ...history.map((h) => h.depth));
  const maxP95 = Math.max(200, ...history.map((h) => h.p95));

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-3">
        <Slider label="Arrival rate" value={rate} min={5} max={120} step={5} unit="/s" onChange={setRate} />
        <Slider label="Workers" value={workers} min={1} max={16} step={1} onChange={setWorkers} />
        <Slider label="Service time" value={serviceMs} min={20} max={300} step={10} unit="ms" onChange={setServiceMs} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Toggle on={queueOn} onChange={setQueueOn} label="Queue" onLabel="Buffering" offLabel="Dropping" />
        <button
          type="button"
          onPointerDown={() => setSpike(true)}
          onPointerUp={() => setSpike(false)}
          onPointerLeave={() => setSpike(false)}
          className={cn(
            'h-8 select-none border px-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors',
            spike ? 'border-ember bg-ember text-background' : 'border-border-strong text-ink-2 hover:text-ink',
          )}
        >
          Hold for 9am spike (×4)
        </button>
        <Button size="sm" onClick={reset}>
          Reset
        </Button>
        <span className="ml-auto flex items-center gap-2">
          <Badge variant={healthy ? 'phosphor' : utilisation < 100 ? 'gold' : 'ember'} dot>
            {utilisation}% utilised
          </Badge>
        </span>
      </div>

      {/* Visualiser */}
      <div className="grid gap-4 border border-border bg-surface-sunken p-5 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">Queue depth (bars) · p95 latency (line)</p>
          <svg viewBox={`0 0 ${HISTORY} 60`} preserveAspectRatio="none" className="h-40 w-full" aria-label="Queue depth and latency over time">
            {history.map((h, i) => (
              <rect key={h.t} x={i} y={60 - (h.depth / maxDepth) * 60} width={0.9} height={(h.depth / maxDepth) * 60} className={h.depth > QUEUE_CAP * 0.8 ? 'fill-[var(--error)]' : 'fill-[var(--accent-amber)]'} opacity={0.65} />
            ))}
            {history.length > 1 && (
              <polyline
                fill="none"
                strokeWidth={0.6}
                className="stroke-[var(--accent-green)]"
                vectorEffect="non-scaling-stroke"
                points={history.map((h, i) => `${i + 0.45},${60 - (h.p95 / maxP95) * 58}`).join(' ')}
              />
            )}
          </svg>
          {/* Workers */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {Array.from({ length: workers }).map((_, i) => (
              <span key={i} className={cn('h-2.5 w-6 border border-border transition-colors', i < stats.inFlight ? 'bg-phosphor/70' : 'bg-transparent')} aria-hidden="true" />
            ))}
            <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-ink-3">
              {stats.inFlight}/{workers} busy
            </span>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-4 font-mono lg:col-span-4 lg:grid-cols-1">
          <Stat label="Queue depth" value={stats.depth.toString()} warn={stats.depth > QUEUE_CAP * 0.8} />
          <Stat label="p95 latency" value={`${Math.round(stats.p95)}ms`} warn={stats.p95 > 1000} />
          <Stat label="Dropped" value={stats.dropped.toString()} warn={stats.dropped > 0} />
          <Stat label="Served" value={stats.served.toString()} />
        </dl>
      </div>

      <p className="font-sans text-xs leading-relaxed text-ink-3">
        Capacity ≈ workers × 1000 / service time = <span className="text-ink-2">{Math.round(capacity)}/s</span>. Push arrivals past that and watch the difference: with the queue off, requests are dropped and p95 stays flat (users see errors). With it on, nothing is dropped but p95 climbs (users see a slower page). The second failure mode is the one you can live with.
      </p>
    </div>
  );
}

function Slider({ label, value, min, max, step, unit = '', onChange }: { label: string; value: number; min: number; max: number; step: number; unit?: string; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="label-mono flex items-center justify-between">
        <span>{label}</span>
        <span className="tabular-nums text-ink">
          {value}
          {unit}
        </span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-3 w-full accent-[var(--accent-amber)]" aria-label={label} />
    </label>
  );
}

function Toggle({ on, onChange, label, onLabel, offLabel }: { on: boolean; onChange: (v: boolean) => void; label: string; onLabel: string; offLabel: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="inline-flex h-8 items-center gap-3 border border-border-strong px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2 transition-colors hover:text-ink"
    >
      <span>{label}</span>
      <span className={cn('relative h-3.5 w-7 rounded-pill border transition-colors', on ? 'border-phosphor bg-phosphor/20' : 'border-border-strong bg-surface')}>
        <span className={cn('absolute top-[1px] h-2.5 w-2.5 rounded-full transition-all', on ? 'left-[15px] bg-phosphor' : 'left-[1px] bg-ink-3')} />
      </span>
      <span className={on ? 'text-phosphor' : 'text-ember'}>{on ? onLabel : offLabel}</span>
    </button>
  );
}

function Stat({ label, value, warn = false }: { label: string; value: string; warn?: boolean }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.2em] text-ink-3">{label}</dt>
      <dd className={cn('mt-1 font-heading text-2xl font-semibold tabular-nums', warn ? 'text-ember' : 'text-ink')}>{value}</dd>
    </div>
  );
}
