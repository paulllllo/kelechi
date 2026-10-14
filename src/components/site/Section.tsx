import React from 'react';
import { cn } from '@/lib/cn';
import { SectionHeader, type SectionHeaderProps } from '@/components/ds';
import { Reveal } from './Reveal';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  /** Pass SectionHeader props to render a numbered header */
  header?: Omit<SectionHeaderProps, 'className'>;
  /** Tighter vertical rhythm */
  compact?: boolean;
  /** Edge-to-edge (skip container) */
  bleed?: boolean;
  children: React.ReactNode;
}

/** Page section with consistent vertical rhythm and an optional numbered header. */
export function Section({ id, header, compact = false, bleed = false, className, children, ...rest }: SectionProps) {
  return (
    <section id={id} className={cn('relative', compact ? 'py-16 md:py-20' : 'py-20 md:py-28', className)} {...rest}>
      <div className={cn(!bleed && 'container-site')}>
        {header && (
          <Reveal className="mb-12 md:mb-16">
            <SectionHeader rule {...header} />
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
