import React from 'react';
import { cn } from '@/lib/cn';

export type MetadataItem = {
  label: string;
  value: React.ReactNode;
  href?: string;
};

export type MetadataListProps = {
  items: MetadataItem[];
  title?: string;
  layout?: 'rows' | 'stacked' | 'grid';
  dense?: boolean;
  className?: string;
};

export function MetadataList({ items, title, layout = 'rows', dense = false, className = '' }: MetadataListProps) {
  const pad = dense ? 'py-2' : 'py-3';

  const renderValue = (item: MetadataItem) =>
    item.href ? (
      <a
        href={item.href}
        target={item.href.startsWith('http') ? '_blank' : undefined}
        rel="noreferrer"
        className="underline decoration-border-strong underline-offset-4 transition-colors hover:text-ember hover:decoration-ember focus:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {item.value}
      </a>
    ) : (
      item.value
    );

  return (
    <section className={cn('w-full font-mono', className)}>
      {title && <h3 className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-3">{title}</h3>}
      {items.length === 0 ? (
        <p className="border-t border-border py-3 text-xs text-ink-3">No details available.</p>
      ) : layout === 'grid' ? (
        <dl className="grid grid-cols-2 gap-x-6 border-t border-border sm:grid-cols-3">
          {items.map((item, i) => (
            <div key={`${item.label}-${i}`} className={cn('border-b border-border', pad)}>
              <dt className="text-[10px] uppercase tracking-[0.1em] text-ink-3">{item.label}</dt>
              <dd className="mt-1 text-sm text-ink">{renderValue(item)}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <dl className="border-t border-border">
          {items.map((item, i) => (
            <div
              key={`${item.label}-${i}`}
              className={cn(
                'border-b border-border',
                pad,
                layout === 'rows' ? 'flex items-baseline justify-between gap-6' : 'flex flex-col gap-1',
              )}
            >
              <dt className="shrink-0 text-[10px] uppercase tracking-[0.1em] text-ink-3">{item.label}</dt>
              <dd className={cn('text-sm text-ink', layout === 'rows' && 'text-right')}>{renderValue(item)}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
