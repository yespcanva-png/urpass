import type { Metadata } from "next";
import { headers, cookies } from "next/headers";
import PricingContent from "./PricingContent";
import { createClient } from "@/lib/supabase/server";
import { detectCountryFromHeaders } from "@/lib/country-config";

export const metadata: Metadata = {
  title: "Pricing — Event Plans & Subscriptions | URPASS",
  description:
    "Starter (₹499/mo), Pro (₹999/mo), Business (₹2,499/mo), one-event passes, and campus licensing for URPASS with transparent pricing and 0% ticket commissions.",
  keywords: [
    "URPASS pricing",
    "event management pricing",
    "event ticketing software pricing",
    "Starter event plan",
    "Pro event plan",
    "Business event plan",
    "event pass software pricing",
    "zero commission event ticketing pricing",
  ],
  alternates: { canonical: "https://urpass.space/pricing" },
  openGraph: {
    title: "URPASS Pricing — Event Plans & Subscriptions",
    description: "Choose Starter, Pro, Business, one-event passes, or campus licensing with transparent local pricing.",
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
                name: "Starter Tier",
                price: "15",
                priceCurrency: "GBP",
                billingIncrement: "P1M",
                description: "10 events/month, 500 registrations/month, 2 organizers, CSV import & export.",
              },
              {
                "@type": "Offer",
                name: "Pro Tier",
                price: "35",
                priceCurrency: "GBP",
                billingIncrement: "P1M",
                description: "Unlimited events, 2,500 registrations/month, 5 organizers, custom pass design, advanced analytics.",
              },
              {
                "@type": "Offer",
                name: "Business Tier",
                price: "79",
                priceCurrency: "GBP",
                billingIncrement: "P1M",
                description: "Unlimited events, 10,000 registrations/month, 15 organizers, custom domain, API & webhooks.",
              },
            ]
          : [
              {
                "@type": "Offer",
                name: "Starter Tier",
                price: "499",
                priceCurrency: "INR",
                billingIncrement: "P1M",
                description: "₹499/month + GST. 10 events/month, 500 registrations/month, 2 organizers, CSV import & export.",
              },
              {
                "@type": "Offer",
                name: "Pro Tier",
                price: "999",
                priceCurrency: "INR",
                billingIncrement: "P1M",
                description: "₹999/month + GST. Unlimited events, 2,500 registrations/month, 5 organizers, custom pass design, advanced analytics.",
              },
              {
                "@type": "Offer",
                name: "Business Tier",
                price: "2499",
                priceCurrency: "INR",
                billingIncrement: "P1M",
                description: "₹2,499/month + GST. Unlimited events, 10,000 registrations/month, 15 organizers, custom domain, API & webhooks.",
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
            name: "How does URPASS pricing work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: isUk
                ? "UK pricing is available as Starter £15/month, Pro £35/month, and Business £79/month, with direct activation and cancel-anytime renewal."
                : "India pricing offers Starter at ₹499/month, Pro at ₹999/month, and Business at ₹2,499/month (+GST). Alternatively, single event passes start at ₹299.",
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
      : headerCountry === "IN"
      ? "IN"
      : headerCountry === "GB"
      ? "GB"
      : cookieCountry === "GB" || cookieCountry === "UK"
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
