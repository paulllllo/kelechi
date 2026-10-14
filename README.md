# Kelechi Odigbo — portfolio

Vite + React + TypeScript + Tailwind, built on the `Kelechi_design` design system (re-tokenised for a warm dark theme). Optional Express server for the Spotify "now playing" widget.

## Run

```bash
npm install
npm run dev          # frontend only → http://localhost:5173
npm run dev:all      # frontend + Spotify API server (port 8787)
npm run build        # typecheck + production build → dist/
npm run preview      # serve the production build
```

## Role lenses (`?type=`)

The whole site re-weights itself from a query parameter so one URL can be tailored per application:

| URL | Lens |
| --- | --- |
| `/` or `/?type=fullstack` | Full-stack (default) |
| `/?type=frontend` (aliases: `fe`, `react`, `ui`, `web`) | Frontend |
| `/?type=backend` (aliases: `be`, `systems`, `platform`, `infra`, `api`) | Backend |
| `/?type=ai` (aliases: `ml`, `llm`, `prompt`, `genai`, `ai-engineer`) | Applied AI / LLM |

What changes: hero headline + lede, proof metrics, competency order, featured case studies, experience bullets (relevant ones emphasised, others collapsed), stack highlights, blog ordering, header descriptor, status-bar ticker and `document.title`. The parameter is preserved on every internal link. Unknown values fall back to full-stack.

Profiles live in `src/data/roles.ts`; role tags on content live in `src/data/experience.ts`, `src/data/work.ts`, `src/data/skills.ts`, `src/data/blog.ts`.

## Portrait

Drop a photo at `public/portrait.jpg`. It is rendered greyscale automatically inside the HUD frame on the home hero and About page. Until the file exists a placeholder is shown.

## Spotify now-playing (optional)

The widget in the home "Signal" section calls `/api/now-playing`. Without a server it shows an offline placeholder.

1. Create an app at <https://developer.spotify.com/dashboard>. Under Redirect URIs add exactly `http://127.0.0.1:8787/api/spotify/callback` (Spotify rejects `localhost`).
2. `cp .env.example .env` and set `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`.
3. `npm run dev:server`, open <http://127.0.0.1:8787/api/spotify/login>, approve, copy the printed `SPOTIFY_REFRESH_TOKEN` into `.env`.
4. Restart with `npm run dev:all`. The home “Signal” section then shows the live track, or the last one played when nothing is on.

On Vercel, `api/now-playing.js` is the production version of this endpoint. The Express server stays for local development and for the one-time login that prints the refresh token.

## Content

- Résumé PDF: `public/Odigbo_Kelechi_Paul_Resume.pdf`
- Profile, socials, availability: `src/data/profile.ts` (social URLs are placeholders — update them)
- Blog posts are placeholders in `src/data/blog.ts`
- Playground experiments: `src/playground/*`

## Structure

```
src/
  components/ds/     design-system components (ported, dark-tokenised)
  components/site/   nav, footer, portrait, reveal/motion helpers, role switchers
  data/              all content + role personalisation model
  lib/               role context, motion presets, now-playing hook
  pages/             routes (home sections under pages/home)
  playground/        interactive experiments
server/index.js      Express: Spotify token refresh + /api/now-playing
```
