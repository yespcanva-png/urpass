import type { Metadata } from "next";
import { getPublishedJobs } from "@/lib/careers/service";
import CareersPageClient from "@/components/careers/CareersPageClient";

export const metadata: Metadata = {
  title: "Careers at UrPass | Jobs, Internships & Opportunities",
  description:
    "Explore careers at UrPass. Discover opportunities in software engineering, product, design, marketing and internships. Build the future of event technology.",
  alternates: {
    canonical: "https://urpass.space/careers",
  },
  openGraph: {
    title: "Careers at UrPass | Jobs, Internships & Opportunities",
    description:
      "Explore careers at UrPass. Discover opportunities in software engineering, product, design, marketing and internships. Build the future of event technology.",
    url: "https://urpass.space/careers",
    siteName: "UrPass",
    locale: "en_IE",
    type: "website",
    images: [
      {
        url: "https://urpass.space/og-image.png",
        width: 1200,
        height: 630,
        alt: "Build with UrPass - Careers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers at UrPass | Jobs, Internships & Opportunities",
    description:
      "Explore careers at UrPass. Discover opportunities in software engineering, product, design, marketing and internships. Build the future of event technology.",
    images: ["https://urpass.space/og-image.png"],
  },
};

export const dynamic = "force-dynamic";

export default async function CareersPage() {
  const jobs = await getPublishedJobs();

  // Organization & Breadcrumbs Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://urpass.space/#organization",
        name: "UrPass",
        url: "https://urpass.space",
        logo: "https://urpass.space/logo.png",
        description:
          "UrPass by Yesp Corporation is the all-in-one event registration, digital ticketing, and sub-second QR check-in platform.",
        sameAs: [
          "https://instagram.com/urpass.space",
          "https://youtube.com/@urpass",
        ],
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
            name: "Careers",
            item: "https://urpass.space/careers",
          },
        ],
      },
      // Include JobPosting schema only for published genuine vacancies
      ...jobs.map((job) => ({
        "@type": "JobPosting",
        title: job.title,
        description: job.description,
        datePosted: job.published_at || job.created_at,
        validThrough: "2027-12-31T23:59:59Z",
        employmentType:
          job.employment_type === "full-time"
            ? "FULL_TIME"
            : job.employment_type === "internship"
            ? "INTERN"
            : job.employment_type === "part-time"
            ? "PART_TIME"
            : "CONTRACTOR",
        hiringOrganization: {
          "@type": "Organization",
          name: "UrPass",
          sameAs: "https://urpass.space",
          logo: "https://urpass.space/logo.png",
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Bengaluru",
            addressRegion: "Karnataka",
            addressCountry: "IN",
          },
        },
        jobLocationType: job.workplace_type === "remote" ? "TELECOMMUTE" : undefined,
        applicantLocationRequirements: {
          "@type": "Country",
          name: "India",
        },
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CareersPageClient initialJobs={jobs} />
    </>
  );
}
