/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
  },
  images: {
    domains: ["images.leafly.com", "res.cloudinary.com", "placehold.co"],
  },
};

module.exports = nextConfig;
