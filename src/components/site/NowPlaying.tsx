import { useEffect, useState } from 'react';
import { ExternalLinkIcon, Music2Icon } from 'lucide-react';
import { CornerFramePanel, StatusDot } from '@/components/ds';
import { useNowPlaying } from '@/lib/useNowPlaying';
import { cn } from '@/lib/cn';

/** Spotify "now playing" widget. Degrades to a static placeholder when the API isn't available. */
export function NowPlaying({ className }: { className?: string }) {
  const { data, status } = useNowPlaying();
  const live = data.source === 'live' && data.isPlaying;
  const [progress, setProgress] = useState(data.progressMs ?? 0);

  // Local progress interpolation between polls
  useEffect(() => {
    setProgress(data.progressMs ?? 0);
    if (!live || !data.durationMs) return;
    const id = window.setInterval(() => setProgress((p) => Math.min((data.durationMs ?? 0), p + 1000)), 1000);
    return () => window.clearInterval(id);
  }, [data, live]);

  const pct = data.durationMs ? Math.min(100, (progress / data.durationMs) * 100) : 0;

  return (
    <CornerFramePanel
      label="SIG.01 // Spotify"
      meta={
        <span className="inline-flex items-center gap-2">
          <StatusDot status={live ? 'online' : 'idle'} size="sm" label={null} pulse={live} />
          {live ? 'Now playing' : data.source === 'recent' ? 'Last played' : status === 'loading' ? 'Connecting' : 'Offline'}
        </span>
      }
      tone={live ? 'accent' : 'default'}
      padding="md"
      className={cn('h-full', className)}
    >
      <div className="flex gap-5">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden border border-border bg-surface-sunken">
          {data.albumArt ? (
            <img src={data.albumArt} alt={data.album ? `${data.album} cover` : 'Album cover'} className="h-full w-full object-cover grayscale-portrait" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ink-3">
              <Music2Icon className="h-7 w-7" />
            </div>
          )}
          {live && (
            <div className="absolute inset-x-0 bottom-0 flex h-6 items-end justify-center gap-[3px] bg-gradient-to-t from-background/90 to-transparent pb-1.5" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className="w-[3px] origin-bottom bg-phosphor" style={{ animation: `eq 0.9s ease-in-out ${i * 0.12}s infinite alternate`, height: 8 + ((i * 7) % 10) }} />
              ))}
              <style>{`@keyframes eq { from { transform: scaleY(0.35) } to { transform: scaleY(1) } }`}</style>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-heading text-lg font-semibold leading-tight text-ink">{data.title}</p>
          <p className="mt-1 truncate font-serif text-base italic text-ink-2">{data.artist}</p>
          {data.album && <p className="mt-2 truncate font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">{data.album}</p>}

          <div className="mt-4">
            <div className="h-px w-full bg-border" role={live ? 'progressbar' : undefined} aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-px bg-phosphor transition-[width] duration-1000 ease-linear" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-1.5 flex justify-between font-mono text-[10px] tabular-nums text-ink-3">
              <span>{fmt(progress)}</span>
              <span>{data.durationMs ? fmt(data.durationMs) : '--:--'}</span>
            </div>
          </div>
        </div>
      </div>

      {data.url && (
        <a
          href={data.url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3 transition-colors hover:text-phosphor"
        >
          Open in Spotify
          <ExternalLinkIcon className="h-3 w-3" />
        </a>
      )}
    </CornerFramePanel>
  );
}

function fmt(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
