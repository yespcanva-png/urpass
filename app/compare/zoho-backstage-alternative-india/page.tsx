import type { Metadata } from "next";
import { CheckCircle2, Zap, Ticket, ScanLine, Users, ShieldCheck, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Zoho Backstage Alternative for Fast & Agile Events",
  description: "A lightweight, modern alternative to Zoho Backstage. 5-minute setup without enterprise complexity or steep learning curves, engineered for colleges, hackathons, and agile organizers.",
  keywords: [
    "zoho backstage alternative india",
    "event ticketing alternative",
    "event registration software",
    "QR event check-in",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/compare/zoho-backstage-alternative-india" },
  openGraph: {
    title: "Zoho Backstage Alternative for Fast & Agile Events | URPASS",
    description: "A lightweight, modern alternative to Zoho Backstage. 5-minute setup without enterprise complexity or steep learning curves, engineered for colleges, hackathons, and agile organizers.",
    url: "https://urpass.space/compare/zoho-backstage-alternative-india",
    locale: "en_IN",
    type: "article",
  },
};

export default function ComparisonPage() {
  return (
    <SEOPage
      config={{
        badge: "AGILE ALTERNATIVE",
        h1: "Zoho Backstage Alternative for Fast, Frictionless Events",
        canonicalUrl: "https://urpass.space/compare/zoho-backstage-alternative-india",
        description: "A lightweight, modern alternative to Zoho Backstage. 5-minute setup without enterprise complexity or steep learning curves, engineered for colleges, hackathons, and agile organizers.",
        ctaLabel: "Try agile alternative free",
        features: [
          { icon: Zap, title: "5-Minute Quick Setup", desc: "Launch an event registration page and ticketing flow in under 5 minutes without navigating enterprise software menus." },
          { icon: Ticket, title: "Zero App Downloads", desc: "Attendees view responsive digital passes in mobile web browsers or Apple Wallet without downloading dedicated attendee apps." },
          { icon: ScanLine, title: "Sub-Second Mobile Scanning", desc: "Volunteer door staff scan passes in under 0.3s using phone cameras with instant valid/duplicate checks." },
          { icon: Users, title: "Built for Colleges & Startups", desc: "Tailored for dynamic college fests, student symposiums, hackathons, and workshops with flexible approval queues." },
          { icon: ShieldCheck, title: "Permanent Free Tier", desc: "Host 2 events per month with up to 100 registrations per month for ₹0 forever with no credit card required." },
          { icon: BarChart3, title: "Native Razorpay Integration", desc: "Collect ticket payments in INR via UPI, credit/debit cards, and net banking with direct bank settlements." },
        ],
        steps: [
          { n: "01", title: "Create Event", desc: "Set up your event title, venue, and ticketing tiers in 3 minutes." },
          { n: "02", title: "Publish Link", desc: "Share your clean, fast-loading public registration page." },
          { n: "03", title: "Auto-Deliver Passes", desc: "Attendees receive unique digital QR passes upon registration." },
          { n: "04", title: "Scan at Doors", desc: "Volunteers scan passes with phone browsers in under 0.3 seconds." },
          { n: "05", title: "Review Headcount", desc: "Track real-time attendance and export clean CSV logs." },
        ],
        callout: {
          badge: "SIMPLICITY FIRST",
          title: "All the power you need, none of the enterprise bloat.",
          description: "Zoho Backstage is built for massive enterprise exhibitions and requires days of training. URPASS focuses on what event organizers actually need: fast registration forms, beautiful passes, and instant gate check-in.",
          bullets: [
            "No complex training or enterprise onboarding required",
            "Browser-based mobile door scanner deployed in seconds",
            "Instant duplicate entry lockout across all venue doors",
            "Affordable flat monthly pricing with 30-day free trial",
          ],
        },
        useCases: [
          "College Fests & Culturals",
          "Department Technical Symposiums",
          "24h Hackathons",
          "Startup Founder Meetups",
          "Hands-on Masterclasses",
          "Community Seminars",
        ],
        faqs: [
          { q: "Is URPASS easier to set up than Zoho Backstage?", a: "Yes. URPASS can be configured and live in under 5 minutes without complex ticketing workflows or mandatory app downloads." },
          { q: "Do volunteers need an account to scan passes at the door?", a: "No. Organizers share a PIN-protected scanner link so volunteers can scan using their own phone browser." },
          { q: "Can we collect custom attendee questions like student roll numbers?", a: "Yes. You can add custom questions, text fields, and dropdowns to your registration form." },
          { q: "Can I try URPASS for free before committing?", a: "Yes. We offer a permanent free plan as well as a 30-day free trial on all paid subscription plans." },
        ],
        ctaTitle: "Experience the URPASS difference today",
        ctaDescription: "Permanent free tier · Zero ticket commission · Sub-second door check-in",
      }}
    />
  );
}
