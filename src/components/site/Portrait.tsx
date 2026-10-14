import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { CoordinateTag, GrainOverlay } from '@/components/ds';
import { profile } from '@/data/profile';
import { cn } from '@/lib/cn';

interface PortraitProps {
  /** Image path. Defaults to /public/PORTRAIT.png. */
  src?: string;
  alt?: string;
  className?: string;
  /** Figure label in the frame header */
  label?: string;
}

/**
 * Greyscale portrait in a HUD frame: corner brackets, scanline sweep, grain,
 * subtle pointer parallax. Falls back to an explicit placeholder when the
 * image is missing so the slot is obvious during development.
 */
export function Portrait({ src = '/PORTRAIT.png', alt = `${profile.name} — portrait`, className, label = 'FIG. 01 // OPERATOR' }: PortraitProps) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 18 });
  const tx = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 20 });
  const ty = useSpring(useTransform(my, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 20 });

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.figure
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      className={cn('group relative aspect-[4/5] w-full select-none', className)}
    >
      {/* Frame */}
      <div className="absolute inset-0 border border-border-strong bg-surface-sunken" />
      <CornerBrackets />

      {/* Header strip */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between border-b border-border/80 bg-background/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3 backdrop-blur-sm">
        <span>{label}</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_8px_rgba(255,90,54,0.8)]" aria-hidden="true" />
          REC
        </span>
      </div>

      {/* Image */}
      <motion.div style={{ x: tx, y: ty }} className="absolute inset-[1px] overflow-hidden">
        {!failed ? (
          <img
            src={src}
            alt={alt}
            onError={() => setFailed(true)}
            className="grayscale-portrait h-full w-full scale-[1.06] object-cover object-center transition-[filter,transform] duration-700 ease-out-expo group-hover:scale-[1.09] group-hover:brightness-105"
            loading="eager"
          />
        ) : (
          <Placeholder />
        )}

        {/* Tonal wash to sit the photo into the palette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/20 mix-blend-multiply" />
        <div className="pointer-events-none absolute inset-0 bg-ember/[0.07] mix-blend-color" />

        {/* Scanline sweep */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 h-24 animate-scan bg-gradient-to-b from-transparent via-ink/[0.07] to-transparent"
        />
        <GrainOverlay position="absolute" grainOpacity={0.12} scanlineOpacity={0.12} scanlineSpacing={3} animated={false} zIndex={10} />
      </motion.div>

      {/* Footer meta */}
      <figcaption className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-2 border-t border-border/80 bg-background/60 px-3 py-1.5 backdrop-blur-sm">
        <CoordinateTag variant="plain" label="LOC" coordinates={profile.coordinates} precision={2} className="text-[10px]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">{profile.locationShort} · GREYSCALE</span>
      </figcaption>
    </motion.figure>
  );
}

function CornerBrackets() {
  const b = 'pointer-events-none absolute z-30 h-5 w-5 border-ember transition-transform duration-300 group-hover:scale-125';
  return (
    <>
      <span aria-hidden="true" className={cn(b, '-left-px -top-px origin-top-left border-l-2 border-t-2')} />
      <span aria-hidden="true" className={cn(b, '-right-px -top-px origin-top-right border-r-2 border-t-2')} />
      <span aria-hidden="true" className={cn(b, '-bottom-px -left-px origin-bottom-left border-b-2 border-l-2')} />
      <span aria-hidden="true" className={cn(b, '-bottom-px -right-px origin-bottom-right border-b-2 border-r-2')} />
    </>
  );
}

function Placeholder() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-surface text-center">
      {/* Halftone-ish backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--border-strong) 1px, transparent 1.2px)',
          backgroundSize: '10px 10px',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, #000 20%, transparent 75%)',
          maskImage: 'radial-gradient(ellipse at 50% 40%, #000 20%, transparent 75%)',
        }}
      />
      {/* Silhouette */}
      <svg viewBox="0 0 200 250" className="relative z-10 h-[62%] w-auto text-border-strong" aria-hidden="true">
        <defs>
          <linearGradient id="sil" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.9" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="78" r="46" fill="url(#sil)" />
        <path d="M20 250c0-56 36-92 80-92s80 36 80 92" fill="url(#sil)" />
      </svg>
      <div className="relative z-10 mt-6 space-y-1 px-6 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">
        <p className="text-ink-2">Portrait placeholder</p>
        <p>
          drop <span className="text-ember">/public/PORTRAIT.png</span>
        </p>
        <p>greyscale applied automatically</p>
      </div>
    </div>
  );
}
