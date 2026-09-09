/** @type {import('next').NextConfig} */
const apiProxyTarget = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "");

const imageHosts = (
  process.env.NEXT_PUBLIC_PRODUCT_IMAGE_ALLOWED_HOSTS || "images.unsplash.com"
)
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

const nextConfig = {
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: imageHosts.map((host) => ({
      protocol: "https",
      hostname: host,
    })),
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiProxyTarget}/api/:path*`,
      },
      {
        source: "/socket.io",
        destination: `${apiProxyTarget}/socket.io/`,
      },
      {
        source: "/socket.io/:path*",
        destination: `${apiProxyTarget}/socket.io/:path*`,
      },
    ];
  },
};

export default nextConfig;
