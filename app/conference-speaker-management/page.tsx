import type { Metadata } from "next";
import ConferenceClusterPage from "@/components/seo/ConferenceClusterPage";
import { CLUSTER_PAGES } from "@/lib/seo-cluster/data";

const slug = "conference-speaker-management";
const pageData = CLUSTER_PAGES[slug];

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.metaDescription,
  keywords: [pageData.primaryKeyword, "keynote speaker coordination", "conference speakers", "UrPass"],
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
