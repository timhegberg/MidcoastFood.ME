import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Preserve inbound links from the old Webflow URL structure.
      { source: "/food-resources", destination: "/resources", permanent: true },
      { source: "/donate", destination: "/share-your-resources", permanent: true },
    ];
  },
};

export default config;
