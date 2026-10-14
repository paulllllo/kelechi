/**
 * Minimal Express server — the only backend this portfolio needs.
 *
 * It exists for one reason: Spotify's "currently playing" endpoint requires
 * a user OAuth token, which cannot live in the browser. This server holds a
 * refresh token, mints access tokens, and exposes a tiny cached JSON endpoint.
 *
 *   GET /api/now-playing  → { isPlaying, title, artist, album, albumArt, url, progressMs, durationMs, source }
 *   GET /api/health       → { ok: true }
 *
 * Setup (one time):
 *   1. Create an app at https://developer.spotify.com/dashboard
 *      Redirect URI: http://127.0.0.1:8787/api/spotify/callback
 *      (Spotify rejects "localhost"; the loopback IP is required.)
 *   2. Copy .env.example → .env and fill SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET
 *   3. `npm run dev:server`, open http://localhost:8787/api/spotify/login,
 *      approve, and paste the printed refresh token into .env as SPOTIFY_REFRESH_TOKEN
 *   4. `npm run dev:all`
 *
 * Without credentials the endpoint returns 503 and the UI shows its offline placeholder.
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { getNowPlaying, spotifyConfigured } from './spotify.js';

const PORT = Number(process.env.PORT ?? 8787);
const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN,
  SPOTIFY_REDIRECT_URI = `http://127.0.0.1:${PORT}/api/spotify/callback`,
  CORS_ORIGIN = 'http://localhost:5173',
} = process.env;

const app = express();
app.use(cors({ origin: CORS_ORIGIN.split(',').map((s) => s.trim()) }));

const SCOPES = 'user-read-currently-playing user-read-recently-played';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';

function basicAuth() {
  return `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`;
}

app.get('/api/health', (_req, res) => res.json({ ok: true, spotify: spotifyConfigured() ? 'configured' : 'unconfigured' }));

app.get('/api/now-playing', async (_req, res) => {
  try {
    const { status, body } = await getNowPlaying();
    if (status === 200) res.set('Cache-Control', 'public, max-age=15');
    res.status(status).json(body);
  } catch (err) {
    console.error('[now-playing]', err);
    res.status(502).json({ error: 'upstream failure' });
  }
});

// --- One-time OAuth helper to obtain a refresh token -------------------------
app.get('/api/spotify/login', (_req, res) => {
  if (!SPOTIFY_CLIENT_ID) return res.status(400).send('Set SPOTIFY_CLIENT_ID first.');
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: SCOPES,
    redirect_uri: SPOTIFY_REDIRECT_URI,
  });
  res.redirect(`https://accounts.spotify.com/authorize?${params}`);
});

app.get('/api/spotify/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Missing code');
  const r = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { Authorization: basicAuth(), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'authorization_code', code: String(code), redirect_uri: SPOTIFY_REDIRECT_URI }),
  });
  const json = await r.json();
  if (!json.refresh_token) return res.status(500).send(`<pre>${JSON.stringify(json, null, 2)}</pre>`);
  console.log('\nSPOTIFY_REFRESH_TOKEN=' + json.refresh_token + '\n');
  res.send(
    `<body style="font-family:ui-monospace,monospace;background:#151210;color:#ede4d3;padding:40px"><h2>Done.</h2><p>Add this to <code>.env</code> and restart the server:</p><pre style="color:#ff5a36">SPOTIFY_REFRESH_TOKEN=${json.refresh_token}</pre></body>`,
  );
});

app.listen(PORT, () => {
  console.log(`[api] listening on http://127.0.0.1:${PORT}  (spotify: ${spotifyConfigured() ? 'configured' : 'NOT configured — /api/now-playing returns 503'})`);
});
