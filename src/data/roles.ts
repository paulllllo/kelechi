import type { ReactNode } from 'react';

/**
 * Role profiles drive the `?type=` personalisation.
 *
 *   /?type=frontend   → frontend-weighted copy, bullets, stack, case studies
 *   /?type=backend    → systems / backend
 *   /?type=ai         → LLM / applied AI
 *   /?type=fullstack  → default (everything, balanced)
 *
 * Aliases are accepted (e.g. `?type=ml`, `?type=react`, `?type=platform`).
 */
export type RoleKey = 'fullstack' | 'frontend' | 'backend' | 'ai';

export const ROLE_KEYS: RoleKey[] = ['fullstack', 'frontend', 'backend', 'ai'];

const ALIASES: Record<string, RoleKey> = {
  fullstack: 'fullstack',
  'full-stack': 'fullstack',
  full: 'fullstack',
  general: 'fullstack',
  swe: 'fullstack',
  frontend: 'frontend',
  'front-end': 'frontend',
  fe: 'frontend',
  react: 'frontend',
  ui: 'frontend',
  web: 'frontend',
  backend: 'backend',
  'back-end': 'backend',
  be: 'backend',
  systems: 'backend',
  platform: 'backend',
  infra: 'backend',
  api: 'backend',
  ai: 'ai',
  ml: 'ai',
  llm: 'ai',
  'ai-engineer': 'ai',
  prompt: 'ai',
  genai: 'ai',
};

export function resolveRole(raw: string | null | undefined): RoleKey {
  if (!raw) return 'fullstack';
  return ALIASES[raw.trim().toLowerCase()] ?? 'fullstack';
}

export interface RoleProfile {
  key: RoleKey;
  /** Short label for toggles: "Frontend" */
  label: string;
  /** Wordmark descriptor: "FRONTEND ENGINEER" */
  descriptor: string;
  /** Browser title suffix */
  title: string;
  /** Hero headline, split so the second part can take the serif-italic treatment */
  headline: { lead: string; accent: string; tail?: string };
  /** One-paragraph positioning statement */
  lede: string;
  /** Three-word pitch for the status bar */
  ticker: string;
  /** Pillars ordered by relevance (ids reference skills.ts) */
  pillarOrder: Array<'frontend' | 'backend' | 'ai'>;
  /** Metric ids to feature in the proof strip (see metrics.ts) */
  proof: string[];
  /** Case-study slugs ordered by relevance */
  featuredWork: string[];
  /** Headline for the experience section */
  experienceTitle: ReactNode;
  /** CTA copy */
  cta: { primary: string; secondary: string };
}

export const ROLES: Record<RoleKey, RoleProfile> = {
  fullstack: {
    key: 'fullstack',
    label: 'Full-stack',
    descriptor: 'SOFTWARE ENGINEER',
    title: 'Software Engineer',
    headline: {
      lead: 'I build systems that stay',
      accent: 'calm under load',
      tail: '— and interfaces people actually enjoy using.',
    },
    lede: 'Four years shipping for banks, legal teams, and AI startups — from brief to production.',
    ticker: 'Full-stack · Real-time · Applied AI',
    pillarOrder: ['backend', 'frontend', 'ai'],
    proof: ['concurrent-users', 'turnaround', 'hallucination', 'onboarding'],
    featuredWork: ['performance-management-system', 'ai-support-engine', 'llm-eval-framework', 'realtime-notifications'],
    experienceTitle: 'Four years, four teams, one habit: ship the thing and measure it.',
    cta: { primary: 'View selected work', secondary: 'Download résumé' },
  },
  frontend: {
    key: 'frontend',
    label: 'Frontend',
    descriptor: 'FRONTEND ENGINEER',
    title: 'Frontend Engineer',
    headline: {
      lead: 'Interfaces that feel',
      accent: 'instant',
      tail: '— even when the backend is having a day.',
    },
    lede: 'Real-time React interfaces for workflows where a spinner is a support ticket.',
    ticker: 'React · Real-time UI · Design systems',
    pillarOrder: ['frontend', 'backend', 'ai'],
    proof: ['csat', 'turnaround', 'concurrent-users', 'onboarding'],
    featuredWork: ['realtime-notifications', 'performance-management-system', 'applicant-tracking-system', 'ai-support-engine'],
    experienceTitle: 'Interfaces for people who have no patience for spinners.',
    cta: { primary: 'View frontend work', secondary: 'Download résumé' },
  },
  backend: {
    key: 'backend',
    label: 'Backend',
    descriptor: 'BACKEND ENGINEER',
    title: 'Backend Engineer',
    headline: {
      lead: 'Event-driven systems that',
      accent: 'scale quietly',
      tail: '— 1k+ concurrent users and nobody noticed.',
    },
    lede: 'Concurrency, messaging, and the delivery tooling that halved feature turnaround.',
    ticker: 'Distributed systems · WebSockets · CI/CD',
    pillarOrder: ['backend', 'ai', 'frontend'],
    proof: ['concurrent-users', 'turnaround', 'support-tickets', 'onboarding'],
    featuredWork: ['performance-management-system', 'applicant-tracking-system', 'ai-support-engine', 'realtime-notifications'],
    experienceTitle: 'Throughput, reliability, and the boring tooling that makes both possible.',
    cta: { primary: 'View systems work', secondary: 'Download résumé' },
  },
  ai: {
    key: 'ai',
    label: 'AI / LLM',
    descriptor: 'AI ENGINEER',
    title: 'AI Engineer',
    headline: {
      lead: 'LLM systems that are',
      accent: 'grounded',
      tail: '— evaluated, versioned, and wired into production.',
    },
    lede: 'Evaluation first, then prompts. Language-model features a bank was willing to trust.',
    ticker: 'LLM eval · RAG · Agentic workflows',
    pillarOrder: ['ai', 'backend', 'frontend'],
    proof: ['hallucination', 'iteration', 'concurrent-users', 'turnaround'],
    featuredWork: ['llm-eval-framework', 'prompt-registry', 'ai-approval-workflow', 'ai-support-engine'],
    experienceTitle: 'From prompt to production: making language models behave.',
    cta: { primary: 'View AI work', secondary: 'Download résumé' },
  },
};

export const ROLE_OPTIONS = ROLE_KEYS.map((key) => ({ value: key, label: ROLES[key].label }));
