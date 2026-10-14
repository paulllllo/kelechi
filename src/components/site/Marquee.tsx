import React from 'react';
import { cn } from '@/lib/cn';

interface MarqueeProps {
  items: React.ReactNode[];
  /** Seconds per loop */
  duration?: number;
  className?: string;
  separator?: React.ReactNode;
  reverse?: boolean;
}

/** Infinite horizontal ticker. Content is duplicated for a seamless loop. */
export function Marquee({ items, duration = 40, className, separator = <span className="text-ember">◆</span>, reverse = false }: MarqueeProps) {
  const row = (
    <>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <span className="shrink-0">{item}</span>
          <span aria-hidden="true" className="mx-6 shrink-0 text-[8px]">
            {separator}
          </span>
        </React.Fragment>
      ))}
    </>
  );
  return (
    <div className={cn('mask-fade-x relative flex w-full overflow-hidden', className)}>
      <div
        className="flex w-max shrink-0 items-center whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em] text-ink-2 [animation:marquee_linear_infinite] motion-reduce:animate-none"
        style={{ animationDuration: `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {row}
        {row}
      </div>
    </div>
  );
}
