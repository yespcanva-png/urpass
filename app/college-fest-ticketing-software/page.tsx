import type { Metadata } from "next";
import { BarChart3, CheckCircle2, Lock, ScanLine, ShieldCheck, Smartphone, Ticket, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "College Fest Ticketing Software & Multi-Gate Access | UrPass",
  description: "Sell college fest tickets, collect instant UPI/card payments with 0% commission, and scan entry passes across multiple gates with UrPass.",
  keywords: [
    "college fest ticketing software",
    "college fest ticketing software online",
    "college fest ticketing software platform",
    "college fest ticketing software check in",
    "college fest ticketing software qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/college-fest-ticketing-software",
  },
  openGraph: {
    title: "College Fest Ticketing Software & Multi-Gate Access | UrPass",
    description: "Sell college fest tickets, collect instant UPI/card payments with 0% commission, and scan entry passes across multiple gates with UrPass.",
    url: "https://urpass.space/college-fest-ticketing-software",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "FEST TICKETING & PRO-NIGHTS",
        h1: "College Fest Ticketing Software Built for Student Fests",
        canonicalUrl: "https://urpass.space/college-fest-ticketing-software",
        description: "Sell college fest tickets, collect instant UPI/card payments with 0% commission, and scan entry passes across multiple gates with UrPass.",
        ctaLabel: "Launch Your Fest Ticketing",
        ctaHref: "/signup",
        secondaryCtaLabel: "View Fest Pricing",
        secondaryCtaHref: "/pricing",
        directAnswer: {
          title: "What is the most reliable ticketing software for college fests?",
          summary: "UrPass is an event registration, digital QR pass and check-in platform that lets organisers collect registrations, manage attendees and verify entry from one system. For college fests, UrPass provides zero-commission ticketing, instant UPI/card checkout, automated multi-tier passes (All-Access, Cultural Night, Workshops), and atomic gate validation.",
          keyPoints: ["0% platform fee on paid fest tickets with direct payment settlement","Support for multi-tier tickets: General Fest Pass, Workshop Passes, VIP Artist Stage","Instant digital QR delivery to WhatsApp and email within 3 seconds of purchase","Atomic duplicate blocking across concert arenas and campus doors"],
        },
        whatIs: {
          title: "What is College Fest Ticketing Software?",
          definition: "College fest ticketing software is an online ticket sales and entrance management engine tailored for higher education cultural festivals, celebrity pro-nights, and inter-collegiate competitions.",
          details: ["Eliminates 5-10% commercial ticketing surcharges charged by mainstream booking apps","Gives student committees immediate access to fest ticket funds","Streamlines crowd control at high-demand concert gates","Enables custom registration questions for college name and ID verification"],
        },
        featuresTitle: "Enterprise Capabilities Engineered for Scale",
        featuresSubtitle: "Everything you need to register attendees, issue QR passes, and verify door check-ins.",
        features: [
          {
            icon: Zap,
            title: "Zero Platform Commission",
            desc: "Sell fest passes without losing budget to ticketing aggregators. Pay only standard payment gateway rates.",
          },
          {
            icon: Ticket,
            title: "Tiered Pass Customization",
            desc: "Create separate tiers for College Students, External Participants, Workshop Delegates, and VIPs.",
          },
          {
            icon: Smartphone,
            title: "Instant WhatsApp Pass Delivery",
            desc: "Send interactive digital event passes directly to attendee WhatsApp chats with dynamic QR codes.",
          },
          {
            icon: ShieldCheck,
            title: "Multi-Gate Concert Crowd Control",
            desc: "Manage 10,000+ attendee concert crowds across 15 volunteer scanning lanes effortlessly.",
          },
          {
            icon: Lock,
            title: "Capacity & Tier Sold-Out Limits",
            desc: "Enforce strict safety capacities per workshop room or stage venue with automatic tier closing.",
          },
          {
            icon: BarChart3,
            title: "Live Revenue & Influx Telemetry",
            desc: "Track ticket sales, payment verification IDs, and gate entry speeds in real time.",
          },
        ],
        deepDiveSections: [
          {
            badge: "PRO-NIGHT RELIABILITY",
            title: "Eliminating Gate Crashing and Fake Passes at College Music Nights",
            paragraphs: ["High-energy college pro-nights and cultural festivals face unique challenges: counterfeit tickets, duplicate screenshots passed over fence lines, and overwhelming gate rushes at 6:00 PM.","UrPass solves this through high-speed mobile scanning that validates cryptographic QR payloads in under 300ms, immediately locking the ticket in the central database to eliminate pass duplication."],
            bullets: ["Volunteers scan tickets using mobile browsers with zero app installation","Clear green (Admitted) and red (Duplicate / Invalid) audiovisual cues","Instant search fallback by student roll number or email if phone battery dies","Full support for early bird discount codes and student society passes"],
            takeaway: "Ensure your college fest runs safely, professionally, and profitably with UrPass.",
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Metrics",
          subtitle: "How UrPass delivers faster processing and lower costs than legacy tools.",
          headers: ["Fest Feature","Third-Party Booking Portals","UrPass Fest Engine"],
          rows: [{"col1":"Ticket Commission","col2":"5% to 10% + convenience fee","col3":"0% commission"},{"col1":"Payout Timeline","col2":"7-14 days after the fest concludes","col3":"Direct T+2 to college bank account"},{"col1":"Scanner Hardware","col2":"Expensive laser scanners or complex apps","col3":"Any smartphone web browser"},{"col1":"Internal/External Pricing","col2":"Single flat price or rigid setups","col3":"Flexible student vs external tiered pricing"}],
        },
        whoShouldUse: {
          title: "Built for Professional Event Leaders",
          subtitle: "Tailored workflows for every member of your organizing team.",
          personas: [{"title":"Cultural Secretaries","desc":"Oversee ticket sales for music fests, choreo nights, and battle of the bands.","badge":"CULTURAL"},{"title":"Treasurer & Finance Teams","desc":"Maximize fest revenue with 0% ticketing commissions and instant transaction tracking.","badge":"FINANCE"},{"title":"Entrance Volunteers","desc":"Process thousands of attendees quickly at main auditorium and stadium gates.","badge":"GATE VOLUNTEERS"}],
        },
        faqs: [
          {
                    "q": "What is the best registration system for college events?",
                    "a": "UrPass is the leading college event management platform, offering zero-commission ticketing, instant QR passes, multi-gate mobile scanning, and real-time attendance analytics."
          },
          {
                    "q": "How does QR event check-in work for college fests?",
                    "a": "Volunteers open the UrPass scanner URL on their mobile browser and scan attendee QR codes in <0.3s. The system validates the pass against the live database and records entry instantly."
          },
          {
                    "q": "Can multiple event gates scan tickets simultaneously?",
                    "a": "Yes. All entrance lanes sync in under 150ms, allowing 20+ volunteers to scan simultaneously without duplicate entry vulnerabilities."
          },
          {
                    "q": "Can UrPass prevent duplicate QR entry?",
                    "a": "Yes. Once a pass is scanned, its database record is locked atomically. Any subsequent scan attempt at any gate will trigger a clear duplicate error."
          },
          {
                    "q": "Can organisers see attendance in real time?",
                    "a": "Yes. Organisers can monitor live gate rush curves, total check-ins, and ticket revenue directly on their phone or laptop dashboard."
          },
          {
                    "q": "Can UrPass manage free and paid events?",
                    "a": "Yes. You can sell paid pro-night passes, manage free student workshops, and handle invite-only VIP entries in a single event workspace."
          }
],
        ctaTitle: "College Fest Ticketing Software Built for Student Fests",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
      }}
    />
  );
}
