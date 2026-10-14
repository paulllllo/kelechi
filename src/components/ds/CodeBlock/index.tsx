import { useEffect, useMemo, useState } from 'react';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

export type CodeBlockLanguage = 'tsx' | 'ts' | 'js' | 'jsx' | 'css' | 'json' | 'bash' | 'python' | 'plain';

export interface CodeBlockProps {
  /** Source code to render. Leading/trailing blank lines are trimmed. */
  code: string;
  /** Language used for syntax styling. */
  language?: CodeBlockLanguage;
  /** Optional filename shown in the header bar. */
  filename?: string;
  /** Show the line-number gutter. */
  showLineNumbers?: boolean;
  /** Number of the first line (useful for excerpts). */
  startLine?: number;
  /** Line numbers (relative to startLine) to emphasize. */
  highlightLines?: number[];
  /** Show the copy-to-clipboard button. */
  showCopy?: boolean;
  /** Optional caption rendered beneath the panel. */
  caption?: string;
  /** Max height before the body scrolls (any CSS length). */
  maxHeight?: string;
  className?: string;
}

type TokenType = 'comment' | 'string' | 'keyword' | 'number' | 'function' | 'tag' | 'property' | 'punctuation' | 'text';

interface Token {
  type: TokenType;
  value: string;
}

const TOKEN_CLASSES: Record<TokenType, string> = {
  comment: 'text-ink-3 italic',
  string: 'text-phosphor',
  keyword: 'text-ember',
  number: 'text-gold',
  function: 'text-teal',
  tag: 'text-[#ffb38a]',
  property: 'text-[#9ad9d0]',
  punctuation: 'text-ink-3',
  text: 'text-ink',
};

const LANGUAGE_LABELS: Record<CodeBlockLanguage, string> = {
  tsx: 'TSX',
  ts: 'TypeScript',
  js: 'JavaScript',
  jsx: 'JSX',
  css: 'CSS',
  json: 'JSON',
  bash: 'Shell',
  python: 'Python',
  plain: 'Text',
};

export function CodeBlock({
  code,
  language = 'tsx',
  filename,
  showLineNumbers = true,
  startLine = 1,
  highlightLines = [],
  showCopy = true,
  caption,
  maxHeight,
  className = '',
}: CodeBlockProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const source = useMemo(() => trimBlankLines(code), [code]);
  const lines = useMemo(() => splitTokensIntoLines(tokenize(source, language)), [source, language]);
  const highlightSet = useMemo(() => new Set(highlightLines), [highlightLines]);
  const gutterWidth = String(startLine + lines.length - 1).length;

  useEffect(() => {
    if (copyState === 'idle') return;
    const t = window.setTimeout(() => setCopyState('idle'), 1800);
    return () => window.clearTimeout(t);
  }, [copyState]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
  };

  const copyLabel = copyState === 'copied' ? 'Copied' : copyState === 'error' ? 'Copy failed' : 'Copy code';

  return (
    <figure className={cn('w-full', className)}>
      <div className="overflow-hidden rounded border border-border bg-surface-sunken text-ink">
        <div className="flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-border-strong" />
              <span className="h-2 w-2 rounded-full bg-border-strong" />
              <span className="h-2 w-2 rounded-full bg-border-strong" />
            </span>
            {filename && <span className="truncate font-mono text-xs text-ink-2">{filename}</span>}
            <span className="shrink-0 rounded-sm bg-surface-raised px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-ink-3">
              {LANGUAGE_LABELS[language]}
            </span>
          </div>
          {showCopy && (
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copyLabel}
              className="inline-flex h-7 items-center gap-1.5 rounded-sm px-2 font-mono text-[11px] uppercase tracking-wider text-ink-3 transition-colors hover:bg-surface-raised hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
            >
              {copyState === 'copied' ? (
                <CheckIcon className="h-3.5 w-3.5 text-phosphor" aria-hidden="true" />
              ) : (
                <CopyIcon className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span className="hidden sm:inline" aria-live="polite">
                {copyState === 'idle' ? 'Copy' : copyLabel}
              </span>
            </button>
          )}
        </div>

        <div className="overflow-auto" style={{ maxHeight }}>
          <pre
            className="m-0 py-3 font-mono text-[13px] leading-6"
            aria-label={filename ? `Code: ${filename}` : 'Code snippet'}
          >
            <code className="block min-w-max">
              {lines.map((lineTokens, i) => {
                const lineNo = startLine + i;
                const isHighlighted = highlightSet.has(lineNo);
                return (
                  <span key={i} className={cn('flex pr-6', isHighlighted && 'bg-ember/10')}>
                    {showLineNumbers && (
                      <span
                        aria-hidden="true"
                        className={cn(
                          'sticky left-0 shrink-0 select-none bg-surface-sunken pl-4 pr-4 text-right',
                          isHighlighted ? 'text-ember' : 'text-ink-3',
                        )}
                        style={{ minWidth: `calc(${gutterWidth}ch + 2rem)` }}
                      >
                        {lineNo}
                      </span>
                    )}
                    <span className={showLineNumbers ? '' : 'pl-4'}>
                      {lineTokens.length === 0
                        ? '\u00A0'
                        : lineTokens.map((tok, j) => (
                            <span key={j} className={TOKEN_CLASSES[tok.type]}>
                              {tok.value}
                            </span>
                          ))}
                    </span>
                  </span>
                );
              })}
            </code>
          </pre>
        </div>
      </div>
      {caption && <figcaption className="mt-2 font-mono text-xs text-ink-3">{caption}</figcaption>}
    </figure>
  );
}

// ---------- helpers ----------

function trimBlankLines(code: string): string {
  return code.replace(/^\s*\n/, '').replace(/\n\s*$/, '');
}

const JS_KEYWORDS =
  'import|from|export|default|const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|extends|interface|type|enum|implements|async|await|try|catch|finally|throw|typeof|instanceof|in|of|as|true|false|null|undefined|this|void|readonly|public|private|protected|static';

const PY_KEYWORDS =
  'def|class|return|if|elif|else|for|while|import|from|as|with|try|except|finally|raise|lambda|yield|async|await|pass|break|continue|and|or|not|in|is|None|True|False|self|global|nonlocal|assert|del';

function buildPattern(language: CodeBlockLanguage): RegExp | null {
  switch (language) {
    case 'ts':
    case 'tsx':
    case 'js':
    case 'jsx':
      return new RegExp(
        [
          '(?<comment>\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)',
          '(?<string>`(?:\\\\[\\s\\S]|[^`\\\\])*`|"(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\')',
          '(?<tag><\\/?[A-Za-z][\\w.]*|\\/?>)',
          `(?<keyword>\\b(?:${JS_KEYWORDS})\\b)`,
          '(?<number>\\b\\d+(?:\\.\\d+)?\\b)',
          '(?<function>\\b[A-Za-z_$][\\w$]*(?=\\s*\\())',
          '(?<punctuation>[{}()[\\];,.=<>+\\-*/!?:&|])',
        ].join('|'),
        'g',
      );
    case 'python':
      return new RegExp(
        [
          '(?<comment>#[^\\n]*)',
          '(?<string>"""[\\s\\S]*?"""|\'\'\'[\\s\\S]*?\'\'\'|"(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\')',
          `(?<keyword>\\b(?:${PY_KEYWORDS})\\b)`,
          '(?<number>\\b\\d+(?:\\.\\d+)?\\b)',
          '(?<function>\\b[A-Za-z_][\\w]*(?=\\s*\\())',
          '(?<punctuation>[{}()[\\];,.=<>+\\-*/!?:&|])',
        ].join('|'),
        'g',
      );
    case 'css':
      return new RegExp(
        [
          '(?<comment>\\/\\*[\\s\\S]*?\\*\\/)',
          '(?<string>"[^"\\n]*"|\'[^\'\\n]*\')',
          '(?<keyword>@[\\w-]+|!important)',
          '(?<property>[\\w-]+(?=\\s*:))',
          '(?<number>#[0-9a-fA-F]{3,8}\\b|-?\\d*\\.?\\d+(?:px|rem|em|%|vh|vw|s|ms|deg)?\\b)',
          '(?<function>[\\w-]+(?=\\())',
          '(?<punctuation>[{}();:,])',
        ].join('|'),
        'g',
      );
    case 'json':
      return new RegExp(
        [
          '(?<property>"(?:\\\\.|[^"\\\\])*"(?=\\s*:))',
          '(?<string>"(?:\\\\.|[^"\\\\])*")',
          '(?<keyword>\\b(?:true|false|null)\\b)',
          '(?<number>-?\\b\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?\\b)',
          '(?<punctuation>[{}[\\]:,])',
        ].join('|'),
        'g',
      );
    case 'bash':
      return new RegExp(
        [
          '(?<comment>#[^\\n]*)',
          '(?<string>"(?:\\\\.|[^"\\\\])*"|\'[^\']*\')',
          '(?<keyword>\\b(?:npm|npx|pnpm|yarn|git|cd|export|echo|sudo|if|then|fi|for|do|done|curl|node|python)\\b)',
          '(?<property>(?:^|\\s)--?[\\w-]+)',
          '(?<function>\\$[\\w{}]+)',
          '(?<punctuation>[|&;><])',
        ].join('|'),
        'gm',
      );
    default:
      return null;
  }
}

export function tokenize(code: string, language: CodeBlockLanguage): Token[] {
  const pattern = buildPattern(language);
  if (!pattern) return [{ type: 'text', value: code }];
  const tokens: Token[] = [];
  let last = 0;
  for (const match of code.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > last) tokens.push({ type: 'text', value: code.slice(last, index) });
    const groups = match.groups ?? {};
    const type = (Object.keys(groups).find((k) => groups[k] !== undefined) ?? 'text') as TokenType;
    tokens.push({ type, value: match[0] });
    last = index + match[0].length;
  }
  if (last < code.length) tokens.push({ type: 'text', value: code.slice(last) });
  return tokens;
}

function splitTokensIntoLines(tokens: Token[]): Token[][] {
  const lines: Token[][] = [[]];
  for (const tok of tokens) {
    const parts = tok.value.split('\n');
    parts.forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ type: tok.type, value: part });
    });
  }
  return lines;
}
