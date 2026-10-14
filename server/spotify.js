/**
 * Shared Spotify "now playing" lookup.
 * Used by the local Express server and by the Vercel function in /api.
 */

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENT_URL = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';
const CACHE_MS = 15_000;

let accessToken = null;
let accessTokenExpiresAt = 0;
let cache = { at: 0, payload: null };

function creds() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;
  return { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN };
}

export function spotifyConfigured() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = creds();
  return Boolean(SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET && SPOTIFY_REFRESH_TOKEN);
}

function basicAuth() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = creds();
  return `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`;
}

async function getAccessToken() {
  if (accessToken && Date.now() < accessTokenExpiresAt - 10_000) return accessToken;
  const { SPOTIFY_REFRESH_TOKEN } = creds();
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { Authorization: basicAuth(), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: SPOTIFY_REFRESH_TOKEN }),
  });
  if (!res.ok) throw new Error(`token refresh failed: ${res.status}`);
  const json = await res.json();
  accessToken = json.access_token;
  accessTokenExpiresAt = Date.now() + json.expires_in * 1000;
  return accessToken;
}

function shapeTrack(item, { isPlaying, progressMs, source }) {
  return {
    isPlaying,
    title: item.name,
    artist: item.artists.map((a) => a.name).join(', '),
    album: item.album?.name,
    albumArt: item.album?.images?.[1]?.url ?? item.album?.images?.[0]?.url,
    url: item.external_urls?.spotify,
    progressMs,
    durationMs: item.duration_ms,
    source,
  };
}

/** @returns {Promise<{ status: number, body: object }>} */
export async function getNowPlaying() {
  if (!spotifyConfigured()) {
    return { status: 503, body: { error: 'spotify not configured', hint: 'set SPOTIFY_* env vars' } };
  }
  if (cache.payload && Date.now() - cache.at < CACHE_MS) return { status: 200, body: cache.payload };

  const token = await getAccessToken();
  const headers = { Authorization: `Bearer ${token}` };

  let payload;
  const now = await fetch(NOW_PLAYING_URL, { headers });
  if (now.status === 200) {
    const json = await now.json();
    if (json?.item) {
      payload = shapeTrack(json.item, { isPlaying: Boolean(json.is_playing), progressMs: json.progress_ms, source: 'live' });
    }
  }
  if (!payload) {
    const recent = await fetch(RECENT_URL, { headers });
    if (recent.ok) {
      const json = await recent.json();
      const item = json?.items?.[0]?.track;
      if (item) payload = shapeTrack(item, { isPlaying: false, progressMs: 0, source: 'recent' });
    }
  }
  if (!payload) payload = { isPlaying: false, title: 'Nothing playing', artist: 'Silence, apparently', source: 'recent' };

  cache = { at: Date.now(), payload };
  return { status: 200, body: payload };
}
