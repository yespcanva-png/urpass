export type PageCluster = "festive" | "institutional" | "recurring" | "evergreen";

export type PageStatus = "published" | "draft" | "scheduled" | "retired" | "redirected";

export interface WorkflowStep {
  step: number;
  title: string;
  desc: string;
}

export interface FeatureItem {
  icon: string; // Icon identifier e.g. "qr", "shield", "ticket", "users", "zap", "check", "clock"
  title: string;
  desc: string;
  bullets?: string[];
}

export interface PracticalScenario {
  title: string;
  problem: string;
  solution: string;
  outcome: string;
}

export interface ServiceComparison {
  headline: string;
  selfServicePoints: string[];
  managedServicePoints: string[];
  recommendedFor: string;
}

export interface PageFaq {
  q: string;
  a: string;
}

export interface MarketingPageConfig {
  slug: string;
  canonicalUrl: string;
  title: string;
  description: string;
  h1: string;
  badge: string;
  cluster: PageCluster;
  audience: string;
  status: PageStatus;
  updatedAt: string;
  hero: {
    valueProposition: string;
    openingAnswer: string;
  };
  workflow: {
    title: string;
    steps: WorkflowStep[];
  };
  features: FeatureItem[];
  practicalScenario: PracticalScenario;
  serviceComparison: ServiceComparison;
  faqs: PageFaq[];
  relatedSlugs: string[];
}

export interface ManagedInquirySubmission {
  organizerName: string;
  businessEmail: string;
  phoneNumber: string;
  eventType: string;
  eventDate?: string;
  city?: string;
  expectedAttendees?: string;
  eventPricingType?: "free" | "paid" | "private";
  preferredPackage?: "essential" | "pro" | "premium" | "enterprise";
  supportRequirements?: string;
  comments?: string;
  pageSlug?: string;
  contentCluster?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  referrer?: string;
}
