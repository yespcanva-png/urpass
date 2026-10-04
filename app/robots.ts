import type { MetadataRoute } from "next";

const DISALLOWED_PATHS = [
  "/dashboard/",
  "/event/",
  "/billing/",
  "/scan/",
  "/auth/",
  "/ops/",
  "/pass/",
  "/org/",
  "/portal/",
  "/onboarding",
  "/onboarding/",
  "/login",
  "/forgot-password",
  "/api/",
];

const ALLOWED_PATHS = ["/", "/api/mcp", "/llms.txt", "/llms-full.txt"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ALLOWED_PATHS,
        disallow: DISALLOWED_PATHS,
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
        allow: ALLOWED_PATHS,
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: "Googlebot",
        allow: ALLOWED_PATHS,
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: "Bingbot",
        allow: ALLOWED_PATHS,
        disallow: DISALLOWED_PATHS,
      },
    ],
    sitemap: "https://urpass.space/sitemap.xml",
    host: "https://urpass.space",
  };
}
