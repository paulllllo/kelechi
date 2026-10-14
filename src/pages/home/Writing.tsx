import { ArrowRightIcon } from 'lucide-react';
import { LogEntryCard } from '@/components/ds';
import { Section } from '@/components/site/Section';
import { RevealGroup, RevealItem } from '@/components/site/Reveal';
import { postsForRole } from '@/data/blog';
import { RoleLink, useRole } from '@/lib/role';

export function Writing() {
  const { role, withRole } = useRole();
  const posts = postsForRole(role, 3);

  return (
    <Section
      id="writing"
      compact
      header={{
        index: 8,
        label: 'Writing',
        title: (
          <>
            Notes from the <span className="serif-accent text-ember">post-mortems.</span>
          </>
        ),
        size: 'sm',
        aside: (
          <RoleLink to="/blog" className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-2 transition-colors hover:text-ember">
            All posts
            <ArrowRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </RoleLink>
        ),
      }}
    >
      <RevealGroup className="grid gap-4 lg:grid-cols-3" staggerChildren={0.1}>
        {posts.map((p) => (
          <RevealItem key={p.slug} className="flex">
            <LogEntryCard
              date={p.date}
              logNumber={p.number}
              title={p.title}
              tags={p.tags}
              status={p.status}
              meta={p.readingTime}
              to={withRole(`/blog/${p.slug}`)}
              className="flex-1"
            />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
