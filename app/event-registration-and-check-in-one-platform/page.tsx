import type { Metadata } from "next";
import { AlertTriangle, BarChart3, Building2, CheckCircle2, Lock, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration and Check-In on One Unified Platform | UrPass",
  description: "Ditch fragmented tools. Manage custom registration forms, digital QR pass delivery, smartphone door scanning, and real-time analytics in one place with UrPass.",
  keywords: [
    "registration and check in software",
    "registration and check in software online",
    "registration and check in software platform",
    "registration and check in software check in",
    "registration and check in software qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/event-registration-and-check-in-one-platform",
  },
  openGraph: {
    title: "Event Registration and Check-In on One Unified Platform | UrPass",
    description: "Ditch fragmented tools. Manage custom registration forms, digital QR pass delivery, smartphone door scanning, and real-time analytics in one place with UrPass.",
    url: "https://urpass.space/event-registration-and-check-in-one-platform",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "ALL-IN-ONE EVENT OS",
        h1: "Event Registration and QR Check-In on One Unified Platform",
        canonicalUrl: "https://urpass.space/event-registration-and-check-in-one-platform",
        description: "Ditch fragmented tools. Manage custom registration forms, digital QR pass delivery, smartphone door scanning, and real-time analytics in one place with UrPass.",
        ctaLabel: "Launch Unified Platform Free",
        ctaHref: "/signup",
        secondaryCtaLabel: "Explore Unified Suite",
        secondaryCtaHref: "/pricing",
        directAnswer: {
          title: "What is the best all-in-one event registration and check-in software?",
          summary: "UrPass is an event registration, digital ticketing and QR check-in platform by Yesp Corporation. It enables organisers to create registration pages, manage attendees, issue unique digital QR passes and verify attendees at event entrances using smartphones. By uniting registration forms, automated digital pass dispatch, 0.28s smartphone scanning, and live attendance telemetry in a single system, UrPass eliminates the need to duct-tape multiple tools together.",
          keyPoints: ["All-in-one platform: Custom forms, ticket sales, digital QR passes, mobile scanning, and analytics","Zero percentage commission on paid ticket sales with direct Stripe/Razorpay payouts","Sub-0.3s optical camera check-in deployed on staff smartphones without hardware rentals","Live operational telemetry dashboard tracking arrival velocity, gate load, and no-shows"],
        },
        whatIs: {
          title: "What is Unified Event Registration and Check-In Software?",
          definition: "Unified event registration and check-in software is an integrated operating system that manages the full attendee lifecycle from initial public sign-up and ticket payment to on-site entrance verification and post-event reporting.",
          details: ["Eliminates data silos between online form builders, email marketing tools, and door scanners","Guarantees that every registered attendee instantly receives a valid, single-use digital QR pass","Provides seamless real-time synchronization between registration databases and gate scanners","Reduces software subscription costs by replacing 3–4 disconnected event tools"],
        },
        featuresTitle: "Core Platform Capabilities Engineered for High Performance",
        featuresSubtitle: "Everything you need to register attendees, issue digital QR passes, and verify door check-ins without hardware.",
        features: [
          {
            icon: Users,
            title: "Custom Form Builder",
            desc: "Collect attendee details, custom questions, food preferences, and student IDs effortlessly.",
          },
          {
            icon: ScanLine,
            title: "Instant QR Pass Delivery",
            desc: "Automate digital pass delivery to attendee email and WhatsApp with Apple Wallet support.",
          },
          {
            icon: Zap,
            title: "Zero Ticket Commission",
            desc: "Keep 100% of ticket sales with direct merchant payouts via Stripe and Razorpay.",
          },
          {
            icon: ShieldCheck,
            title: "Sub-0.3s Mobile Camera Check-In",
            desc: "Turn staff smartphones into high-speed scanners using simple PIN links.",
          },
          {
            icon: Lock,
            title: "Atomic Duplicate Detection",
            desc: "Real-time database row locking prevents pass sharing and screenshot fraud across doors.",
          },
          {
            icon: BarChart3,
            title: "Real-Time Telemetry & Reports",
            desc: "Monitor live arrival curves, gate velocity, and export verified attendance records in one click.",
          },
        ],
        deepDiveSections: [
          {
            badge: "UNIFIED PLATFORM ADVANTAGE",
            title: "Why Duct-Taping 4 Separate Event Tools is Costing You Time and Money",
            paragraphs: ["Many event organizers try to piece together their stack: using Google Forms or Typeform for signups, Zapier to create spreadsheets, an email tool for confirmations, and a separate scanner app for door check-in. This fragmented setup is brittle—Zapier syncs fail, attendee names get misspelled, and tickets get lost in spam folders.","UrPass unites the entire event workflow into a single high-performance engine. When an attendee submits your branded registration page, their record is stored, their digital QR pass is generated and emailed, and their barcode is instantly valid on all active gate scanners. Everything works seamlessly without third-party plugins or integrations."],
            bullets: ["Saves hours of setup time and eliminates brittle third-party Zapier connections","Reduces event technology software subscription costs by up to 70%","Guarantees 100% data integrity from online signup to door check-in scan","Permanent free plan available for free events and community gatherings"],
            takeaway: "UrPass gives event organisers a modern, integrated event operating system that eliminates complexity and accelerates execution.",
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Benchmarks",
          subtitle: "How UrPass delivers faster processing, zero commission fees, and foolproof duplicate protection.",
          headers: ["Operational Capability","Fragmented Multi-Tool Setup","UrPass Unified Platform"],
          rows: [{"col1":"Tool Integration","col2":"3–4 separate tools (Form + Zapier + Email + Scanner)","col3":"100% native all-in-one platform"},{"col1":"Pass Delivery Reliability","col2":"Frequent sync drops and delays","col3":"Instant automated digital QR delivery"},{"col1":"Door Check-In Speed","col2":"15–45s per attendee","col3":"0.28s ultra-fast optical camera scan"},{"col1":"Software Subscription Cost","col2":"$100–$300/month across multiple SaaS tools","col3":"Free tier available / flat transparent pricing"}],
        },
        whoShouldUse: {
          title: "Built for High-Stakes Event Leaders",
          subtitle: "Tailored workflows for organizing committees, operations crew, and security staff.",
          personas: [{"title":"Conference Directors","desc":"Manage multi-track summits, speaker badges, and attendee check-in seamlessly.","badge":"CONFERENCES"},{"title":"Corporate Event Planners","desc":"Coordinate employee town halls, partner summits, and product launches.","badge":"CORPORATE"},{"title":"College Fest Coordinators","desc":"Run inter-college symposiums, culturals, and workshops from one console.","badge":"COLLEGE"},{"title":"Community & Meetup Leaders","desc":"Host monthly workshops, hackathons, and networking mixers with zero friction.","badge":"COMMUNITY"}],
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
                    "q": "What does an all-in-one event registration and check-in platform do?",
                    "a": "It combines registration landing pages, custom form builder, digital QR pass generation, automated email delivery, smartphone door scanning, and live attendance analytics into a single dashboard."
          },
          {
                    "q": "Do I need to connect Zapier or third-party tools to make UrPass work?",
                    "a": "No. UrPass is completely unified. Pass generation, email delivery, and scanner synchronization happen automatically within the platform."
          },
          {
                    "q": "Does UrPass charge commission on paid ticket sales?",
                    "a": "No. UrPass charges 0% commission on ticket sales, connecting directly to your Stripe or Razorpay account for direct payouts."
          },
          {
                    "q": "How do our staff scan tickets at the door?",
                    "a": "Staff simply open a volunteer scanner PIN link on their mobile phones and scan attendee QR passes using their camera in 0.28 seconds."
          },
          {
                    "q": "Can we collect custom attendee information during registration?",
                    "a": "Yes. You can add custom questions, dropdowns, food preferences, and required fields to your registration forms."
          },
          {
                    "q": "Can we export attendance reports after the event?",
                    "a": "Yes. You can download comprehensive attendance logs with attendee details and exact entry timestamps as CSV or Excel files."
          },
          {
                    "q": "Is there a free version of UrPass available?",
                    "a": "Yes. UrPass provides a permanent free plan with no credit card required, ideal for free events, student clubs, and community meetups."
          }
],
        ctaTitle: "Event Registration and QR Check-In on One Unified Platform",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
      }}
    />
  );
}
