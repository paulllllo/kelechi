import { TabDeck, TopologyDiagram, TopologyNode, TopologySignal } from '@/components/ds';
import { Section } from '@/components/site/Section';
import { Reveal } from '@/components/site/Reveal';

const STEPS = [
  {
    id: 'discover',
    label: 'Discover',
    description: 'Find the real constraint.',
    body: <p className="font-serif text-xl italic leading-relaxed text-ink-2">Traffic shapes, sign-off, and the previous system’s failure mode.</p>,
  },
  {
    id: 'design',
    label: 'Design',
    description: 'Make the hard path boring.',
    body: <p className="font-serif text-xl italic leading-relaxed text-ink-2">Degrade to latency, never to failure. Schemas at every model boundary.</p>,
  },
  {
    id: 'ship',
    label: 'Ship',
    description: 'Small, reversible, often.',
    body: <p className="font-serif text-xl italic leading-relaxed text-ink-2">CI, previews, and one shared build tool. Releases stay small.</p>,
  },
  {
    id: 'measure',
    label: 'Measure',
    description: 'Numbers or it didn’t happen.',
    body: <p className="font-serif text-xl italic leading-relaxed text-ink-2">A number on every project. Evals, CSAT, turnaround, p95.</p>,
  },
];

export function Process() {
  return (
    <Section
      id="process"
      header={{
        index: 5,
        label: 'How I work',
        title: (
          <>
            Find the constraint. <span className="serif-accent text-ember">Make it boring.</span>
          </>
        ),
      }}
    >
      <div className="grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <TabDeck items={STEPS.map((s) => ({ id: s.id, label: s.label, description: s.description, content: s.body }))} aria-label="Process steps" />
        </Reveal>
        <Reveal className="lg:col-span-5" delay={0.1}>
          <TopologyDiagram title="Typical system shape" description="Client, gateway, event bus, workers, model, store" width={420} height={330}>
            <TopologySignal from={{ x: 70, y: 70 }} to={{ x: 210, y: 70 }} packet />
            <TopologySignal from={{ x: 210, y: 70 }} to={{ x: 210, y: 170 }} packet />
            <TopologySignal from={{ x: 210, y: 170 }} to={{ x: 90, y: 250 }} curve={-20} />
            <TopologySignal from={{ x: 210, y: 170 }} to={{ x: 330, y: 250 }} curve={20} packet speed={1.6} />
            <TopologySignal from={{ x: 330, y: 250 }} to={{ x: 350, y: 120 }} status="degraded" curve={20} direction="reverse" />
            <TopologySignal from={{ x: 210, y: 70 }} to={{ x: 70, y: 70 }} status="idle" curve={-30} />
            <TopologyNode x={70} y={70} label="Client" sublabel="React · WS" status="active" shape="square" />
            <TopologyNode x={210} y={70} label="Gateway" sublabel="auth · rate-limit" status="active" shape="diamond" />
            <TopologyNode x={210} y={170} label="Event bus" sublabel="source of truth" status="active" />
            <TopologyNode x={90} y={250} label="Store" sublabel="postgres · redis" shape="square" />
            <TopologyNode x={330} y={250} label="Workers" sublabel="idempotent" status="active" />
            <TopologyNode x={350} y={120} label="LLM" sublabel="schema-gated" status="degraded" shape="diamond" labelPosition="top" />
          </TopologyDiagram>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">Fig. 02</p>
        </Reveal>
      </div>
    </Section>
  );
}
