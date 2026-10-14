import type { RoleKey } from './roles';

export type PillarId = 'frontend' | 'backend' | 'ai';

export interface Pillar {
  id: PillarId;
  index: string;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
  stack: string[];
}

/** Core competencies — the three things a visitor should grasp in ten seconds. */
export const PILLARS: Record<PillarId, Pillar> = {
  backend: {
    id: 'backend',
    index: 'SYS',
    title: 'Systems & Backend',
    tagline: 'High-concurrency, event-driven, observable.',
    description:
      'Platforms that hold up when the whole bank logs in at 9am. Event-driven services, WebSocket messaging, and the CI/CD and shared tooling that make a team fast.',
    bullets: [
      'Scaled a performance-management platform to 1k+ concurrent internal users',
      'Distributed applicant tracking with shared build tooling (50% faster turnaround)',
      'Real-time notification engines over WebSockets',
      'API documentation standards that cut support tickets 15%',
    ],
    stack: ['Node.js', 'Python', 'WebSockets', 'PostgreSQL', 'Redis', 'Docker', 'CI/CD', 'Event-driven architecture'],
  },
  frontend: {
    id: 'frontend',
    index: 'UI',
    title: 'Frontend & Real-time UI',
    tagline: 'Fast, legible, resilient under bad networks.',
    description:
      'React interfaces for high-stakes workflows: live chat, dashboards, approval flows. I treat latency and state as design problems, not just engineering ones.',
    bullets: [
      'Chat and notification UI that lifted CSAT 25%',
      'Dynamic document generation and booking flows (70% faster onboarding)',
      'Responsive, accessible interfaces built with product and design',
      'Design-system thinking: reusable components, tokens, motion',
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind', 'Framer Motion', 'WebSockets', 'Accessibility', 'Design systems'],
  },
  ai: {
    id: 'ai',
    index: 'LLM',
    title: 'Applied AI & LLM Systems',
    tagline: 'Evaluated, versioned, grounded.',
    description:
      'Language-model features that survive contact with production: evaluation frameworks, prompt registries with version control, strict output contracts and multi-stage agentic workflows.',
    bullets: [
      'LLM evaluation framework that cut hallucination rates 35%',
      'Prompt management registry with A/B testing (50% faster iteration)',
      'Multi-stage AI approval workflow for a bank’s AI initiatives',
      'Event-driven, LLM-integrated support engine',
    ],
    stack: ['Python', 'HuggingFace', 'RAG pipelines', 'OpenAI / function calling', 'Prompt versioning', 'Eval harnesses', 'Monitoring', 'Vector search'],
  },
};

export interface StackGroup {
  label: string;
  items: Array<{ name: string; roles: RoleKey[]; level?: 'core' | 'working' }>;
}

export const STACK: StackGroup[] = [
  {
    label: 'Languages',
    items: [
      { name: 'TypeScript', roles: ['fullstack', 'frontend', 'backend'], level: 'core' },
      { name: 'JavaScript', roles: ['fullstack', 'frontend', 'backend'], level: 'core' },
      { name: 'Python', roles: ['fullstack', 'backend', 'ai'], level: 'core' },
      { name: 'C', roles: ['backend'], level: 'working' },
      { name: 'SQL', roles: ['fullstack', 'backend'], level: 'core' },
    ],
  },
  {
    label: 'Frontend',
    items: [
      { name: 'React', roles: ['fullstack', 'frontend'], level: 'core' },
      { name: 'Vite', roles: ['fullstack', 'frontend'], level: 'core' },
      { name: 'Tailwind CSS', roles: ['fullstack', 'frontend'], level: 'core' },
      { name: 'Framer Motion', roles: ['frontend'], level: 'working' },
      { name: 'State management', roles: ['frontend'], level: 'core' },
      { name: 'Accessibility', roles: ['frontend'], level: 'working' },
    ],
  },
  {
    label: 'Backend & infra',
    items: [
      { name: 'Node.js / Express', roles: ['fullstack', 'backend'], level: 'core' },
      { name: 'WebSockets', roles: ['fullstack', 'backend', 'frontend'], level: 'core' },
      { name: 'PostgreSQL', roles: ['fullstack', 'backend'], level: 'core' },
      { name: 'Redis', roles: ['backend'], level: 'working' },
      { name: 'Docker', roles: ['backend', 'fullstack'], level: 'working' },
      { name: 'CI/CD pipelines', roles: ['backend', 'fullstack'], level: 'core' },
      { name: 'Event-driven design', roles: ['backend', 'ai'], level: 'core' },
    ],
  },
  {
    label: 'AI / LLM',
    items: [
      { name: 'LLM evaluation', roles: ['ai', 'fullstack'], level: 'core' },
      { name: 'Prompt engineering', roles: ['ai'], level: 'core' },
      { name: 'RAG systems', roles: ['ai', 'fullstack'], level: 'core' },
      { name: 'HuggingFace', roles: ['ai'], level: 'working' },
      { name: 'Function calling / JSON', roles: ['ai', 'backend'], level: 'core' },
      { name: 'Agentic workflows', roles: ['ai'], level: 'working' },
      { name: 'Monitoring', roles: ['ai', 'backend'], level: 'working' },
    ],
  },
];
