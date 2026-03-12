/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "images.pexels.com" }],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
