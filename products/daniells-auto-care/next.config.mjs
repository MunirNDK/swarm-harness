/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'wordpress-1279759-6563731.cloudwaysapps.com',
      },
    ],
  },
};

export default nextConfig;