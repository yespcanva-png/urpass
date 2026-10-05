const fs = require("fs");
const path = require("path");

// Load the 50 definitions
const { ALL_50_PAGES } = require("./commercial-50-definitions");

console.log(`Loaded ${ALL_50_PAGES.length} commercial SEO page definitions.`);

const rootDir = path.resolve(__dirname, "..");
const appDir = path.join(rootDir, "app");

// 1. Generate lib/commercial-seo/commercial-50-data.ts
const dataFilePath = path.join(rootDir, "lib", "commercial-seo", "commercial-50-data.ts");
const tsContent = `// Auto-generated Commercial 50 SEO & GEO Data definitions (5 October 2026)
export interface CommercialPageData {
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

export const COMMERCIAL_50_PAGES: Record<string, CommercialPageData> = ${JSON.stringify(
  ALL_50_PAGES.reduce((acc, p) => {
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
  const iconSet = new Set(["ShieldCheck", "ScanLine", "Users", "Zap", "BarChart3", "Lock", "CheckCircle2"]);
  features.forEach(f => {
    if (f.iconName) iconSet.add(f.iconName);
  });
  return Array.from(iconSet).sort().join(", ");
}

// 2. Generate/Update all 50 app/[slug]/page.tsx files
let createdCount = 0;
let updatedCount = 0;

for (const page of ALL_50_PAGES) {
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

  const otherMeta = page.geoMeta
    ? `
  other: {
    "geo.region": "${page.geoMeta.region}",
    "geo.placename": "${page.geoMeta.placename}",
    "geo.position": "${page.geoMeta.position}",
    "ICBM": "${page.geoMeta.latitude}, ${page.geoMeta.longitude}",
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
        featuresTitle: "Enterprise Capabilities Engineered for Scale",
        featuresSubtitle: "Everything you need to register attendees, issue QR passes, and verify door check-ins.",
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
          title: "Platform Comparison & Operational Metrics",
          subtitle: "How UrPass delivers faster processing and lower costs than legacy tools.",
          headers: ${JSON.stringify(page.keyFacts.headers)},
          rows: ${JSON.stringify(page.keyFacts.rows)},
        },
        whoShouldUse: {
          title: "Built for Professional Event Leaders",
          subtitle: "Tailored workflows for every member of your organizing team.",
          personas: ${JSON.stringify(page.whoShouldUse)},
        },
        faqs: ${JSON.stringify(page.faqs, null, 10).replace(/^ {10}/gm, "          ")},
        ctaTitle: ${JSON.stringify(page.h1)},
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
${page.geoMeta ? `        geo: ${JSON.stringify(page.geoMeta)},\n` : ""}      }}
    />
  );
}
`;

  fs.writeFileSync(pagePath, pageCode, "utf-8");
}

console.log(`✓ Processed 50 pages (${createdCount} new directories created, ${updatedCount} existing updated)`);

// 3. Update sitemap.ts with all 50 slugs
const sitemapPath = path.join(appDir, "sitemap.ts");
let sitemapContent = fs.readFileSync(sitemapPath, "utf-8");

const all50Slugs = ALL_50_PAGES.map(p => `/${p.slug}`);
let addedToSitemap = 0;

all50Slugs.forEach(slug => {
  if (!sitemapContent.includes(`"${slug}"`)) {
    // Insert into seoPages array
    sitemapContent = sitemapContent.replace(
      'const seoPages = [',
      `const seoPages = [\n    "${slug}",`
    );
    addedToSitemap++;
  }
});

fs.writeFileSync(sitemapPath, sitemapContent, "utf-8");
console.log(`✓ Updated sitemap.ts (added ${addedToSitemap} new entries)`);
console.log("Commercial 50 batch generation complete!");
