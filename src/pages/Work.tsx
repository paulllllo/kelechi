import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { SegmentedToggle } from '@/components/ds';
import { PageHeader, PageShell } from '@/components/site/PageShell';
import { WorkCard } from '@/components/site/WorkCard';
import { RoleSwitcher } from '@/components/site/RoleSwitcher';
import { PILLARS, type PillarId } from '@/data/skills';
import { WORK, workForRole } from '@/data/work';
import { useRole } from '@/lib/role';
import { EASE_OUT_EXPO } from '@/lib/motion';

type Filter = 'all' | PillarId;

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'backend', label: PILLARS.backend.title.split(' ')[0] },
  { value: 'frontend', label: 'Frontend' },
  { value: 'ai', label: 'AI / LLM' },
];

export default function Work() {
  const { role, profile } = useRole();
  const [params, setParams] = useSearchParams();
  const filter = (params.get('pillar') as Filter | null) ?? 'all';

  const items = useMemo(() => {
    const ordered = workForRole(role, profile.featuredWork);
    return filter === 'all' ? ordered : ordered.filter((w) => w.pillar === filter);
  }, [role, profile.featuredWork, filter]);

  const setFilter = (f: Filter) => {
    const next = new URLSearchParams(params);
    if (f === 'all') next.delete('pillar');
    else next.set('pillar', f);
    setParams(next, { replace: true });
  };

  return (
    <PageShell>
      <PageHeader
        index="01"
        label={`Work · ${WORK.length} case studies`}
        title={
          <>
            Things I have built that <span className="serif-accent text-ember">kept working.</span>
          </>
        }
        description="Every project carries the number it was judged by. Banking clients are abstracted under NDA; the architecture and outcomes are real."
        aside={<RoleSwitcher size="sm" showHint />}
      />

      <div className="container-site mt-12 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
        <SegmentedToggle<Filter> options={FILTERS} value={filter} onChange={setFilter} size="md" aria-label="Filter by discipline" showIcons={false} />
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
          {items.length} {items.length === 1 ? 'project' : 'projects'} · lens: <span className="text-ember">{profile.label}</span>
        </span>
      </div>

      <div className="container-site py-12">
        <motion.div layout className="grid gap-5 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {items.map((w, i) => (
              <motion.div
                key={w.slug}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: EASE_OUT_EXPO, delay: i * 0.04 }}
                className={i === 0 && filter === 'all' ? 'md:col-span-2' : ''}
              >
                <WorkCard work={w} featured={i === 0 && filter === 'all'} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </PageShell>
  );
}
