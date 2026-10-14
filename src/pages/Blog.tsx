import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchIcon } from 'lucide-react';
import { Badge, Input, LogEntryCard } from '@/components/ds';
import { PageHeader, PageShell } from '@/components/site/PageShell';
import { POSTS, postsForRole } from '@/data/blog';
import { useRole } from '@/lib/role';
import { EASE_OUT_EXPO } from '@/lib/motion';
import { cn } from '@/lib/cn';

export default function Blog() {
  const { role, withRole } = useRole();
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState<string | null>(null);

  const tags = useMemo(() => Array.from(new Set(POSTS.flatMap((p) => p.tags))).sort(), []);

  const posts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return postsForRole(role).filter((p) => {
      const matchesTag = !tag || p.tags.includes(tag);
      const matchesQuery = !q || p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q));
      return matchesTag && matchesQuery;
    });
  }, [role, query, tag]);

  return (
    <PageShell>
      <PageHeader
        index="04"
        label={`Blog · ${POSTS.length} entries`}
        title={
          <>
            Longer notes, <span className="serif-accent text-ember">fewer bullet points.</span>
          </>
        }
        description="Post-mortems, patterns and the occasional strong opinion. Placeholder content for now — the index is wired, the words are coming."
      />

      <div className="container-site mt-12 flex flex-col gap-5 border-y border-border py-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTag(null)}
            className={cn('rounded-sm border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors', !tag ? 'border-ember bg-ember/10 text-ink' : 'border-border text-ink-3 hover:text-ink')}
          >
            All
          </button>
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTag(tag === t ? null : t)}
              className={cn('rounded-sm border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors', tag === t ? 'border-ember bg-ember/10 text-ink' : 'border-border text-ink-3 hover:text-ink')}
            >
              #{t}
            </button>
          ))}
        </div>
        <Input
          size="sm"
          placeholder="grep posts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leadingIcon={<SearchIcon size={14} />}
          containerClassName="md:w-64"
          aria-label="Search posts"
        />
      </div>

      <div className="container-site py-12">
        <motion.div layout className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {posts.map((p, i) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE_OUT_EXPO, delay: i * 0.03 }}
              >
                <LogEntryCard
                  date={p.date}
                  logNumber={p.number}
                  title={p.title}
                  summary={p.summary}
                  tags={p.tags}
                  status={p.status}
                  meta={p.readingTime}
                  to={withRole(`/blog/${p.slug}`)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          {posts.length === 0 && (
            <div className="border border-dashed border-border p-10 text-center font-mono text-xs uppercase tracking-wider text-ink-3">
              No entries match. <Badge variant="ember" size="sm">404</Badge>
            </div>
          )}
        </motion.div>
      </div>
    </PageShell>
  );
}
