import type { RoleKey } from './roles';
import type { PillarId } from './skills';

export interface CaseStudyMetric {
  value: string;
  label: string;
}

export interface CaseStudy {
  slug: string;
  index: string; // PRJ.01
  title: string;
  client: string;
  employer: string;
  period: string;
  sector: string;
  /** One-line hook */
  hook: string;
  summary: string;
  roles: RoleKey[];
  pillar: PillarId;
  tags: string[];
  stack: string[];
  metrics: CaseStudyMetric[];
  problem: string;
  approach: string[];
  outcome: string;
  /** Short pull quote for the detail page */
  quote?: string;
  /** Short code snippet illustrating a key idea */
  snippet?: { filename: string; language: 'ts' | 'tsx' | 'python' | 'json' | 'bash'; code: string; caption?: string };
  /** Topology diagram hint for the detail page */
  topology?: 'pipeline' | 'realtime' | 'eval' | 'approval';
  confidential?: boolean;
  status: 'shipped' | 'in-progress';
}

export const WORK: CaseStudy[] = [
  {
    slug: 'performance-management-system',
    index: 'PRJ.01',
    title: 'Performance Management System',
    client: 'Tier-1 financial institution',
    employer: 'Dew Insight',
    period: '2024 — present',
    sector: 'Banking',
    hook: '1k+ concurrent users on a review-cycle deadline.',
    summary:
      'A high-concurrency platform for goal-setting, appraisals and performance reviews across a Tier-1 bank, built to survive the moment every employee logs in on the same morning.',
    roles: ['fullstack', 'backend', 'frontend'],
    pillar: 'backend',
    tags: ['high-concurrency', 'enterprise', 'react', 'node'],
    stack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'WebSockets', 'Docker'],
    metrics: [
      { value: '1k+', label: 'Concurrent internal users' },
      { value: '0', label: 'Deadline-day outages' },
      { value: '<300ms', label: 'p95 dashboard load' },
    ],
    problem:
      'Performance cycles create brutal traffic shapes: nothing for weeks, then the entire organisation submitting appraisals in the final hours. The previous tooling buckled under that spike, and “try again later” is not an acceptable answer to a bank.',
    approach: [
      'Modelled the review workflow as a state machine so every transition was idempotent and auditable.',
      'Separated read and write paths: cached, denormalised read models for dashboards; queued writes for submissions so bursts degrade to latency, not failure.',
      'Built the React front end around optimistic updates and skeleton states so the UI stayed responsive while the backend absorbed load.',
      'Load-tested against deadline-day traffic shapes before each release and made the results part of the definition of done.',
    ],
    outcome:
      'The platform scaled to 1k+ concurrent internal users through full review cycles without incident, and became the reference architecture for subsequent internal tools.',
    quote: 'The hard part of concurrency is not the peak. It is making the peak boring.',
    snippet: {
      filename: 'reviews/submit.ts',
      language: 'ts',
      caption: 'Submissions are enqueued and acknowledged immediately; the worker applies the state transition idempotently.',
      code: `export async function submitReview(cmd: SubmitReview) {
  // Idempotency key derived from the review + cycle, not the request.
  const key = \`review:\${cmd.reviewId}:\${cmd.cycleId}:submit\`;
  if (await cache.exists(key)) return { status: 'accepted', deduped: true };

  await queue.enqueue('review.submit', cmd, { key });
  await cache.set(key, '1', { ttlSeconds: 60 * 60 });

  // The UI gets an immediate ack; the worker owns the transition.
  return { status: 'accepted', deduped: false };
}`,
    },
    topology: 'pipeline',
    confidential: true,
    status: 'shipped',
  },
  {
    slug: 'applicant-tracking-system',
    index: 'PRJ.02',
    title: 'Distributed Applicant Tracking System',
    client: 'Tier-1 financial institution',
    employer: 'Dew Insight',
    period: '2024 — present',
    sector: 'Banking / HR',
    hook: 'Half the turnaround time with a shared build tool.',
    summary:
      'End-to-end development of a distributed ATS — requisitions, pipelines, interview scheduling — plus the CI/CD practices and shared build tooling that let the team ship twice as fast.',
    roles: ['fullstack', 'backend', 'frontend'],
    pillar: 'backend',
    tags: ['ci-cd', 'tooling', 'distributed', 'dx'],
    stack: ['TypeScript', 'Node.js', 'React', 'PostgreSQL', 'Docker', 'GitHub Actions'],
    metrics: [
      { value: '50%', label: 'Faster feature turnaround' },
      { value: '1', label: 'Shared build tool across services' },
    ],
    problem:
      'Multiple services, multiple teams, and a build process that lived in people’s heads. Every feature paid a tax in environment drift, flaky pipelines and “works on my machine”.',
    approach: [
      'Wrote a single shared build tool that every service used for lint, test, build and deploy, with sensible defaults and escape hatches.',
      'Established CI/CD conventions: trunk-based development, preview environments per pull request, and automated migrations.',
      'Contributed across the stack — pipeline UI, scheduling APIs, candidate search — so the tooling was shaped by someone who had to use it daily.',
    ],
    outcome: 'Feature turnaround time dropped by roughly 50%, and new engineers could ship to production in their first week.',
    quote: 'Developer experience is a product. Its users just happen to sit next to you.',
    snippet: {
      filename: '.github/workflows/service.yml',
      language: 'bash',
      caption: 'Every service invokes the shared tool — the workflow file is identical across repositories.',
      code: `# Identical in every service repository
npx @dew/build ci --service $SERVICE_NAME
npx @dew/build preview --pr $PR_NUMBER
npx @dew/build deploy --env production --migrate`,
    },
    topology: 'pipeline',
    confidential: true,
    status: 'shipped',
  },
  {
    slug: 'ai-approval-workflow',
    index: 'PRJ.03',
    title: 'AI Initiative Approval Workflow',
    client: 'Tier-1 financial institution',
    employer: 'Dew Insight',
    period: '2024',
    sector: 'Banking / Governance',
    hook: 'A multi-stage AI workflow a bank was willing to trust.',
    summary:
      'Automated the approval process for the bank’s internal AI initiatives using a multi-staged LLM workflow — triage, policy checks, risk summarisation — with human checkpoints where it mattered.',
    roles: ['ai', 'backend', 'fullstack'],
    pillar: 'ai',
    tags: ['agentic', 'governance', 'llm', 'workflow'],
    stack: ['Python', 'LLM APIs', 'Function calling', 'Node.js', 'PostgreSQL'],
    metrics: [
      { value: '4', label: 'Automated review stages' },
      { value: '100%', label: 'Decisions with human sign-off' },
    ],
    problem:
      'Every proposed AI use-case needed review against data-handling policy, model risk and business justification. The queue was manual, slow, and inconsistent between reviewers.',
    approach: [
      'Decomposed the review into discrete stages, each with a narrow prompt, a strict JSON output schema and its own evaluation set.',
      'Grounded policy checks in the actual policy documents via retrieval, so the model cited clauses rather than improvising.',
      'Designed the workflow so the model drafts and flags; humans approve. Every stage output is stored and auditable.',
    ],
    outcome: 'Review throughput increased materially while every decision retained a human signature — the property that made adoption possible.',
    quote: 'In regulated environments, the model’s job is to make the human faster, not optional.',
    topology: 'approval',
    confidential: true,
    status: 'shipped',
  },
  {
    slug: 'ai-support-engine',
    index: 'PRJ.04',
    title: 'Event-driven AI Support Engine',
    client: 'Tier-1 financial institution',
    employer: 'Dew Insight',
    period: '2024 — present',
    sector: 'Banking / Support',
    hook: 'WebSockets in, LLM in the loop, humans on the edge.',
    summary:
      'An event-driven support engine with WebSocket-based real-time messaging and LLM integration: instant first responses, grounded answers, and clean hand-off to a human agent.',
    roles: ['fullstack', 'ai', 'backend', 'frontend'],
    pillar: 'ai',
    tags: ['websockets', 'llm', 'event-driven', 'realtime'],
    stack: ['TypeScript', 'Node.js', 'WebSockets', 'React', 'LLM APIs', 'RAG', 'Redis'],
    metrics: [
      { value: '<1s', label: 'First response' },
      { value: 'Streamed', label: 'Token-by-token replies' },
    ],
    problem:
      'Internal support queues were slow to acknowledge and inconsistent in answers. A chatbot that confidently invented procedures would have been worse than nothing.',
    approach: [
      'Event bus at the centre: every message, model call and hand-off is an event, which made the system observable and replayable.',
      'Retrieval over the internal knowledge base with citations in every answer; low-confidence answers escalate automatically.',
      'Streaming responses over WebSockets so the interface feels alive, with typing indicators and graceful reconnection.',
    ],
    outcome: 'Support requests get an immediate, grounded first response; agents inherit full context when they take over.',
    snippet: {
      filename: 'support/stream.ts',
      language: 'ts',
      caption: 'Model tokens are forwarded to the socket as they arrive; the event log is the source of truth.',
      code: `bus.on('message.received', async (evt) => {
  const ctx = await retrieve(evt.text, { topK: 6, withCitations: true });
  if (ctx.confidence < 0.6) return bus.emit('handoff.requested', evt);

  for await (const token of llm.stream({ system: SUPPORT_PROMPT, ctx, user: evt.text })) {
    socket(evt.sessionId).send({ type: 'token', token });
  }
  bus.emit('reply.completed', { sessionId: evt.sessionId, citations: ctx.citations });
});`,
    },
    topology: 'realtime',
    confidential: true,
    status: 'in-progress',
  },
  {
    slug: 'llm-eval-framework',
    index: 'PRJ.05',
    title: 'LLM Evaluation Framework',
    client: 'Codygo',
    employer: 'Codygo',
    period: '2024',
    sector: 'AI startup',
    hook: '35% fewer hallucinations, measured, not vibes.',
    summary:
      'A rigorous evaluation framework for production inference — relevancy, groundedness, format adherence — that turned prompt changes from guesswork into measured experiments.',
    roles: ['ai', 'fullstack'],
    pillar: 'ai',
    tags: ['evaluation', 'llm', 'python', 'quality'],
    stack: ['Python', 'LLM APIs', 'HuggingFace', 'Pandas', 'JSON schema'],
    metrics: [
      { value: '35%', label: 'Reduction in hallucination rate' },
      { value: '3', label: 'Scored dimensions per response' },
    ],
    problem:
      'Prompt changes shipped on intuition. A tweak that fixed one failure quietly broke three others, and nobody could say whether the product was getting better.',
    approach: [
      'Built a golden dataset from real production traffic, labelled for relevancy and groundedness.',
      'Scored responses with a mix of deterministic checks (schema, citations present) and model-graded rubrics with calibrated judges.',
      'Made the eval a gate: every prompt or model change produced a scorecard before it reached production.',
    ],
    outcome: 'Hallucination rates fell by 35% across production inference tasks, and regressions were caught before users saw them.',
    quote: 'If you cannot measure it, you are not engineering it. You are hoping.',
    snippet: {
      filename: 'evals/groundedness.py',
      language: 'python',
      caption: 'Each claim in a response must be supported by the retrieved context.',
      code: `def groundedness(response: str, context: list[str]) -> float:
    claims = extract_claims(response)
    if not claims:
        return 1.0
    supported = sum(1 for c in claims if is_supported(c, context))
    return supported / len(claims)

def gate(scorecard: Scorecard, baseline: Scorecard) -> None:
    for dim in ("relevancy", "groundedness", "format"):
        assert scorecard[dim] >= baseline[dim] - 0.01, f"regression in {dim}"`,
    },
    topology: 'eval',
    status: 'shipped',
  },
  {
    slug: 'prompt-registry',
    index: 'PRJ.06',
    title: 'Prompt Management Registry',
    client: 'Codygo',
    employer: 'Codygo',
    period: '2024',
    sector: 'AI startup',
    hook: 'Version control and A/B testing for prompts.',
    summary:
      'A centralised registry that treats prompts like code: versioned, reviewed, A/B tested in production, and rolled back in one command.',
    roles: ['ai', 'backend', 'fullstack'],
    pillar: 'ai',
    tags: ['prompt-ops', 'versioning', 'ab-testing', 'llm'],
    stack: ['Python', 'PostgreSQL', 'LLM APIs', 'Feature flags'],
    metrics: [
      { value: '50%', label: 'Shorter iteration cycles' },
      { value: '1 cmd', label: 'Rollback' },
    ],
    problem: 'Prompts lived in source files and chat logs. Nobody knew which version was live, and comparing two candidates meant deploying twice and squinting.',
    approach: [
      'Stored prompts as immutable versions with metadata — model, temperature, schema — and resolved them at runtime by name and environment.',
      'Wired A/B allocation into the resolver so two versions could run against live traffic with the evaluation framework scoring both.',
      'Enforced persona and output contracts (JSON / function calling) as part of the version, so downstream APIs never saw surprises.',
    ],
    outcome: 'Prompt iteration cycles halved, and the team could answer “what changed?” for any production response.',
    snippet: {
      filename: 'registry/resolve.py',
      language: 'python',
      code: `prompt = registry.resolve(
    name="support.triage",
    env="production",
    experiment="triage-v7-vs-v8",   # 50/50 split, scored by the eval suite
    user_id=request.user_id,        # sticky allocation
)
response = llm.complete(prompt.render(ticket), schema=prompt.output_schema)`,
    },
    topology: 'eval',
    status: 'shipped',
  },
  {
    slug: 'realtime-notifications',
    index: 'PRJ.07',
    title: 'Real-time Notifications & Chat',
    client: 'O2 Legal',
    employer: 'O2 Legal',
    period: '2024',
    sector: 'Legal services',
    hook: 'Low-latency chat that lifted CSAT 25%.',
    summary:
      'A low-latency notification engine and chat interface over WebSockets, connecting clients and lawyers in real time without the refresh button.',
    roles: ['fullstack', 'frontend', 'backend'],
    pillar: 'frontend',
    tags: ['websockets', 'react', 'realtime', 'ux'],
    stack: ['JavaScript', 'React', 'Node.js', 'WebSockets', 'REST APIs'],
    metrics: [
      { value: '25%', label: 'CSAT improvement' },
      { value: 'Realtime', label: 'Delivery, read receipts, presence' },
    ],
    problem: 'Clients emailed, lawyers replied days later, and nobody knew what had been seen. Satisfaction scores reflected it.',
    approach: [
      'WebSocket layer with presence, delivery and read receipts; a REST fallback for history and offline catch-up.',
      'Designed the chat UI for anxious users: optimistic sends, clear status per message, reconnection that never loses a draft.',
      'Notification engine fan-out with per-user preferences so lawyers were pinged for the right things only.',
    ],
    outcome: 'Customer satisfaction scores improved by 25% in the quarter after launch.',
    topology: 'realtime',
    status: 'shipped',
  },
  {
    slug: 'client-onboarding',
    index: 'PRJ.08',
    title: 'Client Onboarding Automation',
    client: 'O2 Legal',
    employer: 'O2 Legal',
    period: '2024',
    sector: 'Legal services',
    hook: 'Onboarding time down 70%.',
    summary: 'Dynamic document generation and appointment booking that turned a week of back-and-forth into a single guided session.',
    roles: ['fullstack', 'frontend', 'backend'],
    pillar: 'frontend',
    tags: ['automation', 'documents', 'booking', 'forms'],
    stack: ['JavaScript', 'React', 'Node.js', 'PDF generation', 'Calendar APIs'],
    metrics: [
      { value: '70%', label: 'Faster onboarding' },
      { value: '15%', label: 'Fewer internal support tickets (API docs)' },
    ],
    problem: 'Engagement letters, intake forms and first appointments were assembled by hand from templates and email threads.',
    approach: [
      'Schema-driven intake forms that generate the right documents from one source of truth.',
      'Templated document generation with legal review baked into the template, not the instance.',
      'Appointment booking integrated with lawyer calendars; confirmations and reminders automated.',
      'Documented the APIs to a standard, cutting internal support tickets by 15%.',
    ],
    outcome: 'Client onboarding time fell by up to 70%, and the documentation standard outlived the project.',
    topology: 'pipeline',
    status: 'shipped',
  },
];

export const WORK_BY_SLUG = Object.fromEntries(WORK.map((w) => [w.slug, w])) as Record<string, CaseStudy>;

export function workForRole(role: RoleKey, featured: string[]): CaseStudy[] {
  const featuredSet = new Set(featured);
  const first = featured.map((s) => WORK_BY_SLUG[s]).filter(Boolean);
  const rest = WORK.filter((w) => !featuredSet.has(w.slug)).sort(
    (a, b) => Number(b.roles.includes(role)) - Number(a.roles.includes(role)),
  );
  return [...first, ...rest];
}
