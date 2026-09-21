import type { Metadata } from "next";
import { CheckCircle2, Percent, CreditCard, QrCode, ScanLine, Users, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "How to Run Event Registration Without Eventbrite: Zero Commission",
  description: "To run event registration without Eventbrite's high per-ticket fees and complex ticketing setup, use a lightweight platform like URPASS. You can launch customized registration forms, accept UPI/card payments via Razorpay in India, and scan passes using mobile browser scanners with zero per-ticket commission.",
  keywords: [
    "how to run event registration without eventbrite",
    "QR event check-in guide",
    "digital event pass tutorial",
    "event check-in best practices",
    "college fest check-in",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/guides/how-to-run-event-registration-without-eventbrite" },
  openGraph: {
    title: "How to Run Event Registration Without Eventbrite: Zero Commission | URPASS",
    description: "To run event registration without Eventbrite's high per-ticket fees and complex ticketing setup, use a lightweight platform like URPASS. You can launch customized registration forms, accept UPI/card payments via Razorpay in India, and scan passes using mobile browser scanners with zero per-ticket commission.",
    url: "https://urpass.space/guides/how-to-run-event-registration-without-eventbrite",
    locale: "en_IN",
    type: "article",
  },
};

export default function GuidePage() {
  return (
    <SEOPage
      config={{
        badge: "ALTERNATIVE GUIDE",
        h1: "How to Run Event Registration Without Eventbrite",
        canonicalUrl: "https://urpass.space/guides/how-to-run-event-registration-without-eventbrite",
        description: "To run event registration without Eventbrite's high per-ticket fees and complex ticketing setup, use a lightweight platform like URPASS. You can launch customized registration forms, accept UPI/card payments via Razorpay in India, and scan passes using mobile browser scanners with zero per-ticket commission.",
        ctaLabel: "Host events without Eventbrite free",
        features: [
          { icon: Percent, title: "Zero Per-Ticket Commission", desc: "Eventbrite charges 3.7% + service fees per ticket. URPASS charges ₹0 per-ticket commission, letting you keep 100% of sales." },
          { icon: CreditCard, title: "Native Indian Payments", desc: "Seamless Razorpay integration supporting UPI (Google Pay, PhonePe, Paytm), Net Banking, and Indian debit/credit cards." },
          { icon: QrCode, title: "Browser-Based Door Scanner", desc: "No need to download heavy organizer apps. Staff scan passes directly inside Safari or Chrome on any phone." },
          { icon: ScanLine, title: "Sub-Second Pass Verification", desc: "Verify attendee QR passes in under 0.3 seconds with instant duplicate entry lockout across all venue gates." },
          { icon: Users, title: "Direct Attendee Ownership", desc: "Your attendee database belongs strictly to your organization with zero competitor ads or cross-marketing." },
          { icon: BarChart3, title: "Transparent Flat Pricing", desc: "Choose our permanent free tier or upgrade to flat monthly plans with a 30-day free trial." },
        ],
        steps: [
          { n: "01", title: "Create Free Account", desc: "Sign up on URPASS with no credit card required." },
          { n: "02", title: "Configure Event", desc: "Set ticket tiers, prices in INR, and custom registration questions." },
          { n: "03", title: "Share Direct Link", desc: "Publish your clean, ad-free registration page across your audience." },
          { n: "04", title: "Scan at the Door", desc: "Staff scan digital QR tickets with mobile browsers in under 0.3s." },
          { n: "05", title: "Keep 100% of Revenue", desc: "Ticket revenue settles directly to your bank account via Razorpay." },
        ],
        callout: {
          badge: "KEEP YOUR REVENUE",
          title: "Stop paying thousands in per-ticket platform cuts.",
          description: "If you sell 500 tickets at ₹500 each, legacy ticketing platforms take upwards of ₹15,000 in platform fees. URPASS charges zero per-ticket commission on flat, predictable plans.",
          bullets: [
            "Zero per-ticket percentage cuts on ticket revenue",
            "Native UPI payments via Razorpay (GPay, PhonePe, Paytm)",
            "Instant door check-in with any mobile phone browser",
            "30-day free trial available on all paid subscription plans",
          ],
        },
        useCases: [
          "College Fests & Culturals",
          "Tech Conferences & Summits",
          "Hands-on Workshops",
          "Hackathons & Buildathons",
          "Networking Galas",
          "Corporate Training Seminars",
        ],
        faqs: [
          { q: "How much money can I save compared to Eventbrite?", a: "Eventbrite charges 3.7% + fees per ticket. On ₹2,00,000 of ticket sales, you save ₹10,000+ by using URPASS's flat monthly subscription." },
          { q: "Does URPASS support UPI payments in India?", a: "Yes. Native Razorpay integration supports all major UPI apps (Google Pay, PhonePe, Paytm), net banking, and cards." },
          { q: "How do volunteers scan tickets at the door?", a: "Volunteers open a secure scanner URL in their phone's web browser, grant camera access, and scan passes in under 0.3 seconds." },
          { q: "Can I host free events on URPASS?", a: "Yes. You can host 2 events per month with up to 100 registrations per month completely free on our permanent free tier." },
        ],
        ctaTitle: "Streamline your event check-in with URPASS",
        ctaDescription: "Permanent free tier · Zero app downloads · Fast sub-second scanning",
      }}
    />
  );
}
