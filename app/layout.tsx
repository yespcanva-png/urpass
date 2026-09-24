import type { Metadata } from "next";
import Script from "next/script";
import { Geist } from "next/font/google";
import "./globals.css";
import SupportWidget from "@/components/support/SupportWidget";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const BASE_URL = "https://urpass.space";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "URPASS — Free Digital Event Passes & QR Check-in | Try 30-Day Free Trial",
    template: "%s | URPASS",
  },
  description:
    "Create digital event passes in minutes, manage attendees, and scan QR codes at entry in under 0.3s. Start free forever or try any paid plan with a 30-day free trial. Built for colleges, hackathons, conferences, and event organizers across India and worldwide.",
  keywords: [
    "digital event pass",
    "QR check-in",
    "event pass generator",
    "event management India",
    "college event management",
    "digital ticket India",
    "attendee management",
    "QR code event entry",
    "event ticketing platform",
    "Razorpay event ticketing",
    "event feedback form",
    "post event survey",
    "URPASS",
    "free digital event passes",
    "try 30 day free trial",
    "free QR check-in",
    "free event ticketing platform",
    "30 day free trial event software",
    "free event registration India",
    "digital pass generator free",
    "free QR ticket scanner",
    "try pro free 30 days",
    "free attendee management software",
    "college fest ticketing free",
    "hackathon registration platform",
    "event check-in app India",
  ],
  authors: [{ name: "URPASS", url: BASE_URL }],
  creator: "URPASS",
  publisher: "URPASS",
  applicationName: "URPASS",
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
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "google-site-verification-id",
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
    },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-IN": `${BASE_URL}/in`,
      "en-US": BASE_URL,
      "x-default": BASE_URL,
    },
  },
  openGraph: {
    type: "website",
    siteName: "URPASS",
    title: "URPASS — Digital Event Passes & Lightning QR Check-in",
    description:
      "Create custom digital event passes, approve attendees, accept Razorpay payments, scan entry QR codes, and collect post-event feedback.",
    url: BASE_URL,
    locale: "en_IN",
    alternateLocale: ["en_US"],
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        secureUrl: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "URPASS — Digital Event Passes & Lightning QR Check-In Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@urpass",
    creator: "@urpass",
    title: "URPASS — Digital Event Passes & Lightning QR Check-in",
    description:
      "Create custom digital event passes, scan entry QR codes, and manage attendees all in one place.",
    images: [`${BASE_URL}/og-image.png`],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "geo.position": "20.5937;78.9629",
    "ICBM": "20.5937, 78.9629",
    "distribution": "Global",
    "rating": "General",
    "revisit-after": "3 days",
    "format-detection": "telephone=no",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: "URPASS",
  alternateName: ["URPASS Space", "URPASS Event Passes"],
  url: BASE_URL,
  description: "Digital event passes, lightning QR check-in, and attendee management platform.",
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
  name: "URPASS",
  alternateName: "URPASS Space",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/icon.png`,
    caption: "URPASS Logo",
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
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  slogan: "Create. Share. Scan. Instant digital event passes and sub-second QR check-in.",
  knowsAbout: [
    "Digital Event Passes",
    "QR Event Check-in",
    "Event Ticketing Software",
    "College Fest Management",
    "Hackathon Pass Generator",
    "Razorpay Event Ticketing",
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "URPASS",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Event Ticketing & Check-In Platform",
  operatingSystem: "All, Web, iOS, Android",
  browserRequirements: "Requires HTML5, JavaScript, modern browser",
  url: BASE_URL,
  description:
    "Fast digital event pass generator with QR code check-in, real-time attendance analytics, customizable attendee feedback surveys, and Razorpay ticket payment integration. Start free forever or try Starter, Pro, or Business with a 30-day free trial.",
  offers: [
    { "@type": "Offer", name: "Free Tier", price: "0", priceCurrency: "INR", priceValidUntil: "2027-12-31", description: "Free forever. 2 events/month, 100 registrations/month, QR passes & check-in." },
    { "@type": "Offer", name: "Starter Tier (30-Day Free Trial)", price: "499", priceCurrency: "INR", billingIncrement: "P1M", priceValidUntil: "2027-12-31", description: "Try free for 30 days. 10 events/month, 500 registrations/month, CSV import & export." },
    { "@type": "Offer", name: "Pro Tier (30-Day Free Trial)", price: "999", priceCurrency: "INR", billingIncrement: "P1M", priceValidUntil: "2027-12-31", description: "Try free for 30 days. Unlimited events, 2,500 registrations/month, custom pass design & branding." },
    { "@type": "Offer", name: "Business Tier (30-Day Free Trial)", price: "2499", priceCurrency: "INR", billingIncrement: "P1M", priceValidUntil: "2027-12-31", description: "Try free for 30 days. Unlimited events, 10,000 registrations/month, 15 organizers, custom domain & API." },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "168",
    bestRating: "5",
    worstRating: "1",
  },
  knowsAbout: [
    "Digital Event Passes",
    "QR Check-in System",
    "Event Ticketing Software",
    "Free Event Registration",
    "30-Day Free Trial",
    "College Fest Entry Management",
    "Hackathon Check-in",
    "Razorpay Payment Gateway",
    "Generative Engine Optimization",
  ],
  featureList: [
    "30-Day Free Trial on paid plans",
    "Instant QR Code Ticket Generation",
    "Sub-second Mobile QR Entry Scanner",
    "Customizable Post-Event Feedback Survey Builder",
    "Real-time Attendance & Check-in Analytics",
    "Custom Pass Designer with Live Preview",
    "Razorpay INR Payment Gateway Integration",
    "Exportable CSV Attendee Reports",
  ],
};

const siteNavSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Site Navigation",
  itemListElement: [
    { "@type": "SiteNavigationElement", position: 1, name: "Pricing", url: `${BASE_URL}/pricing` },
    { "@type": "SiteNavigationElement", position: 2, name: "QR Event Check-in", url: `${BASE_URL}/qr-event-check-in` },
    { "@type": "SiteNavigationElement", position: 3, name: "Events in India", url: `${BASE_URL}/in` },
    { "@type": "SiteNavigationElement", position: 4, name: "College Events", url: `${BASE_URL}/college-events` },
    { "@type": "SiteNavigationElement", position: 5, name: "Guides & Tutorials", url: `${BASE_URL}/guides/what-is-qr-event-check-in` },
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
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="h-full font-[family-name:var(--font-geist)] antialiased bg-white text-neutral-900">
        {children}
        <SupportWidget />
      </body>
    </html>
  );
}
