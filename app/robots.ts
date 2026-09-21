import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
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
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "PerplexityBot",
          "ClaudeBot",
          "anthropic-ai",
          "Google-Extended",
          "GoogleOther",
          "Applebot-Extended",
          "cohere-ai",
          "Amazonbot",
        ],
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
