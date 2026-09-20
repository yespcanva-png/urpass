import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/in",
          "/in/*",
          "/guides/*",
          "/compare/*",
          "/pricing",
          "/sitelinks",
          "/apply/*",
          "/feedback/*",
          "/design-your-ticket",
          "/custom-pass-design",
          "/qr-code-scanner",
          "/event-analytics",
          "/digital-event-pass",
          "/free-event-registration",
          "/college-fests",
          "/hackathons",
          "/conferences",
          "/workshops",
          "/docs",
          "/contact",
          "/terms",
        ],
        disallow: [
          "/dashboard/",
          "/event/",
          "/billing/",
          "/scan/",
          "/api/",
          "/auth/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/event/",
          "/billing/",
          "/scan/",
          "/api/",
          "/auth/",
        ],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/event/",
          "/billing/",
          "/scan/",
          "/api/",
          "/auth/",
        ],
      },
    ],
    sitemap: "https://urpass.space/sitemap.xml",
    host: "https://urpass.space",
  };
}
