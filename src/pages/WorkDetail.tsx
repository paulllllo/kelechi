import { ArrowLeftIcon, ArrowRightIcon, LockIcon } from 'lucide-react';
import { Navigate, useParams } from 'react-router-dom';
import { Badge, BracketButton, CodeBlock, Divider, MetadataList, MetricStat, PullQuote, TopologyDiagram, TopologyNode, TopologySignal } from '@/components/ds';
import { PageShell } from '@/components/site/PageShell';
import { Reveal, RevealGroup, RevealItem } from '@/components/site/Reveal';
import { WorkCard } from '@/components/site/WorkCard';
import { WORK, WORK_BY_SLUG, type CaseStudy } from '@/data/work';
import { PILLARS } from '@/data/skills';
import { RoleLink, useRole } from '@/lib/role';

export default function WorkDetail() {
  const { slug = '' } = useParams();
  const { withRole } = useRole();
  const work = WORK_BY_SLUG[slug];
  if (!work) return <Navigate to={withRole('/404')} replace />;

  const idx = WORK.findIndex((w) => w.slug === slug);
  const prev = WORK[(idx - 1 + WORK.length) % WORK.length];
  const next = WORK[(idx + 1) % WORK.length];
  const related = WORK.filter((w) => w.slug !== slug && w.pillar === work.pillar).slice(0, 2);

  return (
    <PageShell>
      <article>
        {/* Header */}
        <div className="container-site pt-12 md:pt-16">
          <RoleLink to="/work" className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3 transition-colors hover:text-ink">
            <ArrowLeftIcon className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
            All work
          </RoleLink>

          <Reveal className="mt-10 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="label-mono mb-5 flex items-center gap-3">
                <span className="text-ember">{work.index}</span>
                <span className="text-ink-3">//</span>
                <span>{PILLARS[work.pillar].title}</span>
                {work.confidential && (
                  <span className="inline-flex items-center gap-1 text-ink-3">
                    <LockIcon className="h-3 w-3" /> NDA
                  </span>
                )}
              </p>
              <h1 className="font-heading text-4xl font-semibold leading-[1.02] tracking-tight text-ink text-balance md:text-6xl">{work.title}</h1>
              <p className="mt-5 font-serif text-2xl italic text-ink-2 md:text-3xl">{work.hook}</p>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-2">{work.summary}</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {work.tags.map((t) => (
                  <Badge key={t} variant="neutral" size="sm">
                    {t}
                  </Badge>
                ))}
                <Badge variant={work.status === 'shipped' ? 'phosphor' : 'gold'} size="sm" dot>
                  {work.status === 'shipped' ? 'Shipped' : 'In progress'}
                </Badge>
              </div>
            </div>
            <aside className="lg:col-span-4">
              <MetadataList
                title="Spec"
                layout="rows"
                dense
                items={[
                  { label: 'Client', value: work.client },
                  { label: 'Via', value: work.employer },
                  { label: 'Period', value: work.period },
                  { label: 'Sector', value: work.sector },
                  { label: 'Stack', value: work.stack.join(' · ') },
                ]}
              />
            </aside>
          </Reveal>
        </div>

        {/* Metrics */}
        <div className="container-site mt-16">
          <RevealGroup className="grid grid-cols-2 gap-8 border-y border-border py-10 md:grid-cols-3" staggerChildren={0.1}>
            {work.metrics.map((m) => (
              <RevealItem key={m.label}>
                <MetricStat value={m.value} label={m.label} size="md" animate={false} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* Body */}
        <div className="container-site mt-20 grid gap-16 lg:grid-cols-12">
          <div className="space-y-16 lg:col-span-7">
            <Block index="01" label="Problem">
              <p className="text-lg leading-relaxed text-ink">{work.problem}</p>
            </Block>
            <Block index="02" label="Approach">
              <ol className="space-y-5">
                {work.approach.map((step, i) => (
                  <li key={i} className="flex gap-5">
                    <span className="mt-1 font-mono text-xs tabular-nums text-ember">{String(i + 1).padStart(2, '0')}</span>
                    <p className="text-base leading-relaxed text-ink">{step}</p>
                  </li>
                ))}
              </ol>
            </Block>
            <Block index="03" label="Outcome">
              <p className="text-lg leading-relaxed text-ink">{work.outcome}</p>
            </Block>
            {work.quote && <PullQuote bordered size="md" className="my-0">{work.quote}</PullQuote>}
          </div>

          <div className="space-y-10 lg:col-span-5">
            {work.topology && (
              <Reveal>
                <Topology kind={work.topology} />
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">Fig. {work.index} — simplified system shape</p>
              </Reveal>
            )}
            {work.snippet && (
              <Reveal delay={0.1}>
                <CodeBlock code={work.snippet.code} language={work.snippet.language} filename={work.snippet.filename} caption={work.snippet.caption} />
              </Reveal>
            )}
          </div>
        </div>

        {/* Related + nav */}
        <div className="container-site mt-24">
          <Divider tick label="Related" />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {related.map((w) => (
              <WorkCard key={w.slug} work={w} />
            ))}
          </div>

          <nav aria-label="Case study navigation" className="mt-16 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
            <RoleLink to={`/work/${prev.slug}`} className="group inline-flex items-center gap-3 text-left">
              <ArrowLeftIcon className="h-4 w-4 text-ink-3 transition-transform group-hover:-translate-x-1 group-hover:text-ember" />
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">Previous</span>
                <span className="font-heading text-base font-semibold text-ink group-hover:text-ember">{prev.title}</span>
              </span>
            </RoleLink>
            <BracketButton as={RoleLink} to="/contact" variant="ghost" size="sm">
              Discuss a project like this
            </BracketButton>
            <RoleLink to={`/work/${next.slug}`} className="group inline-flex items-center gap-3 text-right sm:flex-row-reverse">
              <ArrowRightIcon className="h-4 w-4 text-ink-3 transition-transform group-hover:translate-x-1 group-hover:text-ember" />
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">Next</span>
                <span className="font-heading text-base font-semibold text-ink group-hover:text-ember">{next.title}</span>
              </span>
            </RoleLink>
          </nav>
        </div>
      </article>
    </PageShell>
  );
}

function Block({ index, label, children }: { index: string; label: string; children: React.ReactNode }) {
  return (
    <Reveal as="section">
      <p className="label-mono mb-5 flex items-center gap-3">
        <span className="text-ember">{index}</span>
        <span className="text-ink-3">//</span>
        {label}
      </p>
      {children}
    </Reveal>
  );
}

function Topology({ kind }: { kind: NonNullable<CaseStudy['topology']> }) {
  switch (kind) {
    case 'realtime':
      return (
        <TopologyDiagram title="Real-time messaging shape" width={420} height={240}>
          <TopologySignal from={{ x: 60, y: 120 }} to={{ x: 200, y: 120 }} packet />
          <TopologySignal from={{ x: 200, y: 120 }} to={{ x: 60, y: 120 }} curve={-40} packet direction="forward" speed={1.6} />
          <TopologySignal from={{ x: 200, y: 120 }} to={{ x: 340, y: 60 }} packet />
          <TopologySignal from={{ x: 200, y: 120 }} to={{ x: 340, y: 180 }} status="degraded" />
          <TopologyNode x={60} y={120} label="Client" sublabel="websocket" status="active" shape="square" />
          <TopologyNode x={200} y={120} label="Gateway" sublabel="presence · fan-out" status="active" shape="diamond" />
          <TopologyNode x={340} y={60} label="Event bus" sublabel="replayable" status="active" labelPosition="right" />
          <TopologyNode x={340} y={180} label="LLM" sublabel="streamed" status="degraded" labelPosition="right" />
        </TopologyDiagram>
      );
    case 'eval':
      return (
        <TopologyDiagram title="Evaluation loop" width={420} height={240}>
          <TopologySignal from={{ x: 60, y: 120 }} to={{ x: 190, y: 120 }} packet />
          <TopologySignal from={{ x: 190, y: 120 }} to={{ x: 320, y: 120 }} packet />
          <TopologySignal from={{ x: 320, y: 120 }} to={{ x: 190, y: 200 }} curve={30} status="degraded" />
          <TopologySignal from={{ x: 190, y: 200 }} to={{ x: 60, y: 120 }} curve={30} status="degraded" packet speed={2} />
          <TopologyNode x={60} y={120} label="Prompt vN" sublabel="registry" status="active" shape="square" />
          <TopologyNode x={190} y={120} label="Model" sublabel="inference" status="active" shape="diamond" />
          <TopologyNode x={320} y={120} label="Scorecard" sublabel="relevancy · grounded" status="active" />
          <TopologyNode x={190} y={200} label="Gate" sublabel="regression?" status="degraded" labelPosition="right" shape="diamond" />
        </TopologyDiagram>
      );
    case 'approval':
      return (
        <TopologyDiagram title="Multi-stage approval workflow" width={420} height={240}>
          <TopologySignal from={{ x: 50, y: 120 }} to={{ x: 140, y: 120 }} packet />
          <TopologySignal from={{ x: 140, y: 120 }} to={{ x: 230, y: 120 }} packet />
          <TopologySignal from={{ x: 230, y: 120 }} to={{ x: 320, y: 120 }} packet />
          <TopologySignal from={{ x: 320, y: 120 }} to={{ x: 380, y: 120 }} status="degraded" />
          <TopologyNode x={50} y={120} label="Intake" sublabel="proposal" shape="square" status="active" />
          <TopologyNode x={140} y={120} label="Triage" sublabel="llm · json" status="active" />
          <TopologyNode x={230} y={120} label="Policy" sublabel="rag · cited" status="active" />
          <TopologyNode x={320} y={120} label="Risk" sublabel="summarised" status="active" />
          <TopologyNode x={380} y={120} label="Human" sublabel="signs" shape="diamond" status="degraded" labelPosition="top" />
        </TopologyDiagram>
      );
    default:
      return (
        <TopologyDiagram title="Read / write split" width={420} height={240}>
          <TopologySignal from={{ x: 60, y: 120 }} to={{ x: 190, y: 60 }} packet />
          <TopologySignal from={{ x: 60, y: 120 }} to={{ x: 190, y: 180 }} packet speed={1.8} />
          <TopologySignal from={{ x: 190, y: 60 }} to={{ x: 340, y: 120 }} />
          <TopologySignal from={{ x: 190, y: 180 }} to={{ x: 260, y: 180 }} packet />
          <TopologySignal from={{ x: 260, y: 180 }} to={{ x: 340, y: 120 }} />
          <TopologyNode x={60} y={120} label="Client" sublabel="1k+ concurrent" status="active" shape="square" />
          <TopologyNode x={190} y={60} label="Read model" sublabel="cached" status="active" labelPosition="top" />
          <TopologyNode x={190} y={180} label="Queue" sublabel="pressure valve" status="active" shape="diamond" />
          <TopologyNode x={260} y={180} label="Worker" sublabel="idempotent" status="active" />
          <TopologyNode x={340} y={120} label="Store" sublabel="postgres" shape="square" labelPosition="right" />
        </TopologyDiagram>
      );
  }
}
