import type { Metadata } from "next";
import PricingContent from "./PricingContent";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Pricing — Start Free · Try 30-Day Free Trial on Paid Plans | URPASS",
  description: "Free ₹0 forever. Starter ₹499/mo, Pro ₹999/mo, Business ₹2,499/mo. Try any paid plan free for 30 days with mandatory AutoPay. Transparent INR pricing for event organizers across India.",
  keywords: [
    "URPASS pricing",
    "try 30 day free trial",
    "event management free trial",
    "free event ticketing platform",
    "Starter plan free trial",
    "Pro plan free trial",
    "Business plan free trial",
    "event pass software pricing India",
    "Razorpay AutoPay event software",
    "free digital pass generator",
  ],
  alternates: { canonical: "https://urpass.space/pricing" },
  openGraph: {
    title: "URPASS Pricing — Start Free · Try Any Paid Plan Free for 30 Days",
    description: "Try Starter, Pro, or Business free for 30 days. AutoPay setup required · Cancel before renewal.",
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
    <PricingContent
      isAuthenticated={Boolean(user)}
      trialUsed={trialUsed}
      userEmail={userEmail}
      userName={userName}
    />
  );
}
