import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback & Feature Requests — URPASS",
  description:
    "Share product feedback, report issues, or request new features for URPASS event management software.",
  alternates: { canonical: "https://urpass.space/feedback" },
  openGraph: {
    title: "Feedback & Feature Requests | URPASS",
    description: "Help us make URPASS better. Share your experience and feature requests.",
    url: "https://urpass.space/feedback",
    locale: "en_IN",
    type: "website",
  },
};

const feedbackJsonLd = {
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
          name: "Feedback",
          item: "https://urpass.space/feedback",
        },
      ],
    },
  ],
};

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(feedbackJsonLd) }}
      />
      {children}
    </>
  );
}
