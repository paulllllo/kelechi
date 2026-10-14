import type { RoleKey } from './roles';

export interface ExperienceBullet {
  text: string;
  /** Roles this bullet is most relevant to. Bullets always show for 'fullstack'. */
  roles: RoleKey[];
  /** Optional headline number to pull out visually */
  metric?: string;
  /** Linked case study slug */
  work?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  /** Role title overrides per profile (e.g. "Frontend Engineer" when ?type=frontend) */
  roleByProfile?: Partial<Record<RoleKey, string>>;
  location: string;
  remote?: boolean;
  start: string; // YYYY-MM
  end: string | 'present';
  summary: string;
  bullets: ExperienceBullet[];
  stack: string[];
  /** Industry tag */
  sector: string;
}

export const EXPERIENCE: Experience[] = [
  {
    id: 'dew-insight',
    company: 'Dew Insight',
    role: 'Software Developer',
    roleByProfile: {
      frontend: 'Software Developer (Frontend-leaning)',
      backend: 'Software Developer (Systems)',
      ai: 'Software Developer (AI integrations)',
    },
    location: 'Lagos, Nigeria',
    start: '2024-06',
    end: 'present',
    sector: 'Financial services',
    summary:
      'Product engineering for a Tier-1 financial institution: performance management at scale, applicant tracking, and the bank’s first AI-assisted internal workflows.',
    bullets: [
      {
        text: 'Engineered a high-concurrency Performance Management System for a Tier-1 financial institution, scaling the platform to 1k+ concurrent internal users.',
        roles: ['backend', 'frontend', 'fullstack'],
        metric: '1k+ users',
        work: 'performance-management-system',
      },
      {
        text: 'Contributed end-to-end to a distributed Applicant Tracking System; established CI/CD practices and a shared build tool that cut feature turnaround time by 50%.',
        roles: ['backend', 'frontend', 'fullstack'],
        metric: '-50% turnaround',
        work: 'applicant-tracking-system',
      },
      {
        text: 'Automated the approval system for the bank’s AI initiatives using a multi-staged AI workflow with human checkpoints.',
        roles: ['ai', 'backend', 'fullstack'],
        work: 'ai-approval-workflow',
      },
      {
        text: 'Engineered an event-driven, AI-integrated support engine using WebSocket-based real-time messaging and LLM integration.',
        roles: ['ai', 'backend', 'frontend', 'fullstack'],
        work: 'ai-support-engine',
      },
    ],
    stack: ['TypeScript', 'React', 'Node.js', 'WebSockets', 'PostgreSQL', 'LLM APIs', 'CI/CD'],
  },
  {
    id: 'codygo',
    company: 'Codygo',
    role: 'AI Prompt Engineer',
    location: 'Israel',
    remote: true,
    start: '2024-03',
    end: '2024-08',
    sector: 'AI startup',
    summary:
      'Owned LLM quality for production inference: evaluation, prompt infrastructure and output contracts for downstream APIs.',
    bullets: [
      {
        text: 'Developed a rigorous LLM evaluation framework; optimised response relevancy and groundedness, reducing hallucination rates by 35% across production inference tasks.',
        roles: ['ai', 'fullstack'],
        metric: '-35% hallucinations',
        work: 'llm-eval-framework',
      },
      {
        text: 'Engineered a centralised Prompt Management Registry with version control and A/B testing, cutting iteration cycles by 50%.',
        roles: ['ai', 'backend', 'fullstack'],
        metric: '-50% iteration',
        work: 'prompt-registry',
      },
      {
        text: 'Calibrated system prompts to enforce strict persona adherence and output formatting (JSON / function calling) for seamless integration with downstream APIs.',
        roles: ['ai', 'backend'],
      },
      {
        text: 'Designed the user interface and data-flow diagrams that streamlined product creation.',
        roles: ['frontend', 'ai', 'fullstack'],
      },
    ],
    stack: ['Python', 'LLM APIs', 'Eval harnesses', 'Prompt versioning', 'A/B testing', 'JSON schema'],
  },
  {
    id: 'o2-legal',
    company: 'O2 Legal',
    role: 'Web Developer',
    roleByProfile: {
      frontend: 'Web Developer (Frontend)',
      backend: 'Web Developer (Backend)',
    },
    location: 'Lagos, Nigeria',
    start: '2024-03',
    end: '2024-06',
    sector: 'Legal services',
    summary: 'Real-time client communication and onboarding automation for a legal practice.',
    bullets: [
      {
        text: 'Architected a low-latency real-time notification engine and chat interface on WebSockets, improving CSAT scores by 25%.',
        roles: ['frontend', 'backend', 'fullstack'],
        metric: '+25% CSAT',
        work: 'realtime-notifications',
      },
      {
        text: 'Streamlined client onboarding time by up to 70% with dynamic document generation and appointment booking.',
        roles: ['frontend', 'backend', 'fullstack'],
        metric: '-70% onboarding',
        work: 'client-onboarding',
      },
      {
        text: 'Created standardised API documentation guidelines that reduced developer onboarding time and cut internal support tickets by 15%.',
        roles: ['backend', 'fullstack'],
        metric: '-15% tickets',
      },
      {
        text: 'Implemented quality-assurance processes to maintain product quality and reliability.',
        roles: ['backend', 'frontend'],
      },
    ],
    stack: ['JavaScript', 'React', 'Node.js', 'WebSockets', 'PDF generation', 'REST APIs'],
  },
  {
    id: 'anthills',
    company: 'Anthills Integrated Systems',
    role: 'Web Developer',
    location: 'Ekiti, Nigeria',
    start: '2020-08',
    end: '2022-02',
    sector: 'Systems integration',
    summary: 'First production role: shipping responsive features with product and design, and learning what “maintainable” costs.',
    bullets: [
      {
        text: 'Designed, tested and implemented software features to improve efficiency and competitiveness.',
        roles: ['fullstack', 'backend', 'frontend'],
      },
      {
        text: 'Collaborated with product and design teams to create responsive user interfaces.',
        roles: ['frontend', 'fullstack'],
      },
      {
        text: 'Wrote clean, scalable code, participated in code reviews, and optimised applications for performance.',
        roles: ['backend', 'frontend', 'fullstack'],
      },
      {
        text: 'Designed algorithms and flowcharts for new web programmes.',
        roles: ['backend', 'ai'],
      },
    ],
    stack: ['JavaScript', 'HTML/CSS', 'PHP', 'MySQL', 'Responsive design'],
  },
];

/** Returns bullets ordered by relevance to the role; `relevant` marks the ones to emphasise. */
export function bulletsForRole(exp: Experience, role: RoleKey): Array<ExperienceBullet & { relevant: boolean }> {
  const withFlag = exp.bullets.map((b) => ({ ...b, relevant: role === 'fullstack' ? true : b.roles.includes(role) }));
  return [...withFlag].sort((a, b) => Number(b.relevant) - Number(a.relevant));
}

export function roleTitle(exp: Experience, role: RoleKey): string {
  return exp.roleByProfile?.[role] ?? exp.role;
}

export function formatPeriod(exp: Experience): string {
  const fmt = (ym: string) => {
    const [y, m] = ym.split('-').map(Number);
    return new Date(y, m - 1, 1).toLocaleString('en-GB', { month: 'short', year: 'numeric' });
  };
  return `${fmt(exp.start)} — ${exp.end === 'present' ? 'Present' : fmt(exp.end)}`;
}

export function durationLabel(exp: Experience): string {
  const [sy, sm] = exp.start.split('-').map(Number);
  const end = exp.end === 'present' ? new Date() : new Date(Number(exp.end.split('-')[0]), Number(exp.end.split('-')[1]) - 1, 1);
  const months = (end.getFullYear() - sy) * 12 + (end.getMonth() + 1 - sm) + 1;
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} mo`;
  if (m === 0) return `${y} yr`;
  return `${y} yr ${m} mo`;
}
