import type { Metadata } from "next";
import DevelopersContent from "@/components/developers/DevelopersContent";
import { TICKET_OG_IMAGE, TICKET_OG_IMAGE_META } from "@/lib/seo/og-images";

export const metadata: Metadata = {
  title: "Event Infrastructure as a Service (EIaaS) & APIs | UrPass Developers",
  description:
    "The API-first event infrastructure platform. Issue cryptographic QR passes, verify gate turnstiles in sub-300ms, prevent duplicate scans, and stream real-time event webhooks.",
  keywords: [
    "Event Infrastructure as a Service",
    "EIaaS",
    "event ticketing API",
    "QR code check-in API",
    "turnstile access API",
    "event webhooks",
    "event developer SDK",
    "cryptographic QR pass",
    "Model Context Protocol event API",
    "UrPass developers",
  ],
  alternates: { canonical: "https://urpass.space/developers" },
  openGraph: {
    title: "Event Infrastructure as a Service (EIaaS) & APIs | UrPass Developers",
    description:
      "The API-first event infrastructure platform. Issue cryptographic QR passes, verify gate turnstiles in sub-300ms, and stream real-time event webhooks.",
    url: "https://urpass.space/developers",
    type: "website",
    images: [TICKET_OG_IMAGE_META],
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Infrastructure as a Service (EIaaS) & APIs | UrPass Developers",
    description:
      "The API-first event infrastructure platform. Issue cryptographic QR passes, verify gate turnstiles in sub-300ms, and stream real-time event webhooks.",
    images: [TICKET_OG_IMAGE],
  },
};

export default function DevelopersPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": "https://urpass.space/developers#api",
        name: "UrPass Event Infrastructure API",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Cloud / REST",
        provider: {
          "@type": "Organization",
          name: "UrPass by Yesp Corporation",
          url: "https://urpass.space",
        },
        description:
          "Event Infrastructure as a Service (EIaaS) providing cryptographic pass issuance, sub-300ms gate scanning, real-time webhooks, and Model Context Protocol (MCP) integrations.",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://urpass.space",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Developers",
            item: "https://urpass.space/developers",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DevelopersContent />
    </>
  );
}
