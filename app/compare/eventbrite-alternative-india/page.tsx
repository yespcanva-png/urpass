import type { Metadata } from "next";
import { CheckCircle2, Percent, CreditCard, ScanLine, QrCode, ShieldCheck, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Eventbrite Alternative for India: Zero Ticket Commission",
  description: "Looking for an Eventbrite alternative in India? URPASS offers zero per-ticket commission fees, native Razorpay integration (UPI, cards, net banking), and sub-second mobile browser door scanning.",
  keywords: [
    "eventbrite alternative india",
    "event ticketing alternative",
    "event registration software",
    "QR event check-in",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/compare/eventbrite-alternative-india" },
  openGraph: {
    title: "Eventbrite Alternative for India: Zero Ticket Commission | URPASS",
    description: "Looking for an Eventbrite alternative in India? URPASS offers zero per-ticket commission fees, native Razorpay integration (UPI, cards, net banking), and sub-second mobile browser door scanning.",
    url: "https://urpass.space/compare/eventbrite-alternative-india",
    locale: "en_IN",
    type: "article",
  },
};

export default function ComparisonPage() {
  return (
    <SEOPage
      config={{
        badge: "INDIAN TICKETING ALTERNATIVE",
        h1: "Eventbrite Alternative for Indian Event Organizers",
        canonicalUrl: "https://urpass.space/compare/eventbrite-alternative-india",
        description: "Looking for an Eventbrite alternative in India? URPASS offers zero per-ticket commission fees, native Razorpay integration (UPI, cards, net banking), and sub-second mobile browser door scanning.",
        ctaLabel: "Switch from Eventbrite free",
        features: [
          { icon: Percent, title: "Zero Per-Ticket Commission", desc: "Eventbrite charges 3.7% + service fees per ticket. URPASS charges zero per-ticket commission, letting you keep 100% of your ticket revenue." },
          { icon: CreditCard, title: "Native UPI & INR Settlements", desc: "Direct Razorpay integration supporting Google Pay, PhonePe, Paytm, net banking, and Indian credit/debit cards." },
          { icon: ScanLine, title: "Browser-Based Door Scanner", desc: "No need for volunteers to download heavy organizer apps. Staff scan passes directly inside Safari or Chrome on any phone." },
          { icon: QrCode, title: "Sub-Second Pass Verification", desc: "High-contrast QR recognition verifies tickets in under 0.3 seconds with instant duplicate entry lockout across all doors." },
          { icon: ShieldCheck, title: "Direct Attendee Ownership", desc: "Your attendee database belongs solely to your organization with zero competitor ads or cross-marketing." },
          { icon: BarChart3, title: "Transparent Flat Pricing", desc: "Choose our permanent free tier or upgrade to flat monthly plans starting at ₹499/mo with a 30-day free trial." },
        ],
        steps: [
          { n: "01", title: "Create Free Account", desc: "Sign up on URPASS in seconds with no credit card required." },
          { n: "02", title: "Configure Event in INR", desc: "Set ticket tiers, prices in INR, and custom registration fields." },
          { n: "03", title: "Share Direct Link", desc: "Publish your clean, ad-free registration page across your audience." },
          { n: "04", title: "Scan at the Door", desc: "Staff scan digital QR tickets with mobile browsers in under 0.3s." },
          { n: "05", title: "Keep 100% of Revenue", desc: "Ticket sales settle directly to your Indian bank account via Razorpay." },
        ],
        callout: {
          badge: "PROFITABILITY",
          title: "Keep your hard-earned ticket revenue in India.",
          description: "Selling tickets on Eventbrite in India means losing a significant percentage of every ticket to platform fees and dealing with international payment friction. URPASS provides native UPI ticketing with zero platform cuts.",
          bullets: [
            "Zero per-ticket percentage cuts on ticket revenue",
            "Direct settlements to your Indian bank account via Razorpay",
            "Mobile browser scanning with zero hardware rentals",
            "30-day free trial available on all paid subscription plans",
          ],
        },
        useCases: [
          "College Culturals & Star Nights",
          "Tech Conferences & Summits",
          "Hands-on Workshops",
          "Hackathons & Buildathons",
          "Comedy Nights & Concerts",
          "Corporate Training Seminars",
        ],
        faqs: [
          { q: "How much money can Indian organizers save compared to Eventbrite?", a: "On ₹2,00,000 of ticket sales, Eventbrite fees can exceed ₹10,000+. URPASS charges zero per-ticket commission, saving you thousands on flat subscription plans." },
          { q: "Does URPASS support PhonePe, Google Pay, and Paytm?", a: "Yes. Native Razorpay integration supports all major UPI apps, debit/credit cards, and net banking." },
          { q: "Can we use URPASS for free events?", a: "Yes. You can host 2 events per month with up to 100 registrations per month completely free on our permanent free tier." },
          { q: "Can volunteers scan tickets without creating an account?", a: "Yes. Organizers share a PIN-protected scanner link so volunteers can scan using their phone browser immediately." },
        ],
        ctaTitle: "Experience the URPASS difference today",
        ctaDescription: "Permanent free tier · Zero ticket commission · Sub-second door check-in",
      }}
    />
  );
}
