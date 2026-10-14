import { ArrowUpRightIcon, LockIcon } from 'lucide-react';
import { Badge, CornerFramePanel } from '@/components/ds';
import type { CaseStudy } from '@/data/work';
import { RoleLink } from '@/lib/role';
import { cn } from '@/lib/cn';

interface WorkCardProps {
  work: CaseStudy;
  /** Larger, 2-column layout for the lead card */
  featured?: boolean;
  className?: string;
}

export function WorkCard({ work, featured = false, className }: WorkCardProps) {
  return (
    <CornerFramePanel
      as={RoleLink}
      to={`/work/${work.slug}`}
      interactive
      padding="none"
      tone={featured ? 'ember' : 'default'}
      className={cn('h-full', className)}
      crosshairs={featured}
    >
      <article className={cn('flex h-full flex-col', featured ? 'p-7 md:p-9' : 'p-6')}>
        <header className="flex items-start justify-between gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">
            {work.index} <span className="text-border-strong">//</span> {work.sector}
          </span>
          <span className="flex items-center gap-2">
            {work.confidential && (
              <span title="Client details abstracted" className="text-ink-3">
                <LockIcon className="h-3 w-3" aria-label="Confidential client" />
              </span>
            )}
            <ArrowUpRightIcon className="h-4 w-4 text-ink-3 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember" />
          </span>
        </header>

        <h3 className={cn('mt-5 font-heading font-semibold leading-tight tracking-tight text-ink transition-colors group-hover:text-ember', featured ? 'text-3xl md:text-4xl' : 'text-xl')}>
          {work.title}
        </h3>
        <p className={cn('mt-2 font-serif italic text-ink-2', featured ? 'text-xl' : 'text-base')}>{work.hook}</p>

        <div className={cn('mt-auto flex flex-wrap items-end justify-between gap-6', featured ? 'pt-10' : 'pt-8')}>
          <div className="flex flex-wrap gap-1.5">
            {work.tags.slice(0, featured ? 4 : 3).map((t) => (
              <Badge key={t} size="sm" variant="neutral" bracketed={false}>
                {t}
              </Badge>
            ))}
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className={cn('font-heading font-semibold tabular-nums text-ink', featured ? 'text-3xl' : 'text-xl')}>{work.metrics[0].value}</span>
            <span className="text-[10px] uppercase tracking-[0.16em] text-ink-3">{work.metrics[0].label}</span>
          </div>
        </div>

        <footer className="mt-5 flex items-center justify-between border-t border-dashed border-border pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
          <span>{work.client}</span>
          <span>{work.period}</span>
        </footer>
      </article>
    </CornerFramePanel>
  );
}
