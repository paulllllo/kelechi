import { useEffect, useState } from 'react';

export interface NowPlaying {
  isPlaying: boolean;
  title: string;
  artist: string;
  album?: string;
  albumArt?: string;
  url?: string;
  progressMs?: number;
  durationMs?: number;
  /** 'live' = from the API, 'recent' = last played, 'fallback' = static placeholder */
  source: 'live' | 'recent' | 'fallback';
}

/** Shown when the API is unreachable (no server running / not configured). */
export const FALLBACK_TRACK: NowPlaying = {
  isPlaying: false,
  title: 'Nothing playing',
  artist: 'Connect Spotify to see what’s on',
  album: 'server/index.js → /api/now-playing',
  source: 'fallback',
};

export function useNowPlaying(pollMs = 30_000) {
  const [data, setData] = useState<NowPlaying>(FALLBACK_TRACK);
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    const load = async () => {
      try {
        const res = await fetch('/api/now-playing', { headers: { accept: 'application/json' } });
        if (!res.ok) throw new Error(String(res.status));
        const json = (await res.json()) as NowPlaying;
        if (!cancelled) {
          setData(json);
          setStatus('ok');
        }
      } catch {
        if (!cancelled) {
          setData(FALLBACK_TRACK);
          setStatus('error');
        }
      } finally {
        if (!cancelled) timer = window.setTimeout(load, pollMs);
      }
    };

    load();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [pollMs]);

  return { data, status };
}
