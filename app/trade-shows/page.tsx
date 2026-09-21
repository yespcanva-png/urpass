import type { Metadata } from "next";
import { CheckCircle2, Building2, ScanLine, Users, ShieldCheck, Palette, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Trade Show Attendee Check-In & Badge Verification Software",
  description: "Accelerate trade show entrance check-in, issue digital delegate badges, manage multi-door exhibit halls, and track real-time B2B buyer attendance.",
  keywords: [
    "trade show attendee check in",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "attendee management",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/trade-shows" },
  openGraph: {
    title: "Trade Show Attendee Check-In & Badge Verification Software | URPASS",
    description: "Accelerate trade show entrance check-in, issue digital delegate badges, manage multi-door exhibit halls, and track real-time B2B buyer attendance.",
    url: "https://urpass.space/trade-shows",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "TRADE SHOWS",
        h1: "Trade Show Attendee Check-In & Access Control Software",
        canonicalUrl: "https://urpass.space/trade-shows",
        description: "Accelerate trade show entrance check-in, issue digital delegate badges, manage multi-door exhibit halls, and track real-time B2B buyer attendance.",
        ctaLabel: "Streamline trade show entry free",
        features: [
          { icon: Building2, title: "Rapid Delegate Verification", desc: "Verify trade delegates, buyers, and exhibitors in under 0.3s at registration desks to prevent morning foyer lines." },
          { icon: ScanLine, title: "B2B Credentials & Tiers", desc: "Issue branded badges with distinct tier tags for Exhibitors, Hosted Buyers, Press, and Speakers." },
          { icon: Users, title: "Multi-Counter Check-In Desks", desc: "Deploy dozens of scanning counters simultaneously with real-time central synchronization." },
          { icon: ShieldCheck, title: "Printable Lanyard Badges", desc: "Produce standardized printable badge PDFs or mobile QR passes for instant on-screen verification." },
          { icon: Palette, title: "Duplicate Entry Lockout", desc: "Prevent badge-swapping between non-registered visitors with cryptographic single-use verification." },
          { icon: BarChart3, title: "Comprehensive Buyer Analytics", desc: "Export full attendee records with company names, industry sectors, and check-in timestamps." },
        ],
        steps: [
          { n: "01", title: "Configure Trade Show", desc: "Set event dates, venue halls, and delegate registration quotas." },
          { n: "02", title: "Collect B2B Signups", desc: "Gather company details, GST/tax IDs, and buyer credentials." },
          { n: "03", title: "Deliver Trade Passes", desc: "Approved delegates receive digital QR badges with company branding." },
          { n: "04", title: "Scan at Foyer Doors", desc: "Desk staff verify passes in under 0.3s on mobile browser cameras." },
          { n: "05", title: "Monitor Hall Traffic", desc: "Watch live attendance graphs across show halls and breakout rooms." },
        ],
        callout: {
          badge: "TRADE EFFICIENCY",
          title: "Professional access control for commercial trade events.",
          description: "Trade shows bring high-value buyers and exhibitors together. URPASS ensures a prestigious, efficient entrance experience without paper rosters or hardware rentals.",
          bullets: [
            "Fast desk check-in without renting dedicated barcode guns",
            "Clear visual tier tags for VIP buyers, exhibitors, and media",
            "Instant duplicate badge detection across all hall entrances",
            "Audit-proof attendee logs ready for sponsor and board reporting",
          ],
        },
        useCases: [
          "Machinery & Industrial Expos",
          "Retail & FMCG Trade Conventions",
          "Pharma & Biotech Summits",
          "Real Estate & Property Expos",
          "Hospitality Trade Fairs",
          "Logistics & Supply Chain Meets",
        ],
        faqs: [
          { q: "Can we use our own staff phones for trade show check-in?", a: "Yes. Volunteers and staff open the scanner URL in their mobile browser, eliminating bulky hardware rentals." },
          { q: "Can we charge admission fees for trade show visitor passes?", a: "Yes. Sell paid passes via Razorpay (UPI, cards, net banking) with zero per-ticket commissions." },
          { q: "How do we handle multi-day trade shows?", a: "Passes can be verified multiple times across designated days while maintaining full entrance audit trails." },
          { q: "Can we export attendee lists for post-show marketing?", a: "Yes. Download complete delegate contact details and timestamps directly to CSV or Excel." },
        ],
        ctaTitle: "Elevate your event entry with URPASS",
        ctaDescription: "Permanent free tier · Zero hardware setup · Fast sub-second scanning",
      }}
    />
  );
}
