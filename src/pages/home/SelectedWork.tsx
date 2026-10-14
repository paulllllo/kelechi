import { ArrowRightIcon } from 'lucide-react';
import { Section } from '@/components/site/Section';
import { RevealGroup, RevealItem } from '@/components/site/Reveal';
import { WorkCard } from '@/components/site/WorkCard';
import { workForRole } from '@/data/work';
import { RoleLink, useRole } from '@/lib/role';

export function SelectedWork() {
  const { role, profile } = useRole();
  const [lead, ...rest] = workForRole(role, profile.featuredWork).slice(0, 4);

  return (
    <Section
      id="work"
      header={{
        index: 3,
        label: 'Selected work',
        title: (
          <>
            Shipped, measured, <span className="serif-accent text-ember">still running.</span>
          </>
        ),
        aside: (
          <RoleLink to="/work" className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-2 transition-colors hover:text-ember">
            All projects
            <ArrowRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </RoleLink>
        ),
      }}
    >
      <RevealGroup className="grid gap-8 lg:grid-cols-3" staggerChildren={0.1}>
        <RevealItem className="lg:col-span-2">
          <WorkCard work={lead} featured />
        </RevealItem>
        <RevealItem className="grid gap-8">
          {rest.slice(0, 1).map((w) => (
            <WorkCard key={w.slug} work={w} />
          ))}
        </RevealItem>
        {rest.slice(1).map((w) => (
          <RevealItem key={w.slug}>
            <WorkCard work={w} />
          </RevealItem>
        ))}
        <RevealItem className="flex">
          <RoleLink
            to="/work"
            className="group flex flex-1 flex-col items-start justify-between border border-dashed border-border-strong p-6 transition-colors hover:border-ember hover:bg-ember/[0.04]"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3">PRJ.0{rest.length + 2}+</span>
            <div>
              <p className="font-heading text-xl font-semibold text-ink">Four more case studies</p>
            </div>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-2 group-hover:text-ember">
              Browse all
              <ArrowRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </span>
          </RoleLink>
        </RevealItem>
      </RevealGroup>
    </Section>
  );
}
