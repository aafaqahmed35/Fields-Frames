import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Stable identifier",
      type: "slug",
      description: "Used for references and future author URLs. Changing it should be rare.",
      options: { source: "name", maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Short biography",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().min(20).max(500),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "bio" },
  },
});
