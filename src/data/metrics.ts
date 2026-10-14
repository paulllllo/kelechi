import type { RoleKey } from './roles';

export interface Metric {
  id: string;
  value: number;
  unit?: string;
  prefix?: string;
  label: string;
  caption: string;
  source: string; // employer
  roles: RoleKey[];
  trend?: 'up' | 'down' | 'neutral';
}

export const METRICS: Record<string, Metric> = {
  'concurrent-users': {
    id: 'concurrent-users',
    value: 1000,
    prefix: '',
    unit: '+',
    label: 'Concurrent users',
    caption: 'Performance Management System scaled for a Tier-1 bank.',
    source: 'Dew Insight',
    roles: ['fullstack', 'backend', 'frontend'],
    trend: 'up',
  },
  turnaround: {
    id: 'turnaround',
    value: 50,
    unit: '%',
    label: 'Faster feature turnaround',
    caption: 'CI/CD practices and a shared build tool across the ATS codebase.',
    source: 'Dew Insight',
    roles: ['fullstack', 'backend', 'frontend'],
    trend: 'up',
  },
  hallucination: {
    id: 'hallucination',
    value: 35,
    unit: '%',
    label: 'Fewer hallucinations',
    caption: 'LLM evaluation framework tuned for relevancy and groundedness.',
    source: 'Codygo',
    roles: ['fullstack', 'ai'],
    trend: 'up',
  },
  iteration: {
    id: 'iteration',
    value: 50,
    unit: '%',
    label: 'Shorter prompt iteration cycles',
    caption: 'Centralised prompt registry with versioning and A/B testing.',
    source: 'Codygo',
    roles: ['ai'],
    trend: 'up',
  },
  csat: {
    id: 'csat',
    value: 25,
    unit: '%',
    label: 'CSAT improvement',
    caption: 'Low-latency notification engine and chat interface over WebSockets.',
    source: 'O2 Legal',
    roles: ['fullstack', 'frontend'],
    trend: 'up',
  },
  onboarding: {
    id: 'onboarding',
    value: 70,
    unit: '%',
    label: 'Faster client onboarding',
    caption: 'Dynamic document generation and appointment booking.',
    source: 'O2 Legal',
    roles: ['fullstack', 'frontend', 'backend'],
    trend: 'up',
  },
  'support-tickets': {
    id: 'support-tickets',
    value: 15,
    unit: '%',
    label: 'Fewer internal support tickets',
    caption: 'Standardised API documentation guidelines.',
    source: 'O2 Legal',
    roles: ['backend'],
    trend: 'up',
  },
};

export function getMetrics(ids: string[]): Metric[] {
  return ids.map((id) => METRICS[id]).filter(Boolean);
}
