import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/mcp", "/llms.txt", "/llms-full.txt"],
        disallow: [
          "/dashboard/",
          "/event/",
          "/billing/",
          "/scan/",
          "/auth/",
          "/ops/",
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
        allow: ["/", "/api/mcp", "/llms.txt", "/llms-full.txt"],
        disallow: [
          "/dashboard/",
          "/event/",
          "/billing/",
          "/scan/",
          "/auth/",
          "/ops/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/api/mcp", "/llms.txt", "/llms-full.txt"],
        disallow: [
          "/dashboard/",
          "/event/",
          "/billing/",
          "/scan/",
          "/auth/",
          "/ops/",
        ],
      },
      {
        userAgent: "Bingbot",
        allow: ["/", "/api/mcp", "/llms.txt", "/llms-full.txt"],
        disallow: [
          "/dashboard/",
          "/event/",
          "/billing/",
          "/scan/",
          "/auth/",
          "/ops/",
        ],
      },
    ],
    sitemap: "https://urpass.space/sitemap.xml",
    host: "https://urpass.space",
  };
}
