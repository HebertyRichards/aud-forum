import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    const api_url = process.env.API_URL;
    return [
      {
        source: "/api-internal/:path*",
        destination: `${api_url}/:path*`,
      },
      {
        source: "/socket/:path*",
        destination: `${api_url}/forum/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);