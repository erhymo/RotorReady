/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence monorepo/workspace root inference warning locally
  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig;

