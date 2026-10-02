import { renderCorporateEmailHtml, CorporateEmailOptions } from "./corporate-layout";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://urpass.space";

export type EmailTemplateSlug =
  | "welcome"
  | "activation"
  | "incomplete_event"
  | "subscription"
  | "payment_failed"
  | "whats_new"
  | "offer";

export interface WelcomeEmailData {
  name?: string | null;
}

export interface ActivationEmailData {
  name?: string | null;
}

export interface IncompleteEventEmailData {
  name?: string | null;
  eventId: string;
  eventName: string;
  venue?: string | null;
  eventDate?: string | null;
}

export interface SubscriptionEmailData {
  name?: string | null;
  planName: string;
  amountFormatted: string;
  billingCycle: "monthly" | "annual";
  renewalDate: string;
}

export interface PaymentFailedEmailData {
  name?: string | null;
  planName: string;
  amountDueFormatted: string;
  attemptDate: string;
  gracePeriodDays?: number;
}

export interface WhatsNewEmailData {
  name?: string | null;
  featureTitle: string;
  featureSummary: string;
  featureDescription: string;
  featureUrl: string;
  highlights?: string[];
}

export interface OfferEmailData {
  name?: string | null;
  targetPlan: string;
  offerHeadline: string;
  discountSummary: string;
  promoCode?: string;
  expiryDate?: string;
  benefits?: string[];
}

/**
 * 1. Welcome Email (Lifecycle: Sign Up)
 * Goal: Welcome the user, orient them, invite them to create their first event.
 */
export function buildWelcomeEmail(data: WelcomeEmailData): { subject: string; html: string } {
  const greeting = data.name ? `Hi ${data.name},` : "Hello,";

  const contextContentHtml = `
    <p style="margin: 0 0 12px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #0f172a;">
      Getting Started in 3 Steps
    </p>
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="font-size: 13px; line-height: 20px; color: #334155;">
      <tr>
        <td style="padding: 6px 0; vertical-align: top; width: 22px; font-weight: 700; color: #0f172a;">1.</td>
        <td style="padding: 6px 0;"><strong>Create your event</strong> &mdash; Specify your date, venue, attendee limits, and ticketing tiers.</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; vertical-align: top; width: 22px; font-weight: 700; color: #0f172a;">2.</td>
        <td style="padding: 6px 0;"><strong>Share registration link</strong> &mdash; Attendees register and receive instant cryptographically signed QR passes.</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; vertical-align: top; width: 22px; font-weight: 700; color: #0f172a;">3.</td>
        <td style="padding: 6px 0;"><strong>Scan at the entrance</strong> &mdash; Open the scanner on any smartphone or tablet to verify passes in under 1 second.</td>
      </tr>
    </table>
  `;

  const html = renderCorporateEmailHtml({
    preheader: "Welcome to UrPass. Your event operations workspace is ready.",
    heading: "Welcome to UrPass",
    message: `<p style="margin: 0 0 12px 0;">${greeting}</p><p style="margin: 0;">Your UrPass workspace is ready. From college fests and developer hackathons to corporate summits, UrPass gives you instant pass generation, payment handling, and real-time gate validation without specialized hardware.</p>`,
    cta: {
      label: "Create Your First Event",
      url: `${APP_URL}/create-event`,
    },
    contextContentHtml,
    secondaryInfo: "Need assistance or a personalized walkthrough? Reply directly to this email to reach our engineering and operations team.",
  });

  return {
    subject: "Welcome to URPASS",
    html,
  };
}

/**
 * 2. Activation Email (Lifecycle: Signed up, no event after 24h-48h)
 * Goal: Prompt organizer to create their first event.
 */
export function buildActivationEmail(data: ActivationEmailData): { subject: string; html: string } {
  const greeting = data.name ? `Hi ${data.name},` : "Hello,";

  const contextContentHtml = `
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="font-size: 13px; line-height: 20px; color: #334155;">
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7;">
          <strong style="color: #0f172a;">Instant QR Pass Issuance</strong><br>
          Deliver verified digital passes with unique barcodes directly via email and SMS.
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7;">
          <strong style="color: #0f172a;">Zero-Hardware Check-in</strong><br>
          Any phone camera becomes a high-speed ticket scanner with offline caching.
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0;">
          <strong style="color: #0f172a;">Automatic Financial Invoicing</strong><br>
          Accept UPI, cards, and corporate bank transfers with GST-compliant invoicing.
        </td>
      </tr>
    </table>
  `;

  const html = renderCorporateEmailHtml({
    preheader: "Publish your ticketing landing page in less than 2 minutes.",
    heading: "Launch your first event on UrPass",
    message: `<p style="margin: 0 0 12px 0;">${greeting}</p><p style="margin: 0;">We noticed you haven't published an event yet. Publishing takes just a couple of minutes, after which your attendees can immediately apply, purchase passes, and receive verified entry badges.</p>`,
    cta: {
      label: "Launch Event Now",
      url: `${APP_URL}/create-event`,
    },
    contextContentHtml,
    secondaryInfo: "If you're planning an event with custom ticket requirements or multi-gate checkpoints, we're here to help set it up.",
  });

  return {
    subject: "Ready to launch your first event on UrPass?",
    html,
  };
}

/**
 * 3. Incomplete Event / Setup Reminder (Lifecycle: Draft event exists)
 * Goal: Nudge organizer to finish ticket tiers and publish the event.
 */
export function buildIncompleteEventEmail(data: IncompleteEventEmailData): { subject: string; html: string } {
  const greeting = data.name ? `Hi ${data.name},` : "Hello,";

  const contextContentHtml = `
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="font-size: 13px; line-height: 22px; color: #334155;">
      <tr>
        <td style="color: #64748b; width: 110px;">Event Name:</td>
        <td style="font-weight: 600; color: #0f172a;">${data.eventName}</td>
      </tr>
      ${data.venue ? `
      <tr>
        <td style="color: #64748b;">Venue:</td>
        <td style="color: #0f172a;">${data.venue}</td>
      </tr>` : ""}
      ${data.eventDate ? `
      <tr>
        <td style="color: #64748b;">Scheduled Date:</td>
        <td style="color: #0f172a;">${data.eventDate}</td>
      </tr>` : ""}
      <tr>
        <td style="color: #64748b;">Status:</td>
        <td><span style="display: inline-block; padding: 2px 8px; border-radius: 9999px; background-color: #f1f5f9; color: #475569; font-size: 11px; font-weight: 600;">Draft</span></td>
      </tr>
    </table>
  `;

  const html = renderCorporateEmailHtml({
    preheader: `Complete your setup for ${data.eventName} and begin accepting registrations.`,
    heading: `Finish setting up ${data.eventName}`,
    message: `<p style="margin: 0 0 12px 0;">${greeting}</p><p style="margin: 0;">Your event draft is saved in your UrPass dashboard, but it is not yet accepting attendee registrations. Complete your pass tiers and publish your public page to go live.</p>`,
    cta: {
      label: "Resume Event Setup",
      url: `${APP_URL}/event/${data.eventId}`,
    },
    contextContentHtml,
    secondaryInfo: "Draft events can be duplicated, previewed, or edited anytime from your Events Directory.",
  });

  return {
    subject: `Complete your event setup: ${data.eventName}`,
    html,
  };
}

/**
 * 4. Subscription Activated Email (Lifecycle: Billing upgrade / Renewal)
 * Goal: Confirm subscription, provide receipt details, list unlocked capabilities.
 */
export function buildSubscriptionEmail(data: SubscriptionEmailData): { subject: string; html: string } {
  const greeting = data.name ? `Hi ${data.name},` : "Hello,";

  const contextContentHtml = `
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="font-size: 13px; line-height: 22px; color: #334155;">
      <tr>
        <td style="color: #64748b; width: 130px;">Active Tier:</td>
        <td style="font-weight: 700; color: #0f172a;">${data.planName}</td>
      </tr>
      <tr>
        <td style="color: #64748b;">Billing Cycle:</td>
        <td style="text-transform: capitalize; color: #0f172a;">${data.billingCycle}</td>
      </tr>
      <tr>
        <td style="color: #64748b;">Amount:</td>
        <td style="font-weight: 600; color: #0f172a;">${data.amountFormatted}</td>
      </tr>
      <tr>
        <td style="color: #64748b;">Next Renewal:</td>
        <td style="color: #0f172a;">${data.renewalDate}</td>
      </tr>
    </table>
  `;

  const html = renderCorporateEmailHtml({
    preheader: `Your ${data.planName} subscription is active on UrPass.`,
    heading: `Your ${data.planName} subscription is active`,
    message: `<p style="margin: 0 0 12px 0;">${greeting}</p><p style="margin: 0;">Thank you for partnering with UrPass. Your account now has full access to enterprise pass limits, custom branding, and multi-scanner synchronization.</p>`,
    cta: {
      label: "Manage Workspace",
      url: `${APP_URL}/dashboard`,
    },
    contextContentHtml,
    secondaryInfo: "You can view your tax invoices and update payment methods at any time under Settings &rarr; Plan & Billing.",
  });

  return {
    subject: `Your UrPass ${data.planName} subscription is active`,
    html,
  };
}

/**
 * 5. Payment Failed Email (Lifecycle: Billing payment failure)
 * Goal: Polite, urgent notification with clear 3-day grace period and direct update link.
 */
export function buildPaymentFailedEmail(data: PaymentFailedEmailData): { subject: string; html: string } {
  const greeting = data.name ? `Hi ${data.name},` : "Hello,";
  const graceDays = data.gracePeriodDays ?? 3;

  const contextContentHtml = `
    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="font-size: 13px; line-height: 22px; color: #334155;">
      <tr>
        <td style="color: #64748b; width: 130px;">Plan:</td>
        <td style="font-weight: 600; color: #0f172a;">${data.planName}</td>
      </tr>
      <tr>
        <td style="color: #64748b;">Amount Due:</td>
        <td style="font-weight: 700; color: #991b1b;">${data.amountDueFormatted}</td>
      </tr>
      <tr>
        <td style="color: #64748b;">Attempt Date:</td>
        <td style="color: #0f172a;">${data.attemptDate}</td>
      </tr>
      <tr>
        <td style="color: #64748b;">Grace Period:</td>
        <td style="color: #92400e; font-weight: 600;">${graceDays} days remaining</td>
      </tr>
    </table>
  `;

  const html = renderCorporateEmailHtml({
    preheader: `Payment update required for your UrPass ${data.planName} account.`,
    heading: "Payment update needed for your UrPass account",
    message: `<p style="margin: 0 0 12px 0;">${greeting}</p><p style="margin: 0;">We were unable to process your recent subscription payment. Your events, ticket sales, and entrance scanning gates remain active during a <strong>${graceDays}-day grace period</strong>. Please update your payment method to ensure uninterrupted service.</p>`,
    cta: {
      label: "Update Payment Method",
      url: `${APP_URL}/dashboard/settings`,
    },
    contextContentHtml,
    secondaryInfo: "If you believe this charge was made in error or need a temporary extension for enterprise procurement, please reply to this email.",
  });

  return {
    subject: "Action required: Payment update needed for your UrPass account",
    html,
  };
}

/**
 * 6. What's New Email (Product Update / Feature Adoption)
 * Goal: Feature announcement in Stripe/Linear style.
 */
export function buildWhatsNewEmail(data: WhatsNewEmailData): { subject: string; html: string } {
  const greeting = data.name ? `Hi ${data.name},` : "Hello,";

  const highlightsHtml = (data.highlights && data.highlights.length > 0)
    ? `
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 22px; color: #334155;">
        ${data.highlights.map((h) => `<li style="margin-bottom: 6px;">${h}</li>`).join("")}
      </ul>
    `
    : `<p style="margin: 0; font-size: 13px; color: #334155;">${data.featureDescription}</p>`;

  const html = renderCorporateEmailHtml({
    preheader: data.featureSummary,
    heading: data.featureTitle,
    message: `<p style="margin: 0 0 12px 0;">${greeting}</p><p style="margin: 0;">${data.featureSummary}</p>`,
    cta: {
      label: "Explore Feature",
      url: data.featureUrl,
    },
    contextContentHtml: highlightsHtml,
    secondaryInfo: "Have feedback on this update? Let us know by replying to this update.",
  });

  return {
    subject: `What's new in UrPass: ${data.featureTitle}`,
    html,
  };
}

/**
 * 7. Offer / Plan Upgrade Email (Marketing / Expansion)
 * Goal: High-value plan upgrade for high-capacity events.
 */
export function buildOfferEmail(data: OfferEmailData): { subject: string; html: string } {
  const greeting = data.name ? `Hi ${data.name},` : "Hello,";

  const benefitsList = data.benefits || [
    "Unlimited simultaneous entrance scan gates",
    "Offline sync and conflict reconciliation engine",
    "Custom branded domain & custom digital pass badge studio",
    "Priority 24/7 organizer on-site support",
  ];

  const contextContentHtml = `
    <div style="margin-bottom: 12px;">
      <span style="display: inline-block; padding: 3px 8px; border-radius: 6px; background-color: #f1f5f9; color: #0f172a; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
        ${data.discountSummary}
      </span>
      ${data.promoCode ? `<span style="margin-left: 8px; font-family: monospace; font-size: 12px; font-weight: 600; color: #475569;">CODE: ${data.promoCode}</span>` : ""}
    </div>
    <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 22px; color: #334155;">
      ${benefitsList.map((b) => `<li style="margin-bottom: 4px;">${b}</li>`).join("")}
    </ul>
    ${data.expiryDate ? `<p style="margin: 12px 0 0 0; font-size: 11px; color: #94a3b8;">Valid through ${data.expiryDate}.</p>` : ""}
  `;

  const html = renderCorporateEmailHtml({
    preheader: data.offerHeadline,
    heading: `Scale your events with UrPass ${data.targetPlan}`,
    message: `<p style="margin: 0 0 12px 0;">${greeting}</p><p style="margin: 0;">${data.offerHeadline}. Upgrade your workspace to handle higher registration volumes, multiple entrance gates, and dedicated staff accounts.</p>`,
    cta: {
      label: `Upgrade to ${data.targetPlan}`,
      url: `${APP_URL}/pricing?plan=${encodeURIComponent(data.targetPlan.toLowerCase())}${data.promoCode ? `&code=${data.promoCode}` : ""}`,
    },
    contextContentHtml,
    secondaryInfo: "Enterprise volume plans can also be invoiced via Purchase Order and corporate bank transfer.",
  });

  return {
    subject: `Upgrade to UrPass ${data.targetPlan}: Built for high-volume events`,
    html,
  };
}

/**
 * Registry of all 7 production release email templates
 */
export const EMAIL_TEMPLATES_CATALOG: Record<
  EmailTemplateSlug,
  {
    slug: EmailTemplateSlug;
    name: string;
    description: string;
    lifecycleStage: "Sign Up" | "Activation" | "Setup" | "Subscription" | "Billing" | "Product" | "Offer";
    category: "lifecycle" | "transactional" | "product" | "marketing";
    sampleData: Record<string, unknown>;
    render: (data: any) => { subject: string; html: string };
  }
> = {
  welcome: {
    slug: "welcome",
    name: "Organizer Welcome",
    description: "Welcomes new organizers and introduces 3-step event setup.",
    lifecycleStage: "Sign Up",
    category: "lifecycle",
    sampleData: { name: "Alex" },
    render: buildWelcomeEmail,
  },
  activation: {
    slug: "activation",
    name: "First Event Activation",
    description: "Encourages organizers who signed up without publishing an event.",
    lifecycleStage: "Activation",
    category: "lifecycle",
    sampleData: { name: "Alex" },
    render: buildActivationEmail,
  },
  incomplete_event: {
    slug: "incomplete_event",
    name: "Incomplete Event Reminder",
    description: "Nudges organizers with saved draft events to configure tickets and publish.",
    lifecycleStage: "Setup",
    category: "lifecycle",
    sampleData: {
      name: "Alex",
      eventId: "demo-event-123",
      eventName: "Global Tech Summit 2026",
      venue: "Main Auditorium & Hall B",
      eventDate: "Nov 14, 2026",
    },
    render: buildIncompleteEventEmail,
  },
  subscription: {
    slug: "subscription",
    name: "Subscription Activated",
    description: "Confirms plan upgrade/renewal and lists unlocked capabilities.",
    lifecycleStage: "Subscription",
    category: "transactional",
    sampleData: {
      name: "Alex",
      planName: "Pro Workspace",
      amountFormatted: "₹2,499",
      billingCycle: "monthly",
      renewalDate: "Nov 02, 2026",
    },
    render: buildSubscriptionEmail,
  },
  payment_failed: {
    slug: "payment_failed",
    name: "Payment Failed Notice",
    description: "Alerts user of subscription billing failure with 3-day grace period.",
    lifecycleStage: "Billing",
    category: "transactional",
    sampleData: {
      name: "Alex",
      planName: "Pro Workspace",
      amountDueFormatted: "₹2,499",
      attemptDate: "Oct 02, 2026",
      gracePeriodDays: 3,
    },
    render: buildPaymentFailedEmail,
  },
  whats_new: {
    slug: "whats_new",
    name: "Product Update / What's New",
    description: "Linear/Stripe-style announcement of new platform capabilities.",
    lifecycleStage: "Product",
    category: "product",
    sampleData: {
      name: "Alex",
      featureTitle: "Multi-Gate QR Sync & Custom Badge Studio",
      featureSummary: "Deliver faster gate check-ins with real-time offline mesh synchronization.",
      featureDescription: "Introducing our next-generation scanner architecture.",
      featureUrl: `${APP_URL}/dashboard/events`,
      highlights: [
        "Sub-second verification even during complete venue WiFi dropouts",
        "Visual pass designer with live preview and custom SVG ticket badges",
        "Role-based scanner operator permissions with entrance audit trails",
      ],
    },
    render: buildWhatsNewEmail,
  },
  offer: {
    slug: "offer",
    name: "Plan Upgrade Offer",
    description: "Targeted enterprise upgrade promotion for active organizers.",
    lifecycleStage: "Offer",
    category: "marketing",
    sampleData: {
      name: "Alex",
      targetPlan: "Enterprise",
      offerHeadline: "Unlock unlimited entrance gates and dedicated account management",
      discountSummary: "20% Annual Discount",
      promoCode: "SCALE2026",
      expiryDate: "October 31, 2026",
      benefits: [
        "Unlimited concurrent check-in scanners and turnstile operators",
        "Dedicated account manager and on-call engineering gate support",
        "Custom branding removal and custom vanity subdomains",
        "Automated GST B2B tax invoice generation for corporate sponsors",
      ],
    },
    render: buildOfferEmail,
  },
};
