import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true, // Optional if using styled-components
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
