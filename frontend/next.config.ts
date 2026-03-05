import type { NextConfig } from "next";

const API_BASE = process.env.INTERNAL_API_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  output: "standalone",

  turbopack: {
    root: __dirname,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "600mb",
    },
  },

  async rewrites() {
    return [
      // Keep Next-Auth routes local
      {
        source      : "/api/auth/:path*",
        destination : "/api/auth/:path*",
      },
      // Everything else proxied to the FastAPI backend
      {
        source      : "/api/:path*",
        destination : `${API_BASE}/:path*`,
      },
    ];
  },
};

export default nextConfig;
