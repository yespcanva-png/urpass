import type { Metadata } from "next";
import ConferenceClusterPage from "@/components/seo/ConferenceClusterPage";
import { CLUSTER_PAGES } from "@/lib/seo-cluster/data";

const slug = "speaker-management-software";
const pageData = CLUSTER_PAGES[slug];

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.metaDescription,
  keywords: [
    pageData.primaryKeyword,
    "speaker management software",
    "conference speaker management",
    "event speaker directory",
    "speaker bios",
    "UrPass",
  ],
  alternates: { canonical: `https://urpass.space/${slug}` },
  openGraph: {
    title: pageData.title,
    description: pageData.metaDescription,
    url: `https://urpass.space/${slug}`,
    type: "website",
  },
};

export default function Page() {
  return <ConferenceClusterPage slug={slug} />;
}
