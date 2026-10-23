import type { Metadata } from "next";
import { CreditCard, FileSpreadsheet, QrCode, ScanLine, ShieldCheck, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Whitefield Event Registration | UrPass",
  description: "Manage Whitefield corporate events with digital guest registration, QR visitor passes and live attendance tracking using UrPass.",
  keywords: ["corporate event registration whitefield","whitefield bangalore corporate ticketing","itpl conference registration","epip zone summit passes","whitefield town hall check-in"],
  alternates: {
    canonical: "https://urpass.space/whitefield-corporate-event-registration",
  },
  openGraph: {
    title: "Whitefield Event Registration | UrPass",
    description: "Manage Whitefield corporate events with digital guest registration, QR visitor passes and live attendance tracking using UrPass.",
    url: "https://urpass.space/whitefield-corporate-event-registration",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Whitefield Event Registration | UrPass",
    description: "Manage Whitefield corporate events with digital guest registration, QR visitor passes and live attendance tracking using UrPass.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function WhitefieldCorporateEventRegistrationPage() {
  return (
    <SEOPage
      config={{
        badge: "WHITEFIELD CORPORATE TICKETING",
        h1: "Corporate Event Registration & QR Check-In in Whitefield",
        canonicalUrl: "https://urpass.space/whitefield-corporate-event-registration",
        description: "Manage corporate event registrations, town halls, and summits in Whitefield, Bangalore. Fast QR badge check-in, Razorpay payments, and zero commission.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=whitefield-corporate-event-registration",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Streamline Whitefield Corporate Events",
        ctaDescription: "Host frictionless corporate town halls, enterprise summits, and partner offsites in Whitefield with digital QR passes and zero commission.",
        directAnswer: {
        "title": "What is Corporate Event Registration for Whitefield?",
        "summary": "Corporate event registration in Whitefield enables IT enterprises, GCCs, and tech campuses across ITPL and the EPIP zone to register employees, leadership, and external delegates. UrPass provides branded forms, automated corporate GST invoices, Apple Wallet passes, and sub-0.3s smartphone camera check-in with 0% ticketing commission.",
        "keyPoints": [
                "Tailored for Whitefield tech parks: ITPL, EPIP Zone, Sigma Tech Park, and luxury conference ballrooms",
                "Direct Razorpay integration for paid summits with corporate cards, net banking, and UPI",
                "Automated GST tax receipts with company name and GSTIN for corporate expense reimbursement",
                "Sub-0.3s camera check-in on volunteer smartphones—zero hardware scanners to rent"
        ]
},
        whatIs: {
        "title": "Why Whitefield Enterprises Host Events on UrPass",
        "definition": "Whitefield houses major global tech headquarters, GCCs, and industrial research hubs. UrPass delivers a modern digital registration engine built to replace slow registration desks and high-commission ticketing brokers.",
        "details": [
                "Zero ticketing commissions—run delegate ticketing with a flat, predictable subscription",
                "Multi-gate credentialing separating employee access from executive and speaker badge tiers",
                "Enterprise-ready privacy: attendee data remains strictly yours and is never marketed to",
                "One-click roster export to CSV with scan timestamps for internal HR and facility compliance"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Legacy Event Software in Whitefield",
        "subtitle": "Why Whitefield corporate organizers choose UrPass over traditional portals.",
        "headers": [
                "Operational Feature",
                "Traditional Portals / Rental Desks",
                "UrPass Whitefield Solution"
        ],
        "rows": [
                {
                        "col1": "Platform Ticketing Fee",
                        "col2": "5% to 8% deduction per paid delegate pass",
                        "col3": "0% ticket commission; plans from ₹499/month"
                },
                {
                        "col1": "Morning Check-In Speed",
                        "col2": "Printed paper rosters and slow name cross-checks",
                        "col3": "Sub-0.3s phone camera QR scanning"
                },
                {
                        "col1": "Corporate Invoicing",
                        "col2": "Manual tax receipts sent days later",
                        "col3": "Automated GST invoices generated upon payment"
                },
                {
                        "col1": "Pass Distribution",
                        "col2": "Printed plastic badges prone to printing delays",
                        "col3": "Instant WhatsApp & Apple Wallet digital passes"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "CAMPUS SCALE",
                "title": "Built for High-Density ITPL & EPIP Zone Corporate Gatherings",
                "paragraphs": [
                        "Organizing enterprise conferences in Whitefield often means handling hundreds of engineers, managers, and external partners arriving simultaneously during morning peak transit windows.",
                        "UrPass provides high-speed camera validation that processes attendees in under 300 milliseconds per person. Reception staff simply open a secure web link on their company mobile devices or iPads, eliminating the expense and hassle of renting bulky hardware scanners."
                ],
                "bullets": [
                        "Deploy multiple scanning stations across IT park reception lobbies and auditorium entrances",
                        "Prevent duplicate entries instantly with cryptographic QR tokens and atomic server locks",
                        "Support offline check-in mode when basement convention halls experience weak mobile reception",
                        "Monitor real-time gate entry velocity and auditorium headcounts from any organizer laptop"
                ],
                "takeaway": "High-speed mobile camera scanning prevents entrance gridlock at Whitefield venues."
        },
        {
                "badge": "B2B REVENUE",
                "title": "Direct Razorpay Settlement with Automated GST Tax Invoicing",
                "paragraphs": [
                        "When hosting paid partner conclaves, industry seminars, or executive roundtables in Whitefield, corporate attendees require official tax receipts with their enterprise GSTIN for financial clearance.",
                        "UrPass automatically prompts attendees for company legal names and GSTIN numbers during checkout. Ticket funds settle straight into your verified Razorpay merchant account, and an itemized GST invoice is delivered alongside their digital QR pass."
                ],
                "bullets": [
                        "Retain 100% of delegate revenues without 5% to 8% aggregator commission cuts",
                        "Automated GST invoice generation with custom corporate tax breakdown",
                        "Support corporate credit cards, net banking, and instant UPI transfers",
                        "Automated bulk invoice export for finance and audit reconciliations"
                ],
                "takeaway": "Zero commission and instant GST receipts make enterprise billing effortless."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed and zero ticket fees.",
        features: [
          {
            icon: ShieldCheck,
            title: "Enterprise Tiering",
            desc: "Configure employee, VIP, partner, and speaker passes with custom access permissions.",
          },
          {
            icon: CreditCard,
            title: "0% Commission via Razorpay",
            desc: "Collect ticket payments directly into your Razorpay account with zero platform fees.",
          },
          {
            icon: QrCode,
            title: "Digital QR Credentials",
            desc: "Deliver verifiable QR badges to attendee WhatsApp numbers, Apple Wallet, and email.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Ingress Validation",
            desc: "Scan passes with any iOS or Android smartphone browser. No rental hardware needed.",
          },
          {
            icon: Users,
            title: "Multi-Gate Lobby Routing",
            desc: "Coordinate multiple reception desks and auditorium entry points in real time.",
          },
          {
            icon: FileSpreadsheet,
            title: "Compliance-Ready CSV Exports",
            desc: "Export verified attendee check-in logs with precise arrival timestamps with one click.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Create Corporate Event Page",
                "desc": "Set up your Whitefield summit or town hall details, ticket tiers, and custom employee questions."
        },
        {
                "n": "02",
                "title": "Configure GST & Payments",
                "desc": "Link Razorpay to collect delegate fees with automated tax invoice generation."
        },
        {
                "n": "03",
                "title": "Distribute Registration Link",
                "desc": "Share your branded portal across internal corporate comms or public social channels."
        },
        {
                "n": "04",
                "title": "Issue Digital Passes",
                "desc": "Attendees receive personalized digital QR badges via email and instant WhatsApp delivery."
        },
        {
                "n": "05",
                "title": "Scan at Reception Desks",
                "desc": "Lobby staff validate passes in <0.3s using smartphone cameras to keep foot traffic flowing."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Corporate Events in Whitefield?",
        "subtitle": "Enterprise leaders and operations teams across east Bengaluru.",
        "personas": [
                {
                        "badge": "IT ENTERPRISES",
                        "title": "Tech Park MNCs & GCCs",
                        "desc": "Host all-hands town halls, annual conventions, and global leadership summits at ITPL."
                },
                {
                        "badge": "PARTNER CONCLAVES",
                        "title": "B2B Vendor & Supplier Summits",
                        "desc": "Register regional channel partners, suppliers, and distributors with automated GST receipts."
                },
                {
                        "badge": "HR & INTERNAL",
                        "title": "People & Talent Teams",
                        "desc": "Coordinate employee offsites, wellness days, and cultural celebrations with paperless passes."
                },
                {
                        "badge": "INDUSTRY CONSORTIUMS",
                        "title": "Executive Roundtables",
                        "desc": "Manage invitation-only CXO roundtables and technology symposiums with privacy assurance."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Whitefield Corporate Gate Check-In Works",
        "subtitle": "Dignified, rapid arrival that eliminates corporate reception queues.",
        "description": "Attendees present their digital pass on their smartphone screen or Apple Wallet. Reception staff point their mobile camera at the QR code. UrPass checks credentials in under 300 milliseconds, displays the attendee's name, tier, and company, and logs the check-in immediately.",
        "points": [
                "Eliminates slow manual searching through printed corporate attendee binders.",
                "Displays real-time pass validity with attendee name, designation, and tier.",
                "Prevents duplicate entry attempts across multiple entrance gates automatically.",
                "Supports name and email lookups for emergency guest manual check-in."
        ]
},
        faqs: [
        {
                "q": "Can UrPass handle internal company RSVPs without ticket fees?",
                "a": "Yes. UrPass is ideal for free internal corporate events and employee town halls. You can capture RSVPs, send QR entry badges via WhatsApp and email, and track check-ins at zero per-ticket cost."
        },
        {
                "q": "Can we collect specific employee details during registration?",
                "a": "Yes. You can configure custom form questions for employee IDs, branch locations, dietary choices, and team departments."
        },
        {
                "q": "How do security guards or reception teams scan passes in Whitefield?",
                "a": "Organizers simply open the UrPass scanner link on their smartphones or iPads. The camera instantly reads digital QR badges with real-time verification."
        },
        {
                "q": "Is UrPass compliant with enterprise security standards?",
                "a": "Yes. UrPass uses secure HTTPS encryption, role-based organizer access, and strict data privacy protocols ensuring attendee details remain completely private."
        },
        {
                "q": "Can attendees save their conference pass to Apple Wallet?",
                "a": "Yes. UrPass digital passes feature native Apple Wallet (.pkpass) support. Attendees can add their pass with one tap and retrieve it from their iPhone lockscreen upon arriving at the venue."
        }
],
      }}
    />
  );
}
