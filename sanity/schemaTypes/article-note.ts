import { defineField, defineType } from "sanity";

export const articleNote = defineType({
  name: "articleNote",
  title: "Note",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string" }),
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "text" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Article note",
      subtitle,
    }),
  },
});
