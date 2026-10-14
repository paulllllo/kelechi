import React from 'react';
import { cn } from '@/lib/cn';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerTickPosition = 'start' | 'center' | 'end';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Direction of the rule. Defaults to horizontal. */
  orientation?: DividerOrientation;
  /** Show a small coordinate tick mark crossing the rule. */
  tick?: boolean;
  /** Where the tick sits along the rule. */
  tickPosition?: DividerTickPosition;
  /** Optional coordinate label rendered next to the tick (e.g. "01", "N 40.7°"). */
  label?: string;
  /** Rule color. Defaults to the system hairline color. */
  color?: string;
}

const HAIRLINE = 'var(--border)';

export function Divider({
  orientation = 'horizontal',
  tick = false,
  tickPosition = 'start',
  label,
  color = HAIRLINE,
  className = '',
  style,
  ...rest
}: DividerProps) {
  const isHorizontal = orientation === 'horizontal';
  const showTick = tick || Boolean(label);
  const pos = positionValue(tickPosition);

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn('relative shrink-0', isHorizontal ? 'h-px w-full' : 'w-px h-full self-stretch', className)}
      style={{ backgroundColor: color, ...style }}
      {...rest}
    >
      {showTick && (
        <span
          aria-hidden="true"
          className="absolute"
          style={
            isHorizontal
              ? {
                  left: pos.offset,
                  top: '50%',
                  width: 1,
                  height: 9,
                  transform: `translate(${pos.translate}, -50%)`,
                  backgroundColor: 'var(--border-strong)',
                }
              : {
                  top: pos.offset,
                  left: '50%',
                  height: 1,
                  width: 9,
                  transform: `translate(-50%, ${pos.translate})`,
                  backgroundColor: 'var(--border-strong)',
                }
          }
        />
      )}
      {label && (
        <span
          className="absolute whitespace-nowrap font-mono text-[10px] uppercase leading-none tracking-[0.12em] text-ink-3"
          style={
            isHorizontal
              ? {
                  left: pos.offset,
                  top: 8,
                  transform: `translateX(${labelTranslate(tickPosition)})`,
                }
              : {
                  top: pos.offset,
                  left: 8,
                  transform: `translateY(${labelTranslate(tickPosition)})`,
                }
          }
        >
          {label}
        </span>
      )}
    </div>
  );
}

function positionValue(p: DividerTickPosition) {
  if (p === 'center') return { offset: '50%', translate: '-50%' };
  if (p === 'end') return { offset: '100%', translate: '-100%' };
  return { offset: '0%', translate: '0%' };
}

function labelTranslate(p: DividerTickPosition) {
  if (p === 'center') return '-50%';
  if (p === 'end') return '-100%';
  return '0%';
}
