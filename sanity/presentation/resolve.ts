import {
  defineLocations,
  type PresentationPluginOptions,
} from "sanity/presentation";

import { resolveArticlePath } from "../../content/editorial-routing";
import { sectionRoutes, type EditorialSection } from "../../content/story";

export const presentationResolve: PresentationPluginOptions["resolve"] = {
  mainDocuments: [
    {
      route: "/football/:slug",
      resolve: ({ params }) => ({
        filter: `_type == "article" && section == "FIELD" && slug.current == $slug`,
        params: { slug: params.slug },
      }),
    },
    {
      route: "/cinema/:slug",
      resolve: ({ params }) => ({
        filter: `_type == "article" && section == "CINEMA" && slug.current == $slug`,
        params: { slug: params.slug },
      }),
    },
    {
      route: "/essays/:slug",
      resolve: ({ params }) => ({
        filter: `_type == "article" && section == "ESSAYS" && slug.current == $slug`,
        params: { slug: params.slug },
      }),
    },
  ],
  locations: {
    article: defineLocations({
      select: {
        title: "title",
        section: "section",
        slug: "slug.current",
      },
      resolve: (document) => {
        const path = resolveArticlePath(document?.section, document?.slug);

        if (!path) {
          return {
            message:
              "Choose a valid section and URL-safe slug before opening the article preview.",
            tone: "caution",
          };
        }

        const section = document?.section as EditorialSection;
        return {
          locations: [
            {
              title: document?.title || "Untitled article",
              href: path,
            },
            {
              title: `${section} index`,
              href: sectionRoutes[section],
            },
            { title: "Homepage", href: "/" },
          ],
        };
      },
    }),
  },
};
