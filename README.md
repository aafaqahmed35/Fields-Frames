# Mind & Margin

Mind & Margin is an independent digital editorial publication for football,
cinema, essays, culture, life, and ideas.

Its three editorial sections are:

- **FIELD** — Football
- **CINEMA** — Film and filmmaking
- **ESSAYS** — Essays, culture, life, and ideas

## Project status

This repository contains the frontend and global design-language foundation: an
editorial typography system, shared publication shell, the full homepage
composition, and the first complete section experience for FIELD. CINEMA and
ESSAYS remain route foundations so their distinct visual identities can develop
independently.

No CMS, database, authentication system, admin interface, or publishing pipeline
has been selected or implemented.

## Technology

- Next.js with the App Router
- React and TypeScript
- Tailwind CSS
- ESLint
- npm

Global foundation styles live in `app/globals.css` and `app/styles/`. Shared shell
components use colocated CSS Modules, while homepage and section-foundation styles
remain local to their routes.

## Local development

Node.js 20.9 or newer is required.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For production verification:

```bash
npm run lint
npm run build
```

## Routes

- `/` — Curated Mind & Margin editorial front page
- `/football` — Complete FIELD editorial section
- `/cinema` — CINEMA foundation
- `/essays` — ESSAYS foundation

Legacy routes redirect permanently to their canonical replacements:

- `/films` → `/cinema`
- `/journal` → `/essays`
