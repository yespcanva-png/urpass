import type { Metadata } from "next";
import { BarChart3, Cpu, CreditCard, Layers, QrCode, ScanLine } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "AI Conference Registration Bangalore | UrPass",
  description: "Manage AI and machine learning conference registrations, delegate categories, QR tickets and attendee check-ins across Bangalore events.",
  keywords: ["ai ml conference registration bangalore","bangalore artificial intelligence summit ticketing","machine learning conclave passes bengaluru","ai developer conference check in","generative ai summit bangalore"],
  alternates: {
    canonical: "https://urpass.space/bangalore-ai-ml-conference-registration",
  },
  openGraph: {
    title: "AI Conference Registration Bangalore | UrPass",
    description: "Manage AI and machine learning conference registrations, delegate categories, QR tickets and attendee check-ins across Bangalore events.",
    url: "https://urpass.space/bangalore-ai-ml-conference-registration",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Conference Registration Bangalore | UrPass",
    description: "Manage AI and machine learning conference registrations, delegate categories, QR tickets and attendee check-ins across Bangalore events.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BangaloreAiMlConferenceRegistrationPage() {
  return (
    <SEOPage
      config={{
        badge: "AI & ML CONFERENCES",
        h1: "AI & Machine Learning Conference Registration in Bangalore",
        canonicalUrl: "https://urpass.space/bangalore-ai-ml-conference-registration",
        description: "Manage AI and machine learning conference registrations, delegate categories, QR tickets and attendee check-ins across Bangalore events.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bangalore-ai-ml-conference-registration",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Power Bangalore AI & ML Conferences",
        ctaDescription: "Onboard research delegates, collect fees with 0% commission via Razorpay, issue Apple Wallet passes, and clear auditorium doors in <0.3s.",
        directAnswer: {
        "title": "What is AI & Machine Learning Conference Registration in Bangalore?",
        "summary": "AI and machine learning conference registration in Bangalore manages delegate ticketing, research paper presenter credentials, corporate GST invoicing, and multi-track breakout check-in for AI summits and LLM conclaves. UrPass provides Razorpay UPI payments with 0% platform commission and sub-0.3s smartphone camera check-in.",
        "keyPoints": [
                "Tiered delegate pricing: Researcher, Enterprise, Speaker, and Student passes",
                "Direct Razorpay UPI and corporate card settlement with 0% platform ticket commission",
                "Automated GST invoice generation with corporate tax details for company reimbursements",
                "Sub-0.3s camera check-in across keynote halls, workshop tracks, and poster sessions"
        ]
},
        whatIs: {
        "title": "Why Bangalore AI Summits Choose UrPass",
        "definition": "As India's deep tech and AI capital, Bangalore hosts premier generative AI conclaves, computer vision symposiums, and data science summits. UrPass replaces clunky enterprise ticketing brokers with an agile, high-converting engine.",
        "details": [
                "0% ticket commission—save tens of thousands on high-value corporate delegate passes",
                "Custom technical registration questions: research domain, GitHub profile, and GPU framework",
                "Multi-track breakout room session tracking for sponsor engagement and room capacity analytics",
                "Instant delivery of digital QR credentials straight to WhatsApp and Apple Wallet"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Legacy Conference Platforms for AI Summits",
        "subtitle": "Why Bangalore AI conclave directors switch to UrPass.",
        "headers": [
                "Conference Dimension",
                "Legacy Enterprise Ticketing",
                "UrPass AI Conference Engine"
        ],
        "rows": [
                {
                        "col1": "Platform Commission",
                        "col2": "5% to 8% cut on delegate and enterprise passes",
                        "col3": "0% ticket commission; plans from ₹29/month"
                },
                {
                        "col1": "Corporate Invoicing",
                        "col2": "Manual invoicing taking days of finance effort",
                        "col3": "Automated GST tax receipts generated instantly"
                },
                {
                        "col1": "Door Check-In Latency",
                        "col2": "Bulky rental scanners or slow manual lookups",
                        "col3": "Sub-0.3s camera scan on volunteer smartphones"
                },
                {
                        "col1": "Breakout Track Tracking",
                        "col2": "Single entrance scan only; no room-level data",
                        "col3": "Multi-session scanning logs individual workshop attendance"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "DELEGATE TIERS",
                "title": "Tiered Delegate Onboarding with Automated GST Invoicing",
                "paragraphs": [
                        "Enterprise delegates attending Bangalore AI conferences require formal corporate tax invoices with company GSTIN numbers for expense reimbursement. Managing this manually across 500+ corporate attendees creates severe administrative bottlenecks.",
                        "UrPass automates corporate tax invoicing. Delegates enter their organization name and GSTIN during checkout, and an itemized tax invoice is automatically attached to their ticket confirmation email, accompanied by their digital QR pass."
                ],
                "bullets": [
                        "Automated GST invoice generation matching Razorpay transaction settlement IDs",
                        "Tiered delegate pricing with scheduled early-bird automated price shifts",
                        "Private hidden ticket tiers unlocked via bespoke invitation access codes",
                        "Group corporate booking workflows with multi-pass bulk allocation"
                ],
                "takeaway": "Automated corporate invoicing simplifies B2B sales and eliminates billing overhead."
        },
        {
                "badge": "SESSION ANALYTICS",
                "title": "Multi-Track Breakout Attendance for Sponsor Reporting",
                "paragraphs": [
                        "At major Bangalore AI summits, sponsors and conference organizers need to know which keynote and breakout tracks drew the highest developer and executive interest.",
                        "UrPass supports multi-session scanning. Station staff outside breakout halls with smartphone scanners to record session attendance in milliseconds. The system logs exact entry timestamps for each delegate, producing verified room-by-room attendance reports for sponsors."
                ],
                "bullets": [
                        "Scan the same delegate pass across multiple halls and workshops",
                        "Live room occupancy telemetry prevents exceeding auditorium fire capacities",
                        "Export session-level attendance logs to CSV with one click",
                        "Automated post-conference digital attendance certificates delivered to verified delegates"
                ],
                "takeaway": "Session-level QR tracking provides verified delegate engagement data for sponsors."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed, privacy, and zero ticket fees.",
        features: [
          {
            icon: Cpu,
            title: "AI Conference Tiering",
            desc: "Configure Researcher, Enterprise, Speaker, and Hackathon passes with custom access rules.",
          },
          {
            icon: CreditCard,
            title: "0% Commission via Razorpay",
            desc: "Keep 100% of your delegate revenue. Connect Razorpay to receive direct UPI payments.",
          },
          {
            icon: QrCode,
            title: "Digital QR Credentials",
            desc: "Issue branded mobile passes featuring delegate name, job title, company, and QR code.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Door Validation",
            desc: "Scan and check in delegates using volunteer smartphone browsers with zero app downloads.",
          },
          {
            icon: Layers,
            title: "Breakout Session Tracking",
            desc: "Track delegate attendance across keynote halls, workshop tracks, and VIP dinners.",
          },
          {
            icon: BarChart3,
            title: "Real-Time Ingress Telemetry",
            desc: "Monitor arrival flow, peak door traffic, and no-show statistics on an executive dashboard.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Set Up AI Summit Page",
                "desc": "Define keynote tracks, delegate tiers, early bird pricing, and corporate GST details."
        },
        {
                "n": "02",
                "title": "Connect Razorpay",
                "desc": "Link your verified Razorpay merchant account to collect registration fees directly via UPI."
        },
        {
                "n": "03",
                "title": "Publish Registration Portal",
                "desc": "Share your high-converting, mobile-responsive page with AI researchers and developers."
        },
        {
                "n": "04",
                "title": "Issue Digital Passes",
                "desc": "Delegates receive personalized digital QR passes via email, WhatsApp, and Apple Wallet."
        },
        {
                "n": "05",
                "title": "Scan at Auditorium Doors",
                "desc": "Door staff scan passes in <0.3s with smartphone cameras for rapid executive entry."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for AI Conferences in Bangalore?",
        "subtitle": "Event producers across Bangalore's enterprise AI and research ecosystem.",
        "personas": [
                {
                        "badge": "RESEARCH",
                        "title": "AI & ML Academic Summits",
                        "desc": "Register researchers, paper authors, and computer science PhD scholars."
                },
                {
                        "badge": "ENTERPRISE",
                        "title": "Generative AI Conclaves",
                        "desc": "Manage high-value corporate tickets, executive badge generation, and sponsor tracks."
                },
                {
                        "badge": "COMMUNITIES",
                        "title": "Developer Hack Days",
                        "desc": "Issue mobile passes and track attendance across weekend AI model building sprints."
                },
                {
                        "badge": "VENTURE",
                        "title": "AI Investor Showcases",
                        "desc": "Curate closed-door demo days connecting early-stage AI startups with venture funds."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Delegate Check-In Functions at Registration Desks",
        "subtitle": "Fast, dignified executive arrival that eliminates lobby congestion.",
        "description": "Delegates display their digital pass on their smartphone screen or Apple Wallet. Registration desk staff point their mobile camera at the pass. UrPass validates the delegate's credentials in under 300 milliseconds, displays their name and tier (e.g., VIP Speaker), and marks them admitted.",
        "points": [
                "Eliminates slow manual searching through printed alphabetical delegate lists.",
                "Instant visual badge confirmation on the scanner screen shows job title and organization.",
                "Scanners prevent duplicate pass entry across multiple lobby doors.",
                "Manual search by delegate name or corporate email allows instant backup check-in."
        ]
},
        faqs: [
        {
                "q": "Can delegates add their AI conference pass to Apple Wallet?",
                "a": "Yes. UrPass digital passes feature native Apple Wallet (.pkpass) support. Delegates can add their pass with one tap from their confirmation email, allowing fast lockscreen retrieval upon arriving at the conference venue."
        },
        {
                "q": "Can we issue corporate invoices with company GST numbers?",
                "a": "Yes. You can configure your business tax details in UrPass. Attendees can enter their organization name and GSTIN during checkout, and an itemized corporate tax invoice is generated automatically."
        },
        {
                "q": "How does UrPass prevent delegates from sharing tickets with colleagues?",
                "a": "Every delegate pass is protected with an encrypted cryptographic token and backed by database-level atomic locking. Once scanned at the venue entrance, the pass is locked. Any subsequent scan attempt displays an amber duplicate warning showing the original entry timestamp."
        },
        {
                "q": "Can we track which delegates attended specific breakout sessions?",
                "a": "Yes. UrPass supports multi-session scanning. Stationing staff with smartphone scanners outside breakout halls allows you to track room-by-room attendance in real time."
        },
        {
                "q": "What pricing applies to AI conferences on UrPass?",
                "a": "UrPass offers transparent flat software subscriptions starting at an introductory ₹29/month for your first 2 months (then ₹999/month), with 0% platform ticket fees on paid tiers."
        }
],
      }}
    />
  );
}
