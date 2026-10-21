import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJobBySlug, getPublishedJobs } from "@/lib/careers/service";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import JobDetailView from "@/components/careers/JobDetailView";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return {
      title: "Job Opening | UrPass Careers",
      description: "Explore open career opportunities at UrPass.",
    };
  }

  const title = `${job.title} — ${job.department} | Careers at UrPass`;
  const description = `Join UrPass as a ${job.title} in ${job.location} (${job.workplace_type}). ${job.summary}`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://urpass.space/careers/${job.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://urpass.space/careers/${job.slug}`,
      siteName: "UrPass",
      type: "website",
      images: [
        {
          url: "https://urpass.space/og-image.png",
          width: 1200,
          height: 630,
          alt: `${job.title} at UrPass`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://urpass.space/og-image.png"],
    },
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  // Schema: JobPosting & Breadcrumbs
  const jsonLd = {
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
            name: "Careers",
            item: "https://urpass.space/careers",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: job.title,
            item: `https://urpass.space/careers/${job.slug}`,
          },
        ],
      },
      {
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
        experienceRequirements: job.experience_level,
        responsibilities: job.responsibilities.join("; "),
        qualifications: job.requirements.join("; "),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#0a0910] text-neutral-100 flex flex-col selection:bg-purple-500/30 selection:text-white">
        <Navbar />
        <main className="flex-1">
          <JobDetailView job={job} />
        </main>
        <Footer />
      </div>
    </>
  );
}
