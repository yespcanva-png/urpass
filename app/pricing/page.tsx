import type { Metadata } from "next";
import PricingContent from "./PricingContent";

export const metadata: Metadata = {
  title: "Pricing — URPASS",
  description: "Free, Starter ₹499/mo, Pro ₹999/mo, Business ₹2,499/mo. Simple pricing based on monthly registrations. Unlimited events on every plan.",
  alternates: { canonical: "https://urpass.space/pricing" },
  openGraph: {
    title: "URPASS Pricing — Simple Plans for Every Event",
    description: "Start free. Upgrade when you grow. Unlimited events on all plans — pay based on monthly registrations.",
    url: "https://urpass.space/pricing",
  },
};

export default function PricingPage() {
  return <PricingContent />;
}
