/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http", // For localhost
        hostname: "localhost",
      },
      {
        protocol: "https", // For Supabase storage
        hostname: "mvkgxkinlfgdlvqvvkir.supabase.co",
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
