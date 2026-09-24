# Editorial CMS

Mind & Margin uses Sanity for production editorial content. The integration keeps
CMS structures out of presentation components:

```text
Sanity documents → GROQ data layer → validated adapter → Article domain model → ArticlePage
```

The App Router pages fetch on the server. `ArticlePage`, article CSS, canonical
section routes, and homepage/section composition remain CMS-agnostic.

## Configuration and source selection

Copy `.env.example` to `.env.local` and provide the applicable values.

- `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are public
  Sanity identifiers used by the read client, image allowlist, and Studio.
- `SANITY_API_READ_TOKEN` is optional for public datasets and remains server-only.
- `SANITY_API_WRITE_TOKEN` is server-only and is used only by the seed command.
- `MIND_MARGIN_CONTENT_SOURCE` is `local` or `sanity`.

When the source variable is absent, the app uses the deliberate local migration
fallback and emits a production warning. When it is `sanity`, missing configuration,
unavailable CMS access, or malformed content fails observably; it never falls back
silently. The application and `/studio` setup screen remain buildable without
credentials.

## One-time Sanity setup

No cloud project is created by this repository. A Sanity administrator must:

1. Create or select a project and dataset in Sanity.
2. Put the project ID and dataset in `.env.local`.
3. Add `http://localhost:3000` as an authenticated CORS origin for the embedded Studio.
4. Restart `npm run dev`, then open `/studio` and authenticate with Sanity.
5. Set `MIND_MARGIN_CONTENT_SOURCE=sanity` only when the dataset is ready to serve.

For deployment, add the deployed Studio origin in Sanity and set the same public
identifiers in the host environment. Use a server-only read token only for a private
dataset. Never prefix tokens with `NEXT_PUBLIC_`.

## Authoring model

Studio is embedded at `/studio`. Editors can manage articles and authors. Articles
have fixed FIELD/CINEMA/ESSAYS sections; section-aware category validation; fixed
FEATURE/STANDARD/ESSAY modes; normalized publication dates; an optional reading-time
override; author and related-article references; accessible lead/body images with
crop and hotspot; structured body blocks; and optional SEO overrides. Section + slug
is the public identity, and Studio checks slug uniqueness within that section.

The body supports paragraphs, level-two/three headings, ordered and unordered lists,
pull quotes, figures, dividers, and notes. It does not accept HTML, JSX, scripts, or
arbitrary layout controls.

## Schema and type checks

```bash
npm run sanity:schema
npm run sanity:typegen
npm run content:validate
```

Schema extraction uses a clearly labeled local sentinel when no project is configured;
that value is never used for frontend CMS requests. Generated schema and query result
types are committed so normal builds do not need Sanity credentials.

## Seed migration

The seed covers all six P9 article bodies, all 18 registered authors, four local image
assets, and 15 related-reading references. Dry-run validation requires no credentials:

```bash
npm run sanity:seed
```

To execute once against an authorized dataset, provide the public project/dataset
variables and a temporary `SANITY_API_WRITE_TOKEN`, then run:

```bash
npm run sanity:seed -- --apply
```

Documents use stable IDs and `createIfNotExists`; reruns do not duplicate or overwrite
editorial documents. Sanity deduplicates identical uploaded image assets. Remove the
write token after migration.

## Deliberate P11 boundary

P10 reads published documents and leaves compatible seams in the client, queries,
source selector, and route data layer. Draft Mode, visual preview, live subscriptions,
publish-triggered revalidation, webhooks, scheduling, approval, update, and archive
operations are intentionally not implemented here.
