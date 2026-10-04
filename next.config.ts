import type { NextConfig } from "next";
import { validateProductionEnvironment } from "./lib/environment";

const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();

if (process.env.NODE_ENV === "production") validateProductionEnvironment();

const publicationCsp = [
  "default-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: https://cdn.sanity.io",
  "connect-src 'self'",
  "frame-src 'self'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Same-origin embedded Studio/Presentation. Resource restrictions are
          // deliberately deferred until authenticated Studio sources are verified.
          {
            key: "Content-Security-Policy",
            value:
              "object-src 'none'; base-uri 'self'; frame-ancestors 'self'; form-action 'self'",
          },
        ],
      },
      ...["/", "/football/:path*", "/cinema/:path*", "/essays/:path*"].map(
        (source) => ({
          source,
          headers: [{ key: "Content-Security-Policy", value: publicationCsp }],
        }),
      ),
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
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
