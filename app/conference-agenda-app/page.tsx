import type { Metadata } from "next";
import ConferenceClusterPage from "@/components/seo/ConferenceClusterPage";
import { CLUSTER_PAGES } from "@/lib/seo-cluster/data";

const slug = "conference-agenda-app";
const pageData = CLUSTER_PAGES[slug];

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.metaDescription,
  keywords: [pageData.primaryKeyword, "mobile conference agenda", "event schedule app", "UrPass"],
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
