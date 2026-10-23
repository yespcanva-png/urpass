import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) — Event Registration & QR Check-In",
  description:
    "Comprehensive answers to all questions about URPASS: digital QR pass generation, sub-second entry scanning, attendee registration forms, and Razorpay ticketing for Indian events.",
  alternates: { canonical: "https://urpass.space/faq" },
  openGraph: {
    title: "Frequently Asked Questions (FAQ) | URPASS",
    description:
      "All your questions answered about digital event passes, gate check-in, capacity management, and event ticketing.",
    url: "https://urpass.space/faq",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "URPASS Platform FAQ",
    description: "Get answers to common questions about digital passes, QR check-in, and attendee management.",
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
  },
};

const faqJsonLd = {
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
          name: "Frequently Asked Questions",
          item: "https://urpass.space/faq",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do attendees register for an event on URPASS?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Attendees register through a single shareable link generated for your event. They complete your custom form in any browser without needing to download an app or create an account.",
          },
        },
        {
          "@type": "Question",
          name: "Can attendees use URPASS without downloading an app?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Attendees receive and use their digital QR pass without installing any mobile app. The pass opens directly in mobile Safari, Chrome, or any standard web browser.",
          },
        },
        {
          "@type": "Question",
          name: "How fast is the entry QR check-in scanner?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Passes scan in under 0.3 seconds directly inside any mobile browser. Any smartphone camera can be used as an entry gate scanner with zero app downloads.",
          },
        },
        {
          "@type": "Question",
          name: "What payment methods are supported for paid events in India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "URPASS integrates directly with Razorpay, supporting UPI (Google Pay, PhonePe, Paytm), debit/credit cards, net banking, and digital wallets with zero per-ticket platform commission.",
          },
        },
        {
          "@type": "Question",
          name: "How does URPASS pricing work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "URPASS offers transparent monthly plans starting at ₹499/month in India, and £15/month in the UK, with 0% platform ticket commissions and direct payment settlements.",
          },
        },
      ],
    },
  ],
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
