import React, { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

export type MetricStatSize = 'sm' | 'md' | 'lg';
export type MetricStatAlign = 'left' | 'center';
export type MetricStatTrend = 'up' | 'down' | 'neutral';

export interface MetricStatProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix'> {
  /** The headline figure, e.g. "98" or 98. Numbers count up when scrolled into view. */
  value: React.ReactNode;
  /** Unit shown next to the value, e.g. "%", "ms", "x" */
  unit?: React.ReactNode;
  /** Optional prefix before the value, e.g. "$" or "+" */
  prefix?: React.ReactNode;
  /** Short label describing the metric */
  label: React.ReactNode;
  /** Optional supporting caption below the label */
  caption?: React.ReactNode;
  /** Optional delta text, e.g. "+12% vs last quarter" */
  delta?: React.ReactNode;
  /** Direction of the delta, controls its color */
  trend?: MetricStatTrend;
  size?: MetricStatSize;
  align?: MetricStatAlign;
  /** Adds a top divider rule, useful in stat rows */
  divider?: boolean;
  /** Count-up animation for numeric values (default true) */
  animate?: boolean;
}

const valueSizes: Record<MetricStatSize, string> = {
  sm: 'text-3xl',
  md: 'text-5xl',
  lg: 'text-6xl md:text-7xl',
};

const unitSizes: Record<MetricStatSize, string> = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl md:text-4xl',
};

const labelSizes: Record<MetricStatSize, string> = {
  sm: 'text-[11px]',
  md: 'text-xs',
  lg: 'text-sm',
};

const trendColors: Record<MetricStatTrend, string> = {
  up: 'text-phosphor',
  down: 'text-error',
  neutral: 'text-ink-3',
};

const trendSymbols: Record<MetricStatTrend, string> = {
  up: '↑',
  down: '↓',
  neutral: '→',
};

export function MetricStat({
  value,
  unit,
  prefix,
  label,
  caption,
  delta,
  trend = 'neutral',
  size = 'md',
  align = 'left',
  divider = false,
  animate = true,
  className = '',
  ...rest
}: MetricStatProps) {
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-left';
  const numeric = typeof value === 'number' ? value : typeof value === 'string' && /^\d+(\.\d+)?$/.test(value) ? Number(value) : null;

  return (
    <div className={cn('flex flex-col gap-2', alignClass, divider && 'border-t border-border pt-5', className)} {...rest}>
      <p className={cn('flex items-baseline font-heading font-semibold leading-none tracking-tight text-ink tabular-nums', valueSizes[size])}>
        {prefix != null && <span className={cn('mr-0.5 font-medium text-ember', unitSizes[size])}>{prefix}</span>}
        <span>{numeric !== null && animate ? <CountUp to={numeric} /> : value}</span>
        {unit != null && <span className={cn('ml-1 font-medium text-ember', unitSizes[size])}>{unit}</span>}
      </p>
      <div className={cn('flex flex-col gap-1', alignClass)}>
        <p className={cn('font-mono font-medium uppercase tracking-[0.16em] text-ink-2', labelSizes[size])}>{label}</p>
        {caption != null && <p className="max-w-xs text-sm leading-relaxed text-ink-3">{caption}</p>}
        {delta != null && (
          <p className={cn('font-mono text-xs font-medium', trendColors[trend])}>
            <span aria-hidden="true" className="mr-1">
              {trendSymbols[trend]}
            </span>
            <span className="sr-only">{trend === 'up' ? 'Increased: ' : trend === 'down' ? 'Decreased: ' : 'Change: '}</span>
            {delta}
          </p>
        )}
      </div>
    </div>
  );
}

function CountUp({ to, duration = 1.4 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? to : 0);
  const decimals = String(to).includes('.') ? String(to).split('.')[1].length : 0;

  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(Number((to * eased).toFixed(decimals)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, decimals, reduce]);

  return <span ref={ref}>{display.toFixed(decimals)}</span>;
}
