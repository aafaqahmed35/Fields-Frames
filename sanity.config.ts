"use client";

import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { siteOrigin, studioDataset, studioProjectId } from "./sanity/env";
import { presentationResolve } from "./sanity/presentation/resolve";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "mindAndMargin",
  title: "Mind & Margin",
  basePath: "/studio",
  projectId: studioProjectId,
  dataset: studioDataset,
  plugins: [
    structureTool(),
    presentationTool({
      resolve: presentationResolve,
      allowOrigins: [siteOrigin],
      previewUrl: {
        initial: siteOrigin,
        previewMode: {
          enable: "/api/draft-mode/enable",
          disable: "/api/draft-mode/disable",
          shareAccess: false,
        },
      },
    }),
  ],
  schema: { types: schemaTypes },
});
