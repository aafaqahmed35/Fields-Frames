# Discovery and SEO

## Origin configuration

`lib/site-origin.ts` owns public absolute URL identity. `SITE_ORIGIN` is server
configuration (the resulting URL is public), required at production build and
runtime. Supply the real deployed HTTPS origin, without credentials, path, query,
or fragment. No production hostname is assumed. Invalid values fail clearly.
Trailing origin slashes normalize; canonical URLs omit trailing slashes, including the root origin, matching Next.js metadata serialization.

Development falls back to `NEXT_PUBLIC_SITE_ORIGIN`, then localhost:3000.
Presentation still uses `NEXT_PUBLIC_SITE_ORIGIN` independently, so local Studio
continues to preview the local frontend. For local production-mode QA only, run
`SITE_ORIGIN=http://localhost:3000 npm run build` and start with the same variable.
Deployment must replace that explicit QA value with the real public origin and
set the Presentation origin to the correct deployed frontend.

## Metadata and structured data

`lib/seo.ts` centralizes canonical, Open Graph and Twitter metadata. Home and
world pages retain their existing editorial descriptions. Articles use P10 SEO
title/description/social-image overrides, falling back to title, dek and lead image.
Real raster images produce large social cards; SVG-only/text stories use summary
cards without fabricated artwork. Authors, publication dates, section and Sanity
`_updatedAt` are included where known. Domain models carry only the optional
content modification date, not Next.js metadata types.

The existing single Article JSON-LD graph uses the visible headline/dek, known
author, dates, section, lead image, canonical identity and named publication
publisher. SEO overrides affect link previews, not the visible-content graph.
Strings are stega-cleaned and `<` escaped. No logo, social handle, address or other
organization facts are invented. No additional homepage graph is needed.
Draft Mode has noindex/nofollow/nocache/noarchive metadata at the root and article
level, including previewed home/world routes. Public sitemap/discovery reads always
use the published perspective, even when requested with a preview cookie.

## Sitemap, robots and publishing

`/sitemap.xml` combines home and the three world routes with current article
summaries from the selected content source. Production must select `sanity`.
Sanity's native Unpublish removes a document from the published perspective;
there is no custom archive state. The sitemap includes no curated-only placeholders,
legacy aliases, generic article routes or operational routes. Article lastmod uses
Sanity's real modification date, falling back to publication date for local content.
Static routes omit lastmod because no reliable page modification date exists.

The sitemap reuses cached published summary queries and their section tags.
Article lifecycle revalidation additionally invalidates `/sitemap.xml`, including
fallback events. Existing section-tag invalidation refreshes the underlying query;
metadata and further reading use existing identity/section revalidation. Author
changes do not alter sitemap URLs/dates; existing author consumers are invalidated.
Production webhook registration remains deferred until the real deployment origin
exists, as documented in `editorial-publishing.md`.

Robots permits public pages, disallows `/studio` and `/api/`, and advertises the
origin-derived sitemap. Studio retains its existing noindex metadata. Robots is
crawl guidance; authenticated preview and published-query isolation remain the
security boundaries.

## Reader discovery decisions

Home already supplies curated reading and three world gateways. Worlds keep their
premium curated composition. A server-rendered Further reading continuation lists
published articles absent from that world's curated slots, so new CMS publications
remain reachable without changing source curation. Existing StoryLink published
slug checks and related-reading projections preserve public link integrity after
unpublish. Curated unpublished placeholders remain unlinked by P11 policy.

With six published articles (two per world), controlled category labels are useful
orientation but do not support substantial category landing pages. Dedicated
indexable category routes are deferred to avoid thin/duplicate pages. Search is
also deferred: navigation, worlds and related reading serve this corpus without a
search service, client JavaScript or a separate content index.

Run `npm run seo:validate` for helper/configuration regressions. Set
`SEO_VALIDATE_ORIGIN=http://localhost:3000` to also verify live CMS-backed page
metadata, JSON-LD, sitemap, robots, redirects, 404s and public link destinations.
Run against the configured Sanity production dataset; the validator is read-only.

The live validator compares article metadata and the single JSON-LD graph with
adapted production CMS documents, verifies sitemap modification dates and preview
cookie isolation, and scans public/preview output plus client assets for configured
secret values without printing them. When the local revalidation secret is present,
it signs an existing-article update event to verify sitemap cache invalidation; this
only expires local caches and does not mutate CMS documents.

## P12 recovery verification (2026-10-04)

Recovered from P11 commit `0f3c46b770dc916db7e6f6d412b26f54890d3c17`.
P12 was substantially implemented in the working tree, with no staged changes or
P12 commit. No unrelated work or temporary repository probes were found. The resume
preserved the implementation and strengthened the existing SEO validator.

Passed: `npm install`, `npm run sanity:validate`, `npm run content:validate`,
`npm run publishing:validate`, `npm run seo:validate`, `npm run lint`,
`npx tsc --noEmit`, `SITE_ORIGIN=http://localhost:3000 npm run build`, and
`git diff --check`. The CMS-backed live validator also passed with
`SEO_VALIDATE_ORIGIN=http://localhost:3000 npm run seo:validate`, including signed
local cache invalidation. Network-restricted execution required rerunning the live
validator with network access; local server binding required sandbox escalation.

The dataset contained six published articles, zero drafts and zero P12 QA documents.
Draft-only isolation therefore has query/perspective inspection and the preserved
P11 baseline as evidence, without a new draft fixture. Preview noindex was tested
on all ten public pages. Repository files and generated client assets passed a
value-safe secret scan. The runtime write token remains empty; `.env.local` remains
ignored and untracked. Presentation configuration is unchanged and still targets
`http://localhost:3000`.

Responsive visual acceptance passed in an explicitly authorized isolated Playwright
Chrome session against the production build. At both 390px and 1440px, inspected
home, FIELD, CINEMA, ESSAYS, and these published articles:

- `/football/what-the-floodlights-remember`
- `/cinema/cutting-on-the-breath`
- `/essays/the-case-for-looking-out-of-the-window`

All fourteen page/viewport combinations visibly rendered, loaded Newsreader and
Source Sans 3, and showed no horizontal overflow, out-of-bounds text, broken images,
headline/metadata overlap, console errors or runtime errors. Full-page, header,
article-body, related-reading and footer screenshots were inspected. Mobile stacking
and actual primary-navigation, story and related-story clicks passed. Further reading
correctly renders no extra block for the present corpus because all six published
articles already have curated slots. No metadata or JSON-LD became visible garbage.
The initial lazy-image failure was a QA-script scrolling issue, resolved by instant
viewport scrolling and waiting for image decoding; no application fix was needed.

No P12-introduced visual regression was found. Baseline comparison used the complete
P11-to-P12 diff: existing page composition, CSS, header/footer and article layout are
unchanged; P12 adds metadata/structured data and a conditional section continuation.
Playwright scripts, screenshots, metrics and temporary installation were kept outside
the repository and removed after inspection. No CMS fixtures were created.

### Handoff: pre-existing editorial design debt

The user-reported and observed excessive vertical whitespace, oversized display
treatments and section gateways, inconsistent information density, sparse numbered
stories, abrupt changes between homepage movements, and oversized footer masthead
belong to the later visual/editorial finalization milestone. Desktop composition can
feel like independent magazine spreads rather than a continuous publication. These
are not P12 failures, and no redesign or broad polish was undertaken. No P13/P14
implementation or deployment was performed.
