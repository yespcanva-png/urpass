import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import HeroPromotionalBanner from "@/components/explore/ads/HeroPromotionalBanner";
import TopSidebarBanner from "@/components/explore/ads/TopSidebarBanner";
import InContentPromotionalBanner from "@/components/explore/ads/InContentPromotionalBanner";
import BottomSidebarBanner from "@/components/explore/ads/BottomSidebarBanner";
import ExploreNewsletterCard from "@/components/explore/ads/ExploreNewsletterCard";
import type { AdCampaign, AdPlacement } from "@/lib/explore/ads-types";

const campaign = (placement: AdPlacement): AdCampaign => ({
  id: "11111111-1111-4111-8111-111111111111", title: "Sponsor headline", description: "Short message",
  placement, campaignType: "brand_sponsor", advertiserName: "Partner",
  desktopImageUrl: "/test-banner.jpg", mobileImageUrl: "/test-mobile.jpg",
  badgeLabel: "Featured", ctaText: "Learn More", destinationUrl: "/explore",
  cityTargeting: ["All Cities"], startsAt: "2026-10-01T00:00:00Z", endsAt: null,
  priority: 50, status: "active", impressionsCount: 0, clicksCount: 0,
  createdAt: "2026-10-01T00:00:00Z", updatedAt: "2026-10-01T00:00:00Z",
});

describe("Explore placement markup", () => {
  it("renders four clearly labeled campaign placements with responsive creatives", () => {
    const html = [
      renderToStaticMarkup(<HeroPromotionalBanner campaigns={[campaign("hero")]} />),
      renderToStaticMarkup(<TopSidebarBanner campaign={campaign("top_sidebar")} />),
      renderToStaticMarkup(<InContentPromotionalBanner campaign={campaign("in_content")} />),
      renderToStaticMarkup(<BottomSidebarBanner campaign={campaign("bottom_sidebar")} />),
    ];
    for (const markup of html) {
      expect(markup).toContain("Sponsored");
      expect(markup).toContain("Learn More");
      expect(markup).toContain("<source media=\"(max-width: 639px)\"");
    }
  });

  it("renders explicit newsletter consent unchecked", () => {
    const html = renderToStaticMarkup(<ExploreNewsletterCard currentCity="Mumbai" />);
    expect(html).toContain("type=\"checkbox\"");
    expect(html).not.toContain("checked=\"\"");
    expect(html).toContain("Mumbai");
  });

  it("renders optional campaign date on hero banner when provided", () => {
    const html = renderToStaticMarkup(<HeroPromotionalBanner campaigns={[campaign("hero")]} />);
    expect(html).toContain("Oct 1, 2026");
  });

  it("renders carousel slider track, arrows, slide counter, and pagination indicators for multiple campaigns", () => {
    const c1 = campaign("hero");
    const c2 = { ...campaign("hero"), id: "22222222-2222-4222-8222-222222222222", title: "Second slide headline" };
    const html = renderToStaticMarkup(<HeroPromotionalBanner campaigns={[c1, c2]} />);

    // Slider track with both slides
    expect(html).toContain("Sponsor headline");
    expect(html).toContain("Second slide headline");
    expect(html).toContain("transform:translateX(-0%)");

    // Accessible slider controls
    expect(html).toContain("aria-label=\"Previous promotional slide\"");
    expect(html).toContain("aria-label=\"Next promotional slide\"");
    expect(html).toContain("aria-label=\"Go to slide 1\"");
    expect(html).toContain("aria-label=\"Go to slide 2\"");
    expect(html).toContain("<span>1</span><span class=\"text-white/40\">/</span><span class=\"text-white/70\">2</span>");
  });
});
