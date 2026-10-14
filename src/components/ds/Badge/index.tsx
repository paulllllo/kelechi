import React from 'react';
import { cn } from '@/lib/cn';

export type BadgeVariant = 'ember' | 'teal' | 'phosphor' | 'gold' | 'neutral';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color treatment of the badge */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: BadgeSize;
  /** Show square brackets around the label */
  bracketed?: boolean;
  /** Show a small leading status dot */
  dot?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, { root: string; bracket: string; dot: string }> = {
  ember: {
    root: 'text-ember bg-ember/10 border-ember/30',
    bracket: 'text-ember/60',
    dot: 'bg-ember',
  },
  teal: {
    root: 'text-teal bg-teal/10 border-teal/30',
    bracket: 'text-teal/60',
    dot: 'bg-teal',
  },
  phosphor: {
    root: 'text-phosphor bg-phosphor/10 border-phosphor/30',
    bracket: 'text-phosphor/60',
    dot: 'bg-phosphor',
  },
  gold: {
    root: 'text-gold bg-gold/10 border-gold/30',
    bracket: 'text-gold/60',
    dot: 'bg-gold',
  },
  neutral: {
    root: 'text-ink-2 bg-surface-raised border-border',
    bracket: 'text-ink-3',
    dot: 'bg-ink-3',
  },
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-[10px] px-1.5 py-0.5 gap-1',
  md: 'text-xs px-2 py-1 gap-1.5',
};

export function Badge({
  variant = 'neutral',
  size = 'md',
  bracketed = true,
  dot = false,
  className = '',
  children,
  ...rest
}: BadgeProps) {
  const styles = variantClasses[variant];
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-sm border font-mono font-medium uppercase leading-none tracking-wider',
        styles.root,
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {dot && <span aria-hidden="true" className={cn('h-1.5 w-1.5 shrink-0 rounded-full', styles.dot)} />}
      <span className="inline-flex items-center">
        {bracketed && (
          <span aria-hidden="true" className={styles.bracket}>
            [
          </span>
        )}
        <span>{children}</span>
        {bracketed && (
          <span aria-hidden="true" className={styles.bracket}>
            ]
          </span>
        )}
      </span>
    </span>
  );
}
