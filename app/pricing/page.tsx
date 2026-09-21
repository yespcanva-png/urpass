import type { Metadata } from "next";
import PricingContent from "./PricingContent";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Pricing — URPASS",
  description: "Free, Starter ₹499/mo, Pro ₹999/mo, Business ₹2,499/mo. Try any paid plan free for 30 days. Simple pricing based on monthly registrations.",
  alternates: { canonical: "https://urpass.space/pricing" },
  openGraph: {
    title: "URPASS Pricing — Try Any Plan Free for 30 Days",
    description: "Try Starter, Pro, or Business free for 30 days. AutoPay setup required · Cancel before renewal.",
    url: "https://urpass.space/pricing",
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
