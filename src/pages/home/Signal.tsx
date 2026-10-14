import { TerminalWindow } from '@/components/ds';
import { NowPlaying } from '@/components/site/NowPlaying';
import { Section } from '@/components/site/Section';
import { Reveal } from '@/components/site/Reveal';
import { profile } from '@/data/profile';
import { EXPERIENCE } from '@/data/experience';
import { PILLARS } from '@/data/skills';
import { useRole } from '@/lib/role';

export function Signal() {
  const { profile: rp } = useRole();

  return (
    <Section
      id="signal"
      compact
      header={{
        index: 7,
        label: 'Signal',
        title: (
          <>
            Off the clock, <span className="serif-accent text-ember">still transmitting.</span>
          </>
        ),
        size: 'sm',
      }}
    >
      <div className="grid gap-5 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <TerminalWindow
            title={`zsh — ${profile.firstName.toLowerCase()}@lagos`}
            prompt="❯"
            typingSpeed={28}
            maxHeight={380}
            minHeight={300}
            lines={[
              { type: 'command', content: 'whoami' },
              { type: 'output', content: `${profile.fullName} — ${rp.title}, ${profile.location}` },
              { type: 'command', content: 'uptime' },
              { type: 'output', content: `${profile.yearsExperience}+ years shipping · currently at ${EXPERIENCE[0].company}` },
              { type: 'command', content: 'ls ./competencies' },
              { type: 'output', content: Object.values(PILLARS).map((p) => p.title.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')).join('   ') },
              { type: 'command', content: 'cat interests.txt' },
              { type: 'output', content: profile.interests.join(' · ') },
            ]}
            commands={{
              whoami: `${profile.fullName} — ${rp.title}`,
              stack: Object.values(PILLARS).flatMap((p) => p.stack.slice(0, 3)).join(' · '),
              contact: (
                <span>
                  email → <a className="text-phosphor underline underline-offset-4" href={`mailto:${profile.email}`}>{profile.email}</a>
                </span>
              ),
              resume: (
                <span>
                  <a className="text-phosphor underline underline-offset-4" href={profile.resumeUrl} download>
                    downloading Odigbo_Kelechi_Paul_Resume.pdf
                  </a>{' '}
                  …
                </span>
              ),
              coffee: 'Error 418: I am a teapot. (Also, yes, let’s.)',
              hire: 'Great instinct. Try `contact`.',
              sudo: 'Nice try. Permission denied — but I respect the ambition.',
              chess: 'Blitz rating: classified. Bullet rating: shameful. Open to a game anyway.',
              basketball: 'Point guard energy, power forward verticals. Lagos pick-up, Saturday mornings.',
              food: 'Running list of the best places to eat in Ikeja is 47 entries long and growing.',
              uptime: `${profile.yearsExperience}+ years, zero regrets, several post-mortems.`,
              ls: 'work/  experience/  playground/  blog/  about/  contact/',
              cd: (args) => `cd: this is a portfolio, not a filesystem. Try the nav for ${args[0] ?? '~'}.`,
              echo: (args) => args.join(' ') || '',
            }}
          />
        </Reveal>
        <Reveal className="lg:col-span-5" delay={0.1}>
          <NowPlaying />
        </Reveal>
      </div>
    </Section>
  );
}
