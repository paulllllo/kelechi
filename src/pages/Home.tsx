import { PageShell } from '@/components/site/PageShell';
import { Hero } from './home/Hero';
import { Proof } from './home/Proof';
import { Competencies } from './home/Competencies';
import { SelectedWork } from './home/SelectedWork';
import { Experience } from './home/Experience';
import { Process } from './home/Process';
import { Stack } from './home/Stack';
import { Signal } from './home/Signal';
import { Writing } from './home/Writing';
import { ContactCta } from './home/ContactCta';

/**
 * Home — conversion-ordered:
 *   1. Hero: positioning + portrait + CTA
 *   2. Proof: four outcomes, counted up
 *   3. Competencies: the three pillars (ordered by lens)
 *   4. Selected work: case studies (ordered by lens)
 *   5. Experience: timeline with lens-weighted bullets
 *   6. Process: how I work
 *   7. Stack
 *   8. Signal: terminal + Spotify (personality)
 *   9. Writing: blog teasers
 *  10. CTA
 */
export default function Home() {
  return (
    <PageShell>
      <Hero />
      <Proof />
      <Competencies />
      <SelectedWork />
      <Experience />
      <Process />
      <Stack />
      <Signal />
      <Writing />
      <ContactCta />
    </PageShell>
  );
}
