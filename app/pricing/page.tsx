import type { Metadata } from "next";
import { headers, cookies } from "next/headers";
import PricingContent from "./PricingContent";
import { createClient } from "@/lib/supabase/server";
import { detectCountryFromHeaders } from "@/lib/country-config";

export const metadata: Metadata = {
  title: "Pricing — Start Free · 30-Day Free Trial on Paid Plans | URPASS",
  description:
    "Free forever tier. Starter, Pro, and Business plans with full features and 30-day free trial. Transparent pricing in your local currency with 0% platform commission.",
  keywords: [
    "URPASS pricing",
    "try 30 day free trial",
    "event management free trial",
    "free event ticketing platform",
    "Starter plan free trial",
    "Pro plan free trial",
    "Business plan free trial",
    "event pass software pricing",
    "no credit card free trial",
    "zero commission event ticketing pricing",
  ],
  alternates: { canonical: "https://urpass.space/pricing" },
  openGraph: {
    title: "URPASS Pricing — Start Free · Try Any Paid Plan Free for 30 Days",
    description: "Try Starter, Pro, or Business free for 30 days. Instant access, zero platform commission.",
    url: "https://urpass.space/pricing",
    siteName: "URPASS",
    type: "website",
  },
};

function getPricingJsonLd(isUk: boolean) {
  return {
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
        description: isUk
          ? "High-speed digital event registration, QR pass and gate check-in platform for UK university societies, conferences, hackathons, and corporate summits."
          : "India-focused digital event registration, QR pass and check-in platform for colleges, conferences, hackathons, workshops and corporate events.",
        offers: isUk
          ? [
              {
                "@type": "Offer",
                name: "Free Tier",
                price: "0",
                priceCurrency: "GBP",
                description: "Free forever. 2 events/month, 100 registrations/month, QR passes & sub-second check-in.",
              },
              {
                "@type": "Offer",
                name: "Starter Tier",
                price: "15",
                priceCurrency: "GBP",
                billingIncrement: "P1M",
                description: "Try free for 30 days. 10 events/month, 500 registrations/month, 2 organizers, CSV import & export.",
              },
              {
                "@type": "Offer",
                name: "Pro Tier",
                price: "35",
                priceCurrency: "GBP",
                billingIncrement: "P1M",
                description: "Try free for 30 days. Unlimited events, 2,500 registrations/month, 5 organizers, custom pass design, advanced analytics.",
              },
              {
                "@type": "Offer",
                name: "Business Tier",
                price: "79",
                priceCurrency: "GBP",
                billingIncrement: "P1M",
                description: "Try free for 30 days. Unlimited events, 10,000 registrations/month, 15 organizers, custom domain, API & webhooks.",
              },
            ]
          : [
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
              text: isUk
                ? "Yes. The Free plan is permanently available at £0 forever with 2 events/month and 100 registrations/month. All paid plans include an instant 30-day free trial with no credit card required."
                : "Yes. The Free plan is permanently available at ₹0 forever with 2 events/month and 100 registrations/month. All paid plans include a 30-day free trial with no credit card required.",
            },
          },
          {
            "@type": "Question",
            name: "Can I sell paid tickets?",
            acceptedAnswer: {
              "@type": "Answer",
              text: isUk
                ? "Yes. URPASS supports paid ticket sales with zero per-ticket platform commissions, direct payouts, and full UK GDPR compliance."
                : "Yes. URPASS supports paid ticket sales with direct Razorpay integration, accepting UPI, debit/credit cards, and net banking with zero per-ticket commission fees.",
            },
          },
        ],
      },
    ],
  };
}

export default async function PricingPage(props: {
  searchParams?: Promise<{ country?: string }>;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const [reqHeaders, cookieStore] = await Promise.all([headers(), cookies()]);
  const cookieCountry = cookieStore.get("urpass_country")?.value?.toUpperCase();
  const headerCountry = detectCountryFromHeaders(reqHeaders);
  const requestedCountry = searchParams?.country?.toUpperCase();

  const country: "IN" | "GB" =
    requestedCountry === "GB" || requestedCountry === "UK"
      ? "GB"
      : requestedCountry === "IN"
      ? "IN"
      : cookieCountry === "GB" || cookieCountry === "UK"
      ? "GB"
      : cookieCountry === "IN"
      ? "IN"
      : headerCountry === "GB"
      ? "GB"
      : "IN";
  const isUk = country === "GB";

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
      .select("trial_used, provider")
      .eq("user_id", user.id)
      .maybeSingle();
    trialUsed = sub?.trial_used ?? false;
  }

  const pricingJsonLd = getPricingJsonLd(isUk);

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
        initialCountry={country}
      />
    </>
  );
}
