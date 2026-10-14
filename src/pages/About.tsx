import { DownloadIcon } from 'lucide-react';
import { Badge, BracketButton, Button, CornerFramePanel, Divider, MetadataList, PullQuote } from '@/components/ds';
import { PageHeader, PageShell } from '@/components/site/PageShell';
import { Portrait } from '@/components/site/Portrait';
import { Reveal, RevealGroup, RevealItem } from '@/components/site/Reveal';
import { NowPlaying } from '@/components/site/NowPlaying';
import { profile } from '@/data/profile';
import { EXPERIENCE, formatPeriod } from '@/data/experience';
import { RoleLink, useRole } from '@/lib/role';

const PRINCIPLES = [
  { title: 'Make the peak boring', body: 'Design so that load turns into latency, not failure. Idempotency, queues, and honest UI state.' },
  { title: 'Measure or it did not happen', body: 'Every project gets a number before it gets a launch date. Evals, p95s, CSAT — whatever the user actually feels.' },
  { title: 'Humans sign', body: 'Language models draft, flag and summarise. In regulated systems a person makes the call, and the audit trail proves it.' },
  { title: 'Tooling is product', body: 'A shared build tool halved turnaround on a distributed ATS. Developer experience compounds.' },
];

export default function About() {
  const { profile: rp } = useRole();

  return (
    <PageShell>
      <PageHeader
        index="05"
        label="About"
        title={
          <>
            Engineer, Lagos. <span className="serif-accent text-ember">Allergic to spinners.</span>
          </>
        }
        description={`${profile.fullName}. ${rp.title}. ${profile.yearsExperience}+ years across banking, legal and AI — mostly the parts that have to work in real time and under load.`}
      />

      <div className="container-site mt-16 grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <Portrait label="FIG. 02 // OPERATOR" />
          <div className="mt-8">
            <MetadataList
              title="Operator"
              dense
              items={[
                { label: 'Name', value: profile.fullName },
                { label: 'Base', value: profile.location },
                { label: 'Timezone', value: `${profile.timeZoneLabel} (UTC+1)` },
                { label: 'Status', value: profile.availability.label },
                { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
                { label: 'Résumé', value: 'PDF · 1 page', href: profile.resumeUrl },
              ]}
            />
          </div>
        </Reveal>

        <div className="space-y-14 lg:col-span-7">
          <Reveal className="space-y-6">
            {profile.bio.map((para, i) => (
              <p key={i} className={i === 0 ? 'text-xl leading-relaxed text-ink md:text-2xl' : 'text-lg leading-relaxed text-ink-2'}>
                {para}
              </p>
            ))}
            <div className="flex flex-wrap gap-4 pt-2">
              <BracketButton as={RoleLink} to="/work">
                See the work
              </BracketButton>
              <a href={profile.resumeUrl} download className="inline-flex">
                <Button size="lg" leadingIcon={<DownloadIcon />} className="h-12">
                  Résumé
                </Button>
              </a>
            </div>
          </Reveal>

          <Reveal>
            <p className="label-mono mb-5">
              <span className="text-ember">01</span> <span className="text-ink-3">//</span> Principles
            </p>
            <RevealGroup className="grid gap-4 sm:grid-cols-2" staggerChildren={0.08}>
              {PRINCIPLES.map((p, i) => (
                <RevealItem key={p.title}>
                  <CornerFramePanel label={`P.0${i + 1}`} padding="md" crosshairs={false} className="h-full">
                    <h3 className="font-heading text-lg font-semibold text-ink">{p.title}</h3>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-ink-2">{p.body}</p>
                  </CornerFramePanel>
                </RevealItem>
              ))}
            </RevealGroup>
          </Reveal>

          <Reveal>
            <p className="label-mono mb-5">
              <span className="text-ember">02</span> <span className="text-ink-3">//</span> Timeline
            </p>
            <ol className="border-t border-border">
              {EXPERIENCE.map((e) => (
                <li key={e.id} className="grid gap-1 border-b border-border py-4 sm:grid-cols-12 sm:gap-6">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3 sm:col-span-4">{formatPeriod(e)}</span>
                  <span className="sm:col-span-8">
                    <span className="font-heading text-base font-semibold text-ink">{e.company}</span>
                    <span className="text-ink-3"> — </span>
                    <span className="font-serif italic text-ink-2">{e.role}</span>
                  </span>
                </li>
              ))}
              {profile.education.map((ed) => (
                <li key={ed.school} className="grid gap-1 border-b border-border py-4 sm:grid-cols-12 sm:gap-6">
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3 sm:col-span-4">{ed.period}</span>
                  <span className="sm:col-span-8">
                    <span className="font-heading text-base font-semibold text-ink">{ed.school}</span>
                    <span className="text-ink-3"> — </span>
                    <span className="font-serif italic text-ink-2">{ed.degree}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal>
            <p className="label-mono mb-5">
              <span className="text-ember">03</span> <span className="text-ink-3">//</span> Off the clock
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((i) => (
                <Badge key={i} variant="gold" bracketed>
                  {i}
                </Badge>
              ))}
            </div>
            <div className="mt-6">
              <NowPlaying />
            </div>
          </Reveal>
        </div>
      </div>

      <div className="container-site mt-24">
        <Divider tick tickPosition="center" />
        <PullQuote align="center" size="lg" author={profile.name} role="on being asked what he does">
          I make systems that stay calm under load, and interfaces that don’t make people wait to find out.
        </PullQuote>
      </div>
    </PageShell>
  );
}
