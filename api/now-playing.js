import { getNowPlaying } from '../server/spotify.js';

/** Vercel serverless function. Replaces the Express route in production. */
export default async function handler(_req, res) {
  try {
    const { status, body } = await getNowPlaying();
    if (status === 200) res.setHeader('Cache-Control', 'public, max-age=15');
    res.status(status).json(body);
  } catch (err) {
    console.error('[now-playing]', err);
    res.status(502).json({ error: 'upstream failure' });
  }
}
