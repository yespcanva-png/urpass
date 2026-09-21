import type { Metadata } from "next";
import { CheckCircle2, Trophy, Ticket, ScanLine, Users, ShieldCheck, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Cultural Fest Ticketing, Artist Pass & High-Volume QR Entry",
  description: "Manage inter-college cultural fests, star night concerts, and student competitions. Handle massive crowd rushes with sub-second QR scanning across multiple gates.",
  keywords: [
    "cultural fest ticketing and entry",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "attendee management",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/cultural-fest" },
  openGraph: {
    title: "Cultural Fest Ticketing, Artist Pass & High-Volume QR Entry | URPASS",
    description: "Manage inter-college cultural fests, star night concerts, and student competitions. Handle massive crowd rushes with sub-second QR scanning across multiple gates.",
    url: "https://urpass.space/cultural-fest",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "CULTURAL FESTS",
        h1: "Cultural Fest Ticketing & High-Volume Gate Check-In",
        canonicalUrl: "https://urpass.space/cultural-fest",
        description: "Manage inter-college cultural fests, star night concerts, and student competitions. Handle massive crowd rushes with sub-second QR scanning across multiple gates.",
        ctaLabel: "Run your cultural fest free",
        features: [
          { icon: Trophy, title: "High-Volume Crowd Management", desc: "Built to move thousands of students through entrance turnstiles quickly with sub-0.3s QR pass verification." },
          { icon: Ticket, title: "Artist & VIP Passes", desc: "Configure distinct pass tiers for Star Night Artists, VIP Guests, Student Organizers, and General Attendees." },
          { icon: ScanLine, title: "Multi-Gate Cloud Sync", desc: "Scanners at Main Gate, Sports Ground, and Auditorium synchronize in real time to prevent cross-gate pass sharing." },
          { icon: Users, title: "Anti-Counterfeit Protection", desc: "Single-use cryptographic QR tokens eliminate photocopied tickets, forwarded screenshots, and fence-passing." },
          { icon: ShieldCheck, title: "Mobile Volunteer Scanners", desc: "Equip dozens of student council volunteers with PIN-protected browser scanners on their own phones." },
          { icon: BarChart3, title: "Live Headcount Dashboard", desc: "Monitor arena capacity, gate check-in velocity, and remaining arrivals live throughout the festival." },
        ],
        steps: [
          { n: "01", title: "Setup Cultural Fest", desc: "Set fest dates, arena capacity, competition rules, and ticket tiers." },
          { n: "02", title: "Launch Public Link", desc: "Distribute your fest registration URL across college student bodies." },
          { n: "03", title: "Issue Digital Passes", desc: "Students receive mobile passes with single-use scannable QR codes." },
          { n: "04", title: "Multi-Gate Scanning", desc: "Volunteers scan incoming crowds across multiple gate lanes simultaneously." },
          { n: "05", title: "Monitor Star Night", desc: "Watch live attendance tallies to ensure safe venue capacity control." },
        ],
        callout: {
          badge: "MASSIVE THROUGHPUT",
          title: "Zero gate chaos during your biggest college nights.",
          description: "When thousands of excited students arrive for star night concerts, entrance delays cause crushing crowds and security risks. URPASS processes passes in under 0.3s to keep lines moving smoothly.",
          bullets: [
            "Sub-0.3s scan speed moves thousands through gates quickly",
            "Immediate duplicate pass detection across all venue entrances",
            "Distinct access tiers for artists, faculty, VIPs, and students",
            "Zero per-ticket commissions on paid cultural fest tickets",
          ],
        },
        useCases: [
          "Annual Inter-College Culturals",
          "Star Night Celebrity Concerts",
          "Fashion Shows & Battle of the Bands",
          "Choreography & Dance Competitions",
          "Campus DJ Nights",
          "Inter-University Youth Fests",
        ],
        faqs: [
          { q: "Can URPASS handle a rush of 3,000+ students at the main gate?", a: "Yes. With 4 to 6 volunteer scanning lanes, URPASS easily processes thousands of attendees continuously without lag." },
          { q: "How do we prevent students from passing their QR code to friends outside?", a: "Each QR code is cryptographically single-use. Once scanned, any duplicate attempt triggers an immediate red alert." },
          { q: "Can we sell tickets for external students while keeping entry free for internal students?", a: "Yes. You can create free tiers for internal students and paid tiers via Razorpay for external colleges." },
          { q: "Can student coordinators scan tickets without accessing financial settings?", a: "Yes. Organizers share PIN-protected scanner links that restrict access strictly to entrance camera scanning." },
        ],
        ctaTitle: "Elevate your event entry with URPASS",
        ctaDescription: "Permanent free tier · Zero hardware setup · Fast sub-second scanning",
      }}
    />
  );
}
