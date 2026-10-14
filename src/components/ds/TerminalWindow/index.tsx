import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/cn';

export type TerminalLine = {
  type: 'command' | 'output';
  content: React.ReactNode;
};

export type TerminalCommandMap = Record<string, React.ReactNode | ((args: string[]) => React.ReactNode)>;

export type TerminalWindowProps = {
  /** Text shown centered in the title bar */
  title?: string;
  /** Prompt prefix rendered before each command */
  prompt?: string;
  /** Scripted lines played back on mount */
  lines?: TerminalLine[];
  /** Animate commands character-by-character */
  animate?: boolean;
  /** Only start the scripted playback once scrolled into view */
  startInView?: boolean;
  /** Milliseconds per typed character */
  typingSpeed?: number;
  /** Pause (ms) between lines */
  lineDelay?: number;
  /** When provided, enables an input so users can run these commands */
  commands?: TerminalCommandMap;
  /** Max height of the scrollable body */
  maxHeight?: number | string;
  /** Minimum height of the body (keeps layout stable during playback) */
  minHeight?: number | string;
  className?: string;
};

type HistoryEntry = TerminalLine & { id: number };

export function TerminalWindow({
  title = 'zsh — about',
  prompt = '~ $',
  lines = [],
  animate = true,
  startInView = true,
  typingSpeed = 32,
  lineDelay = 320,
  commands,
  maxHeight = 360,
  minHeight,
  className,
}: TerminalWindowProps) {
  const reducedMotion = usePrefersReducedMotion();
  const shouldAnimate = animate && !reducedMotion;
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, margin: '-15% 0px' });
  const started = !startInView || inView;

  const [lineIndex, setLineIndex] = useState(shouldAnimate ? 0 : lines.length);
  const [charIndex, setCharIndex] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState('');
  const [cleared, setCleared] = useState(false);
  const idRef = useRef(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scriptDone = lineIndex >= lines.length;
  const interactive = Boolean(commands);

  // Playback of scripted lines
  useEffect(() => {
    if (scriptDone || !started) return;
    const current = lines[lineIndex];
    const text = typeof current.content === 'string' ? current.content : null;

    if (current.type === 'command' && text !== null && charIndex < text.length) {
      const t = window.setTimeout(() => setCharIndex((c) => c + 1), typingSpeed);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(
      () => {
        setLineIndex((i) => i + 1);
        setCharIndex(0);
      },
      current.type === 'command' ? lineDelay : lineDelay / 2,
    );
    return () => window.clearTimeout(t);
  }, [lineIndex, charIndex, lines, scriptDone, typingSpeed, lineDelay, started]);

  // Auto-scroll to bottom
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lineIndex, charIndex, history]);

  const commandNames = useMemo(() => Object.keys(commands ?? {}), [commands]);

  const run = (raw: string) => {
    const trimmed = raw.trim();
    const [cmd, ...args] = trimmed.split(/\s+/);
    const push = (entries: TerminalLine[]) => setHistory((h) => [...h, ...entries.map((e) => ({ ...e, id: idRef.current++ }))]);

    if (!trimmed) {
      push([{ type: 'command', content: '' }]);
      return;
    }
    if (cmd === 'clear') {
      setHistory([]);
      setCleared(true);
      return;
    }
    let output: React.ReactNode;
    if (cmd === 'help') {
      output = `available: ${[...commandNames, 'clear', 'help'].join('  ')}`;
    } else if (commands && cmd in commands) {
      const value = commands[cmd];
      output = typeof value === 'function' ? (value as (args: string[]) => React.ReactNode)(args) : value;
    } else {
      output = (
        <span className="text-error">
          command not found: {cmd}. Type <span className="text-phosphor">help</span>.
        </span>
      );
    }
    push([
      { type: 'command', content: trimmed },
      { type: 'output', content: output },
    ]);
  };

  const visibleScript = cleared ? [] : lines.slice(0, Math.min(lineIndex + 1, lines.length));

  return (
    <div
      ref={rootRef}
      className={cn('w-full overflow-hidden rounded border border-border bg-surface-sunken font-mono text-[13px] text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]', className)}
      onClick={() => interactive && scriptDone && inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div className="relative flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" aria-hidden="true" />
        <span className="pointer-events-none absolute inset-x-0 text-center text-[11px] uppercase tracking-[0.14em] text-ink-3">{title}</span>
      </div>

      {/* Body */}
      <div
        ref={bodyRef}
        role="log"
        aria-live="polite"
        aria-label={title}
        className="space-y-1 overflow-y-auto p-4 leading-relaxed"
        style={{ maxHeight, minHeight }}
      >
        {visibleScript.map((line, i) => {
          const isCurrent = i === lineIndex && !scriptDone;
          const text =
            isCurrent && line.type === 'command' && typeof line.content === 'string' ? line.content.slice(0, charIndex) : line.content;
          return (
            <Line key={`s-${i}`} type={line.type} prompt={prompt}>
              {text}
              {isCurrent && line.type === 'command' && <Cursor />}
            </Line>
          );
        })}

        {history.map((line) => (
          <Line key={line.id} type={line.type} prompt={prompt}>
            {line.content}
          </Line>
        ))}

        {scriptDone && interactive && (
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              run(input);
              setInput('');
            }}
          >
            <span className="shrink-0 text-phosphor">{prompt}</span>
            <label htmlFor="terminal-input" className="sr-only">
              Terminal command
            </label>
            <input
              id="terminal-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              placeholder="type 'help'"
              className="flex-1 bg-transparent text-ink caret-phosphor outline-none placeholder:text-ink-3"
            />
          </form>
        )}

        {scriptDone && !interactive && (
          <Line type="command" prompt={prompt}>
            <Cursor blink />
          </Line>
        )}
      </div>
    </div>
  );
}

function Line({ type, prompt, children }: { type: TerminalLine['type']; prompt: string; children: React.ReactNode }) {
  if (type === 'command') {
    return (
      <div className="flex gap-2">
        <span className="shrink-0 text-phosphor">{prompt}</span>
        <span className="whitespace-pre-wrap break-words text-ink">{children}</span>
      </div>
    );
  }
  return <div className="whitespace-pre-wrap break-words text-ink-2">{children}</div>;
}

function Cursor({ blink = false }: { blink?: boolean }) {
  return <span aria-hidden="true" className={cn('ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-phosphor', blink && 'animate-blink')} />;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);
  return reduced;
}
