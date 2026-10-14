import React from 'react';
import { cn } from '@/lib/cn';

export type SectionHeaderSize = 'sm' | 'md' | 'lg';
export type SectionHeaderAlign = 'left' | 'center';

export interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Section index, e.g. 1 or "01". Numbers are zero-padded to 2 digits. */
  index: number | string;
  /** Section label, e.g. "Architecture". Rendered uppercase. */
  label: string;
  /** Optional large title rendered below the label row. */
  title?: React.ReactNode;
  /** Optional supporting description below the title. */
  description?: React.ReactNode;
  /** Separator between index and label. Defaults to "//". */
  separator?: string;
  /** Show a hairline rule extending to the right of the label. */
  rule?: boolean;
  /** Optional right-aligned slot on the label row (e.g. a toggle or link). */
  aside?: React.ReactNode;
  size?: SectionHeaderSize;
  align?: SectionHeaderAlign;
  /** Heading level used for the title (or label when no title). */
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}

const labelSize: Record<SectionHeaderSize, string> = {
  sm: 'text-[11px] tracking-[0.18em]',
  md: 'text-xs tracking-[0.2em]',
  lg: 'text-sm tracking-[0.22em]',
};

const titleSize: Record<SectionHeaderSize, string> = {
  sm: 'text-xl md:text-2xl',
  md: 'text-3xl md:text-4xl',
  lg: 'text-4xl md:text-5xl lg:text-6xl',
};

export function SectionHeader({
  index,
  label,
  title,
  description,
  separator = '//',
  rule = false,
  aside,
  size = 'md',
  align = 'left',
  as = 'h2',
  className = '',
  ...rest
}: SectionHeaderProps) {
  const Heading = as;
  const formattedIndex = formatIndex(index);
  const centered = align === 'center';

  const labelRow = (
    <span className={cn('inline-flex items-center gap-3 uppercase', labelSize[size])}>
      <span className="font-mono tabular-nums text-ember">{formattedIndex}</span>
      <span aria-hidden="true" className="font-mono text-ink-3">
        {separator}
      </span>
      <span className="font-mono font-medium text-ink-2">{label}</span>
    </span>
  );

  return (
    <div className={cn('flex w-full flex-col gap-5', centered ? 'items-center text-center' : 'items-start text-left', className)} {...rest}>
      <div className={cn('flex w-full items-center gap-4', centered && 'justify-center')}>
        {title ? (
          <span>
            <span className="sr-only">{`Section ${formattedIndex}: `}</span>
            {labelRow}
          </span>
        ) : (
          <Heading className="m-0" aria-label={`${formattedIndex} ${label}`}>
            {labelRow}
          </Heading>
        )}
        {rule && !centered && <span aria-hidden="true" className="h-px flex-1 bg-border" />}
        {aside && !centered && <span className="ml-auto shrink-0">{aside}</span>}
      </div>

      {title && (
        <Heading className={cn('m-0 max-w-3xl font-heading font-semibold leading-[1.05] tracking-tight text-ink text-balance', titleSize[size])}>
          {title}
        </Heading>
      )}

      {description && <p className="m-0 max-w-2xl text-base leading-relaxed text-ink-2 md:text-lg">{description}</p>}
    </div>
  );
}

export function formatIndex(index: number | string): string {
  if (typeof index === 'number') return String(index).padStart(2, '0');
  return index;
}
