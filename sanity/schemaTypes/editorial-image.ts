import { defineField, defineType } from "sanity";

export const editorialImage = defineType({
  name: "editorialImage",
  title: "Editorial image",
  type: "image",
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description: "Describe the image for readers who cannot see it. Do not reuse the caption.",
      validation: (rule) => rule.required().min(5),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
    defineField({
      name: "credit",
      title: "Credit",
      type: "string",
      description: "Use the supplied or licensed credit; never infer one.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      media: "asset",
      title: "alt",
      subtitle: "credit",
    },
  },
});
