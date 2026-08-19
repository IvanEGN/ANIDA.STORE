/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATABASE_URL:
      process.env.DATABASE_URL ||
      "mysql://u624428023_admin:Hermanos_2001@srv755.hstgr.io:3306/u624428023_anida",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
