# Editorial publishing pipeline

Mind & Margin uses one renderer and two deliberately separated read paths:

```text
anonymous request → published perspective → tagged Next.js cache → ArticlePage
Presentation     → authenticated Draft Mode → selected draft/release perspective → ArticlePage
published change → signed Sanity webhook → targeted tags + routes revalidated
```

`ArticlePage` remains CMS-agnostic. Draft access, cache behavior, and credentials
live in the server data layer and route handlers.

## Editorial state model

Sanity's native document states are the source of truth; there is no duplicate
`status` field.

| State | Studio | Authorized preview | Canonical public route | Home/section links | Search/discovery |
| --- | --- | --- | --- | --- | --- |
| Draft-only | Editable draft | Visible | 404 | Never linked | Not exposed |
| Published | Published document | Published content, or draft overlay when one exists | Visible | May be linked when curated | Indexable |
| Scheduled Draft | Locked single-document release in Studio | Previewable in the authorized release/Studio context where the plan supports it | Last published version, or 404 for a new article, until release runs | Unchanged until release | Not exposed until release |
| Unpublished / archived | Draft retained after native Unpublish | Visible | 404 | Link disappears after webhook revalidation | Not exposed |

Public queries always use Sanity's `published` perspective. Draft and release
documents are therefore absent from route generation, article lookups, StoryLink
resolution, and section summaries. A published article with draft edits continues
to serve its last published revision until Publish is selected.

## Editor workflow

### Create, preview, and publish

1. Open `/studio`, sign in, create an Article, and complete the required editorial,
   media, relationship, and SEO fields.
2. Use the **Presentation** tool. It derives `/football/[slug]`, `/cinema/[slug]`, or
   `/essays/[slug]` from the current section and slug. Missing/invalid values show a
   caution instead of inventing a route.
3. Review the real publication renderer. The black **Draft preview** control identifies
   Draft Mode; select **Exit** to clear it when previewing outside Presentation.
4. Select **Publish**. Sanity creates/updates the published document; the signed
   webhook refreshes the article identity, section index, homepage, metadata, and
   article/author data dependencies.

No source file, local registry, route file, or StoryLink flag changes during this flow.

### Update

Edit a published article normally. Sanity keeps the new work as a draft while the
public site continues serving the published revision. Preview shows the draft. On
Publish, the webhook expires the corresponding data and route caches.

### Schedule

Sanity Studio 6 includes native **Scheduled Drafts** on the Growth plan. The configured
Mind & Margin project currently advertises both `scheduledPublishing` and
`singleDocRelease`, so no custom scheduler or deprecated plugin is needed:

1. Open the document action menu beside Publish.
2. Choose **Schedule Publish**, select a future date/time, and confirm.
3. The scheduled version remains non-public until Sanity publishes it. Strongly
   referenced authors and related articles must already be published.

Do not enable the deprecated Scheduled Publishing plugin and do not add an app cron.
If **Schedule Publish** is unexpectedly absent, check the project's **Plan** page and
the editor's role before changing application code.

### Archive / unpublish

Use Sanity's native **Unpublish** action; do not delete the article. This removes the
published document while retaining an editable draft internally. Related-article
references are deliberately weak, so an incoming relationship cannot block the
unpublish action. After webhook revalidation the canonical route is 404,
homepage/section StoryLinks no longer link to it, and published related-reading
projections omit it. Authorized preview remains available. Select Publish later to
restore the same document identity and URL.

No redirect is created without a real replacement destination. If a permanent move
has a known replacement, add a narrowly scoped redirect deliberately in application
configuration; P11 does not provide a general redirect CMS.

## Slug and relationship safety

- Slugs must contain lowercase letters/digits separated by single hyphens.
- Studio rejects duplicate slugs inside the same section, including draft collisions.
- The same slug in different sections is valid because the section is part of the URL.
- Changing a published slug produces a Studio warning. Publishing that change moves
  the canonical URL; the webhook invalidates both old and new routes, but it does not
  invent a redirect.
- Related-article references are weak by policy. Public related reading dereferences
  only published targets; missing/draft/unpublished targets are normalized out before
  `ArticlePage` receives the domain model.
- StoryLink checks the published slug set. Curated visual slots may remain as plain
  editorial composition, but cannot become clickable broken destinations.

## Preview security

Presentation calls `/api/draft-mode/enable`. `defineEnableDraftMode` verifies Sanity's
short-lived preview URL secret with an authenticated server client before setting the
Next.js Draft Mode cookie. Presentation redirects are constrained to canonical publication paths; there is no
`/articles/...` preview surface. Invalid handshakes are rejected.

Draft reads require `SANITY_API_READ_TOKEN` with the built-in **Viewer** role. They use
the draft or scheduled-release perspective selected by Presentation (defaulting to
`drafts`), bypass the Sanity CDN and Next.js cache, and execute only when Draft Mode
is enabled. The credential is never used by anonymous published traffic and must
never have Editor or write permission.

Preview article metadata emits `noindex`, `nofollow`, and `nocache`. Next.js also
serves Draft Mode responses privately without a shared cache. Exit preview through
the POST-only control; do not link to the disable endpoint with a prefetching Link.

## Cache and webhook

Published Sanity reads are cached indefinitely and tagged by identity or section:

- article data: section/slug identity, plus a broad fallback tag used only when a
  malformed article event has no usable old or new identity;
- section summaries and generated slug sets: section identity.

`POST /api/revalidate` validates Sanity's webhook signature with
`SANITY_REVALIDATE_SECRET`, validates the projected JSON, waits for Content Lake
consistency, and queries the published dataset for articles that reference the changed
document. It then immediately expires only the old/new article identity, affected
section data, and actual related/author consumer identities before revalidating their
paths. A malformed identity falls back to the broad article tag rather than leaving an
unknown stale route.

Configure one GROQ-powered webhook in **sanity.io/manage → Mind & Margin → API →
Webhooks → Create webhook**:

Local Presentation and preview integration has been verified against the real
`ArticlePage` at `http://localhost:3000`. Production webhook registration is
intentionally deferred until a real deployed production origin exists; creating the
following webhook against that deployed origin remains a deployment-time checklist
item.

- Name: `Mind & Margin publication revalidation`
- URL: `https://<deployed-publication-origin>/api/revalidate`
- Dataset: `production`
- Trigger on: Create, Update, Delete
- Filter: `_type in ["article", "author"]`
- Projection:

```groq
{
  "_id": coalesce(after()._id, before()._id),
  "_type": coalesce(after()._type, before()._type),
  "before": before(){section, "slug": slug.current},
  "after": after(){section, "slug": slug.current}
}
```

- HTTP method: POST
- API version: `v2025-02-19` or newer
- Secret: exactly the same random value as the deployment's
  `SANITY_REVALIDATE_SECRET`
- Drafts: disabled
- Versions: disabled

Do not enable draft/version delivery: only public-state transitions should purge the
public cache. The shared secret supplies signature authenticity and needs no API role
or write credential.

## Environment and credentials

| Variable | Exposure | Purpose | Required |
| --- | --- | --- | --- |
| `MIND_MARGIN_CONTENT_SOURCE` | Server-only / deployment | Select `local` or `sanity` | `sanity` in CMS production |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Public | Project identity, Studio, image URLs | Yes for Sanity |
| `NEXT_PUBLIC_SANITY_DATASET` | Public | Dataset identity | Yes for Sanity |
| `SANITY_API_READ_TOKEN` | Server-only / preview | Permanent minimum-role Viewer token | Preview only |
| `SANITY_REVALIDATE_SECRET` | Server-only / webhook | Permanent random signing secret | Webhook only |
| `SANITY_API_WRITE_TOKEN` | Server-only / optional migration | Retired P10 seed credential | No; leave empty |

Use `.env.local` for local secrets and the deployment provider's encrypted environment
settings in production. Rotate the Viewer token in **Manage → API → Tokens** and the
webhook secret in both the deployment and webhook configuration. Never use a
`NEXT_PUBLIC_` prefix for either secret and never commit `.env.local`.

## Failure and recovery

- CMS network errors and malformed published documents fail observably; production
  never silently falls back to local article bodies.
- Missing articles and unpublished/archived articles return 404 publicly.
- Missing preview credentials return a configuration error and draft reads fail closed.
- Invalid preview handshakes are rejected by Sanity's preview-secret validation.
- Missing webhook configuration returns 503; invalid signatures return 401; malformed
  signed payloads return 400; and a failed dependency lookup returns 502. Responses
  never include secrets or submitted payloads.
- If a webhook delivery fails, inspect **Manage → API → Webhooks → delivery logs**,
  repair the deployment/configuration, and redeliver. The handler is idempotent.
- A dangling related reference is omitted publicly rather than rendered as a broken
  link. Fix the reference in Studio when convenient.

## Developer verification

Run:

```bash
npm install
npm run sanity:validate
npm run content:validate
npm run publishing:validate
npm run lint
npx tsc --noEmit
npm run build
git diff --check
```

`npm run publishing:validate` exercises canonical route resolution, slug rejection,
create/update/unpublish payloads, actual author/related dependency identities,
malformed payload handling, fallback invalidation, and old/new targeted plans.

For the authoritative deployment environment contract, hardening controls and
recovery steps, see [production-runbook.md](production-runbook.md).
