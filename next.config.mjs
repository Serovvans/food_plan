/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Prevent Next.js from bundling Node.js-only packages (node-telegram-bot-api)
    serverComponentsExternalPackages: ["node-telegram-bot-api"],
  },
};

export default nextConfig;
