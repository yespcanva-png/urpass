export type AdPlacement = "hero" | "top_sidebar" | "in_content" | "bottom_sidebar";

export type CampaignType = "event_promo" | "brand_sponsor" | "urpass_house" | "external";

export type CampaignStatus = "draft" | "active" | "paused" | "archived";

export interface AdCampaign {
  id: string;
  title: string;
  description: string | null;
  placement: AdPlacement;
  campaignType: CampaignType;
  advertiserName: string;
  eventId?: string | null;
  desktopImageUrl: string;
  mobileImageUrl?: string | null;
  badgeLabel: string;
  ctaText: string;
  destinationUrl: string;
  cityTargeting: string[];
  startsAt: string;
  endsAt?: string | null;
  priority: number;
  status: CampaignStatus;
  impressionsCount: number;
  clicksCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdEventPayload {
  campaignId: string;
  placement: AdPlacement;
  eventType: "impression" | "click";
  sessionId?: string;
  city?: string;
}

export interface NewsletterSubscriptionInput {
  email: string;
  city?: string;
  consentGiven: boolean;
}

export interface ExploreAdPlacementsBundle {
  hero: AdCampaign[];
  topSidebar: AdCampaign | null;
  inContent: AdCampaign | null;
  bottomSidebar: AdCampaign | null;
}

export interface AdPerformanceRow {
  placement: AdPlacement;
  city: string;
  impressions: number;
  clicks: number;
}
