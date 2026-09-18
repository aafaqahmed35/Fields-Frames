# Field&Frames

Field&Frames is an independent digital editorial publication for football, film,
culture, ideas, and other long-form writing.

Its three editorial sections are:

- **FIELD** — Football
- **FRAMES** — Film
- **JOURNAL** — Essays, culture, ideas, and other writing

## Project status

This repository currently contains the frontend and global design-language
foundation: an editorial typography system, shared publication shell, restrained
introductory homepage, and route foundations for each editorial section. The final
homepage and the visual identities of FIELD, FRAMES, and JOURNAL are intentionally
unfinished so each can develop independently.

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

- `/` — Publication introduction and section directory
- `/football` — FIELD foundation
- `/films` — FRAMES foundation
- `/journal` — JOURNAL foundation
