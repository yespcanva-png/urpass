import type { Metadata } from "next";
import { CheckCircle2, Zap, Ticket, Users, ScanLine, Palette, QrCode } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Startup Event Ticketing & Demo Day Check-In Software",
  description: "Host founder meetups, demo days, investor mixers, and pitch competitions. Collect founder details, sell tickets with zero commission, and scan guests in under 0.3s.",
  keywords: [
    "startup event ticketing and check in",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "attendee management",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/startup-events" },
  openGraph: {
    title: "Startup Event Ticketing & Demo Day Check-In Software | URPASS",
    description: "Host founder meetups, demo days, investor mixers, and pitch competitions. Collect founder details, sell tickets with zero commission, and scan guests in under 0.3s.",
    url: "https://urpass.space/startup-events",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "STARTUPS & DEMO DAYS",
        h1: "Startup Event Registration, Ticketing & Demo Day Entry",
        canonicalUrl: "https://urpass.space/startup-events",
        description: "Host founder meetups, demo days, investor mixers, and pitch competitions. Collect founder details, sell tickets with zero commission, and scan guests in under 0.3s.",
        ctaLabel: "Host startup events free",
        features: [
          { icon: Zap, title: "Founder & Investor Tiers", desc: "Categorize attendees into Founders, VCs/Angels, Mentors, and General Attendees with visual badges." },
          { icon: Ticket, title: "Zero Ticket Commission", desc: "Sell paid startup summit tickets via Razorpay (UPI, cards) without paying 5% to 10% platform cuts." },
          { icon: Users, title: "Pitch Deck & Application Forms", desc: "Collect startup stage, pitch deck links, and LinkedIn profiles directly on your registration form." },
          { icon: ScanLine, title: "Sub-Second VIP Check-In", desc: "Welcome angel investors and keynote speakers with instantaneous mobile door check-in." },
          { icon: Palette, title: "Custom Branded Passes", desc: "Design sleek, modern digital passes featuring your incubator, accelerator, or sponsor branding." },
          { icon: QrCode, title: "Post-Event Survey Integration", desc: "Automatically collect attendee feedback, pitch ratings, and investor interest after the event." },
        ],
        steps: [
          { n: "01", title: "Create Startup Event", desc: "Set event details, pitching stages, and founder seat capacities." },
          { n: "02", title: "Collect Applications", desc: "Founders and investors apply via clean, mobile-optimized forms." },
          { n: "03", title: "Curate Guest List", desc: "Approve investor and founder applications with one-click actions." },
          { n: "04", title: "Scan at Demo Hall", desc: "Greet guests and scan QR passes at the entrance in under 0.3s." },
          { n: "05", title: "Gather Feedback", desc: "Collect automated post-event reviews and ratings from attendees." },
        ],
        callout: {
          badge: "FOUNDER FRIENDLY",
          title: "Built for agile startup communities and tech hubs.",
          description: "Startup events move fast. URPASS gives accelerators, community organizers, and venture funds a modern, zero-commission registration and door check-in platform.",
          bullets: [
            "Zero per-ticket percentage cuts — keep 100% of ticket sales",
            "Native UPI payments via Razorpay (GPay, PhonePe, Paytm)",
            "Curated approval workflows for private investor mixers",
            "Permanent free tier for up to 100 registrations per month",
          ],
        },
        useCases: [
          "Accelerator Demo Days",
          "Angel Investor Pitch Mixers",
          "Tech Hackathons",
          "Founder Breakfasts & Meetups",
          "SaaS Community Summits",
          "Product Hunt Launch Parties",
        ],
        faqs: [
          { q: "Can we approve investor registrations manually while auto-approving general attendees?", a: "Yes. You can curate specific ticket tiers or review all registrations before passes are generated." },
          { q: "Does URPASS take a cut of our demo day ticket sales?", a: "No. URPASS charges zero per-ticket commissions; you keep 100% of your ticket revenue minus standard gateway fees." },
          { q: "Can attendees show their passes in Apple Wallet?", a: "Yes. Guests can add their digital pass to Apple Wallet or show it in any mobile web browser." },
          { q: "Can we collect post-event feedback from investors and founders?", a: "Yes. URPASS includes built-in post-event survey tools that invite checked-in guests to leave ratings and reviews." },
        ],
        ctaTitle: "Elevate your event entry with URPASS",
        ctaDescription: "Permanent free tier · Zero hardware setup · Fast sub-second scanning",
      }}
    />
  );
}
