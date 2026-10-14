import { Badge, CornerFramePanel } from '@/components/ds';
import { Section } from '@/components/site/Section';
import { RevealGroup, RevealItem } from '@/components/site/Reveal';
import { PILLARS } from '@/data/skills';
import { RoleLink, useRole } from '@/lib/role';
import { cn } from '@/lib/cn';

/** The three things a visitor should grasp in ten seconds. Ordered by lens. */
export function Competencies() {
  const { profile } = useRole();
  const pillars = profile.pillarOrder.map((id) => PILLARS[id]);

  return (
    <Section
      id="competencies"
      header={{
        index: 2,
        label: 'Core competencies',
        title: (
          <>
            Three disciplines, <span className="serif-accent text-ember">one engineer.</span>
          </>
        ),
      }}
    >
      <RevealGroup className="grid gap-8 lg:grid-cols-3" staggerChildren={0.12}>
        {pillars.map((p, i) => {
          const primary = i === 0;
          return (
            <RevealItem key={p.id} className="flex">
              <CornerFramePanel
                tone={primary ? 'ember' : 'default'}
                padding="lg"
                label={`${String(i + 1).padStart(2, '0')} // ${p.index}`}
                meta={primary ? 'Primary' : undefined}
                className={cn('flex-1', primary && 'shadow-[0_0_40px_-10px_rgba(255,90,54,0.25)]')}
                interactive
                as={RoleLink}
                to={`/work?pillar=${p.id}`}
              >
                <h3 className="font-heading text-2xl font-semibold leading-tight tracking-tight text-ink">{p.title}</h3>
                <p className="mt-3 font-serif text-lg italic text-ink-2">{p.tagline}</p>

                <div className="mt-8 flex flex-wrap gap-1.5">
                  {p.stack.slice(0, 5).map((s) => (
                    <Badge key={s} size="sm" bracketed={false} variant="neutral">
                      {s}
                    </Badge>
                  ))}
                </div>
              </CornerFramePanel>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
