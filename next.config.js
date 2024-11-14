/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.cache = false; // Disable cache for client-side webpack build
    }

    // Disable JavaScript minification for debugging purposes
    config.optimization.minimize = false;

    return config;
  },
};

module.exports = nextConfig;
