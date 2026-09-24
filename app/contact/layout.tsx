import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Support & Inquiries — URPASS",
  description:
    "Get in touch with the URPASS team for support, event queries, custom volume plans, or partnership inquiries.",
  alternates: { canonical: "https://urpass.space/contact" },
  openGraph: {
    title: "Contact URPASS Support",
    description: "Reach our customer support team for help with your events, digital passes, and QR check-in.",
    url: "https://urpass.space/contact",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact URPASS Support",
    description: "Get in touch with the URPASS team for support and assistance.",
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
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
          name: "Contact Support",
          item: "https://urpass.space/contact",
        },
      ],
    },
    {
      "@type": "ContactPage",
      name: "URPASS Support",
      url: "https://urpass.space/contact",
      description: "Customer support and inquiries page for URPASS event management software.",
    },
  ],
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      {children}
    </>
  );
}
