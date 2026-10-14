import { twMerge } from 'tailwind-merge';

type ClassValue = string | number | null | undefined | false | ClassValue[];

function flatten(values: ClassValue[]): string[] {
  const out: string[] = [];
  for (const v of values) {
    if (!v && v !== 0) continue;
    if (Array.isArray(v)) out.push(...flatten(v));
    else out.push(String(v));
  }
  return out;
}

/** Tailwind-aware class joiner. */
export function cn(...values: ClassValue[]): string {
  return twMerge(flatten(values).join(' '));
}
