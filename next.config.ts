import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
