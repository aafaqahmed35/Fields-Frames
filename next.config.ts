import type { NextConfig } from "next";

const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

const nextConfig: NextConfig = {
  images:
    sanityProjectId && sanityDataset
      ? {
          remotePatterns: [
            {
              protocol: "https",
              hostname: "cdn.sanity.io",
              port: "",
              pathname: `/images/${sanityProjectId}/${sanityDataset}/**`,
            },
          ],
        }
      : undefined,
  async redirects() {
    return [
      {
        source: "/films",
        destination: "/cinema",
        permanent: true,
      },
      {
        source: "/journal",
        destination: "/essays",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
