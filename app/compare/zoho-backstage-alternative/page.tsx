import type { Metadata } from "next";
import { Zap, QrCode, CreditCard, Users, BarChart3, Gift } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Zoho Backstage Alternative for Simple Events | URPASS",
  description: "Looking for a simpler Zoho Backstage alternative? URPASS is lightweight event registration with digital QR passes, Razorpay, and a free plan. No complex configuration.",
  alternates: { canonical: "https://urpass.space/compare/zoho-backstage-alternative" },
  openGraph: {
    title: "Zoho Backstage Alternative for Simple Events | URPASS",
    description: "URPASS — a simpler alternative to Zoho Backstage for events that don't need enterprise complexity.",
    url: "https://urpass.space/compare/zoho-backstage-alternative",
  },
};

export default function ZohoBackstageAlternativePage() {
  return (
    <SEOPage
      config={{
        badge: "ZOHO BACKSTAGE ALTERNATIVE",
        h1: "A Simpler Alternative to Zoho Backstage",
        description: "URPASS is purpose-built for fast, simple event registration with QR check-in. If your event doesn't need a full conference management suite, URPASS gets you running in minutes.",
        ctaLabel: "Try URPASS free",
        features: [
          { icon: Zap, title: "5-minute setup", desc: "Create an event and start collecting registrations in 5 minutes. No training, no onboarding, no sales call." },
          { icon: Gift, title: "Free plan", desc: "Permanent free plan for 1 event and 50 attendees. No credit card, no trial expiry." },
          { icon: QrCode, title: "QR check-in included", desc: "Every plan includes digital QR passes and phone-based check-in scanning. No add-on required." },
          { icon: CreditCard, title: "Razorpay payments", desc: "Accept INR payments via UPI, cards, and net banking with Razorpay — no complex payment setup." },
          { icon: Users, title: "Simple attendee management", desc: "Registration, approval, pass issuance, and check-in tracking from one clean dashboard." },
          { icon: BarChart3, title: "Real-time check-in dashboard", desc: "See live attendance and export data on paid plans. No extra analytics module needed." },
        ],
        callout: {
          badge: "SIMPLE BY DESIGN",
          title: "For events that need registration + QR check-in, not a full suite.",
          description: "Zoho Backstage is built for large enterprise conferences with speakers, sessions, agendas, and exhibitors. URPASS is built for teams that need registration, passes, and check-in — nothing more.",
          bullets: [
            "No complex conference configuration",
            "Works for any event size",
            "Free forever plan available",
            "Operational in under 10 minutes",
          ],
        },
        useCases: [
          "Small corporate events", "College workshops", "Team events", "Community events",
          "Hackathons", "Seminars", "Paid workshops", "Tech meetups",
        ],
        faqs: [
          { q: "When should I use URPASS instead of Zoho Backstage?", a: "Use URPASS if you need simple event registration, digital QR passes, and check-in scanning — without the complexity of managing speakers, sessions, agendas, and exhibitors. URPASS is faster to set up and free to start." },
          { q: "Is URPASS free to use?", a: "Yes. URPASS has a permanent free plan for 1 event with up to 50 attendees. No credit card required." },
          { q: "Can URPASS handle paid events with Razorpay?", a: "Yes. Starter and Pro plans support paid ticketing with Razorpay integration for UPI, cards, and net banking." },
          { q: "Does URPASS have QR check-in?", a: "Yes. All URPASS plans include QR-based check-in scanning. No additional module or cost." },
          { q: "Is URPASS suitable for corporate events?", a: "Yes. The Pro plan includes custom branding (company name, logo, colour on passes) and team management with role-based access." },
          { q: "What is the main difference between URPASS and Zoho Backstage?", a: "Zoho Backstage is a full conference management platform with speakers, sessions, and complex configurations. URPASS focuses on registration → QR pass → check-in — done simply and quickly." },
        ],
        ctaTitle: "Try URPASS — simple event registration & check-in",
        ctaDescription: "Free plan · 5-minute setup · QR passes included · No complexity",
      }}
    />
  );
}
