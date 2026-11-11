/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/api/brain": ["./brain/**/*.md", "./agents/*.md"],
  },
};

export default nextConfig;
