import { MarketingPageConfig, PageCluster } from "./types";
import { MARKETING_PAGES_BY_SLUG } from "./pages";

export interface ResolvedLink {
  slug: string;
  href: string;
  title: string;
  h1: string;
  badge: string;
  cluster: PageCluster;
}

/**
 * Returns 3 to 5 highly relevant related pages for any given page.
 * Follows the cluster linking strategy while ensuring published evergreen anchors.
 */
export function getRelatedPages(
  currentPage: MarketingPageConfig,
  allPages: Record<string, MarketingPageConfig> = MARKETING_PAGES_BY_SLUG
): ResolvedLink[] {
  const result: ResolvedLink[] = [];

  // 1. First priority: explicitly defined relatedSlugs
  if (currentPage.relatedSlugs && currentPage.relatedSlugs.length > 0) {
    for (const slug of currentPage.relatedSlugs) {
      const target = allPages[slug];
      if (target && target.status === "published" && target.slug !== currentPage.slug) {
        result.push({
          slug: target.slug,
          href: `/${target.slug}`,
          title: target.title.split("|")[0].trim(),
          h1: target.h1,
          badge: target.badge,
          cluster: target.cluster,
        });
      }
      if (result.length >= 4) break;
    }
  }

  // 2. Second priority: cluster peers
  if (result.length < 3) {
    const peers = Object.values(allPages).filter(
      (p) =>
        p.cluster === currentPage.cluster &&
        p.slug !== currentPage.slug &&
        p.status === "published" &&
        !result.some((r) => r.slug === p.slug)
    );

    for (const peer of peers) {
      result.push({
        slug: peer.slug,
        href: `/${peer.slug}`,
        title: peer.title.split("|")[0].trim(),
        h1: peer.h1,
        badge: peer.badge,
        cluster: peer.cluster,
      });
      if (result.length >= 4) break;
    }
  }

  // 3. Fallback priority: Evergreen product pillar pages
  if (result.length < 3) {
    const evergreenPillars = [
      "event-registration-software-india",
      "event-ticketing-software-india",
      "qr-event-check-in-software",
      "remote-managed-event-services",
      "self-service-vs-managed-events",
    ];

    for (const slug of evergreenPillars) {
      if (slug !== currentPage.slug && !result.some((r) => r.slug === slug)) {
        const target = allPages[slug];
        if (target && target.status === "published") {
          result.push({
            slug: target.slug,
            href: `/${target.slug}`,
            title: target.title.split("|")[0].trim(),
            h1: target.h1,
            badge: target.badge,
            cluster: target.cluster,
          });
        }
      }
      if (result.length >= 4) break;
    }
  }

  return result.slice(0, 4);
}
