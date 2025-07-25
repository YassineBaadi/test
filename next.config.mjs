/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure the Next.js proxy to handle API requests
  async rewrites() {
    return [
      {
        source: "/api/games/:path*",
        destination: "https://www.freetogame.com/api/:path*",
      },
    ];
  },

  // Configure images to allow external domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.freetogame.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
