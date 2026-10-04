import {
  editorialSections,
  isEditorialSection,
  isValidArticleSlug,
} from "@/content/editorial-routing";
import { sectionRoutes, type EditorialSection } from "@/content/story";

import {
  articleCacheTag,
  articleIdentityCacheTag,
  sectionCacheTag,
} from "./cache";
import { getSanityClient } from "./client";

type ArticleSnapshot = {
  section?: unknown;
  slug?: unknown;
} | null;

export type RevalidationWebhookPayload = {
  _id?: unknown;
  _type?: unknown;
  before?: ArticleSnapshot;
  after?: ArticleSnapshot;
  dependents?: unknown;
};

export type RevalidationPlan = {
  documentType: "article" | "author";
  paths: readonly string[];
  tags: readonly string[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isSanityDocumentId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= 128 &&
    !value.startsWith("drafts.") &&
    !value.startsWith("versions.") &&
    /^[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*$/.test(value)
  );
}

function parseSnapshot(
  value: unknown,
  field: string,
): { section: EditorialSection; slug: string } | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (!isRecord(value)) {
    throw new Error(`${field} must be an object or null`);
  }

  const { section, slug } = value;
  if (section !== null && section !== undefined && !isEditorialSection(section)) {
    throw new Error(`${field}.section is invalid`);
  }
  if (slug !== null && slug !== undefined && !isValidArticleSlug(slug)) {
    throw new Error(`${field}.slug is invalid`);
  }
  if (section === null || section === undefined || slug === null || slug === undefined) {
    return undefined;
  }

  return { section, slug };
}

function parseDependents(value: unknown) {
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value)) {
    throw new Error("dependents must be an array");
  }

  return value.map((dependent, index) => {
    const identity = parseSnapshot(dependent, `dependents[${index}]`);
    if (!identity) {
      throw new Error(`dependents[${index}] requires section and slug`);
    }
    return identity;
  });
}

export async function fetchRevalidationDependents(documentId: string) {
  if (!isSanityDocumentId(documentId)) {
    throw new Error("payload._id is invalid");
  }

  const result = await getSanityClient()
    .withConfig({ perspective: "published", useCdn: false })
    .fetch<unknown>(
      `*[
        _type == "article" &&
        _id != $documentId &&
        references($documentId)
      ]{
        section,
        "slug": slug.current
      }`,
      { documentId },
      { cache: "no-store" },
    );

  return parseDependents(result);
}

export function buildRevalidationPlan(payload: unknown): RevalidationPlan {
  if (!isRecord(payload)) {
    throw new Error("payload must be an object");
  }
  if (!isSanityDocumentId(payload._id)) {
    throw new Error("payload._id is invalid");
  }

  const dependents = parseDependents(payload.dependents);

  if (payload._type === "author") {
    const paths = new Set<string>();
    const tags = new Set<string>();

    for (const { section, slug } of dependents) {
      paths.add("/");
      paths.add(sectionRoutes[section]);
      paths.add(`${sectionRoutes[section]}/${slug}`);
      tags.add(sectionCacheTag(section));
      tags.add(articleIdentityCacheTag(section, slug));
    }

    return {
      documentType: "author",
      paths: [...paths],
      tags: [...tags],
    };
  }

  if (payload._type !== "article") {
    throw new Error("payload._type must be article or author");
  }

  const identities = [
    parseSnapshot(payload.before, "before"),
    parseSnapshot(payload.after, "after"),
  ].filter((identity): identity is { section: EditorialSection; slug: string } =>
    Boolean(identity),
  );

  const paths = new Set<string>(["/", "/sitemap.xml"]);
  const tags = new Set<string>();

  if (identities.length === 0) {
    tags.add(articleCacheTag);
    for (const section of editorialSections) {
      paths.add(sectionRoutes[section]);
      tags.add(sectionCacheTag(section));
    }
  } else {
    for (const { section, slug } of identities) {
      paths.add(sectionRoutes[section]);
      paths.add(`${sectionRoutes[section]}/${slug}`);
      tags.add(sectionCacheTag(section));
      tags.add(articleIdentityCacheTag(section, slug));
    }
  }

  for (const { section, slug } of dependents) {
    paths.add(`${sectionRoutes[section]}/${slug}`);
    tags.add(articleIdentityCacheTag(section, slug));
  }

  return {
    documentType: "article",
    paths: [...paths],
    tags: [...tags],
  };
}
