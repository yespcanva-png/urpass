import type { Metadata } from "next";
import PricingContent from "./PricingContent";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Pricing — Start Free · Try 30-Day Free Trial on Paid Plans",
  description: "Free ₹0 forever. Starter ₹499/mo, Pro ₹999/mo, Business ₹2,499/mo. Try any paid plan free for 30 days with no credit card required. Transparent INR pricing for event organizers across India.",
  keywords: [
    "URPASS pricing",
    "try 30 day free trial",
    "event management free trial",
    "free event ticketing platform",
    "Starter plan free trial",
    "Pro plan free trial",
    "Business plan free trial",
    "event pass software pricing India",
    "no credit card free trial",
    "free digital pass generator",
  ],
  alternates: { canonical: "https://urpass.space/pricing" },
  openGraph: {
    title: "URPASS Pricing — Start Free · Try Any Paid Plan Free for 30 Days",
    description: "Try Starter, Pro, or Business free for 30 days. No credit card or AutoPay required · Instant access.",
    url: "https://urpass.space/pricing",
    siteName: "URPASS",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@urpass",
    creator: "@urpass",
    title: "URPASS Pricing — Start Free · Try Any Paid Plan Free for 30 Days",
    description: "Try Starter, Pro, or Business free for 30 days. Transparent INR pricing for organizers.",
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "geo.position": "20.5937;78.9629",
    "ICBM": "20.5937, 78.9629",
  },
};

const pricingJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://urpass.space",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Pricing & Plans",
          item: "https://urpass.space/pricing",
        },
      ],
    },
    {
      "@type": "SoftwareApplication",
      name: "URPASS",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web, iOS, Android",
      url: "https://urpass.space/pricing",
      description:
        "India-focused digital event registration, QR pass and check-in platform for colleges, conferences, hackathons, workshops and corporate events.",
      offers: [
        {
          "@type": "Offer",
          name: "Free Tier",
          price: "0",
          priceCurrency: "INR",
          description: "Free forever. 2 events/month, 100 registrations/month, QR passes & sub-second check-in.",
        },
        {
          "@type": "Offer",
          name: "Starter Tier",
          price: "499",
          priceCurrency: "INR",
          billingIncrement: "P1M",
          description: "Try free for 30 days. 10 events/month, 500 registrations/month, 2 organizers, CSV import & export.",
        },
        {
          "@type": "Offer",
          name: "Pro Tier",
          price: "999",
          priceCurrency: "INR",
          billingIncrement: "P1M",
          description: "Try free for 30 days. Unlimited events, 2,500 registrations/month, 5 organizers, custom pass design, advanced analytics.",
        },
        {
          "@type": "Offer",
          name: "Business Tier",
          price: "2499",
          priceCurrency: "INR",
          billingIncrement: "P1M",
          description: "Try free for 30 days. Unlimited events, 10,000 registrations/month, 15 organizers, custom domain, API & webhooks.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Can I cancel anytime?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Cancel from your billing settings at any time with no lock-in. You keep access until the end of your current billing period.",
          },
        },
        {
          "@type": "Question",
          name: "Can I start for free or try a paid plan?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The Free plan is permanently available at ₹0 forever with 2 events/month and 100 registrations/month. All paid plans include a 30-day free trial with no credit card required.",
          },
        },
        {
          "@type": "Question",
          name: "Can I sell paid tickets?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. URPASS supports paid ticket sales with direct Razorpay integration, accepting UPI, debit/credit cards, and net banking with zero per-ticket commission fees.",
          },
        },
      ],
    },
  ],
};

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let trialUsed = false;
  let userEmail = "";
  let userName = "";

  if (user) {
    userEmail = user.email ?? "";
    userName = user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "";
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("trial_used")
      .eq("user_id", user.id)
      .maybeSingle();
    trialUsed = sub?.trial_used ?? false;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />
      <PricingContent
        isAuthenticated={Boolean(user)}
        trialUsed={trialUsed}
        userEmail={userEmail}
        userName={userName}
      />
    </>
  );
}
