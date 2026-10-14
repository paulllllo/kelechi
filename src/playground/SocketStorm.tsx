import { useEffect, useMemo, useState } from 'react';
import { Badge, TelemetryDrawer, TopologyDiagram, TopologyNode, TopologySignal, type TopologyStatus } from '@/components/ds';
import { cn } from '@/lib/cn';

/**
 * EXP.03 — Socket Storm
 * Chaos-engineering toy: a real-time messaging topology where you can
 * degrade or kill individual nodes and watch the traffic re-route.
 * Click any node for its telemetry.
 */

type NodeId = 'client' | 'gateway' | 'bus' | 'worker-a' | 'worker-b' | 'llm' | 'store';

interface NodeDef {
  id: NodeId;
  label: string;
  sublabel: string;
  x: number;
  y: number;
  shape?: 'circle' | 'square' | 'diamond';
  region: string;
}

const NODES: NodeDef[] = [
  { id: 'client', label: 'Clients', sublabel: 'ws · 1,204', x: 60, y: 150, shape: 'square', region: 'edge' },
  { id: 'gateway', label: 'Gateway', sublabel: 'presence', x: 180, y: 150, shape: 'diamond', region: 'lag-1' },
  { id: 'bus', label: 'Event bus', sublabel: 'replayable', x: 300, y: 150, region: 'lag-1' },
  { id: 'worker-a', label: 'Worker A', sublabel: 'idempotent', x: 400, y: 70, region: 'lag-1' },
  { id: 'worker-b', label: 'Worker B', sublabel: 'idempotent', x: 400, y: 230, region: 'lag-2' },
  { id: 'llm', label: 'LLM', sublabel: 'schema-gated', x: 510, y: 150, shape: 'diamond', region: 'eu-w' },
  { id: 'store', label: 'Store', sublabel: 'postgres', x: 300, y: 270, shape: 'square', region: 'lag-1' },
];

const EDGES: Array<[NodeId, NodeId, { curve?: number; packet?: boolean }]> = [
  ['client', 'gateway', { packet: true }],
  ['gateway', 'bus', { packet: true }],
  ['bus', 'worker-a', { packet: true }],
  ['bus', 'worker-b', { packet: true }],
  ['worker-a', 'llm', {}],
  ['worker-b', 'llm', {}],
  ['bus', 'store', { curve: 0 }],
  ['gateway', 'client', { curve: -40 }],
];

export function SocketStorm() {
  const [state, setState] = useState<Record<NodeId, TopologyStatus>>({
    client: 'active',
    gateway: 'active',
    bus: 'active',
    'worker-a': 'active',
    'worker-b': 'active',
    llm: 'active',
    store: 'active',
  });
  const [selected, setSelected] = useState<NodeId | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 1500);
    return () => window.clearInterval(id);
  }, []);

  const cycle = (id: NodeId) => {
    setState((s) => {
      const next: TopologyStatus = s[id] === 'active' ? 'degraded' : s[id] === 'degraded' ? 'error' : 'active';
      return { ...s, [id]: next };
    });
  };

  const edgeStatus = (a: NodeId, b: NodeId): TopologyStatus => {
    const sa = state[a];
    const sb = state[b];
    if (sa === 'error' || sb === 'error') return 'error';
    if (sa === 'degraded' || sb === 'degraded') return 'degraded';
    return 'active';
  };

  const health = useMemo(() => {
    const vals = Object.values(state);
    const errors = vals.filter((v) => v === 'error').length;
    const degraded = vals.filter((v) => v === 'degraded').length;
    if (errors) return { label: 'Incident', variant: 'ember' as const };
    if (degraded) return { label: 'Degraded', variant: 'gold' as const };
    return { label: 'Nominal', variant: 'phosphor' as const };
  }, [state]);

  // Pseudo telemetry derived from node state + tick
  const telemetryFor = (id: NodeId) => {
    const st = state[id];
    const jitter = (n: number) => Math.round(n + Math.sin(tick + id.length) * n * 0.08);
    const base = st === 'active' ? 1 : st === 'degraded' ? 3.2 : 0;
    return {
      status: st === 'active' ? ('nominal' as const) : st === 'degraded' ? ('warning' as const) : ('critical' as const),
      metrics: [
        { label: 'p95 latency', value: st === 'error' ? '—' : jitter(42 * base), unit: 'ms', trend: st === 'active' ? ('flat' as const) : ('up' as const), delta: st === 'active' ? '±0' : '+220%' },
        { label: 'Throughput', value: st === 'error' ? 0 : jitter(820 / base), unit: 'msg/s', trend: st === 'active' ? ('up' as const) : ('down' as const), delta: st === 'active' ? '+3%' : '-68%' },
        { label: 'Error rate', value: st === 'active' ? '0.02' : st === 'degraded' ? '2.4' : '100', unit: '%', progress: st === 'active' ? 2 : st === 'degraded' ? 40 : 100 },
        { label: 'Connections', value: st === 'error' ? 0 : jitter(1204 / base), unit: 'open', progress: st === 'active' ? 61 : st === 'degraded' ? 88 : 0 },
      ],
      details: [
        { label: 'Region', value: NODES.find((n) => n.id === id)?.region ?? '—' },
        { label: 'Replicas', value: st === 'error' ? '0 / 3' : st === 'degraded' ? '1 / 3' : '3 / 3' },
        { label: 'Last deploy', value: '14m ago' },
        { label: 'Idempotent', value: id.startsWith('worker') ? 'yes' : 'n/a' },
      ],
    };
  };

  const selectedNode = NODES.find((n) => n.id === selected);

  return (
    <div className="relative space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-sans text-xs leading-relaxed text-ink-3">
          Click a node to open telemetry. <span className="text-ink-2">Shift-click</span> (or use the chips) to cycle it through active → degraded → down.
        </p>
        <Badge variant={health.variant} dot>
          {health.label}
        </Badge>
      </div>

      <div className="relative">
        <TopologyDiagram title="Socket storm topology" description="Interactive topology of a real-time messaging system" width={580} height={320}>
          {EDGES.map(([a, b, opts]) => {
            const A = NODES.find((n) => n.id === a)!;
            const B = NODES.find((n) => n.id === b)!;
            const st = edgeStatus(a, b);
            return <TopologySignal key={`${a}-${b}`} from={{ x: A.x, y: A.y }} to={{ x: B.x, y: B.y }} status={st} curve={opts.curve ?? 0} packet={opts.packet && st !== 'error'} speed={st === 'degraded' ? 2.4 : 1.2} />;
          })}
          {NODES.map((n) => (
            <TopologyNode
              key={n.id}
              x={n.x}
              y={n.y}
              label={n.label}
              sublabel={n.sublabel}
              shape={n.shape}
              status={state[n.id]}
              labelPosition={n.id === 'store' ? 'right' : n.id === 'client' ? 'bottom' : 'bottom'}
              onClick={() => setSelected(n.id)}
            />
          ))}
        </TopologyDiagram>

        <TelemetryDrawer
          contained
          size="sm"
          open={Boolean(selectedNode)}
          onClose={() => setSelected(null)}
          title={selectedNode?.label ?? ''}
          subtitle={selectedNode ? `${selectedNode.sublabel} · ${selectedNode.region}` : undefined}
          status={selectedNode ? telemetryFor(selectedNode.id).status : undefined}
          metrics={selectedNode ? telemetryFor(selectedNode.id).metrics : []}
          details={selectedNode ? telemetryFor(selectedNode.id).details : []}
          lastUpdated="just now"
          footer={
            selectedNode && (
              <button
                type="button"
                onClick={() => cycle(selectedNode.id)}
                className="border border-border-strong px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-2 transition-colors hover:border-ember hover:text-ember"
              >
                Cycle state
              </button>
            )
          }
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {NODES.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => cycle(n.id)}
            className={cn(
              'inline-flex items-center gap-2 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors',
              state[n.id] === 'active' && 'border-border text-ink-2 hover:text-ink',
              state[n.id] === 'degraded' && 'border-gold/50 bg-gold/10 text-gold',
              state[n.id] === 'error' && 'border-error/50 bg-error/10 text-error',
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', state[n.id] === 'active' ? 'bg-phosphor' : state[n.id] === 'degraded' ? 'bg-gold' : 'bg-error')} />
            {n.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setState((s) => Object.fromEntries(Object.keys(s).map((k) => [k, 'active'])) as typeof s)}
          className="ml-auto border border-border-strong px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-2 hover:text-ink"
        >
          Heal all
        </button>
      </div>
    </div>
  );
}
