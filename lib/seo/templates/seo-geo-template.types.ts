export interface SeoGeoFaq {
  q?: string;
  a?: string;
  question?: string;
  answer?: string;
}

export interface SeoGeoCapability {
  stepNumber: string;
  title: string;
  description: string;
  bestFor?: string;
  technicalProof?: string;
  icon?: "file-text" | "sliders" | "qr-code" | "scan-line" | "bar-chart-3" | "shield" | "users" | "zap";
}

export interface SeoGeoWorkflowStep {
  stepNumber: string;
  title: string;
  description: string;
}

export interface SeoGeoEventType {
  title: string;
  description: string;
  badge?: string;
  icon?: string;
}

export interface SeoGeoComparisonRow {
  manual: string;
  urpass: string;
}

export interface SeoGeoAnswerBlock {
  question: string;
  answer: string;
  highlights?: string[];
}

export interface SeoGeoSalesFormField {
  name: string;
  label: string;
  type: "text" | "email" | "select" | "date" | "number";
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface SeoGeoPageConfig {
  pageNumber?: string; // e.g. "Page 001"
  pageId: string; // e.g. "corporate-event-registration-software"
  slug: string; // e.g. "corporate-event-registration-software"
  canonicalUrl: string; // e.g. "https://urpass.space/solutions/corporate-event-registration-software"
  
  // Page Configuration / Taxonomy
  primaryKeyword: string;
  secondaryKeywords: string[];
  market: string;
  audience: string;
  searchIntent: "Commercial" | "Informational" | "Transactional" | "Navigational" | string;
  conversionGoal: string;
  
  // SEO Metadata
  seoTitle: string;
  metaDescription: string;
  badge: string;
  h1: string;

  // Hero Section
  heroSubtitle: string;
  heroDescription: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;

  // Problem Section
  problemSection: {
    badge?: string;
    title: string;
    paragraphs: string[];
  };

  // Capabilities / Features
  capabilitiesSection: {
    badge?: string;
    title: string;
    subtitle?: string;
    items: SeoGeoCapability[];
  };

  // Workflow / How It Works
  howItWorksSection: {
    badge?: string;
    title: string;
    subtitle?: string;
    steps?: SeoGeoWorkflowStep[];
    items?: SeoGeoWorkflowStep[];
    ctaLabel?: string;
  };

  // Event Types / Use Cases
  eventTypesSection?: {
    badge?: string;
    title: string;
    subtitle?: string;
    items: SeoGeoEventType[];
  };

  useCasesSection?: {
    badge?: string;
    title: string;
    subtitle?: string;
    items: SeoGeoEventType[];
  };

  // Pricing Section
  pricingSection?: {
    badge?: string;
    title: string;
    subtitle?: string;
    features: string[];
  };

  // Comparison Table
  comparisonSection?: {
    badge?: string;
    title: string;
    summaryText: string;
    headers: [string, string];
    rows: SeoGeoComparisonRow[];
  };

  // Audience / Personas
  audienceSection?: {
    badge?: string;
    title: string;
    leadText?: string;
    audiences: string[];
    summaryText: string;
  };

  // GEO-Ready Answer Block
  geoAnswerBlock?: SeoGeoAnswerBlock;

  // Real Product Proof Section (Google People-First Content Guidance)
  productProofSection?: {
    badge?: string;
    title: string;
    subtitle: string;
  };

  // FAQs
  faqSection: {
    badge?: string;
    title: string;
    faqs: SeoGeoFaq[];
  };

  // Closing Call to Action
  closingCtaSection?: {
    badge?: string;
    title: string;
    description: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
  };

  finalCta?: {
    badge?: string;
    title: string;
    description: string;
    primaryCtaLabel: string;
    primaryCtaUrl?: string;
    secondaryCtaLabel: string;
    secondaryCtaUrl?: string;
  };

  // Sales Lead Capture Form
  salesDemoSection?: {
    badge?: string;
    title: string;
    description: string;
    submitCtaLabel: string;
    disclaimer: string;
    tagline: string;
  };
}
