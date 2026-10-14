import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRightIcon, ChevronDownIcon } from 'lucide-react';
import { Badge, StatusDot } from '@/components/ds';
import { Section } from '@/components/site/Section';
import { Reveal } from '@/components/site/Reveal';
import { RoleSwitcher } from '@/components/site/RoleSwitcher';
import { bulletsForRole, durationLabel, EXPERIENCE, formatPeriod, roleTitle, type Experience as Exp } from '@/data/experience';
import { RoleLink, useRole } from '@/lib/role';
import { cn } from '@/lib/cn';
import { EASE_OUT_EXPO } from '@/lib/motion';

export function Experience() {
  const { profile } = useRole();

  return (
    <Section
      id="experience"
      header={{
        index: 4,
        label: 'Experience',
        title: profile.experienceTitle,
        aside: <RoleSwitcher size="sm" />,
      }}
    >
      <ol className="relative">
        {/* Timeline rail */}
        <span aria-hidden="true" className="absolute bottom-0 left-[7px] top-2 hidden w-px bg-gradient-to-b from-ember/70 via-border-strong to-transparent md:block" />
        {EXPERIENCE.map((exp, i) => (
          <ExperienceEntry key={exp.id} exp={exp} index={i} />
        ))}
      </ol>
    </Section>
  );
}

function ExperienceEntry({ exp, index }: { exp: Exp; index: number }) {
  const { role } = useRole();
  const [expanded, setExpanded] = useState(false);
  const bullets = bulletsForRole(exp, role);
  const relevant = bullets.filter((b) => b.relevant);
  const hidden = bullets.filter((b) => !b.relevant);
  const current = exp.end === 'present';

  return (
    <Reveal as="li" className="relative grid gap-6 border-t border-border py-10 md:grid-cols-12 md:gap-10 md:pl-10" delay={index * 0.05}>
      {/* Rail node */}
      <span aria-hidden="true" className="absolute left-0 top-12 hidden md:block">
        {current ? <StatusDot status="active" size="lg" label={null} /> : <span className="block h-3 w-3 rounded-full border border-border-strong bg-background" />}
      </span>

      {/* Meta column */}
      <div className="md:col-span-4 lg:col-span-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">{formatPeriod(exp)}</p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
          {durationLabel(exp)} <span className="text-border-strong">·</span> {exp.location}
          {exp.remote && <span className="text-border-strong"> · Remote</span>}
        </p>
        <h3 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-ink">{exp.company}</h3>
        <p className="mt-1 font-serif text-lg italic text-ink-2">{roleTitle(exp, role)}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <Badge size="sm" variant={current ? 'phosphor' : 'neutral'} dot={current} bracketed={false}>
            {current ? 'Current' : exp.sector}
          </Badge>
          {current && (
            <Badge size="sm" variant="neutral" bracketed={false}>
              {exp.sector}
            </Badge>
          )}
        </div>
      </div>

      {/* Content column */}
      <div className="md:col-span-8 lg:col-span-9">
        <ul className="space-y-5">
          {relevant.map((b) => (
            <BulletRow key={b.text} text={b.text} metric={b.metric} work={b.work} emphasised />
          ))}
          <AnimatePresence initial={false}>
            {expanded &&
              hidden.map((b) => (
                <motion.div
                  key={b.text}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                  className="overflow-hidden"
                >
                  <BulletRow text={b.text} metric={b.metric} work={b.work} />
                </motion.div>
              ))}
          </AnimatePresence>
        </ul>

        {hidden.length > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3 transition-colors hover:text-ink"
          >
            <ChevronDownIcon className={cn('h-3 w-3 transition-transform', expanded && 'rotate-180')} />
            {expanded ? 'Hide' : 'Show'} {hidden.length} less-relevant {hidden.length === 1 ? 'item' : 'items'}
          </button>
        )}
      </div>
    </Reveal>
  );
}

function BulletRow({ text, metric, work, emphasised = false }: { text: string; metric?: string; work?: string; emphasised?: boolean }) {
  const content = (
    <li className={cn('flex gap-4', !emphasised && 'opacity-60')}>
      <span aria-hidden="true" className={cn('mt-[9px] h-px w-4 shrink-0', emphasised ? 'bg-ember' : 'bg-border-strong')} />
      <div className="flex-1">
        <p className={cn('text-sm leading-relaxed', emphasised ? 'text-ink' : 'text-ink-2')}>{text}</p>
        {(metric || work) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em]">
            {metric && <span className={emphasised ? 'text-ember' : 'text-ink-3'}>{metric}</span>}
            {work && (
              <RoleLink to={`/work/${work}`} className="group inline-flex items-center gap-1 text-ink-3 transition-colors hover:text-ember">
                Case study
                <ArrowUpRightIcon className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </RoleLink>
            )}
          </div>
        )}
      </div>
    </li>
  );
  return content;
}
