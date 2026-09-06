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
        hostname: "img1.wsimg.com",
        pathname: "/isteam/**",
      },
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
        pathname: "/**",
      },
      // All local UAE-first prospect hosts (apex + www). Grouped under one
      // glob because the config schema caps remotePatterns at 50 entries.
      {
        protocol: "https",
        hostname: "**.ae",
        pathname: "/**",
      },
      // ── RAK & Dubai demos (scraped from each company's live site, verified 200) ──
      {
        protocol: "https",
        hostname: "rakeauae.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.ostaservices.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "albaredacrepairing.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.teamstalwart.com",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "www.teluscare.com",
        pathname: "/old/**",
      },
      {
        protocol: "https",
        hostname: "nestfix-uae.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "cannelleholdings.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.thushhaara.com",
        pathname: "/media_library/**",
      },
      {
        protocol: "https",
        hostname: "uaehvac.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "noorawaal.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "alsidras.com",
        pathname: "/img/**",
      },
      {
        protocol: "https",
        hostname: "abusaeed.com",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "homefixituae.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.basatanwertech.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "www.reachuae.com",
        pathname: "/uploads/**",
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