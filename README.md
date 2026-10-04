# Mind & Margin

Mind & Margin is an independent digital editorial publication for football,
cinema, essays, culture, life, and ideas.

Its three editorial sections are:

- **FIELD** — Football
- **CINEMA** — Film and filmmaking
- **ESSAYS** — Essays, culture, life, and ideas

## Project status

This repository contains the publication frontend, global design system, curated
homepage and section indexes, shared article-detail renderer, and a Sanity-backed
editorial publishing lifecycle. Editors can draft, securely preview through Sanity
Presentation, publish, update, schedule when the project plan supports Scheduled
Drafts, and reversibly unpublish without changing application source.

## Technology

- Next.js with the App Router
- React and TypeScript
- Tailwind CSS
- ESLint
- Sanity Studio and Content Lake
- npm

Global foundation styles live in `app/globals.css` and `app/styles/`. Shared shell
components use colocated CSS Modules, while homepage and section-foundation styles
remain local to their routes.

## Local development

Node.js 22.12 or newer is required by the current Sanity Studio release.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For production verification:

```bash
SITE_ORIGIN=http://localhost:3000 npm run production:validate
```

## Editorial content

Sanity Studio is embedded at `/studio`. Without Sanity configuration it shows a
setup boundary while the publication continues to build using the explicit local
migration source.

```bash
npm run sanity:validate
npm run sanity:seed          # credential-free dry run
```

Environment variables, source selection, authoring rules, and the authorized seed
procedure are documented in [docs/content-cms.md](docs/content-cms.md). The complete
editor/developer lifecycle is in
[docs/editorial-publishing.md](docs/editorial-publishing.md). No token or shared
secret is committed.

## Routes

- `/` — Curated Mind & Margin editorial front page
- `/football` — Complete FIELD editorial section
- `/cinema` — Complete CINEMA editorial section
- `/essays` — Complete ESSAYS editorial section
- `/football/[slug]` — FIELD articles
- `/cinema/[slug]` — CINEMA articles
- `/essays/[slug]` — ESSAYS articles

Legacy routes redirect permanently to their canonical replacements:

- `/films` → `/cinema`
- `/journal` → `/essays`

Production configuration, security caveats, deployment verification and recovery
are documented in [docs/production-runbook.md](docs/production-runbook.md).
