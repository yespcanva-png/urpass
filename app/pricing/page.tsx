import type { Metadata } from "next";
import { headers, cookies } from "next/headers";
import PricingContent from "./PricingContent";
import { createClient } from "@/lib/supabase/server";
import { detectCountryFromHeaders } from "@/lib/country-config";
import { SELF_SERVICE_PLAN_LIMITS } from "@/lib/billing/plan-limits";

export const metadata: Metadata = {
  title: "UrPass Pricing | Event Ticketing & Remote Managed Services",
  description:
    "Compare UrPass event registration and ticketing subscriptions with one-time remote managed event packages. Transparent pricing and QR check-in.",
  keywords: [
    "UrPass pricing",
    "event registration pricing India",
    "event ticketing software pricing",
    "Starter event plan ₹499",
    "Pro event plan ₹999",
    "Business event plan ₹2499",
    "Remote managed event services ₹2999",
    "QR event check-in pricing",
    "zero commission event ticketing",
  ],
  alternates: { canonical: "https://urpass.space/pricing" },
  openGraph: {
    title: "UrPass Pricing | Event Ticketing & Remote Managed Services",
    description:
      "Compare UrPass event registration and ticketing subscriptions with one-time remote managed event packages. Transparent pricing and QR check-in.",
    url: "https://urpass.space/pricing",
    siteName: "UrPass",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UrPass Pricing | Event Ticketing & Remote Managed Services",
    description:
      "Compare UrPass event registration and ticketing subscriptions with one-time remote managed event packages. Transparent pricing and QR check-in.",
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
        name: "UrPass Self-Service Event Software",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, iOS, Android",
        url: "https://urpass.space/pricing",
        description: isUk
          ? "High-speed digital event registration, QR pass and gate check-in platform for UK university societies, conferences, and festivals."
          : "India's premier 0% ticket commission event registration and QR check-in software for organizers, colleges, and conferences.",
        offers: [
          {
            "@type": "Offer",
            name: "Free Forever",
            price: "0",
            priceCurrency: "INR",
            billingIncrement: "P1M",
            description: `1 active event, ${SELF_SERVICE_PLAN_LIMITS.free.registrationsPerMonth} registrations/month, basic QR check-in with UrPass watermark.`,
          },
          {
            "@type": "Offer",
            name: "Single Event License",
            price: "299",
            priceCurrency: "INR",
            description: "₹299 one-time. 250 registrations for one event, 0% UrPass platform commission; gateway fees apply.",
          },
          {
            "@type": "Offer",
            name: "VIP Concierge Event Setup",
            price: "999",
            priceCurrency: "INR",
            description: "₹999 one-time (Free for 1st-time organizers). Complete 24-hour done-for-you event setup, ticket branding, and QR gate configuration.",
          },
          {
            "@type": "Offer",
            name: "Starter Plan",
            price: "499",
            priceCurrency: "INR",
            billingIncrement: "P1M",
            description: `₹499/month + GST. 3 active events, ${SELF_SERVICE_PLAN_LIMITS.starter.registrationsPerMonth} registrations/month, paid ticketing (0% UrPass commission), 2 team seats.`,
          },
          {
            "@type": "Offer",
            name: "Pro Plan",
            price: "999",
            priceCurrency: "INR",
            billingIncrement: "P1M",
            description: `₹999/month + GST. 10 active events, ${SELF_SERVICE_PLAN_LIMITS.pro.registrationsPerMonth} registrations/month, group QR, multi-gate check-in, 5 team seats.`,
          },
          {
            "@type": "Offer",
            name: "Business Plan",
            price: "2499",
            priceCurrency: "INR",
            billingIncrement: "P1M",
            description: `₹2,499/month + GST. ${SELF_SERVICE_PLAN_LIMITS.business.registrationsPerMonth} registrations/month, API & webhooks, 15 team seats.`,
          },
        ],
      },
      {
        "@type": "Service",
        name: "UrPass Remote Managed Event Services",
        serviceType: "Event Technical Setup & QR Check-in Management",
        provider: {
          "@type": "Organization",
          name: "UrPass",
          url: "https://urpass.space",
        },
        description:
          "End-to-end remote technical setup, registration configuration, ticketing setup, invitation testing, scanner configuration, and coordinator training.",
        offers: [
          {
            "@type": "Offer",
            name: "Essential Remote Setup",
            price: "2999",
            priceCurrency: "INR",
            description: "Up to 1,000 attendees. Form setup, tickets, QR passes, 1 remote training session.",
          },
          {
            "@type": "Offer",
            name: "Pro Remote Management",
            price: "7999",
            priceCurrency: "INR",
            description: "Up to 5,000 attendees. Advanced tiers, group QR, multi-gate routing, 2 remote training sessions.",
          },
          {
            "@type": "Offer",
            name: "Premium Remote Operations",
            price: "14999",
            priceCurrency: "INR",
            description: "Up to 15,000 attendees. Session attendance, rehearsal, 3 training sessions, dedicated remote lead.",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the difference between Self-Service and Remote Managed Service?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "With Self-Service, you pay for a month or year of software access and configure events yourself. The current checkout takes a one-time payment without automatic renewal. Remote Managed Services cover remote event setup for a separate one-time fee.",
            },
          },
          {
            "@type": "Question",
            name: "Does UrPass charge commission on paid ticket sales?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "UrPass charges 0% per-ticket platform commission on paid plans. Payment gateway processing fees still apply, and ticket revenues settle to your connected gateway account after those fees.",
            },
          },
          {
            "@type": "Question",
            name: "Does Remote Managed Service include on-site event staff?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. UrPass Remote Managed Services provide strictly remote technical operations, system configuration, scanner training, and hotline support. The organizer provides on-site staff, smartphones, and venue internet.",
            },
          },
          {
            "@type": "Question",
            name: "Can I cancel my Self-Service subscription anytime?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The current self-service checkout is a one-time payment for one month or year of access, so it has no automatic renewal to cancel. Accounts with an existing AutoPay mandate can cancel future renewals in billing.",
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

  const jsonLd = getPricingJsonLd(isUk);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd)
            .replace(/</g, "\\u003C")
            .replace(/>/g, "\\u003E"),
        }}
      />
      <PricingContent
        isAuthenticated={Boolean(user)}
        userEmail={user?.email || ""}
        initialCountry={country}
      />
    </>
  );
}
