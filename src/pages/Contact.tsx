import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRightIcon, CheckIcon, CopyIcon } from 'lucide-react';
import { BracketButton, CornerFramePanel, Input, MetadataList, SegmentedToggle, StatusDot, Textarea } from '@/components/ds';
import { PageHeader, PageShell } from '@/components/site/PageShell';
import { Reveal } from '@/components/site/Reveal';
import { profile } from '@/data/profile';
import { ROLES, type RoleKey } from '@/data/roles';
import { useRole } from '@/lib/role';
import { EASE_OUT_EXPO } from '@/lib/motion';

type Intent = 'role' | 'contract' | 'collab' | 'other';
const INTENTS: Array<{ value: Intent; label: string }> = [
  { value: 'role', label: 'Full-time role' },
  { value: 'contract', label: 'Contract' },
  { value: 'collab', label: 'Collaboration' },
  { value: 'other', label: 'Something else' },
];

export default function Contact() {
  const { role } = useRole();
  const [intent, setIntent] = useState<Intent>('role');
  const [lens, setLens] = useState<RoleKey>(role);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Name is required.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = 'Enter a valid email.';
    if (message.trim().length < 20) next.message = 'Give me at least a sentence or two.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const subject = `[${INTENTS.find((i) => i.value === intent)?.label}] ${ROLES[lens].title} — ${name}${company ? ` @ ${company}` : ''}`;
    const body = `${message}\n\n—\n${name}\n${email}${company ? `\n${company}` : ''}\n\nLens: ${ROLES[lens].label} (?type=${lens})`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <PageShell>
      <PageHeader
        index="06"
        label="Contact"
        title={
          <>
            Open channel. <span className="serif-accent text-ember">Reply within a day.</span>
          </>
        }
        description="A job spec, a contract brief, or a half-formed idea — all welcome. The form drafts an email in your client; nothing is stored here."
      />

      <div className="container-site mt-16 grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <CornerFramePanel label="TX.01 // Transmission" meta={<span className="inline-flex items-center gap-2"><StatusDot status="online" size="sm" label={null} /> Channel open</span>} padding="lg">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="sent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE_OUT_EXPO }} className="py-10 text-center">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-phosphor">Draft handed to your mail client</p>
                  <h2 className="mt-4 font-heading text-3xl font-semibold text-ink">Thanks, {name.split(' ')[0]}.</h2>
                  <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-ink-2">
                    If nothing opened, email me directly at <a className="text-ember underline underline-offset-4" href={`mailto:${profile.email}`}>{profile.email}</a>.
                  </p>
                  <button type="button" onClick={() => setSent(false)} className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3 hover:text-ink">
                    ← Edit message
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={onSubmit} noValidate className="space-y-7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="space-y-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2">Reason</span>
                    <SegmentedToggle<Intent> options={INTENTS} value={intent} onChange={setIntent} size="md" showIcons={false} aria-label="Reason for contact" />
                  </div>
                  <div className="space-y-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2">Discipline</span>
                    <SegmentedToggle<RoleKey>
                      options={(Object.keys(ROLES) as RoleKey[]).map((k) => ({ value: k, label: ROLES[k].label }))}
                      value={lens}
                      onChange={setLens}
                      size="md"
                      showIcons={false}
                      aria-label="Discipline"
                    />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input label="Name" required value={name} onChange={(e) => setName(e.target.value)} error={errors.name} placeholder="Ada Lovelace" autoComplete="name" />
                    <Input label="Email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} placeholder="ada@analytical.engine" autoComplete="email" />
                  </div>
                  <Input label="Company / team" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Optional" autoComplete="organization" />
                  <Textarea
                    label="Message"
                    required
                    rows={6}
                    maxLength={1200}
                    showCount
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    error={errors.message}
                    helperText="Scope, timeline and what success looks like all help."
                    placeholder="We’re building…"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">Opens your mail client · no data stored</span>
                    <BracketButton type="submit" size="md">
                      Transmit
                    </BracketButton>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </CornerFramePanel>
        </Reveal>

        <Reveal className="space-y-8 lg:col-span-5" delay={0.1}>
          <div className="border border-border bg-surface/70 p-6">
            <p className="label-mono mb-4">Direct</p>
            <div className="flex items-center justify-between gap-3">
              <a href={`mailto:${profile.email}`} className="truncate font-heading text-lg font-semibold text-ink hover:text-ember">
                {profile.email}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                aria-label="Copy email"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center border border-border text-ink-3 transition-colors hover:border-border-strong hover:text-ink"
              >
                {copied ? <CheckIcon className="h-3.5 w-3.5 text-phosphor" /> : <CopyIcon className="h-3.5 w-3.5" />}
              </button>
            </div>
            <ul className="mt-5 flex flex-col gap-2.5 font-mono text-xs">
              {profile.socials
                .filter((s) => s.label !== 'Email')
                .map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 text-ink-2 hover:text-ember">
                      <span className="uppercase tracking-wider text-ink-3 group-hover:text-ember/70">{s.label}</span>
                      {s.handle}
                      <ArrowUpRightIcon className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          <MetadataList
            title="Logistics"
            dense
            items={[
              { label: 'Base', value: profile.location },
              { label: 'Timezone', value: `${profile.timeZoneLabel} · UTC+1` },
              { label: 'Overlap', value: 'EU full day · US East mornings' },
              { label: 'Mode', value: profile.availability.detail },
              { label: 'Notice', value: 'Flexible' },
              { label: 'Résumé', value: 'Download PDF', href: profile.resumeUrl },
            ]}
          />
        </Reveal>
      </div>
    </PageShell>
  );
}
