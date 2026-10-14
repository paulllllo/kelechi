import type { RoleKey } from './roles';

export interface BlogPost {
  slug: string;
  number: number;
  title: string;
  date: string; // YYYY-MM-DD
  summary: string;
  tags: string[];
  roles: RoleKey[];
  readingTime: string;
  status: 'shipped' | 'draft' | 'in-progress';
  /** Placeholder body — Markdown-ish paragraphs */
  body: string[];
}

/**
 * Placeholder content. Replace with real posts (or wire up a CMS / MDX loader).
 */
export const POSTS: BlogPost[] = [
  {
    slug: 'making-the-peak-boring',
    number: 7,
    title: 'Making the peak boring: concurrency lessons from a bank’s review season',
    date: '2026-09-18',
    summary:
      'Why the hard part of high-concurrency systems isn’t handling the spike — it’s designing so that the spike turns into latency instead of failure.',
    tags: ['systems', 'concurrency', 'postgres'],
    roles: ['fullstack', 'backend'],
    readingTime: '8 min',
    status: 'shipped',
    body: [
      'Placeholder. This post will walk through the traffic shape of an enterprise performance cycle, the read/write split that kept dashboards fast, and the idempotency keys that made retries safe.',
      'Sections planned: the traffic shape nobody load-tests for; queues as a pressure valve; what we got wrong on the first cycle; the checklist that became definition-of-done.',
    ],
  },
  {
    slug: 'eval-before-you-prompt',
    number: 6,
    title: 'Eval before you prompt: a boring framework for LLM quality',
    date: '2026-08-02',
    summary: 'The evaluation harness that cut hallucinations by 35% — and why it mattered more than any single prompt change.',
    tags: ['ai', 'evals', 'python'],
    roles: ['fullstack', 'ai'],
    readingTime: '11 min',
    status: 'shipped',
    body: [
      'Placeholder. A practical guide to building a golden set from production traffic, scoring groundedness, calibrating model-graded judges, and turning the whole thing into a release gate.',
    ],
  },
  {
    slug: 'websockets-for-anxious-users',
    number: 5,
    title: 'Designing WebSocket UIs for anxious users',
    date: '2026-06-14',
    summary: 'Optimistic sends, honest status, and reconnection that never loses a draft. Notes from building legal-client chat.',
    tags: ['frontend', 'realtime', 'ux'],
    roles: ['fullstack', 'frontend'],
    readingTime: '6 min',
    status: 'shipped',
    body: ['Placeholder. The small UI decisions that moved CSAT 25%: per-message state, presence, and what to do when the socket dies mid-sentence.'],
  },
  {
    slug: 'prompts-are-code',
    number: 4,
    title: 'Prompts are code. Treat them like it.',
    date: '2026-04-21',
    summary: 'Versioning, review, A/B tests and one-command rollback — what a prompt registry actually needs.',
    tags: ['ai', 'prompt-ops'],
    roles: ['ai', 'backend'],
    readingTime: '7 min',
    status: 'shipped',
    body: ['Placeholder. How the registry resolved prompts by name and environment, allocated experiments stickily, and enforced output schemas.'],
  },
  {
    slug: 'shared-build-tool',
    number: 3,
    title: 'One build tool to rule the monorepo-that-isn’t',
    date: '2026-02-09',
    summary: 'Why a shared CLI beat a shared pipeline template, and how it halved turnaround across a distributed ATS.',
    tags: ['dx', 'ci-cd', 'tooling'],
    roles: ['backend', 'fullstack'],
    readingTime: '9 min',
    status: 'draft',
    body: ['Placeholder.'],
  },
  {
    slug: 'human-in-the-loop-is-the-feature',
    number: 2,
    title: 'Human-in-the-loop is the feature, not the fallback',
    date: '2025-12-01',
    summary: 'Building an AI approval workflow a bank would trust meant designing for the signature, not around it.',
    tags: ['ai', 'governance'],
    roles: ['ai'],
    readingTime: '5 min',
    status: 'draft',
    body: ['Placeholder.'],
  },
];

export const POSTS_BY_SLUG = Object.fromEntries(POSTS.map((p) => [p.slug, p])) as Record<string, BlogPost>;

export function postsForRole(role: RoleKey, limit?: number): BlogPost[] {
  const sorted = [...POSTS].sort((a, b) => {
    const ra = role === 'fullstack' ? 0 : Number(a.roles.includes(role));
    const rb = role === 'fullstack' ? 0 : Number(b.roles.includes(role));
    if (ra !== rb) return rb - ra;
    return b.date.localeCompare(a.date);
  });
  return limit ? sorted.slice(0, limit) : sorted;
}
