import { motion } from 'framer-motion';
import { Section } from '@/components/site/Section';
import { RevealGroup, RevealItem } from '@/components/site/Reveal';
import { STACK } from '@/data/skills';
import { useRole } from '@/lib/role';
import { cn } from '@/lib/cn';

export function Stack() {
  const { role } = useRole();

  return (
    <Section
      id="stack"
      compact
      header={{
        index: 6,
        label: 'Stack',
        title: (
          <>
            Tools I reach for <span className="serif-accent text-ember">without thinking.</span>
          </>
        ),
        size: 'sm',
      }}
    >
      <RevealGroup className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4" staggerChildren={0.08}>
        {STACK.map((group) => (
          <RevealItem key={group.label} className="bg-surface/80 p-6">
            <h3 className="label-mono mb-5 flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-ember" aria-hidden="true" />
              {group.label}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => {
                const hot = role === 'fullstack' ? item.level === 'core' : item.roles.includes(role);
                return (
                  <motion.li
                    key={item.name}
                    layout
                    className={cn(
                      'rounded-sm border px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors duration-300',
                      hot ? 'border-ember/50 bg-ember/10 text-ink shadow-[0_0_14px_-4px_rgba(255,90,54,0.5)]' : 'border-border text-ink-3',
                    )}
                  >
                    {item.name}
                  </motion.li>
                );
              })}
            </ul>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
