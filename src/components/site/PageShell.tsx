import React from 'react';
import { motion } from 'framer-motion';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { EASE_OUT_EXPO } from '@/lib/motion';

/** Wraps page content with nav, footer and a page-transition fade. */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <Nav />
      <motion.main
        className="flex-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}

interface PageHeaderProps {
  index: string;
  label: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  aside?: React.ReactNode;
}

/** Standard header for inner pages. */
export function PageHeader({ index, label, title, description, aside }: PageHeaderProps) {
  return (
    <div className="container-site pt-16 md:pt-24">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="label-mono mb-5 flex items-center gap-3">
            <span className="text-ember">{index}</span>
            <span className="text-ink-3">//</span>
            <span>{label}</span>
          </p>
          <h1 className="font-heading text-4xl font-semibold leading-[1.02] tracking-tight text-ink text-balance md:text-6xl">{title}</h1>
          {description && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">{description}</p>}
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </div>
    </div>
  );
}
