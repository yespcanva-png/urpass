import type { Metadata } from "next";
import { AlertTriangle, BarChart3, Building2, CheckCircle2, Lock, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Software for Professional Organisers & Conference Directors | UrPass",
  description: "End-to-end event management platform for professional organisers. Coordinate registration, digital QR ticketing, smartphone check-in, and live analytics.",
  keywords: [
    "software for event organisers",
    "software for event organisers online",
    "software for event organisers platform",
    "software for event organisers check in",
    "software for event organisers qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/event-software-for-professional-organisers",
  },
  openGraph: {
    title: "Event Software for Professional Organisers & Conference Directors | UrPass",
    description: "End-to-end event management platform for professional organisers. Coordinate registration, digital QR ticketing, smartphone check-in, and live analytics.",
    url: "https://urpass.space/event-software-for-professional-organisers",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "PROFESSIONAL ORGANISER OS",
        h1: "Complete Event Registration & Check-In Software for Professional Organisers",
        canonicalUrl: "https://urpass.space/event-software-for-professional-organisers",
        description: "End-to-end event management platform for professional organisers. Coordinate registration, digital QR ticketing, smartphone check-in, and live analytics.",
        ctaLabel: "Launch Professional Event",
        ctaHref: "/signup",
        secondaryCtaLabel: "Compare PCO Features",
        secondaryCtaHref: "/pricing",
        directAnswer: {
          title: "What is the best all-in-one event software for professional organisers?",
          summary: "UrPass is an event registration, digital ticketing and QR check-in platform by Yesp Corporation. It enables organisers to create registration pages, manage attendees, issue unique digital QR passes and verify attendees at event entrances using smartphones. Professional organisers rely on UrPass for branded registration forms, zero-commission ticketing, sub-0.3s camera check-in, volunteer scanner coordination, and real-time attendance telemetry.",
          keyPoints: ["Unified platform covering registration forms, pass generation, door scanning, and analytics","0% platform commission on paid delegate tickets with direct merchant payouts","High-speed 0.28s mobile camera QR scanning eliminates registration desk bottlenecks","Comprehensive telemetry dashboard with live attendance metrics and CSV exports"],
        },
        whatIs: {
          title: "What is Event Software for Professional Organisers?",
          definition: "Event software for professional organisers (PCOs) is an all-in-one operational system that coordinates the complete event lifecycle—from initial registration and payment collection to on-site check-in and post-event reporting.",
          details: ["Replaces disconnected spreadsheets, form builders, and rental scanners with a single tool","Empowers organizing teams to deploy dozens of volunteer door scanners in seconds","Protects event revenue with atomic duplicate QR validation across multiple venue entrances","Delivers enterprise-level reliability without enterprise-level complexity or pricing"],
        },
        featuresTitle: "Core Platform Capabilities Engineered for High Performance",
        featuresSubtitle: "Everything you need to register attendees, issue digital QR passes, and verify door check-ins without hardware.",
        features: [
          {
            icon: Building2,
            title: "Complete Event Lifecycle",
            desc: "Build forms, sell tickets, distribute digital QR passes, and scan doors from a single dashboard.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Mobile Scanning",
            desc: "Turn any volunteer smartphone into an optical scanner without renting specialized equipment.",
          },
          {
            icon: Zap,
            title: "Zero Ticket Commission",
            desc: "Keep 100% of delegate registration revenue with direct Stripe or Razorpay integration.",
          },
          {
            icon: CheckCircle2,
            title: "Multi-Tier Access Control",
            desc: "Manage General, VIP, Speaker, and Exhibitor credentials with custom door routing.",
          },
          {
            icon: ShieldCheck,
            title: "Vetting & Approval Engine",
            desc: "Screen delegate applications and approve qualified attendees before releasing passes.",
          },
          {
            icon: BarChart3,
            title: "Real-Time Telemetry Console",
            desc: "Monitor live arrival curves, peak entrance velocity, and gate load distribution in real time.",
          },
        ],
        deepDiveSections: [
          {
            badge: "PCO OPERATIONAL EXCELLENCE",
            title: "Why Professional Organisers Choose UrPass Over Bloated Legacy Suites",
            paragraphs: ["Professional Congress Organisers (PCOs) are tired of legacy event management suites that require 6-week onboarding cycles, charge hefty annual contracts, and take 4% of every ticket sold. On the other extreme, lightweight form tools lack door scanning and duplicate prevention.","UrPass provides the sweet spot of professional power and instant usability. Organisers can configure a high-converting registration page in minutes, set up custom attendee fields and approval workflows, automate digital QR pass distribution, and manage on-site multi-door check-in at 45+ attendees per minute per scanner."],
            bullets: ["No complex training required—staff and volunteers start scanning in 30 seconds","Saves tens of thousands in platform commissions and equipment rentals","Atomic database locking ensures complete pass security across all doors","Full CSV and Excel export for academic and corporate compliance reporting"],
            takeaway: "UrPass gives professional organisers enterprise capabilities with modern simplicity and zero commission fees.",
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Benchmarks",
          subtitle: "How UrPass delivers faster processing, zero commission fees, and foolproof duplicate protection.",
          headers: ["Professional Requirement","Bloated Legacy Enterprise Suites","UrPass Professional Platform"],
          rows: [{"col1":"Setup & Onboarding Time","col2":"3–6 weeks of enterprise training","col3":"Under 5 minutes self-serve setup"},{"col1":"Ticketing Commission","col2":"3.5%–7.5% per ticket sold","col3":"0% ticket commission"},{"col1":"On-Site Scanner Setup","col2":"Rented hardware terminals ($300+/unit)","col3":"$0 (staff smartphones via browser PIN)"},{"col1":"Door Check-In Velocity","col2":"15–30s per attendee","col3":"0.28s ultra-fast optical camera scan"}],
        },
        whoShouldUse: {
          title: "Built for High-Stakes Event Leaders",
          subtitle: "Tailored workflows for organizing committees, operations crew, and security staff.",
          personas: [{"title":"Professional Congress Organisers (PCOs)","desc":"Manage multi-day scientific conferences, medical symposiums, and delegate badges.","badge":"PCO"},{"title":"Corporate Event Directors","desc":"Execute annual general meetings, customer summits, and global partner events.","badge":"CORPORATE"},{"title":"Trade Show & Expo Producers","desc":"Manage exhibitor passes, buyer registrations, and multi-hall access control.","badge":"EXPOS"},{"title":"Festival & Cultural Directors","desc":"Coordinate multi-stage wristband redemption and rapid venue ingress.","badge":"FESTIVALS"}],
        },
        relatedLinks: [
        {
                "title": "QR Code Check-In System",
                "href": "/qr-code-check-in-system",
                "category": "Product"
        },
        {
                "title": "Multi-Gate Event Check-In",
                "href": "/multiple-gate-event-check-in",
                "category": "Product"
        },
        {
                "title": "Zero Commission Event Ticketing",
                "href": "/zero-commission-event-ticketing",
                "category": "Product"
        },
        {
                "title": "Event Pricing & Free Plan",
                "href": "/pricing",
                "category": "Product"
        },
        {
                "title": "URPASS Sitelinks Directory",
                "href": "/sitelinks",
                "category": "Guide"
        }
],
        faqs: [
          {
                    "q": "What makes UrPass ideal for professional event organisers?",
                    "a": "UrPass combines enterprise-grade power—like multi-gate synchronization, sub-0.3s camera check-in, custom approval workflows, and zero ticket commission—with extreme simplicity and instant setup."
          },
          {
                    "q": "Can we manage multiple events simultaneously?",
                    "a": "Yes. Organisers can create and manage unlimited concurrent events across different venues, dates, and client accounts."
          },
          {
                    "q": "Does UrPass charge commission on paid conference registrations?",
                    "a": "No. UrPass charges 0% commission on ticket sales, connecting directly to your Stripe or Razorpay accounts for instant payouts."
          },
          {
                    "q": "How do we coordinate volunteer scanning staff at large venues?",
                    "a": "You can generate secure volunteer scanner PIN links. Volunteers open the link on their phone browser, enter the PIN, and start scanning immediately without accounts or downloads."
          },
          {
                    "q": "Can we restrict access to specific sessions or VIP rooms?",
                    "a": "Yes. You can assign gate rules in the dashboard so that specific scanner stations only validate VIP, Speaker, or workshop-specific ticket tiers."
          },
          {
                    "q": "Can we export attendance data for accreditation or compliance?",
                    "a": "Yes. You can export complete attendance records—including exact check-in timestamps, gate names, and custom field responses—as CSV or Excel files."
          },
          {
                    "q": "Is UrPass suitable for both free and paid professional events?",
                    "a": "Yes. UrPass seamlessly handles free community events, tiered paid tickets, and vetted invitation-only application workflows."
          }
],
        ctaTitle: "Complete Event Registration & Check-In Software for Professional Organisers",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
      }}
    />
  );
}
