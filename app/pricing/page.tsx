import type { Metadata } from "next";
import { headers, cookies } from "next/headers";
import PricingContent from "./PricingContent";
import { createClient } from "@/lib/supabase/server";
import { detectCountryFromHeaders } from "@/lib/country-config";

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
            description: "1 active event, 100 registrations/event, basic QR check-in.",
          },
          {
            "@type": "Offer",
            name: "Starter Plan",
            price: "499",
            priceCurrency: "INR",
            billingIncrement: "P1M",
            description: "₹499/month + GST. 3 active events, 1,000 attendees/event, paid ticketing (0% commission), 2 team seats.",
          },
          {
            "@type": "Offer",
            name: "Pro Plan",
            price: "999",
            priceCurrency: "INR",
            billingIncrement: "P1M",
            description: "₹999/month + GST. 10 active events, 5,000 attendees/event, group QR, multi-gate check-in, 5 team seats.",
          },
          {
            "@type": "Offer",
            name: "Business Plan",
            price: "2499",
            priceCurrency: "INR",
            billingIncrement: "P1M",
            description: "₹2,499/month + GST. 30 active events, 15,000 attendees/event, API & webhooks, 15 team seats.",
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
              text: "With Self-Service, you subscribe monthly and configure your events yourself using our software. With Remote Managed Services, our technical team remotely handles your complete event setup, ticketing, QR passes, coordinator training, and event-day hotline for a one-time flat fee.",
            },
          },
          {
            "@type": "Question",
            name: "Does UrPass charge commission on paid ticket sales?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. UrPass charges 0% per-ticket platform commission on all paid plans (Starter, Pro, Business). Ticket revenues settle directly into your connected Razorpay payment gateway.",
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
              text: "Yes. You can cancel future renewals anytime directly in your customer billing portal. You retain full paid access until the end of your current paid billing period with zero cancellation fees.",
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
