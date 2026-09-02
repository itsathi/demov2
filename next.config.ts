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
      {
        protocol: "https",
        hostname: "files.saasuae.gositebuilder.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.airotechacgm.com",
        pathname: "/static/**",
      },
      {
        protocol: "https",
        hostname: "endeavoruae.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "noqtatalnada.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "camberme.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "newwaygroupcompanies.ae",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "gbfm.ae",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "dhabicontracting.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "thehealthyhome.me",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "whitearch-me.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "lemlemtechnicals.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.primegroupuae.ae",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "specialairconditiongeneralmaintenance.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "newlifeuae.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "air-co.ae",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "brightstargroup.ae",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "emra.ae",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "lark.ae",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/demo",
        destination: "/",
        permanent: true,
      },
      {
        source: "/demo/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;