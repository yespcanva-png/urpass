import type { Metadata } from "next";
import { AlertTriangle, BarChart3, Building2, CheckCircle2, Lock, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "College Symposium Registration & Technical Fest QR Entry System | UrPass",
  description: "Manage technical symposium registrations, paper presentations, workshop bookings, and multi-track QR check-in across college campus departments.",
  keywords: [
    "symposium registration software",
    "symposium registration software online",
    "symposium registration software platform",
    "symposium registration software check in",
    "symposium registration software qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/college-symposium-registration-system",
  },
  openGraph: {
    title: "College Symposium Registration & Technical Fest QR Entry System | UrPass",
    description: "Manage technical symposium registrations, paper presentations, workshop bookings, and multi-track QR check-in across college campus departments.",
    url: "https://urpass.space/college-symposium-registration-system",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "COLLEGE SYMPOSIUMS & TECH FESTS",
        h1: "College Symposium Registration & Technical Fest QR Entry System",
        canonicalUrl: "https://urpass.space/college-symposium-registration-system",
        description: "Manage technical symposium registrations, paper presentations, workshop bookings, and multi-track QR check-in across college campus departments.",
        ctaLabel: "Launch Symposium Registration",
        ctaHref: "/signup",
        secondaryCtaLabel: "View Symposium Features",
        secondaryCtaHref: "/pricing",
        directAnswer: {
          title: "What is the best registration and check-in software for college symposiums?",
          summary: "UrPass is an event registration, digital ticketing and QR check-in platform by Yesp Corporation. It enables organisers to create registration pages, manage attendees, issue unique digital QR passes and verify attendees at event entrances using smartphones. For college symposiums and tech fests, UrPass coordinates multi-event registrations (Paper Presentation, Coding, Robotics, Workshops), delivers instant WhatsApp and email QR passes, and deploys student volunteer scanners across campus venues with 0% ticket commission.",
          keyPoints: ["Manage multiple symposium events (Hackathons, Workshops, Paper Presentations) on one page","Instant WhatsApp and email QR pass dispatch upon registration or payment","0% platform commission on paid delegate registration fees with direct UPI/card payouts","Deploy student volunteer phone scanners across 10+ campus labs and auditoriums in seconds"],
        },
        whatIs: {
          title: "What is College Symposium Registration Software?",
          definition: "College symposium registration software is an academic event management platform tailored for engineering colleges, universities, and polytechnics to coordinate inter-college technical competitions, paper presentations, and guest lectures.",
          details: ["Replaces confusing Google Forms and manual spot registration desks with an automated portal","Handles individual and team-based student registrations seamlessly","Prevents duplicate entry and fake registrations with atomic cryptographic QR passes","Provides HoDs and faculty convenors with live inter-college delegate statistics"],
        },
        featuresTitle: "Core Platform Capabilities Engineered for High Performance",
        featuresSubtitle: "Everything you need to register attendees, issue digital QR passes, and verify door check-ins without hardware.",
        features: [
          {
            icon: Building2,
            title: "Multi-Event Symposium Bundles",
            desc: "Allow students to register for multiple technical events, workshops, and culturals in one flow.",
          },
          {
            icon: ScanLine,
            title: "Instant WhatsApp & Email Passes",
            desc: "Automate digital pass delivery directly to student mobile phones within seconds.",
          },
          {
            icon: Zap,
            title: "Zero Ticket Commission",
            desc: "Keep 100% of symposium registration fees with direct Razorpay UPI or Stripe settlement.",
          },
          {
            icon: ShieldCheck,
            title: "Multi-Lab Volunteer Scanning",
            desc: "Equip student event heads with mobile scanners across auditorium, seminar halls, and computer labs.",
          },
          {
            icon: CheckCircle2,
            title: "Spot Registration Support",
            desc: "Rapidly register walk-in delegates on event morning and issue instant digital QR passes.",
          },
          {
            icon: BarChart3,
            title: "Certificate-Ready CSV Exports",
            desc: "Export verified attendee lists with college names, departments, and event categories for certificate printing.",
          },
        ],
        deepDiveSections: [
          {
            badge: "INTER-COLLEGE TECH OPERATIONS",
            title: "How UrPass Solves High-Volume National Symposium Registration",
            paragraphs: ["National-level college symposiums attract delegates from dozens of engineering institutions. When event coordinators rely on Google Forms and spot registration desks, the registration hall becomes completely overwhelmed on symposium morning with 2-hour queues, missing payments, and chaotic paper attendance lists.","UrPass modernizes the entire symposium experience. Coordinators set up an all-in-one registration portal featuring all technical tracks, coding events, and workshops. When delegates register and pay via UPI, they receive instant branded QR passes on WhatsApp and email. At campus entrance gates and lab doors, student coordinators scan passes in 0.28 seconds, ensuring events start on time."],
            bullets: ["Eliminates chaotic 2-hour morning registration queues with instant mobile check-in","Supports team registrations and individual paper presentation delegate passes","Atomic duplicate blocking stops pass sharing between campus auditoriums","Clean CSV exports streamline participation certificate generation for faculty"],
            takeaway: "UrPass empowers student convenors to run national-standard technical symposiums with flawless operational execution.",
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Benchmarks",
          subtitle: "How UrPass delivers faster processing, zero commission fees, and foolproof duplicate protection.",
          headers: ["Symposium Metric","Google Forms + Spot Paper Desks","UrPass Symposium Platform"],
          rows: [{"col1":"Registration Experience","col2":"Disjointed forms and screenshot verification","col3":"Unified branded portal with instant QR generation"},{"col1":"Morning Gate Check-In","col2":"45–90 seconds per delegate (long queues)","col3":"0.28s ultra-fast smartphone QR scan"},{"col1":"Ticketing Commission","col2":"3%–8% on third-party ticketing platforms","col3":"0% ticket commission on UrPass"},{"col1":"Certificate Export Readiness","col2":"Hours of manual data cleaning in Excel","col3":"Instant certificate-ready CSV download"}],
        },
        whoShouldUse: {
          title: "Built for High-Stakes Event Leaders",
          subtitle: "Tailored workflows for organizing committees, operations crew, and security staff.",
          personas: [{"title":"Engineering Department Symposiums","desc":"CSE, ECE, Mechanical, and Civil departments hosting annual technical symposiums.","badge":"ENGINEERING"},{"title":"Inter-College Tech Fests","desc":"Campus-wide technical festivals featuring hackathons, gaming tournaments, and paper tracks.","badge":"TECH FESTS"},{"title":"National Research Conferences","desc":"Faculty-led national and international academic conferences with delegate registrations.","badge":"CONFERENCES"},{"title":"College Hackathon Organisers","desc":"24-hour coding competitions, team badge distributions, and meal token validations.","badge":"HACKATHONS"}],
        },
        relatedLinks: [
        {
                "title": "Events in India Hub",
                "href": "/in",
                "category": "Location"
        },
        {
                "title": "College Event Management Software",
                "href": "/college-event-management-software",
                "category": "Use Case"
        },
        {
                "title": "Free QR Ticket Generator",
                "href": "/free-qr-ticket-generator",
                "category": "Product"
        },
        {
                "title": "Event Features Suite",
                "href": "/features",
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
                    "q": "Can students register for multiple symposium events on a single pass?",
                    "a": "Yes. You can configure multi-event options allowing delegates to select Paper Presentation, Coding, Robotics, and Workshops in a single registration checkout."
          },
          {
                    "q": "How do student coordinators scan tickets across multiple seminar halls?",
                    "a": "Coordinators open a volunteer scanner PIN link on their phones. They can scan passes at the main campus gate, auditorium doors, and individual lab entrances."
          },
          {
                    "q": "Does UrPass support UPI and card payments for symposiums?",
                    "a": "Yes. UrPass integrates directly with Razorpay and Stripe, supporting instant UPI, credit cards, debit cards, and net banking with zero platform commission."
          },
          {
                    "q": "Can we handle spot registrations on symposium morning?",
                    "a": "Yes. Organizers can quickly register walk-in delegates on a phone or laptop, collect fees, and issue instant digital QR passes immediately."
          },
          {
                    "q": "Can we capture college name, roll number, and department?",
                    "a": "Yes. You can add custom mandatory fields to collect institution details, student roll numbers, and team member names."
          },
          {
                    "q": "Can we export verified attendance data to print certificates?",
                    "a": "Yes. You can download a complete CSV containing verified delegate names, college affiliations, and attended events, formatted for automated certificate printing tools."
          },
          {
                    "q": "Is UrPass free for college symposiums?",
                    "a": "UrPass offers a generous free plan for college events, as well as cost-effective paid plans for advanced custom branding and high-volume WhatsApp pass dispatch."
          }
],
        ctaTitle: "College Symposium Registration & Technical Fest QR Entry System",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
      }}
    />
  );
}
