import { MarketingPageConfig, PageCluster } from "./types";
import { CLUSTER_A_PAGES } from "./registry/cluster-a";
import { CLUSTER_B_PAGES } from "./registry/cluster-b";
import { CLUSTER_C_PAGES } from "./registry/cluster-c";
import { CLUSTER_D_PAGES } from "./registry/cluster-d";

export const ALL_MARKETING_PAGES: MarketingPageConfig[] = [
  ...CLUSTER_A_PAGES,
  ...CLUSTER_B_PAGES,
  ...CLUSTER_C_PAGES,
  ...CLUSTER_D_PAGES,
];

export const MARKETING_PAGES_BY_SLUG: Record<string, MarketingPageConfig> =
  ALL_MARKETING_PAGES.reduce((acc, page) => {
    acc[page.slug] = page;
    return acc;
  }, {} as Record<string, MarketingPageConfig>);

export function getMarketingPage(slug: string): MarketingPageConfig | undefined {
  return MARKETING_PAGES_BY_SLUG[slug];
}

export function getAllPublishedSlugs(): string[] {
  return ALL_MARKETING_PAGES
    .filter((p) => p.status === "published")
    .map((p) => p.slug);
}

export function getAllPublishedPages(): MarketingPageConfig[] {
  return ALL_MARKETING_PAGES.filter((p) => p.status === "published");
}

export function getPagesByCluster(cluster: PageCluster): MarketingPageConfig[] {
  return ALL_MARKETING_PAGES.filter((p) => p.cluster === cluster && p.status === "published");
}
