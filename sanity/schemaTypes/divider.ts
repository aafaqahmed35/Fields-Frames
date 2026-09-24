import { defineField, defineType } from "sanity";

export const divider = defineType({
  name: "divider",
  title: "Divider",
  type: "object",
  fields: [
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      initialValue: "divider",
      readOnly: true,
      hidden: true,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Section divider" }),
  },
});
