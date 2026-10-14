import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { Navigate, useParams } from 'react-router-dom';
import { Badge, Divider, LogEntryCard, PullQuote } from '@/components/ds';
import { formatLogDate, formatLogId } from '@/components/ds/LogEntryCard';
import { PageShell } from '@/components/site/PageShell';
import { Reveal } from '@/components/site/Reveal';
import { POSTS, POSTS_BY_SLUG } from '@/data/blog';
import { RoleLink, useRole } from '@/lib/role';

export default function BlogPost() {
  const { slug = '' } = useParams();
  const { withRole } = useRole();
  const post = POSTS_BY_SLUG[slug];
  if (!post) return <Navigate to={withRole('/404')} replace />;

  const idx = POSTS.findIndex((p) => p.slug === slug);
  const next = POSTS[(idx + 1) % POSTS.length];
  const prev = POSTS[(idx - 1 + POSTS.length) % POSTS.length];

  return (
    <PageShell>
      <article className="container-site pt-12 md:pt-16">
        <RoleLink to="/blog" className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3 transition-colors hover:text-ink">
          <ArrowLeftIcon className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
          All posts
        </RoleLink>

        <Reveal className="mx-auto mt-10 max-w-3xl">
          <p className="label-mono flex flex-wrap items-center gap-3">
            <time dateTime={post.date}>{formatLogDate(post.date)}</time>
            <span className="text-border-strong">//</span>
            <span className="text-ink-2">{formatLogId('LOG', post.number)}</span>
            <span className="text-border-strong">//</span>
            <span>{post.readingTime} read</span>
          </p>
          <h1 className="mt-6 font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-ink text-balance md:text-5xl">{post.title}</h1>
          <p className="mt-6 font-serif text-xl italic leading-relaxed text-ink-2 md:text-2xl">{post.summary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <Badge key={t} size="sm" variant="neutral">
                {t}
              </Badge>
            ))}
            <Badge size="sm" variant={post.status === 'shipped' ? 'phosphor' : 'gold'} dot>
              {post.status}
            </Badge>
          </div>
        </Reveal>

        <Divider className="mx-auto mt-12 max-w-3xl" tick tickPosition="center" />

        <Reveal className="prose-site mx-auto mt-12 max-w-3xl space-y-6 text-lg leading-relaxed text-ink">
          {post.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <PullQuote size="md" bordered className="my-10">
            This entry is a placeholder. Swap the body in <code className="font-mono text-base text-ember">src/data/blog.ts</code> or wire an MDX loader.
          </PullQuote>
          <p className="text-ink-2">
            Want the real version sooner? <RoleLink to="/contact" className="text-ember underline underline-offset-4">Tell me</RoleLink> which post you came for.
          </p>
        </Reveal>

        <nav aria-label="Post navigation" className="mx-auto mt-20 grid max-w-5xl gap-4 border-t border-border pt-10 md:grid-cols-2">
          <LogEntryCard compact date={prev.date} logNumber={prev.number} title={prev.title} tags={prev.tags} to={withRole(`/blog/${prev.slug}`)} meta={<span className="inline-flex items-center gap-1"><ArrowLeftIcon className="h-3 w-3" /> Prev</span>} />
          <LogEntryCard compact date={next.date} logNumber={next.number} title={next.title} tags={next.tags} to={withRole(`/blog/${next.slug}`)} meta={<span className="inline-flex items-center gap-1">Next <ArrowRightIcon className="h-3 w-3" /></span>} />
        </nav>
      </article>
    </PageShell>
  );
}
