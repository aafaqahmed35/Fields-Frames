import { defineField, defineType } from "sanity";

export const articleFigure = defineType({
  name: "articleFigure",
  title: "Figure",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "editorialImage",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      media: "image",
      title: "image.alt",
      subtitle: "image.credit",
    },
  },
});
