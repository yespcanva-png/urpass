const fs = require("fs");
const path = require("path");

// Load the 25 definitions
const { ALL_25_PAGES } = require("./seo-batch-25-definitions");

console.log(`Loaded ${ALL_25_PAGES.length} problem/commercial SEO page definitions.`);

const rootDir = path.resolve(__dirname, "..");
const appDir = path.join(rootDir, "app");

// 1. Generate lib/commercial-seo/seo-batch-25-data.ts
const dataFilePath = path.join(rootDir, "lib", "commercial-seo", "seo-batch-25-data.ts");
const tsContent = `// Auto-generated Problem & Commercial SEO Batch 25 Data definitions
export interface Batch25PageData {
  slug: string;
  keyword: string;
  title: string;
  description: string;
  h1: string;
  badge: string;
  cluster: "Colleges" | "Universities" | "Agencies" | "Operations" | "Exhibitions" | "Conferences" | "UK" | "Alternatives" | "Innovation";
  audienceType: string;
  ctaLabel: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  directAnswerQuestion: string;
  directAnswerSummary: string;
  directAnswerPoints: string[];
  whatIsTitle: string;
  whatIsDefinition: string;
  whatIsPoints: string[];
  features: Array<{ title: string; desc: string; iconName: string }>;
  deepDive: {
    badge: string;
    title: string;
    paragraphs: string[];
    bullets: string[];
    takeaway: string;
  };
  keyFacts: {
    headers: [string, string, string];
    rows: Array<{ col1: string; col2: string; col3: string }>;
  };
  whoShouldUse: Array<{ title: string; desc: string; badge: string }>;
  faqs: Array<{ q: string; a: string }>;
  geoMeta?: {
    region: string;
    placename: string;
    position: string;
    latitude: number;
    longitude: number;
    country: string;
    countryCode: string;
  };
}

export const SEO_BATCH_25_PAGES: Record<string, Batch25PageData> = ${JSON.stringify(
  ALL_25_PAGES.reduce((acc, p) => {
    acc[p.slug] = p;
    return acc;
  }, {}),
  null,
  2
)};
`;

fs.writeFileSync(dataFilePath, tsContent, "utf-8");
console.log(`✓ Generated ${dataFilePath}`);

// Icon map helper
function getIconImports(features) {
  const iconSet = new Set(["ShieldCheck", "ScanLine", "Users", "Zap", "BarChart3", "Lock", "CheckCircle2", "Building2", "AlertTriangle"]);
  features.forEach(f => {
    if (f.iconName) iconSet.add(f.iconName);
  });
  return Array.from(iconSet).sort().join(", ");
}

// 2. Generate all 25 app/[slug]/page.tsx files
let createdCount = 0;
let updatedCount = 0;

for (const page of ALL_25_PAGES) {
  const pageTargetDir = path.join(appDir, ...page.slug.split("/"));
  if (!fs.existsSync(pageTargetDir)) {
    fs.mkdirSync(pageTargetDir, { recursive: true });
    createdCount++;
  } else {
    updatedCount++;
  }

  const pagePath = path.join(pageTargetDir, "page.tsx");
  const iconImports = getIconImports(page.features);

  const isUk = page.slug.startsWith("uk") || page.cluster === "UK";
  const locale = isUk ? "en_GB" : "en_US";
  const canonicalUrl = `https://urpass.space/${page.slug}`;

  const relatedLinks = isUk
    ? [
        { title: "UK Event Hub & GBP Pricing", href: "/uk", category: "Location" },
        { title: "London Event QR Check-In", href: "/uk/london/event-qr-check-in", category: "Location" },
        { title: "Zero Commission Ticketing UK", href: "/zero-commission-event-ticketing-uk", category: "Product" },
        { title: "Event Features Suite", href: "/features", category: "Product" },
        { title: "URPASS Sitelinks Directory", href: "/sitelinks", category: "Guide" },
      ]
    : page.cluster === "Colleges"
    ? [
        { title: "Events in India Hub", href: "/in", category: "Location" },
        { title: "College Event Management Software", href: "/college-event-management-software", category: "Use Case" },
        { title: "Free QR Ticket Generator", href: "/free-qr-ticket-generator", category: "Product" },
        { title: "Event Features Suite", href: "/features", category: "Product" },
        { title: "URPASS Sitelinks Directory", href: "/sitelinks", category: "Guide" },
      ]
    : [
        { title: "QR Code Check-In System", href: "/qr-code-check-in-system", category: "Product" },
        { title: "Multi-Gate Event Check-In", href: "/multiple-gate-event-check-in", category: "Product" },
        { title: "Zero Commission Event Ticketing", href: "/zero-commission-event-ticketing", category: "Product" },
        { title: "Event Pricing & Free Plan", href: "/pricing", category: "Product" },
        { title: "URPASS Sitelinks Directory", href: "/sitelinks", category: "Guide" },
      ];

  const otherMeta = isUk
    ? `
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
    "geo.position": "55.3781;-3.4360",
    "ICBM": "55.3781, -3.4360",
  },`
    : "";

  const pageCode = `import type { Metadata } from "next";
import { ${iconImports} } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: ${JSON.stringify(page.title)},
  description: ${JSON.stringify(page.description)},
  keywords: [
    ${JSON.stringify(page.keyword)},
    ${JSON.stringify(`${page.keyword} online`)},
    ${JSON.stringify(`${page.keyword} platform`)},
    ${JSON.stringify(`${page.keyword} check in`)},
    ${JSON.stringify(`${page.keyword} qr code`)},
  ],
  alternates: {
    canonical: "${canonicalUrl}",
  },
  openGraph: {
    title: ${JSON.stringify(page.title)},
    description: ${JSON.stringify(page.description)},
    url: "${canonicalUrl}",
    locale: "${locale}",
    type: "website",
  },${otherMeta}
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: ${JSON.stringify(page.badge)},
        h1: ${JSON.stringify(page.h1)},
        canonicalUrl: "${canonicalUrl}",
        description: ${JSON.stringify(page.description)},
        ctaLabel: ${JSON.stringify(page.ctaLabel)},
        ctaHref: ${JSON.stringify(page.ctaHref || "/signup")},
        secondaryCtaLabel: ${JSON.stringify(page.secondaryCtaLabel || "View pricing")},
        secondaryCtaHref: ${JSON.stringify(page.secondaryCtaHref || "/pricing")},
        directAnswer: {
          title: ${JSON.stringify(page.directAnswerQuestion)},
          summary: ${JSON.stringify(page.directAnswerSummary)},
          keyPoints: ${JSON.stringify(page.directAnswerPoints)},
        },
        whatIs: {
          title: ${JSON.stringify(page.whatIsTitle)},
          definition: ${JSON.stringify(page.whatIsDefinition)},
          details: ${JSON.stringify(page.whatIsPoints)},
        },
        featuresTitle: "Core Platform Capabilities Engineered for High Performance",
        featuresSubtitle: "Everything you need to register attendees, issue digital QR passes, and verify door check-ins without hardware.",
        features: [
${page.features
  .map(
    f => `          {
            icon: ${f.iconName || "ShieldCheck"},
            title: ${JSON.stringify(f.title)},
            desc: ${JSON.stringify(f.desc)},
          },`
  )
  .join("\n")}
        ],
        deepDiveSections: [
          {
            badge: ${JSON.stringify(page.deepDive.badge)},
            title: ${JSON.stringify(page.deepDive.title)},
            paragraphs: ${JSON.stringify(page.deepDive.paragraphs)},
            bullets: ${JSON.stringify(page.deepDive.bullets)},
            takeaway: ${JSON.stringify(page.deepDive.takeaway)},
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Benchmarks",
          subtitle: "How UrPass delivers faster processing, zero commission fees, and foolproof duplicate protection.",
          headers: ${JSON.stringify(page.keyFacts.headers)},
          rows: ${JSON.stringify(page.keyFacts.rows)},
        },
        whoShouldUse: {
          title: "Built for High-Stakes Event Leaders",
          subtitle: "Tailored workflows for organizing committees, operations crew, and security staff.",
          personas: ${JSON.stringify(page.whoShouldUse)},
        },
        relatedLinks: ${JSON.stringify(relatedLinks, null, 8).replace(/^ {8}/gm, "        ")},
        faqs: ${JSON.stringify(page.faqs, null, 10).replace(/^ {10}/gm, "          ")},
        ctaTitle: ${JSON.stringify(page.h1)},
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
${isUk ? `        geo: {
          region: "United Kingdom",
          placename: "United Kingdom",
          position: "55.3781;-3.4360",
          latitude: 55.3781,
          longitude: -3.4360,
          country: "United Kingdom",
          countryCode: "GB"
        },\n` : ""}      }}
    />
  );
}
`;

  fs.writeFileSync(pagePath, pageCode, "utf-8");
}

console.log(`✓ Processed 25 pages (${createdCount} new directories created, ${updatedCount} existing updated)`);

// 3. Update sitemap.ts with all 25 slugs
const sitemapPath = path.join(appDir, "sitemap.ts");
let sitemapContent = fs.readFileSync(sitemapPath, "utf-8");

const all25Slugs = ALL_25_PAGES.map(p => `/${p.slug}`);
let addedToSitemap = 0;

all25Slugs.forEach(slug => {
  if (!sitemapContent.includes(`"${slug}"`)) {
    sitemapContent = sitemapContent.replace(
      'const seoPages = [',
      `const seoPages = [\n    "${slug}",`
    );
    addedToSitemap++;
  }
});

fs.writeFileSync(sitemapPath, sitemapContent, "utf-8");
console.log(`✓ Updated sitemap.ts (added ${addedToSitemap} new entries)`);

console.log("SEO Batch 25 build complete!");
