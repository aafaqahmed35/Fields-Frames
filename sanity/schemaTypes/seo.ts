import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "Search and social",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "SEO title",
      type: "string",
      description: "Optional. Falls back to the editorial title.",
      validation: (rule) => rule.max(70),
    }),
    defineField({
      name: "description",
      title: "SEO description",
      type: "text",
      rows: 3,
      description: "Optional. Falls back to the dek.",
      validation: (rule) => rule.max(180),
    }),
    defineField({
      name: "socialImage",
      title: "Social image",
      type: "editorialImage",
      description: "Optional. Falls back to the lead image.",
    }),
  ],
});
