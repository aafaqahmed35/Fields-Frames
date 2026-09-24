import { defineArrayMember, defineField, defineType } from "sanity";

import {
  allCategories,
  articleModes,
  isCategoryForSection,
} from "../../content/editorial-constants";
import type { EditorialSection } from "../../content/story";

const sections: readonly EditorialSection[] = ["FIELD", "CINEMA", "ESSAYS"];

function isSection(value: unknown): value is EditorialSection {
  return typeof value === "string" && sections.includes(value as EditorialSection);
}

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  groups: [
    { name: "editorial", title: "Editorial", default: true },
    { name: "media", title: "Media" },
    { name: "relationships", title: "Relationships" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "editorial",
      validation: (rule) => rule.required().min(5).max(140),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "editorial",
      description: "The URL-safe article identity inside its section.",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: async (value, context) => {
          const section = context.document?.section;
          const currentId = context.document?._id?.replace(/^drafts\./, "");

          if (!value || !isSection(section) || !currentId) {
            return true;
          }

          const duplicateId = await context
            .getClient({ apiVersion: "2026-02-01" })
            .fetch<string | null>(
              `*[_type == "article" && section == $section && slug.current == $slug && !(_id in [$id, $draftId])][0]._id`,
              {
                draftId: `drafts.${currentId}`,
                id: currentId,
                section,
                slug: value,
              },
            );

          return !duplicateId;
        },
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "section",
      title: "Section",
      type: "string",
      group: "editorial",
      options: {
        layout: "radio",
        list: sections.map((section) => ({ title: section, value: section })),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "editorial",
      description: "Categories are constrained to the selected section's editorial vocabulary.",
      options: {
        list: allCategories.map((category) => ({ title: category, value: category })),
      },
      validation: (rule) =>
        rule.required().custom((value, context) => {
          const section = context.document?.section;

          if (!isSection(section) || typeof value !== "string") {
            return "Choose a section and category";
          }

          return isCategoryForSection(section, value)
            ? true
            : `${value} is not an approved ${section} category`;
        }),
    }),
    defineField({
      name: "mode",
      title: "Presentation mode",
      type: "string",
      group: "editorial",
      description: "Editorial intent only; the publication design system owns layout.",
      options: {
        layout: "radio",
        list: articleModes.map((mode) => ({ title: mode, value: mode })),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "kicker",
      title: "Kicker",
      type: "string",
      group: "editorial",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "dek",
      title: "Dek",
      type: "text",
      rows: 3,
      group: "editorial",
      validation: (rule) => rule.required().min(20).max(300),
    }),
    defineField({
      name: "opening",
      title: "Opening standfirst",
      type: "text",
      rows: 4,
      group: "editorial",
      description: "Optional emphasized opening used by the existing article presentation.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      group: "editorial",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
          ],
          lists: [
            { title: "Bulleted list", value: "bullet" },
            { title: "Numbered list", value: "number" },
          ],
          marks: { decorators: [], annotations: [] },
        }),
        defineArrayMember({ type: "pullQuote" }),
        defineArrayMember({ type: "articleFigure" }),
        defineArrayMember({ type: "divider" }),
        defineArrayMember({ type: "articleNote" }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      group: "relationships",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Publication date",
      type: "date",
      group: "editorial",
      description: "The frontend derives the human-readable date label in UTC.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "readingTimeOverride",
      title: "Reading-time override",
      type: "number",
      group: "editorial",
      description: "Optional. Leave empty to derive reading time from the body at 225 words per minute.",
      validation: (rule) => rule.integer().min(1).max(60),
    }),
    defineField({
      name: "leadImage",
      title: "Lead image",
      type: "editorialImage",
      group: "media",
      validation: (rule) =>
        rule.custom((value, context) =>
          context.document?.mode === "FEATURE" && !value
            ? "Feature articles require a lead image"
            : true,
        ),
    }),
    defineField({
      name: "relatedArticles",
      title: "Related reading",
      type: "array",
      group: "relationships",
      description: "Choose up to three explicit editorial relationships. Order is preserved.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "article" }],
        }),
      ],
      validation: (rule) =>
        rule.unique().max(3).custom((references, context) => {
          if (!Array.isArray(references)) {
            return true;
          }

          const currentId = context.document?._id?.replace(/^drafts\./, "");
          const selfReference = references.some((reference) => {
            if (!reference || typeof reference !== "object" || !("_ref" in reference)) {
              return false;
            }

            const referenceId = String(reference._ref).replace(/^drafts\./, "");
            return currentId === referenceId;
          });

          return selfReference ? "An article cannot relate to itself" : true;
        }),
    }),
    defineField({
      name: "seo",
      title: "Search and social",
      type: "seo",
      group: "seo",
    }),
  ],
  orderings: [
    {
      title: "Publication date, newest",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      section: "section",
      category: "category",
      media: "leadImage",
      date: "publishedAt",
    },
    prepare: ({ title, section, category, media, date }) => ({
      title,
      media,
      subtitle: [section, category, date].filter(Boolean).join(" · "),
    }),
  },
});
