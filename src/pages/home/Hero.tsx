import { motion } from 'framer-motion';
import { DownloadIcon } from 'lucide-react';
import { Badge, BlueprintGrid, BracketButton, Button, RulerEdge } from '@/components/ds';
import { Portrait } from '@/components/site/Portrait';
import { Marquee } from '@/components/site/Marquee';
import { profile } from '@/data/profile';
import { STACK } from '@/data/skills';
import { RoleLink, useRole } from '@/lib/role';
import { EASE_OUT_EXPO } from '@/lib/motion';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT_EXPO } },
};

export function Hero() {
  const { profile: rp, role } = useRole();

  const tickerItems = STACK.flatMap((g) => g.items)
    .filter((i) => role === 'fullstack' || i.roles.includes(role))
    .map((i) => i.name);

  return (
    <section className="relative overflow-hidden">
      <BlueprintGrid cellSize={28} majorEvery={4} color="var(--text-primary)" minorOpacity={0.04} majorOpacity={0.08} fade="top" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-ember/10 blur-[140px]" />

      <div className="container-site relative grid items-center gap-16 pb-20 pt-16 md:pt-24 lg:grid-cols-12 lg:gap-16 lg:pb-28">
        {/* Copy */}
        <motion.div variants={container} initial="hidden" animate="show" className="lg:col-span-7">
          <motion.div variants={item} className="mb-8">
            <Badge variant="phosphor" dot>
              {profile.availability.label}
            </Badge>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-heading text-[2.6rem] font-semibold leading-[1.02] tracking-tight text-ink text-balance sm:text-6xl lg:text-[4.6rem]"
          >
            {rp.headline.lead}{' '}
            <span className="serif-accent text-ember text-glow-ember">{rp.headline.accent}</span>
            {rp.headline.tail && <span className="text-ink-2"> {rp.headline.tail}</span>}
          </motion.h1>

          <motion.p variants={item} className="mt-8 max-w-xl text-lg leading-relaxed text-ink-2 text-pretty">
            {rp.lede}
          </motion.p>

          <motion.div variants={item} className="mt-12 flex flex-wrap items-center gap-4">
            <BracketButton as={RoleLink} to="/work" size="md">
              {rp.cta.primary}
            </BracketButton>
            <a href={profile.resumeUrl} download className="inline-flex">
              <Button variant="secondary" size="lg" leadingIcon={<DownloadIcon />} className="h-12">
                {rp.cta.secondary}
              </Button>
            </a>
          </motion.div>
        </motion.div>

        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.25 }}
          className="relative mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none"
        >
          <div aria-hidden="true" className="absolute -inset-6 -z-10 rounded-full bg-ember/10 blur-3xl" />
          <Portrait />
        </motion.div>
      </div>

      {/* Ticker */}
      <div className="relative border-y border-border bg-surface-sunken/60">
        <RulerEdge side="top" spacing={8} majorEvery={8} size={10} tone="muted" baseline={false} className="absolute inset-x-0 top-0" />
        <div className="py-4">
          <Marquee items={tickerItems} duration={Math.max(30, tickerItems.length * 2.2)} />
        </div>
      </div>
    </section>
  );
}
