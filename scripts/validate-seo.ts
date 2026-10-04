import assert from "node:assert/strict";
import { articles, type Article } from "../content/articles";
import {
  articleMetadata,
  articleStructuredData,
  buildSitemap,
  pageMetadata,
  previewRobots,
  publicationDescription,
  publicationName,
  robotsPolicy,
} from "../lib/seo";
import { publicUrl, resolvePublicOrigin } from "../lib/site-origin";
import { sectionRoutes } from "../content/story";

const previous = process.env.SITE_ORIGIN;
// Reserved test identity, never used as a deployment default.
process.env.SITE_ORIGIN = "https://publication.example";
assert.equal(
  resolvePublicOrigin({ NODE_ENV: "development" }),
  "http://localhost:3000",
);
assert.equal(
  resolvePublicOrigin({ SITE_ORIGIN: "https://publication.example/" }),
  "https://publication.example",
);
assert.throws(() =>
  resolvePublicOrigin({
    NODE_ENV: "production",
    NEXT_PUBLIC_SITE_ORIGIN: "http://localhost:3000",
  }),
);
for (const value of [
  "bad",
  "ftp://example.com",
  "https://example.com/path",
  "https://a:b@example.com",
  "https://example.com/?q=x",
  "https://example.com/#x",
])
  assert.throws(() => resolvePublicOrigin({ SITE_ORIGIN: value }));
assert.equal(publicUrl("/football/"), "https://publication.example/football");
assert.throws(() => publicUrl("//another.example"));
for (const path of ["/", ...Object.values(sectionRoutes)]) {
  const metadata = pageMetadata("Title", "Description", path);
  assert.equal(metadata.alternates?.canonical, publicUrl(path));
  assert.equal(metadata.openGraph?.url, publicUrl(path));
  assert.equal(metadata.twitter?.title, "Title");
}
for (const article of articles) {
  const path = `${sectionRoutes[article.section]}/${article.slug}`;
  const metadata = articleMetadata(article);
  assert.equal(metadata.alternates?.canonical, publicUrl(path));
  assert.equal(metadata.title, article.title);
  assert.equal(metadata.description, article.dek);
  const graph = articleStructuredData(article);
  assert.equal(graph.mainEntityOfPage, publicUrl(path));
  assert.equal(graph.headline, article.title);
  assert.equal(graph.articleSection, article.section);
  assert.equal(graph.author.name, article.author);
  assert.equal(graph.datePublished, article.date);
  assert.deepEqual(articleMetadata(article, true).robots, previewRobots);
  const overridden = {
    ...article,
    modifiedAt: "2026-10-01T12:00:00Z",
    seo: {
      title: "SEO title",
      description: "SEO description",
      socialImage: {
        src: "https://cdn.example/photo.jpg",
        width: 1200,
        height: 800,
        alt: "Actual photo",
        credit: "Photographer",
      },
    },
  };
  const seo = articleMetadata(overridden);
  assert.equal(seo.title, "SEO title");
  assert.equal(seo.description, "SEO description");
  assert.ok(seo.twitter && "card" in seo.twitter);
  assert.equal(seo.twitter.card, "summary_large_image");
  assert.equal(articleStructuredData(overridden).headline, article.title);
  assert.equal(
    articleStructuredData(overridden).dateModified,
    overridden.modifiedAt,
  );
}
assert.equal(buildSitemap(articles).length, 4 + articles.length);
assert.equal(robotsPolicy().sitemap, publicUrl("/sitemap.xml"));
if (previous === undefined) delete process.env.SITE_ORIGIN;
else process.env.SITE_ORIGIN = previous;

async function validateLive() {
  const origin = process.env.SEO_VALIDATE_ORIGIN;
  if (origin) {
    const { loadEnvConfig } = await import("@next/env");
    loadEnvConfig(process.cwd());
    const { getSanityClient } = await import("../sanity/lib/client");
    const { ARTICLE_QUERY } = await import("../sanity/lib/queries");
    const { adaptSanityArticle } = await import("../sanity/lib/adapter");
    const { requirePublicSanityConfig } = await import("../sanity/env");
    assert.equal(
      process.env.MIND_MARGIN_CONTENT_SOURCE,
      "sanity",
      "Live validation requires CMS-backed production content",
    );
    const client = getSanityClient().withConfig({
      perspective: "published",
      useCdn: false,
      stega: false,
    });
    const published = await client.fetch<
      Array<{ _id: string; section: keyof typeof sectionRoutes; slug: string }>
    >(
      '*[_type == "article" && defined(publishedAt)]{_id,section,"slug":slug.current}',
    );
    assert.ok(
      published.length >= 6,
      "Expected at least the six production articles",
    );
    const identities = new Set(
      published.map((a) => `${sectionRoutes[a.section]}/${a.slug}`),
    );
    const cmsArticles = new Map<string, Article>(
      await Promise.all(published.map(async ({ section, slug }) => {
        const raw = await client.fetch(ARTICLE_QUERY, { section, slug });
        return [
          `${sectionRoutes[section]}/${slug}`,
          adaptSanityArticle(raw, requirePublicSanityConfig()),
        ] as const;
      })),
    );
    const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;" })[char]!,
    );
    const assertMeta = (html: string, attribute: "name" | "property", key: string, value: string) =>
      assert.ok(html.includes(`${attribute}="${key}" content="${escapeHtml(value)}"`), `Metadata ${key}`);
    const get = async (path: string) =>
      fetch(new URL(path, origin), {
        redirect: "manual",
        headers: { "user-agent": "Googlebot" },
      });
    const sitemap = await (await get("/sitemap.xml")).text();
    const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    assert.equal(urls.length, 4 + published.length);
    for (const [path, article] of cmsArticles) {
      const entry = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)]
        .find((match) => match[1].includes(`<loc>${publicUrl(path, origin)}</loc>`));
      assert.ok(entry?.[1].includes(`<lastmod>${article.modifiedAt ?? article.date}</lastmod>`), `Sitemap modification date ${path}`);
    }
    for (const path of ["/", ...Object.values(sectionRoutes), ...identities])
      assert.ok(
        urls.includes(publicUrl(path, origin)),
        `Missing sitemap ${path}`,
      );
    assert.ok(
      !urls.some((url) =>
        /\/(studio|api|articles|films|journal)(\/|$)/.test(
          new URL(url).pathname,
        ),
      ),
    );
    const robots = await (await get("/robots.txt")).text();
    assert.ok(
      robots.includes(`Sitemap: ${new URL("/sitemap.xml", origin).href}`),
    );
    assert.ok(
      robots.includes("Disallow: /studio") &&
        robots.includes("Disallow: /api/"),
    );
    for (const path of ["/", ...Object.values(sectionRoutes), ...identities]) {
      const response = await get(path);
      assert.equal(response.status, 200, path);
      const html = await response.text();
      assert.ok(
        html.includes(`rel="canonical" href="${publicUrl(path, origin)}"`),
        `Canonical ${path}`,
      );
      assert.ok(
        html.includes('property="og:url"') &&
          html.includes('name="twitter:card"'),
        `Social ${path}`,
      );
      if (!identities.has(path)) {
        const labels: Record<string, string> = {
          "/": publicationName,
          "/football": "FIELD — Football",
          "/cinema": "CINEMA — Film and Filmmaking",
          "/essays": "ESSAYS — Life, Culture, and Ideas",
        };
        assert.ok(html.includes(`<title>${escapeHtml(labels[path])}${path === "/" ? "" : " | Mind &amp; Margin"}</title>`), `Landing title ${path}`);
        assertMeta(html, "property", "og:title", labels[path]);
        assertMeta(html, "name", "twitter:title", labels[path]);
        if (path === "/") assertMeta(html, "name", "description", publicationDescription);
        assert.ok(!html.includes('type="application/ld+json"'), "No conflicting landing graph");
      }
      if (identities.has(path)) {
        const article = cmsArticles.get(path)!;
        const title = article.seo?.title ?? article.title;
        const description = article.seo?.description ?? article.dek;
        assert.ok(html.includes(`<title>${escapeHtml(title)} | Mind &amp; Margin</title>`), `Title ${path}`);
        assertMeta(html, "name", "description", description);
        assertMeta(html, "property", "og:title", title);
        assertMeta(html, "property", "og:description", description);
        assertMeta(html, "name", "twitter:title", title);
        assertMeta(html, "name", "twitter:description", description);
        assertMeta(html, "property", "article:section", article.section);
        assertMeta(html, "property", "article:published_time", article.date);
        if (article.modifiedAt) assertMeta(html, "property", "article:modified_time", article.modifiedAt);
        assertMeta(html, "property", "article:author", article.author);
        const image = article.seo?.socialImage ?? article.image;
        if (image && !/\.svg(?:\?|$)/i.test(image.src)) {
          assertMeta(html, "property", "og:image", new URL(image.src, origin).href);
          assertMeta(html, "name", "twitter:image", new URL(image.src, origin).href);
        }
        const graphs = [
          ...html.matchAll(
            /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
          ),
        ].map((m) => JSON.parse(m[1]));
        assert.equal(graphs.length, 1);
        assert.deepEqual(graphs[0], JSON.parse(JSON.stringify(articleStructuredData(article))));
        assert.equal(graphs[0].mainEntityOfPage, publicUrl(path, origin));
        assert.equal(
          graphs[0].articleSection,
          published.find(
            (a) => `${sectionRoutes[a.section]}/${a.slug}` === path,
          )?.section,
        );
        assert.ok(
          graphs[0].headline &&
            graphs[0].description &&
            graphs[0].datePublished &&
            graphs[0].author.name,
        );
      }
      for (const link of html.matchAll(
        /href="(\/(?:football|cinema|essays)\/[^"?#]+)"/g,
      ))
        assert.ok(identities.has(link[1]), `Non-public story link ${link[1]}`);
      assert.ok(!/href="\/(?:articles|films|journal)(?:\/|")/.test(html));
    }
    for (const [alias, target] of [
      ["/films", "/cinema"],
      ["/journal", "/essays"],
    ]) {
      const response = await get(alias);
      assert.equal(response.status, 308);
      assert.ok(response.headers.get("location")?.endsWith(target));
    }
    const { readFile } = await import("node:fs/promises");
    const { preview } = JSON.parse(
      await readFile(".next/prerender-manifest.json", "utf8"),
    );
    for (const path of ["/", ...Object.values(sectionRoutes), ...identities]) {
      const response: Response = await fetch(new URL(path, origin), {
        headers: {
          cookie: `__prerender_bypass=${preview.previewModeId}`,
          "user-agent": "Googlebot",
        },
      });
      assert.equal(response.status, 200);
      const html = await response.text();
      const directive = html.match(/name="robots" content="([^"]+)"/)?.[1];
      assert.ok(
        directive?.includes("noindex") && directive.includes("noarchive"),
        "Draft Mode robots safety",
      );
    }
    const previewSitemap = await fetch(new URL("/sitemap.xml", origin), {
      headers: { cookie: `__prerender_bypass=${preview.previewModeId}` },
    });
    assert.equal(await previewSitemap.text(), sitemap, "Preview cookie cannot change public sitemap");
    const secrets = [
      "SANITY_API_READ_TOKEN",
      "SANITY_REVALIDATE_SECRET",
      "SANITY_API_WRITE_TOKEN",
    ]
      .map((key) => process.env[key])
      .filter((value): value is string => Boolean(value));
    for (const path of ["/", ...Object.values(sectionRoutes), "/robots.txt", "/sitemap.xml", ...identities]) {
      const html = await (await get(path)).text();
      assert.ok(
        !secrets.some((secret) => html.includes(secret)),
        "Secret must not appear in public output",
      );
      const previewHtml = await (await fetch(new URL(path, origin), {
        headers: { cookie: `__prerender_bypass=${preview.previewModeId}` },
      })).text();
      assert.ok(!secrets.some((secret) => previewHtml.includes(secret)), "Secret must not appear in preview output");
    }
    const { readdir } = await import("node:fs/promises");
    for (const entry of await readdir(".next/static", { recursive: true, withFileTypes: true })) {
      if (!entry.isFile()) continue;
      const bytes = await readFile(`${entry.parentPath}/${entry.name}`);
      assert.ok(!secrets.some((secret) => bytes.includes(Buffer.from(secret))), "Secret must not appear in client assets");
    }
    if (process.env.SANITY_API_READ_TOKEN) {
      const raw = client.withConfig({
        perspective: "raw",
        token: process.env.SANITY_API_READ_TOKEN,
      });
      const qaCount = await raw.fetch<number>(
        'count(*[_type == "article" && (slug.current match "p12-*" || _id match "*p12-qa*")])',
      );
      assert.equal(qaCount, 0, "No P12 QA documents should exist");
      const drafts = await raw.fetch<
        Array<{ section: keyof typeof sectionRoutes; slug: string }>
      >(
        '*[_type == "article" && _id in path("drafts.**") && defined(slug.current)]{section,"slug":slug.current}',
      );
      for (const draft of drafts) {
        const path = `${sectionRoutes[draft.section]}/${draft.slug}`;
        if (!identities.has(path)) {
          assert.equal(
            (await get(path)).status,
            404,
            "Draft-only public route",
          );
          assert.ok(!urls.includes(publicUrl(path, origin)));
        }
      }
      console.log(
        `Read-only CMS audit: no P12 QA documents; ${drafts.length} draft documents checked for public isolation.`,
      );
    }
    const first = published[0];
    if (process.env.SANITY_REVALIDATE_SECRET) {
      const { encodeSignatureHeader } = await import("@sanity/webhook");
      const body = JSON.stringify({
        _id: first._id,
        _type: "article",
        before: { section: first.section, slug: first.slug },
        after: { section: first.section, slug: first.slug },
      });
      const response = await fetch(new URL("/api/revalidate", origin), {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "sanity-webhook-signature": await encodeSignatureHeader(body, Date.now(), process.env.SANITY_REVALIDATE_SECRET),
        },
        body,
      });
      assert.equal(response.status, 200, "Signed existing-article cache invalidation");
      const result = await response.json();
      assert.ok(result.revalidated && result.paths.includes("/sitemap.xml"));
      assert.equal(await (await get("/sitemap.xml")).text(), sitemap);
    }
    const wrongSection = Object.keys(sectionRoutes).find(
      (s) => s !== first.section,
    ) as keyof typeof sectionRoutes;
    for (const path of [
      "/football/p12-nonexistent-slug",
      `${sectionRoutes[wrongSection]}/${first.slug}`,
      `/articles/${first.slug}`,
      "/essays/p11-preview-lifecycle-probe",
    ])
      assert.equal((await get(path)).status, 404, path);
    console.log(
      `Live SEO verified: 4 static routes, ${published.length} published articles, sitemap, robots, redirects, public links and anonymous 404s.`,
    );
  }
  console.log(
    "Validated origin, metadata overrides/fallbacks, structured data, preview robots and sitemap helpers.",
  );
}
validateLive().catch((error) => {
  console.error("SEO validation failed:", error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
});
