# Production operations

P13 hardens the P12 publication without recomposing its design. No deployment,
domain, hosting project, or production webhook is provisioned by this milestone.

## Environment contract

Use provider environment settings for deployment; `.env.local` is ignored and
must remain untracked. `.env.example` contains placeholders, never credentials.

| Configuration | Classification | Contract |
| --- | --- | --- |
| `MIND_MARGIN_CONTENT_SOURCE` | Server / build / deployment | Explicit `sanity` for deployed publication. Explicit `local` only with a localhost canonical origin for local production QA; unset production fails. |
| `SITE_ORIGIN` | Server / build / deployment, public URL identity | Required canonical HTTP(S) origin; deployed identity must be real HTTPS. No credentials, path, query, fragment, or invented default. |
| `NEXT_PUBLIC_SITE_ORIGIN` | Public / build / deployment | Required Presentation frontend origin. Use actual deployed HTTPS origin; localhost is only for local QA. Rebuild when changed. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Public / build / deployment | Required project identifier for CMS and Studio. |
| `NEXT_PUBLIC_SANITY_DATASET` | Public / build / deployment | Required dataset identifier; normally `production`. Public dataset reads must be enabled. |
| Sanity API version | Build / source constant | Pinned in `sanity/env.ts` to `2026-02-01`; no environment override. Webhook before/after projection requires API `v2025-02-19` or later. |
| `SANITY_API_READ_TOKEN` | Server-only / deployment | Permanent minimum-role Viewer token, required for production preview. Never used for anonymous published reads. |
| `SANITY_REVALIDATE_SECRET` | Server-only / deployment | Required for CMS production; at least 32 characters, generated from at least 32 random bytes. Same value in webhook and deployment. |
| `SANITY_API_WRITE_TOKEN` | Server-only / optional / local migration | Leave empty. Only retired seed tooling uses it; frontend runtime has no mutation capability. |
| `SEO_VALIDATE_ORIGIN` | Optional / local QA | Opt into live read-only SEO/CMS validation against a running production build. |
| `PRODUCTION_VALIDATE_ORIGIN` | Optional / local QA | Opt into live endpoint, header, cookie, and client asset checks. |
| `PRODUCTION_VALIDATE_ENV` | Optional / local QA | `1` checks actual deployment environment as production in the validator. Build/start always check it. |
| `NODE_ENV`, `PORT` | Platform / build / runtime | Next manages production mode; provider supplies listening port when needed. |

Do not prefix credentials with `NEXT_PUBLIC_`. Draft fetching is explicitly
`server-only`. Studio imports public configuration only. Never print tokens,
request URLs containing preview secrets, or full CMS/webhook payloads.

## Deployment and verification

Use Node >=22.12 (Node 24 LTS was verified), a Node Next.js runtime, and a platform
that supports App Router cookies, server endpoints, image optimization, persistent
Next data caching, and on-demand path/tag revalidation. This is not a static export.
Use one managed deployment/cache domain; unmanaged multi-instance deployments need
shared platform cache/revalidation support. No custom cache service is included.

1. Set all production configuration above. Keep write token empty.
2. Add the exact deployed frontend/Studio origin to Sanity **Manage → API → CORS**,
   with credentials allowed for Studio login. Add staging separately when used.
3. Install with `npm ci` (lockfile committed). Run `npm audit` and review remaining
   findings; then `npm run production:validate`. Build command: `npm run build`.
   Google Fonts are fetched at build time; permit build egress to Google Fonts
   and Sanity. Fonts are self-hosted afterward; readers need no Google connection.
4. Start using `npm run start` or the hosting provider's supported Next adapter.
5. Configure the signed production webhook only once the real origin exists.
   Follow the exact filter, create/update/delete triggers, before/after projection,
   API version and draft/version exclusions in [editorial-publishing.md](editorial-publishing.md#cache-and-webhook).
6. Verify Studio login, Presentation draft rendering, publish/update/unpublish,
   and webhook delivery against the deployed origin. Core workflow does not
   depend on Growth Scheduled Drafts.

Local production verification with existing local CMS configuration:

```bash
SITE_ORIGIN=http://localhost:3000 npm run production:validate
SITE_ORIGIN=http://localhost:3000 npm run start
# In another terminal, against that build:
SITE_ORIGIN=http://localhost:3000 PRODUCTION_VALIDATE_ENV=1 \
  PRODUCTION_VALIDATE_ORIGIN=http://localhost:3000 npm run production:check
SITE_ORIGIN=http://localhost:3000 SEO_VALIDATE_ORIGIN=http://localhost:3000 npm run seo:validate
```

The aggregate stops at the first failed gate: schema/types, content, publishing,
SEO unit checks, production failure modes, lint, TypeScript, build, and diff checks.
Live checks are explicit because they require an already-running matching build.
The validator uses an isolated CMS test double to verify fetch failures, absent vs
malformed content, anonymous credential isolation, and safe diagnostics; it does
not create CMS documents or mutate publication content. Live SEO checks exercise
published routes, metadata, sitemap/preview isolation and signed revalidation.
Live production checks also exercise the real transport timeout against a local
upstream that never answers (up to 25 seconds). Browser regression remains a
separate check at 390px and 1440px.

## Cache, preview and failures

Public CMS fetches use published perspective, Sanity CDN and tagged Next data
cache. Preview uses the authenticated perspective, API origin and no shared cache.
Section/discovery queries and sitemap explicitly use published content even when
preview cookies exist. Public metadata/HTML never includes credentials.

Webhook identity plans expire old/new article tags and paths, affected section,
homepage, sitemap and actual related consumers. Author events refresh actual
consumers. Missing article identities retain the existing broad safety fallback;
normal events do not globally purge the publication. Delivery retries repeat the
same deterministic invalidations. The 3-second consistency wait is intentional. Allow at least a 15-second
webhook handler budget at deployment (3 seconds plus the 10-second CMS deadline).

Requests require POST and verified Sanity signature, JSON, valid document ID/type,
and validated identities. Bodies are limited to 16 KiB even with chunked transfer.
Rejected requests perform no CMS dependency lookup. Responses: 401 signature,
400 payload, 413 size, 415 media type, 503 missing configuration, 502 processing
failure. Deployment-level request/body timeouts and rate controls are preferable
to in-process counters; configure platform protections for `/api/*` if abused.

Preview uses Sanity's expiring URL secret, bounded parameters and publication-only
redirect paths. No arbitrary external redirects or `/articles` routes. A syntactically
valid unknown/wrong-world article reaches 404 after authentication; it never reveals
a draft to an anonymous caller. Missing/invalid handshake sets no cookies. POST exit
clears ordinary and partitioned preview cookies. Preview stays noindex/private.

A missing article is 404. A static `pages/500.tsx` fallback also covers cold
SSG/metadata failures that happen before the App Router boundary can render. CMS transport/content failure propagates to the unavailable
boundary; it never substitutes local article bodies or becomes a fabricated 404.
Client fetches have a real 10-second AbortSignal deadline and at most one retry.
The SDK native-fetch path did not honor its timeout option in the stalled-upstream
test; the deadline therefore wraps fetch and follows `withConfig` clones, including
preview validation and webhook dependency lookup. Cold-cache
CMS outage can fail build; previous deployment remains the recovery target. Warm
cached published data can remain available without pretending every CMS call worked.

Inspect platform logs for `[cms.fetch]`, `[webhook.config]`, `[webhook.reject]`,
`[webhook.revalidate]`, and `[preview.enable]`. Next server-render errors carry a
server digest. Logs contain operation/known tags/status, no raw upstream error,
token, submitted payload, or secret-bearing URL. Malformed content errors identify
fields in normal Next server logs; public boundaries display no internals. No noisy
success logging, logging framework, or monitoring service is required.

## Headers and dependency caveats

All routes receive nosniff, strict-origin-when-cross-origin referrer policy and
disabled camera/microphone/geolocation. API responses are private/no-store,
no-referrer and noindex. X-Powered-By is disabled. No HSTS is claimed for local HTTP;
HTTPS/HSTS is a deployment-provider decision after the real domain is established.

Reader routes use CSP restricting resources to self, images to self/data/Sanity CDN,
with no objects and same-origin framing/forms/base URL. Next bootstrap/JSON-LD and
existing style attributes require inline scripts/styles; nonce conversion is deferred.
Development additionally permits script eval. Studio and general fallback routes
retain the object/base/frame/form baseline without resource allowlists, preserving
Sanity authentication/tool integrations whose authenticated sources have not yet
been fully observed. No generic deny-all policy is applied to Studio. Standalone
cross-origin Studio would require deliberate frame-ancestor changes.

Next/ESLint were patched from 16.3.5 to 16.3.6 for the critical ImageResponse
advisory (the application does not use `next/og`). DOMPurify was patched within
range. Narrow same-major overrides patch pinned Undici, archive, YAML and TOML
packages; review/remove overrides when their parents adopt patched versions.
Remaining audit findings concern Braces (no patched 3.x version available in the
registry at verification) through glob/watch/ESLint/codegen tooling, and UUID 10
through CLI typeid (fix requires UUID 11 migration). npm counts parent packages
as vulnerable too; these are not 15 independent application vulnerabilities.
The clean install also warns that ESLint 9 and CLI UUID 10 are unsupported;
major tooling migrations remain separate work. Do not feed untrusted glob patterns or invoke seed/import tooling on untrusted
inputs. Recheck audit before deployment. No known critical finding remains;
no forced major migration or downgrade was performed.

## Recovery and deferred work

- Failed deployment: roll back to the previous successful platform deployment.
- Bad article: unpublish or revert it in Sanity; redeliver webhook and verify public
  article, discovery links and sitemap. Keep the draft for correction.
- Failed webhook: inspect Sanity delivery and platform logs, repair secret/config,
  then redeliver. There is no unauthenticated manual purge endpoint. Redeploying a
  provider version that rebuilds cache is a fallback only after checking its cache
  semantics; do not assume restarting a process clears a persistent platform cache.
- Suspected exposure: rotate Viewer token and/or signing secret, update environment
  and webhook together, redeploy, review logs and revoke old credentials.

P14 retains all known editorial/visual debt: whitespace, display scale, information
density, homepage continuity, sparse story sections, gateways and footer composition.
No analytics, scheduler, search, queue, custom auth, infrastructure, or redesign is
part of P13. Authenticated deployment smoke testing, real CORS registration, real
origins, production webhook and provider timeout/rate/TLS choices remain operator
work at deployment time.
