"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { studioDataset, studioProjectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "mindAndMargin",
  title: "Mind & Margin",
  basePath: "/studio",
  projectId: studioProjectId,
  dataset: studioDataset,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
