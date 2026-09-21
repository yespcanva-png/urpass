import type { Metadata } from "next";
import { CheckCircle2, Presentation, Palette, QrCode, ScanLine, Users, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Exhibition Badge Generator & Visitor Entry Management",
  description: "Streamline visitor pre-registration, generate printable and digital QR badges, manage multi-hall access, and track booth visitor flow for expos and trade fairs.",
  keywords: [
    "exhibition badge and entry management",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "attendee management",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/exhibitions" },
  openGraph: {
    title: "Exhibition Badge Generator & Visitor Entry Management | URPASS",
    description: "Streamline visitor pre-registration, generate printable and digital QR badges, manage multi-hall access, and track booth visitor flow for expos and trade fairs.",
    url: "https://urpass.space/exhibitions",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "EXHIBITIONS & EXPOS",
        h1: "Exhibition Badge & Visitor Entry Management Software",
        canonicalUrl: "https://urpass.space/exhibitions",
        description: "Streamline visitor pre-registration, generate printable and digital QR badges, manage multi-hall access, and track booth visitor flow for expos and trade fairs.",
        ctaLabel: "Manage exhibition visitors free",
        features: [
          { icon: Presentation, title: "Visitor Pre-Registration", desc: "Collect business credentials, industry sectors, company names, and designations via clean online forms." },
          { icon: Palette, title: "Digital & Printed Badges", desc: "Generate mobile passes for phone screens or formatted printable PDF badges for standard lanyard sleeves." },
          { icon: QrCode, title: "Exhibitor vs Buyer Tiers", desc: "Configure differentiated access levels for Exhibitors, Trade Buyers, VIPs, Media, and General Visitors." },
          { icon: ScanLine, title: "Sub-Second Hall Check-In", desc: "Volunteers scan visitor badges in under 0.3s at exhibition hall turnstiles and registration desks." },
          { icon: Users, title: "Multi-Day Re-Entry Access", desc: "Support multi-day expo passes that remain valid throughout the full duration of your trade show." },
          { icon: BarChart3, title: "Lead & Attendance Analytics", desc: "Export comprehensive visitor lists with company names, designations, and entrance timestamps." },
        ],
        steps: [
          { n: "01", title: "Setup Exhibition", desc: "Define trade show dates, venue halls, and visitor categories." },
          { n: "02", title: "Collect Pre-Registrations", desc: "Visitors submit professional details via public registration link." },
          { n: "03", title: "Generate Expo Badges", desc: "Automate creation of QR badges with attendee name and company." },
          { n: "04", title: "Scan at Hall Gates", desc: "Desk staff scan badges for instant sub-second entrance validation." },
          { n: "05", title: "Export Visitor Data", desc: "Download verified B2B visitor databases for post-show reporting." },
        ],
        callout: {
          badge: "B2B VISITOR FLOW",
          title: "Ditch manual visitor logbooks and long desk queues.",
          description: "Trade expos lose valuable buyer attention when registration desks back up. URPASS pre-registers visitors and verifies credentials at the door in seconds.",
          bullets: [
            "Custom business visitor registration forms",
            "Instant printable lanyard badges and mobile passes",
            "Multi-counter check-in synchronization across halls",
            "Export full B2B visitor directories for exhibitors",
          ],
        },
        useCases: [
          "Industrial Manufacturing Expos",
          "Art & Design Exhibitions",
          "Tech Product Showcases",
          "Education & Career Fairs",
          "Jewelry & Lifestyle Expos",
          "Automobile Trade Shows",
        ],
        faqs: [
          { q: "Can visitors print their badge before arriving at the expo?", a: "Yes. Attendees can download a formatted PDF badge to print at home or present on their mobile screen." },
          { q: "Can we capture visitor company names on the badge?", a: "Yes. The badge designer displays attendee name, company, and designation prominently." },
          { q: "Can we run multi-day passes for 3-day trade shows?", a: "Yes. You can configure passes to allow authorized re-entry across all days of the exhibition." },
          { q: "Can exhibitors scan visitor badges for lead generation?", a: "Visitors have verifiable QR passes that can be validated at booth entrances and seminar tracks." },
        ],
        ctaTitle: "Elevate your event entry with URPASS",
        ctaDescription: "Permanent free tier · Zero hardware setup · Fast sub-second scanning",
      }}
    />
  );
}
