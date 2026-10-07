import type { Metadata } from "next";
import { AlertTriangle, BarChart3, Building2, CheckCircle2, Lock, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Software for Agencies & Production Houses | UrPass",
  description: "Deliver white-label registration pages, rapid mobile QR check-in, and professional client analytics across multiple client campaigns with UrPass.",
  keywords: [
    "event registration software for agencies",
    "event registration software for agencies online",
    "event registration software for agencies platform",
    "event registration software for agencies check in",
    "event registration software for agencies qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/event-registration-for-event-agencies",
  },
  openGraph: {
    title: "Event Registration Software for Agencies & Production Houses | UrPass",
    description: "Deliver white-label registration pages, rapid mobile QR check-in, and professional client analytics across multiple client campaigns with UrPass.",
    url: "https://urpass.space/event-registration-for-event-agencies",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "AGENCY & PRODUCTION EDITION",
        h1: "Event Registration & QR Check-In Software Built for Event Agencies",
        canonicalUrl: "https://urpass.space/event-registration-for-event-agencies",
        description: "Deliver white-label registration pages, rapid mobile QR check-in, and professional client analytics across multiple client campaigns with UrPass.",
        ctaLabel: "Launch Agency Portal",
        ctaHref: "/signup",
        secondaryCtaLabel: "Schedule Agency Demo",
        secondaryCtaHref: "/contact",
        directAnswer: {
          title: "What is the best event registration software for event agencies?",
          summary: "UrPass is an event registration, digital ticketing and QR check-in platform by Yesp Corporation. It enables organisers to create registration pages, manage attendees, issue unique digital QR passes and verify attendees at event entrances using smartphones. For agencies and production houses, UrPass provides multi-event client workspaces, custom branding, sub-0.3s mobile QR scanning, and exportable analytics reports to impress enterprise clients.",
          keyPoints: ["Manage multiple client events concurrently under a unified master organization","Deliver fully branded registration experiences and customized digital QR passes","Deploy volunteer scanner crews instantly without expensive barcode hardware rentals","Provide clients with real-time check-in telemetry and professional post-event reports"],
        },
        whatIs: {
          title: "What is Event Registration Software for Agencies?",
          definition: "Event registration software for agencies is a multi-tenant event management platform that allows marketing agencies, PR firms, and production houses to manage registration, guest lists, and entrance scanning for dozens of corporate clients efficiently.",
          details: ["Supports multi-client brand segregation with tailored logos, colors, and email passes","Eliminates expensive handheld scanner hardware rentals ($500+ per event saved)","Guarantees fast entrance throughput (35+ scans/min/phone) for high-profile client launches","Generates executive-ready PDF/CSV attendance analytics for client debriefs"],
        },
        featuresTitle: "Core Platform Capabilities Engineered for High Performance",
        featuresSubtitle: "Everything you need to register attendees, issue digital QR passes, and verify door check-ins without hardware.",
        features: [
          {
            icon: Building2,
            title: "Multi-Client Event Management",
            desc: "Create and manage dozens of client events independently from one master account.",
          },
          {
            icon: Users,
            title: "Custom Brand Styling",
            desc: "Customize registration forms, pass colors, and confirmation emails to match client brand guidelines.",
          },
          {
            icon: ScanLine,
            title: "Zero Hardware Rental Costs",
            desc: "Equip on-site agency staff with mobile phone scanners using simple, secure PIN codes.",
          },
          {
            icon: Zap,
            title: "Zero Ticket Commission",
            desc: "Pass 100% of ticket revenue directly to client payment accounts with zero percentage cut.",
          },
          {
            icon: BarChart3,
            title: "Real-Time Client Dashboard",
            desc: "Give clients read-only or live dashboard access to watch attendee arrivals in real time.",
          },
          {
            icon: ShieldCheck,
            title: "VIP & Press Vetting Engine",
            desc: "Approve executive guest lists and media delegates individually before issuing access badges.",
          },
        ],
        deepDiveSections: [
          {
            badge: "AGENCY ROI & WORKFLOW",
            title: "How UrPass Elevates Event Agency Operations and Profit Margins",
            paragraphs: ["Event production agencies often struggle with fragmented tools—using one tool for client RSVPs, another for badge emails, and renting clunky barcode scanners for on-site execution. This leads to high rental overheads, data silos, and stressful check-in queues at high-profile client launches.","UrPass consolidates the agency stack into a single high-performance platform. Agencies can spin up a client registration page in under 5 minutes, automate branded digital pass delivery, and deploy 10 on-site staff scanners on their own smartphones with zero equipment rental costs. Post-event, agencies deliver spotless attendance reports to clients."],
            bullets: ["Saves agencies thousands per year in dedicated scanner rental fees","Delivers 0.28-second optical scanning that impresses demanding corporate clients","Atomic duplicate blocking ensures strict exclusivity for VIP and influencer events","Clean CSV exports streamline post-event CRM updates and client reporting"],
            takeaway: "UrPass gives event agencies the speed, reliability, and professional polish needed to retain enterprise clients.",
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Benchmarks",
          subtitle: "How UrPass delivers faster processing, zero commission fees, and foolproof duplicate protection.",
          headers: ["Agency Operational Capability","Traditional Fragmented Setup","UrPass Agency Platform"],
          rows: [{"col1":"Scanner Hardware Cost","col2":"$300–$800 per event in rentals","col3":"$0 (staff smartphones via browser PIN)"},{"col1":"Check-In Speed at VIP Door","col2":"15–30 seconds (manual search)","col3":"0.28s ultra-fast optical camera scan"},{"col1":"Ticketing Commission","col2":"3.5% + $1.50 per ticket","col3":"0% ticket commission (direct client payout)"},{"col1":"Multi-Client Event Setup","col2":"Disjointed tools and separate logins","col3":"Unified multi-event management console"}],
        },
        whoShouldUse: {
          title: "Built for High-Stakes Event Leaders",
          subtitle: "Tailored workflows for organizing committees, operations crew, and security staff.",
          personas: [{"title":"Experiential Marketing Agencies","desc":"Run brand activations, pop-ups, and influencer launches with bespoke branding.","badge":"MARKETING"},{"title":"Corporate PR & Event Firms","desc":"Host press conferences, annual shareholder meetings, and executive summits.","badge":"PR & COMMS"},{"title":"Live Event Production Companies","desc":"Manage door access control for award galas, fashion shows, and concerts.","badge":"PRODUCTION"},{"title":"B2B Exhibition Organisers","desc":"Deliver high-volume trade badge registration and scanner access across halls.","badge":"EXPOS"}],
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
                    "q": "Why should event agencies choose UrPass over generic ticketing tools?",
                    "a": "UrPass eliminates costly scanner rentals, charges 0% ticket commission, supports complete brand customization, provides sub-0.3s camera check-in, and lets agencies manage multiple client campaigns effortlessly."
          },
          {
                    "q": "Can we apply our client's branding to registration pages and passes?",
                    "a": "Yes. You can customize logos, hero graphics, brand color schemes, and email copy so the entire registration experience reflects your client's brand identity."
          },
          {
                    "q": "How do agency staff scan tickets at the client's venue?",
                    "a": "Staff simply open the UrPass scanner URL on their own smartphones and enter a secure PIN. There are no apps to install or hardware to configure."
          },
          {
                    "q": "Can we connect our client's payment gateway directly?",
                    "a": "Yes. UrPass supports direct connections to Stripe and Razorpay, allowing ticket revenue to settle directly into the client's bank account with 0% platform commission."
          },
          {
                    "q": "Can we provide our client with live attendance reports?",
                    "a": "Yes. You can share real-time dashboard views or export comprehensive CSV attendance reports immediately following the event."
          },
          {
                    "q": "How does UrPass handle VIP and media registrations for agency events?",
                    "a": "You can enable an approval workflow to review applicants before releasing passes, ensuring only vetted VIPs and media receive entry credentials."
          },
          {
                    "q": "Is there a limit on how many client events an agency can host?",
                    "a": "No. UrPass offers plans that allow agencies to host unlimited events and manage multiple client portfolios simultaneously."
          }
],
        ctaTitle: "Event Registration & QR Check-In Software Built for Event Agencies",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
      }}
    />
  );
}
