import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Remote brand assets are large and often slow; skip the optimizer so
    // the browser fetches the original URL instead of timing out.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.skmaircon.com",
        pathname: "/img/**",
      },
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "geogroupglobal.com",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "www.aljunaidgroup.com",
        pathname: "/web/image/**",
      },
      {
        protocol: "https",
        hostname: "www.atheeraljazirah.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "atheeraljazirah.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "burjaldar.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "bestairservices.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.unitedgulf.ae",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "tawoostech.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;