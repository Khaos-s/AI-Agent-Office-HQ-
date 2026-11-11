/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputFileTracingIncludes: {
      "/api/brain": ["./brain/**/*.md", "./agents/*.md"],
    },
  },
};

export default nextConfig;
