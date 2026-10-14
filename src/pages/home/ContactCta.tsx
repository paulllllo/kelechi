import { MailIcon } from 'lucide-react';
import { BlueprintGrid, BracketButton, Button, PullQuote } from '@/components/ds';
import { Reveal } from '@/components/site/Reveal';
import { profile } from '@/data/profile';
import { RoleLink, useRole } from '@/lib/role';

export function ContactCta() {
  const { profile: rp } = useRole();

  return (
    <section id="cta" className="relative overflow-hidden border-t border-border py-24 md:py-32">
      <BlueprintGrid cellSize={32} majorEvery={4} color="var(--accent-amber)" minorOpacity={0.05} majorOpacity={0.1} fade="radial" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/10 blur-[120px]" />

      <div className="container-site relative">
        <Reveal className="mx-auto max-w-4xl text-center">
          <PullQuote size="xl" align="center" className="my-0">
            Hiring {/^[aeiou]/i.test(rp.title) ? 'an' : 'a'} {rp.title.toLowerCase()} who ships, measures, and does not panic at p99?
          </PullQuote>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <BracketButton as={RoleLink} to="/contact" size="lg">
              Start a conversation
            </BracketButton>
            <a href={`mailto:${profile.email}`} className="inline-flex">
              <Button variant="tertiary" size="lg" leadingIcon={<MailIcon />}>
                {profile.email}
              </Button>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
