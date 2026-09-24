"use client";

import { NextStudio } from "next-sanity/studio";

import config from "../sanity.config";

export function MindAndMarginStudio() {
  return <NextStudio config={config} />;
}
