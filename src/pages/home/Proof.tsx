import { MetricStat } from '@/components/ds';
import { RevealGroup, RevealItem } from '@/components/site/Reveal';
import { getMetrics } from '@/data/metrics';
import { useRole } from '@/lib/role';

/** Proof strip: four role-weighted outcomes, counted up on scroll. */
export function Proof() {
  const { profile } = useRole();
  const metrics = getMetrics(profile.proof);

  return (
    <section id="proof" className="relative py-16 md:py-20">
      <div className="container-site">
        <RevealGroup className="grid grid-cols-2 gap-x-10 gap-y-12 lg:grid-cols-4" staggerChildren={0.1}>
          {metrics.map((m) => (
            <RevealItem key={m.id}>
              <MetricStat
                divider
                size="md"
                value={m.value}
                unit={m.unit}
                prefix={m.prefix}
                label={m.label}
                caption={m.caption}
                delta={m.source}
                trend="neutral"
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
