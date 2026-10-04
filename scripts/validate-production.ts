import { createRequire } from "node:module";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { loadEnvConfig } from "@next/env";
import { encodeSignatureHeader } from "@sanity/webhook";
import {
  validateProductionEnvironment,
  resolveContentSourceMode,
} from "../lib/environment";
import { isSafePreviewPath } from "../lib/preview";
import { readSignedWebhook, WebhookRequestError } from "../lib/webhook";

const fixture = {
  NODE_ENV: "production" as const,
  SITE_ORIGIN: "https://publication.example",
  NEXT_PUBLIC_SITE_ORIGIN: "https://publication.example",
  MIND_MARGIN_CONTENT_SOURCE: "sanity",
  NEXT_PUBLIC_SANITY_PROJECT_ID: "fixtureproject",
  NEXT_PUBLIC_SANITY_DATASET: "production",
  SANITY_API_READ_TOKEN: "fixture-viewer",
  SANITY_REVALIDATE_SECRET: "x".repeat(64),
};
assert.equal(validateProductionEnvironment(fixture).source, "sanity");
assert.throws(() => resolveContentSourceMode({ NODE_ENV: "production" }));
for (const key of [
  "SITE_ORIGIN",
  "NEXT_PUBLIC_SITE_ORIGIN",
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_DATASET",
  "SANITY_API_READ_TOKEN",
  "SANITY_REVALIDATE_SECRET",
]) {
  assert.throws(
    () => validateProductionEnvironment({ ...fixture, [key]: "" }),
    key,
  );
}
for (const value of [
  "ftp://example.com",
  "https://u:p@example.com",
  "https://example.com/path",
  "https://example.com/../",
  "https://example.com/?x",
  "https://example.com/#x",
  "not-a-url",
]) {
  for (const key of ["SITE_ORIGIN", "NEXT_PUBLIC_SITE_ORIGIN"])
    assert.throws(() =>
      validateProductionEnvironment({ ...fixture, [key]: value }),
    );
}
assert.throws(() =>
  validateProductionEnvironment({
    ...fixture,
    MIND_MARGIN_CONTENT_SOURCE: "local",
  }),
);
assert.throws(() =>
  validateProductionEnvironment({
    ...fixture,
    NEXT_PUBLIC_SITE_ORIGIN: "http://localhost:3000",
  }),
);
assert.equal(
  validateProductionEnvironment({
    NODE_ENV: "production",
    MIND_MARGIN_CONTENT_SOURCE: "local",
    SITE_ORIGIN: "http://localhost:3000",
    NEXT_PUBLIC_SITE_ORIGIN: "http://localhost:3000",
  }).source,
  "local",
);
for (const path of [
  "/",
  "/football",
  "/cinema",
  "/essays",
  "/football/valid-story",
  "/essays/valid-story?sanity-preview-perspective=drafts#note",
])
  assert.ok(isSafePreviewPath(path), path);
for (const path of [
  "https://evil.example",
  "//evil.example",
  "/\\evil.example",
  "/api/revalidate",
  "/studio",
  "/articles/story",
  "/football/Bad",
  "/cinema/a%2fb",
  "/football/a/b",
  "/football/" + "a".repeat(97),
])
  assert.ok(!isSafePreviewPath(path), path);

async function main() {
  loadEnvConfig(process.cwd());
  const actualProject = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const actualDataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||=
    fixture.NEXT_PUBLIC_SANITY_PROJECT_ID;
  process.env.NEXT_PUBLIC_SANITY_DATASET ||= fixture.NEXT_PUBLIC_SANITY_DATASET;
  const { buildRevalidationPlan } = await import("../sanity/lib/revalidation");
  const secret = fixture.SANITY_REVALIDATE_SECRET;
  const event = {
    _id: "article-fixture",
    _type: "article",
    before: null,
    after: { section: "FIELD", slug: "fixture-story" },
  };
  const body = JSON.stringify(event);
  const signature = await encodeSignatureHeader(body, Date.now(), secret);
  const request = (value = body, sig = signature, type = "application/json") =>
    new Request("http://localhost/api/revalidate", {
      method: "POST",
      headers: { "content-type": type, "sanity-webhook-signature": sig },
      body: value,
    });
  const rejects = (promise: Promise<unknown>, status: number) =>
    assert.rejects(
      promise,
      (error: unknown) =>
        error instanceof WebhookRequestError && error.status === status,
    );
  for (const sig of [
    "",
    "garbage",
    await encodeSignatureHeader(body, Date.now(), "wrong"),
  ])
    await rejects(readSignedWebhook(request(body, sig), secret), 401);
  await rejects(
    readSignedWebhook(request(body, signature, "text/plain"), secret),
    415,
  );
  await rejects(readSignedWebhook(request("x".repeat(16385)), secret), 413);
  const malformed = "{";
  await rejects(
    readSignedWebhook(
      request(
        malformed,
        await encodeSignatureHeader(malformed, Date.now(), secret),
      ),
      secret,
    ),
    400,
  );
  const parsed = await readSignedWebhook(request(), secret);
  assert.deepEqual(parsed, event);
  assert.deepEqual(
    buildRevalidationPlan(parsed),
    buildRevalidationPlan(await readSignedWebhook(request(), secret)),
    "Duplicate delivery is deterministic",
  );
  for (const value of [
    null,
    [],
    {},
    { _id: "drafts.test", _type: "article" },
    { _id: "test", _type: "unknown" },
    { ...event, after: "bad" },
    { ...event, after: { section: "NEWS", slug: "a" } },
  ])
    assert.throws(() => buildRevalidationPlan(value));

  // Standalone Node tests do not have Next's RSC compiler. Resolve only its
  // server-only marker to the package's empty server entry in this test process.
  const require = createRequire(import.meta.url);
  const markerPath = require.resolve("server-only");
  require.cache[markerPath] = { exports: {} } as NodeModule;
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||=
    fixture.NEXT_PUBLIC_SANITY_PROJECT_ID;
  process.env.NEXT_PUBLIC_SANITY_DATASET ||= fixture.NEXT_PUBLIC_SANITY_DATASET;
  const { getSanityClient } = await import("../sanity/lib/client");
  const { sanityFetch } = await import("../sanity/lib/fetch");
  const { adaptSanityArticle, CmsContentError } =
    await import("../sanity/lib/adapter");
  const client = getSanityClient();
  const original = client.withConfig;
  const originalLog = console.error;
  const logs: unknown[][] = [];
  console.error = (...values) => {
    logs.push(values);
  };
  const oldToken = process.env.SANITY_API_READ_TOKEN;
  process.env.SANITY_API_READ_TOKEN = "private-fixture-not-for-public";
  try {
    let result: unknown = null;
    let fails = false;
    client.withConfig = (config = {}) => {
      assert.equal(config.perspective, "published");
      assert.equal(
        config.token,
        undefined,
        "Anonymous CMS reads cannot use Viewer token",
      );
      assert.equal(config.useCdn, true);
      const cloned = original.call(client, config);
      Object.defineProperty(cloned, "fetch", {
        value: async () => {
          if (fails) throw new Error("upstream private-fixture-not-for-public");
          return result;
        },
      });
      return cloned;
    };
    assert.equal(
      await sanityFetch({ query: "fixture", preview: false }),
      null,
      "Absent content stays absent",
    );
    fails = true;
    await assert.rejects(sanityFetch({ query: "fixture", preview: false }), {
      message: "Editorial content is temporarily unavailable.",
    });
    assert.ok(!JSON.stringify(logs).includes("private-fixture-not-for-public"));
    fails = false;
    result = { unexpected: true };
    assert.throws(
      () =>
        adaptSanityArticle(result, {
          projectId: "fixtureproject",
          dataset: "production",
        }),
      CmsContentError,
    );
  } finally {
    client.withConfig = original;
    console.error = originalLog;
    if (oldToken === undefined) delete process.env.SANITY_API_READ_TOKEN;
    else process.env.SANITY_API_READ_TOKEN = oldToken;
  }
  // Remove fixture defaults before loading the real deployment contract.
  if (actualProject === undefined)
    delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  else process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = actualProject;
  if (actualDataset === undefined)
    delete process.env.NEXT_PUBLIC_SANITY_DATASET;
  else process.env.NEXT_PUBLIC_SANITY_DATASET = actualDataset;
  loadEnvConfig(process.cwd());
  if (process.env.PRODUCTION_VALIDATE_ENV === "1")
    validateProductionEnvironment({ ...process.env, NODE_ENV: "production" });
  const origin = process.env.PRODUCTION_VALIDATE_ORIGIN;
  if (origin) {
    // Exercise the actual configured transport against an upstream that never
    // answers. This runs only with live QA, outside the credential-free gate.
    const { createServer } = await import("node:http");
    let requests = 0;
    const stalled = createServer(() => {
      requests += 1;
    });
    await new Promise<void>((resolve) =>
      stalled.listen(0, "127.0.0.1", resolve),
    );
    const address = stalled.address();
    assert.ok(address && typeof address !== "string");
    const started = Date.now();
    let watchdog: ReturnType<typeof setTimeout> | undefined;
    try {
      await assert.rejects(
        Promise.race([
          client
            .withConfig({
              apiHost: `http://127.0.0.1:${address.port}`,
              useProjectHostname: false,
              useCdn: false,
            })
            .fetch("*[_type == 'article'][0]", {}, { cache: "no-store" }),
          new Promise<never>((_, reject) => {
            watchdog = setTimeout(
              () => reject(new Error("Transport exceeded test budget")),
              25_000,
            );
          }),
        ]),
      );
      const elapsed = Date.now() - started;
      assert.ok(
        elapsed >= 9_000 && elapsed < 25_000,
        `Slow CMS must fail within configured transport budget (elapsed=${elapsed}ms, requests=${requests})`,
      );
      assert.ok(
        requests >= 1 && requests <= 2,
        "Transport retries must be bounded",
      );
    } finally {
      clearTimeout(watchdog);
      stalled.closeAllConnections();
      await new Promise<void>((resolve) => stalled.close(() => resolve()));
    }
    const get = (path: string, init?: RequestInit) =>
      fetch(new URL(path, origin), {
        redirect: "manual",
        signal: AbortSignal.timeout(30_000),
        ...init,
      });
    for (const path of [
      "/",
      "/football",
      "/cinema",
      "/essays",
      "/studio",
      "/sitemap.xml",
      "/robots.txt",
    ]) {
      const response = await get(path);
      assert.equal(response.status, 200, path);
      assert.equal(response.headers.get("x-content-type-options"), "nosniff");
      assert.ok(
        response.headers
          .get("content-security-policy")
          ?.includes("frame-ancestors 'self'"),
      );
      assert.equal(response.headers.get("x-powered-by"), null);
    }
    const serverError = await get("/500");
    assert.equal(serverError.status, 500);
    assert.ok(
      (await serverError.text()).includes("Reading is temporarily unavailable"),
    );
    const post = (value: string, sig?: string, type = "application/json") =>
      get("/api/revalidate", {
        method: "POST",
        headers: {
          "content-type": type,
          ...(sig ? { "sanity-webhook-signature": sig } : {}),
        },
        body: value,
      });
    assert.equal((await get("/api/revalidate")).status, 405);
    assert.equal((await post(body)).status, 401);
    assert.equal((await post(body, "malformed")).status, 401);
    const configuredSecret = process.env.SANITY_REVALIDATE_SECRET!;
    const sign = (value: string) =>
      encodeSignatureHeader(value, Date.now(), configuredSecret);
    assert.equal((await post(malformed, await sign(malformed))).status, 400);
    assert.equal((await post("{}", await sign("{}"))).status, 400);
    assert.equal(
      (await post(body, await sign(body), "text/plain")).status,
      415,
    );
    assert.equal((await post("x".repeat(16385), signature)).status, 413);
    for (const path of [
      "/api/draft-mode/enable",
      "/api/draft-mode/enable?sanity-preview-secret=invalid",
      "/api/draft-mode/enable?sanity-preview-secret=invalid&sanity-preview-pathname=//evil.example",
    ]) {
      const response = await get(path);
      assert.ok([400, 401].includes(response.status), path);
      assert.equal(response.headers.get("set-cookie"), null);
      assert.ok(response.headers.get("cache-control")?.includes("no-store"));
    }
    assert.equal((await get("/api/draft-mode/disable")).status, 405);
    const exit = await get("/api/draft-mode/disable", { method: "POST" });
    assert.equal(exit.status, 303);
    assert.ok(exit.headers.get("set-cookie")?.includes("__prerender_bypass="));
    for (const path of [
      "/not-a-page",
      "/football/unknown-story",
      "/football/Bad-Slug",
      "/articles/unknown-story",
    ]) {
      const response = await get(path, {
        headers: { "user-agent": "Googlebot" },
      });
      assert.equal(response.status, 404, path);
      assert.ok((await response.text()).includes("This page isn’t available"));
    }
    const secrets = [
      "SANITY_API_READ_TOKEN",
      "SANITY_REVALIDATE_SECRET",
      "SANITY_API_WRITE_TOKEN",
    ]
      .map((key) => process.env[key]?.trim())
      .filter((value): value is string => Boolean(value));
    for (const entry of await readdir(".next/static", {
      recursive: true,
      withFileTypes: true,
    })) {
      if (!entry.isFile()) continue;
      const bytes = await readFile(`${entry.parentPath}/${entry.name}`);
      assert.ok(
        !secrets.some((value) => bytes.includes(value)),
        "Secret value in client assets",
      );
      if (entry.name.endsWith(".js"))
        assert.ok(
          !/SANITY_API_READ_TOKEN|SANITY_REVALIDATE_SECRET|SANITY_API_WRITE_TOKEN/.test(
            bytes.toString(),
          ),
          "Secret reference in client JavaScript",
        );
    }
    console.log(
      "Live production checks passed: headers, trust boundaries, bounded inputs, 404s, exit cookies and client secret scan.",
    );
  }
  console.log(
    "Production failure-mode checks passed: environment, preview paths, signature/body handling and retries.",
  );
}
main().catch((error) => {
  console.error(
    "Production validation failed:",
    error instanceof Error ? error.message : "Unknown failure",
  );
  process.exitCode = 1;
});
