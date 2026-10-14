import { motion, type HTMLMotionProps } from 'framer-motion';
import { fadeUp, stagger, viewportOnce } from '@/lib/motion';

type RevealProps = HTMLMotionProps<'div'> & {
  /** Delay in seconds */
  delay?: number;
  as?: 'div' | 'section' | 'article' | 'li' | 'ul' | 'header' | 'footer' | 'span' | 'p';
};

/** Fades + lifts its children into view once, when scrolled into the viewport. */
export function Reveal({ children, delay = 0, as = 'div', className, ...rest }: RevealProps) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={{ delay }}
      className={className}
      {...rest}
    >
      {children}
    </Component>
  );
}

type RevealGroupProps = HTMLMotionProps<'div'> & {
  staggerChildren?: number;
  delayChildren?: number;
  as?: 'div' | 'section' | 'ul' | 'ol';
};

/** Staggers `RevealItem` children. */
export function RevealGroup({ children, staggerChildren = 0.08, delayChildren = 0, as = 'div', className, ...rest }: RevealGroupProps) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component variants={stagger(staggerChildren, delayChildren)} initial="hidden" whileInView="show" viewport={viewportOnce} className={className} {...rest}>
      {children}
    </Component>
  );
}

export function RevealItem({ children, className, as = 'div', ...rest }: HTMLMotionProps<'div'> & { as?: 'div' | 'li' | 'article' }) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component variants={fadeUp} className={className} {...rest}>
      {children}
    </Component>
  );
}

export const MotionDiv = motion.div;
export type { HTMLMotionProps };
