import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist } from "next/font/google";
import "./globals.css";
import SupportWidget from "@/components/support/SupportWidget";
import VersionSkewHandler from "@/components/common/VersionSkewHandler";
import AuthRecoveryHandler from "@/components/common/AuthRecoveryHandler";
import { CookieConsentBanner } from "@/components/ui/CookieConsentBanner";
import PwaRuntime from "@/components/pwa/PwaRuntime";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const BASE_URL = "https://urpass.space";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "UrPass — Digital Event Passes & Lightning QR Check-In Platform",
    template: "%s | UrPass",
  },
  description:
    "UrPass (urpass.space) by Yesp Corporation is the all-in-one digital event pass and lightning QR check-in platform. Create custom passes, manage attendees, and scan entry QR codes in under 0.3s with 0% platform commission.",
  keywords: [
    "UrPass",
    "urpass",
    "urpass.space",
    "UrPass official site",
    "UrPass event passes",
    "UrPass QR check in",
    "UrPass ticketing",
    "UrPass login",
    "UrPass features",
    "digital event pass",
    "QR check-in",
    "event pass generator",
    "event management India",
    "college event management",
    "digital ticket India",
    "attendee management",
    "QR code event entry",
    "event ticketing platform",
    "zero commission event ticketing",
    "Razorpay event ticketing",
    "event feedback form",
    "post event survey",
    "digital event pass generator",
    "sub-second QR check-in",
    "UPI event ticketing India",
    "college fest ticketing",
    "hackathon registration platform",
    "event check-in app India",
  ],
  authors: [{ name: "UrPass", url: BASE_URL }],
  creator: "UrPass",
  publisher: "UrPass",
  applicationName: "UrPass",
  manifest: "/manifest.webmanifest",
  category: "Event Management Software",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION &&
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION !== "google-site-verification-id"
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
      : {}),
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-IN": `${BASE_URL}/in`,
      "en-GB": `${BASE_URL}/uk`,
      "en-US": BASE_URL,
      "x-default": BASE_URL,
    },
  },
  openGraph: {
    type: "website",
    siteName: "UrPass",
    title: "UrPass — Digital Event Passes & Lightning QR Check-In Platform",
    description:
      "UrPass (urpass.space) by Yesp Corporation is the all-in-one digital event pass and lightning QR check-in platform. Create custom passes, manage attendees, and scan entry QR codes in under 0.3s with 0% platform commission.",
    url: BASE_URL,
    locale: "en_IN",
    alternateLocale: ["en_GB", "en_US"],
    images: [
      {
        url: `${BASE_URL}/og-events-your-way.png`,
        secureUrl: `${BASE_URL}/og-events-your-way.png`,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "UrPass: Your Events, Your Way — Digital Event Passes & Lightning QR Check-In",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@urpass",
    creator: "@urpass",
    title: "UrPass — Digital Event Passes & Lightning QR Check-In Platform",
    description:
      "UrPass (urpass.space) by Yesp Corporation is the all-in-one digital event pass and lightning QR check-in platform. Create custom passes, manage attendees, and scan entry QR codes in under 0.3s with 0% platform commission.",
    images: [`${BASE_URL}/og-events-your-way.png`],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "UrPass",
    statusBarStyle: "black-translucent",
  },
  other: {
    "format-detection": "telephone=no",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: "UrPass",
  alternateName: ["urpass", "urpass.space", "UrPass Space", "UrPass Event Passes", "UrPass by Yesp"],
  url: BASE_URL,
  description: "Official website for UrPass (pronounced 'Your Pass') — digital event passes, lightning QR check-in, and zero-commission ticketing.",
  inLanguage: "en-IN",
  publisher: {
    "@id": `${BASE_URL}/#organization`,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/apply/{search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "UrPass",
  alternateName: ["urpass", "urpass.space", "UrPass Space"],
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/icon.png`,
    caption: "UrPass Logo",
  },
  brand: {
    "@type": "Brand",
    name: "UrPass",
    alternateName: ["urpass", "urpass.space"],
    url: BASE_URL,
    logo: `${BASE_URL}/icon.png`,
    slogan: "Create. Share. Scan. Instant digital event passes and sub-second QR check-in.",
  },
  image: {
    "@type": "ImageObject",
    url: `${BASE_URL}/og-image.png`,
    width: "1200",
    height: "630",
    caption: "UrPass — Digital Event Passes & Lightning QR Check-In Platform",
  },
  sameAs: [
    "https://www.instagram.com/urpass.space",
    "https://www.youtube.com/channel/UCzUliQs5vwGlLAM7X6aB9zg/",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "urpass.space@yespstudio.com",
      areaServed: ["IN", "Worldwide"],
      availableLanguage: ["English", "Hindi", "Tamil"],
    },
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
    addressRegion: "Tamil Nadu",
    addressLocality: "Chennai",
  },
  areaServed: [
    {
      "@type": "Country",
      name: "India",
    },
    {
      "@type": "Country",
      name: "United Kingdom",
    },
    {
      "@type": "AdministrativeArea",
      name: "Worldwide",
    },
  ],
  slogan: "Create. Share. Scan. Instant digital event passes and sub-second QR check-in.",
  knowsAbout: [
    "Digital Event Passes",
    "QR Event Check-in",
    "Event Ticketing Software",
    "Zero Commission Event Ticketing",
    "College Fest Management",
    "Hackathon Pass Generator",
    "Razorpay Event Ticketing",
    "Model Context Protocol",
    "Multi-Tenant Event Organizations",
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "UrPass",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Event Ticketing & Check-In Platform",
  operatingSystem: "All, Web, iOS, Android",
  browserRequirements: "Requires HTML5, JavaScript, modern browser",
  url: BASE_URL,
  description:
    "Fast digital event pass generator with sub-second QR check-in, real-time attendance analytics, offline gate scanning sync, Model Context Protocol (MCP) server, and zero-commission ticketing. Free forever plan available, with paid plans starting at ₹499/month (or £15/month in UK).",
  offers: [
    { "@type": "Offer", name: "Starter Tier", price: "499", priceCurrency: "INR", billingIncrement: "P1M", priceValidUntil: "2027-12-31", description: "Starter Plan at ₹499/mo +GST. 10 events/month, 500 registrations/month, CSV import & export." },
    { "@type": "Offer", name: "Pro Tier", price: "999", priceCurrency: "INR", billingIncrement: "P1M", priceValidUntil: "2027-12-31", description: "Pro Plan at ₹999/mo +GST. Unlimited events, 2,500 registrations/month, Ticket Studio custom pass branding." },
    { "@type": "Offer", name: "Business Tier", price: "2499", priceCurrency: "INR", billingIncrement: "P1M", priceValidUntil: "2027-12-31", description: "Business Plan at ₹2,499/mo +GST. Unlimited events, 10,000 registrations/month, corporate workspaces, API & MCP server." },
    { "@type": "Offer", name: "UK Starter Tier", price: "15", priceCurrency: "GBP", billingIncrement: "P1M", priceValidUntil: "2027-12-31", description: "UK Starter Plan at £15/month." },
    { "@type": "Offer", name: "UK Pro Tier", price: "35", priceCurrency: "GBP", billingIncrement: "P1M", priceValidUntil: "2027-12-31", description: "UK Pro Plan at £35/month." },
    { "@type": "Offer", name: "UK Business Tier", price: "79", priceCurrency: "GBP", billingIncrement: "P1M", priceValidUntil: "2027-12-31", description: "UK Business Plan at £79/month." },
  ],
  knowsAbout: [
    "Digital Event Passes",
    "QR Check-in System",
    "Event Ticketing Software",
    "Zero Commission Ticketing",
    "College Fest Entry Management",
    "Hackathon Check-in",
    "Razorpay Payment Gateway",
    "Model Context Protocol (MCP)",
    "Generative Engine Optimization",
  ],
  featureList: [
    "0% Per-Ticket Platform Commission",
    "Sub-second Mobile QR Entry Scanner (<0.3s)",
    "Bespoke Ticket Studio & Lanyard Badge Designer",
    "Atomic Anti-Duplicate Entry Protection",
    "Offline Gate Scanning & Local Manifest Sync",
    "Native Model Context Protocol (MCP) AI Server",
    "Multi-Tenant Corporate Workspaces & RBAC",
    "Razorpay INR Payment Gateway & UPI Checkout",
    "Exportable CSV Attendee Reports & Audit Logs",
  ],
};

const siteNavSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Site Navigation",
  itemListElement: [
    { "@type": "SiteNavigationElement", position: 1, name: "Features", url: `${BASE_URL}/features` },
    { "@type": "SiteNavigationElement", position: 2, name: "Pricing", url: `${BASE_URL}/pricing` },
    { "@type": "SiteNavigationElement", position: 3, name: "Brand & Media Kit", url: `${BASE_URL}/brand` },
    { "@type": "SiteNavigationElement", position: 4, name: "Product Suite", url: `${BASE_URL}/product` },
    { "@type": "SiteNavigationElement", position: 5, name: "Security & Trust", url: `${BASE_URL}/security` },
    { "@type": "SiteNavigationElement", position: 6, name: "QR Event Check-in", url: `${BASE_URL}/qr-event-check-in` },
    { "@type": "SiteNavigationElement", position: 7, name: "Support Center", url: `${BASE_URL}/support` },
    { "@type": "SiteNavigationElement", position: 8, name: "Events in India", url: `${BASE_URL}/in` },
    { "@type": "SiteNavigationElement", position: 9, name: "College Events", url: `${BASE_URL}/college-events` },
  ],
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-E5RNX1BZ0Z";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <head>
        <link rel="help" type="text/plain" href="/llms.txt" title="LLM Documentation" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="Full Product Context for Generative Engines" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavSchema) }}
        />
        {GA_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('consent', 'default', {
                    'analytics_storage': 'denied',
                    'ad_storage': 'denied'
                  });
                  try {
                    if (typeof localStorage !== 'undefined' && localStorage.getItem('urpass_cookie_consent') === 'all') {
                      gtag('consent', 'update', {
                        'analytics_storage': 'granted'
                      });
                    }
                  } catch (e) {}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}', {
                    page_path: window.location.pathname,
                  });
                  window.addEventListener('urpass:cookie-consent', function(e) {
                    if (e.detail && e.detail.analytics) {
                      gtag('consent', 'update', {
                        'analytics_storage': 'granted'
                      });
                    }
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="h-full font-[family-name:var(--font-geist)] antialiased bg-white text-neutral-900">
        <VersionSkewHandler />
        <AuthRecoveryHandler />
        <PwaRuntime />
        {children}
        <SupportWidget />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
