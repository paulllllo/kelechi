import React from 'react';
import { Badge, CornerFramePanel, Divider } from '@/components/ds';
import { PageHeader, PageShell } from '@/components/site/PageShell';
import { Reveal } from '@/components/site/Reveal';
import { HallucinationMeter } from '@/playground/HallucinationMeter';
import { BackpressureLab } from '@/playground/BackpressureLab';
import { SocketStorm } from '@/playground/SocketStorm';
import { CrtMode } from '@/playground/CrtMode';

interface Experiment {
  id: string;
  index: string;
  title: string;
  hook: string;
  description: string;
  status: 'stable' | 'beta' | 'unhinged';
  tags: string[];
  component: React.ReactNode;
}

const EXPERIMENTS: Experiment[] = [
  {
    id: 'hallucination',
    index: 'EXP.01',
    title: 'Hallucination-o-meter',
    hook: 'Turn the temperature up and watch my résumé become lore.',
    description: 'A toy model that answers “who is Kelechi?” with a mix of grounded and invented claims. The groundedness score is computed honestly — it is the exact metric that gated prompt changes in production.',
    status: 'stable',
    tags: ['llm', 'evals', 'snark'],
    component: <HallucinationMeter />,
  },
  {
    id: 'backpressure',
    index: 'EXP.02',
    title: 'Backpressure Lab',
    hook: 'Drop requests or delay them. You only get to pick one.',
    description: 'A live queueing simulation. Push arrivals past capacity, hold the 9am spike button, and compare the two failure modes. This is the argument behind every “make the peak boring” decision on this site.',
    status: 'stable',
    tags: ['systems', 'queues', 'p95'],
    component: <BackpressureLab />,
  },
  {
    id: 'socket-storm',
    index: 'EXP.03',
    title: 'Socket Storm',
    hook: 'Break a node. Watch the traffic cope.',
    description: 'Chaos-engineering toy: a real-time messaging topology where any node can be degraded or killed. Click a node for its telemetry drawer.',
    status: 'beta',
    tags: ['websockets', 'chaos', 'topology'],
    component: <SocketStorm />,
  },
  {
    id: 'crt',
    index: 'EXP.04',
    title: 'CRT Mode',
    hook: 'It is 1987 and the deploy just went green.',
    description: 'Cranks the retro to eleven across the whole site — scanlines, chromatic fringe, flicker, vignette. Persists until you turn it off or your eyes do.',
    status: 'unhinged',
    tags: ['css', 'retro', 'regret'],
    component: <CrtMode />,
  },
];

const STATUS_VARIANT = { stable: 'phosphor', beta: 'gold', unhinged: 'ember' } as const;

export default function Playground() {
  return (
    <PageShell>
      <PageHeader
        index="03"
        label={`Playground · ${EXPERIMENTS.length} experiments`}
        title={
          <>
            Snarky experiments, <span className="serif-accent text-ember">running live.</span>
          </>
        }
        description="Small interactive toys that make a point about how I think — about queues, language models, real-time systems, and taste. Everything here runs in your browser; nothing phones home."
      />

      <div className="container-site mt-12 flex flex-wrap gap-x-6 gap-y-2 border-y border-border py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
        {EXPERIMENTS.map((e) => (
          <a key={e.id} href={`#${e.id}`} className="transition-colors hover:text-ember">
            {e.index} <span className="text-ink-2">{e.title}</span>
          </a>
        ))}
      </div>

      <div className="container-site space-y-14 py-14">
        {EXPERIMENTS.map((e, i) => (
          <Reveal key={e.id} as="section" id={e.id} className="scroll-mt-32">
            <CornerFramePanel
              label={e.index}
              meta={
                <Badge size="sm" variant={STATUS_VARIANT[e.status]} dot>
                  {e.status}
                </Badge>
              }
              padding="lg"
              tone={i === 0 ? 'ember' : 'default'}
            >
              <div className="grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <h2 className="font-heading text-3xl font-semibold leading-tight tracking-tight text-ink">{e.title}</h2>
                  <p className="mt-3 font-serif text-xl italic text-ink-2">{e.hook}</p>
                  <p className="mt-5 font-sans text-sm leading-relaxed text-ink-2">{e.description}</p>
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {e.tags.map((t) => (
                      <Badge key={t} size="sm" variant="neutral" bracketed={false}>
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-8">{e.component}</div>
              </div>
            </CornerFramePanel>
          </Reveal>
        ))}

        <Divider tick label="More soon" />
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-3">
          Ideas in the queue: a prompt-diff viewer · a WebSocket reconnection torture test · a jollof ranking algorithm with a confidence interval.
        </p>
      </div>
    </PageShell>
  );
}
