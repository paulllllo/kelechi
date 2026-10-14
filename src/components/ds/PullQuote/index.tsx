import React from 'react';
import { cn } from '@/lib/cn';

export type PullQuoteSize = 'md' | 'lg' | 'xl';
export type PullQuoteAlign = 'left' | 'center';

export interface PullQuoteProps {
  /** The quote text */
  children: React.ReactNode;
  /** Optional attribution name */
  author?: string;
  /** Optional attribution role / company */
  role?: string;
  /** Type scale of the quote */
  size?: PullQuoteSize;
  /** Text alignment */
  align?: PullQuoteAlign;
  /** Show a vertical rule on the left (left alignment only) */
  bordered?: boolean;
  className?: string;
}

const sizeClasses: Record<PullQuoteSize, string> = {
  md: 'text-2xl md:text-3xl',
  lg: 'text-3xl md:text-4xl lg:text-5xl',
  xl: 'text-4xl md:text-5xl lg:text-6xl',
};

export function PullQuote({ children, author, role, size = 'lg', align = 'left', bordered = false, className = '' }: PullQuoteProps) {
  const isCenter = align === 'center';
  const showBorder = bordered && !isCenter;

  return (
    <figure
      className={cn(
        'my-12 w-full max-w-3xl md:my-16',
        isCenter ? 'mx-auto text-center' : 'text-left',
        showBorder && 'border-l-2 border-ember pl-6 md:pl-8',
        className,
      )}
    >
      <blockquote className={cn('font-serif italic font-normal leading-[1.1] tracking-[-0.01em] text-balance text-ink', sizeClasses[size])}>
        <p>
          <span aria-hidden="true" className="text-ember">
            “
          </span>
          {children}
          <span aria-hidden="true" className="text-ember">
            ”
          </span>
        </p>
      </blockquote>
      {(author || role) && (
        <figcaption className={cn('mt-6 flex flex-wrap items-center gap-x-2 font-mono text-xs uppercase tracking-wider', isCenter && 'justify-center')}>
          <span aria-hidden="true" className="inline-block h-px w-6 bg-ember opacity-70" />
          {author && <span className="font-medium text-ink">{author}</span>}
          {role && <span className="text-ink-3">{role}</span>}
        </figcaption>
      )}
    </figure>
  );
}
