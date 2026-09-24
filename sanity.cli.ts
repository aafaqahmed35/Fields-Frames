import { defineCliConfig } from "sanity/cli";

import { studioDataset, studioProjectId } from "./sanity/env";

export default defineCliConfig({
  api: {
    projectId: studioProjectId,
    dataset: studioDataset,
  },
  schemaExtraction: {
    enabled: true,
    path: "./sanity/schema.json",
  },
  typegen: {
    enabled: true,
    path: ["./sanity/**/*.{ts,tsx}", "./content/**/*.{ts,tsx}"],
    schema: "./sanity/schema.json",
    generates: "./sanity/sanity.types.ts",
    overloadClientMethods: true,
  },
});
