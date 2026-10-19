import type { Metadata } from "next";
import { BarChart3, Cpu, CreditCard, Layers, QrCode, ScanLine } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Tech Conference Registration Bangalore | UrPass",
  description: "Organize Bangalore tech conferences with delegate registration, ticket categories, QR entry passes and real-time attendee tracking.",
  keywords: ["bangalore tech conference registration","tech conference registration bangalore","bengaluru developer conference software","b2b tech summit ticketing bangalore","delegate badge scanning bangalore"],
  alternates: {
    canonical: "https://urpass.space/bangalore-tech-conference-registration",
  },
  openGraph: {
    title: "Tech Conference Registration Bangalore | UrPass",
    description: "Organize Bangalore tech conferences with delegate registration, ticket categories, QR entry passes and real-time attendee tracking.",
    url: "https://urpass.space/bangalore-tech-conference-registration",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Conference Registration Bangalore | UrPass",
    description: "Organize Bangalore tech conferences with delegate registration, ticket categories, QR entry passes and real-time attendee tracking.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BangaloreTechConferenceRegistrationPage() {
  return (
    <SEOPage
      config={{
        badge: "TECH CONFERENCES BANGALORE",
        h1: "Tech Conference Registration and QR Check-In in Bangalore",
        canonicalUrl: "https://urpass.space/bangalore-tech-conference-registration",
        description: "Organize Bangalore tech conferences with delegate registration, ticket categories, QR entry passes and real-time attendee tracking.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bangalore-tech-conference-registration",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Elevate Your Bangalore Tech Conference",
        ctaDescription: "Collect delegate fees with direct Razorpay UPI settlement, generate executive digital badges, and clear morning entrance lines in <0.3s.",
        directAnswer: {
        "title": "What is Tech Conference Registration Software for Bangalore?",
        "summary": "Tech conference registration software for Bangalore manages delegate onboarding, ticket pricing tiers, corporate GST invoicing, digital QR badge generation, and multi-track session check-in. UrPass enables organizers to accept UPI and card payments with 0% platform ticket commission and scan delegates in under 0.3 seconds.",
        "keyPoints": [
                "Tiered delegate ticketing: VIP, Speaker, General Admission, and Student Passes",
                "Direct Razorpay UPI and card integration with 0% platform ticket commissions",
                "Branded digital QR badges with Apple Wallet support and calendar sync",
                "Multi-track breakout room session attendance tracking for sponsor reporting"
        ]
},
        whatIs: {
        "title": "Why Bangalore Tech Conferences Run on UrPass",
        "definition": "As India's Silicon Valley, Bengaluru hosts premier developer conferences, cloud summits, and AI conclaves. UrPass replaces clunky enterprise platforms with an agile, high-converting registration engine and sub-second gate scanning.",
        "details": [
                "Eliminates 5% to 8% aggregator ticketing commissions on high-value delegate tickets",
                "Generates automated corporate GST tax receipts with company tax registration numbers",
                "Empowers registration desk volunteers with phone camera scanners requiring zero training",
                "Provides room-by-room session attendance tracking for keynote and breakout tracks"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Legacy Conference Platforms in Bangalore",
        "subtitle": "Why Bengaluru tech summit organizers switch to UrPass.",
        "headers": [
                "Conference Dimension",
                "Legacy Enterprise Platforms",
                "UrPass Tech Conference Engine"
        ],
        "rows": [
                {
                        "col1": "Platform Ticketing Fee",
                        "col2": "5% to 8% commission on delegate passes",
                        "col3": "0% ticket commission; flat monthly subscription"
                },
                {
                        "col1": "Delegate Badging",
                        "col2": "Expensive thermal badge printers prone to ribbon jams",
                        "col3": "Digital QR passes + Apple Wallet + printable web badges"
                },
                {
                        "col1": "Entrance Scan Latency",
                        "col2": "Slow manual name lookups or bulky rental scanners",
                        "col3": "Sub-0.3s camera check-in via volunteer smartphones"
                },
                {
                        "col1": "Corporate Invoicing",
                        "col2": "Manual invoicing taking days of finance team effort",
                        "col3": "Automated GST tax receipts delivered with confirmation"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "DELEGATE ONBOARDING",
                "title": "Frictionless Delegate Registration with Automated GST Invoicing",
                "paragraphs": [
                        "Enterprise delegates attending Bangalore tech summits require formal corporate tax invoices with company GSTIN numbers for expense reimbursement. Managing this manually across 500+ corporate attendees creates severe administrative bottlenecks.",
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
                "badge": "SESSION TRACKING",
                "title": "Multi-Track Breakout Attendance for Sponsor ROI",
                "paragraphs": [
                        "At major Bangalore tech summits, sponsors and conference organizers need to know which keynote and breakout tracks drew the highest developer and executive interest.",
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
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed and zero ticket fees.",
        features: [
          {
            icon: Cpu,
            title: "Tech Conference Tiering",
            desc: "Configure VIP, General Delegate, Speaker, and Hackathon passes with custom access rules.",
          },
          {
            icon: CreditCard,
            title: "0% Ticket Commission",
            desc: "Keep 100% of your delegate revenue. Connect Razorpay to receive direct UPI payments.",
          },
          {
            icon: QrCode,
            title: "Executive Digital Badges",
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
                "title": "Set Up Conference Page",
                "desc": "Define summit tracks, delegate tiers, early bird pricing, and corporate GST details."
        },
        {
                "n": "02",
                "title": "Connect Razorpay",
                "desc": "Link your verified Razorpay merchant account to receive ticket revenues directly."
        },
        {
                "n": "03",
                "title": "Publish Registration Portal",
                "desc": "Share your high-converting, mobile-responsive page with prospective attendees."
        },
        {
                "n": "04",
                "title": "Issue Digital Credentials",
                "desc": "Delegates receive personalized digital QR passes via email, WhatsApp, and Apple Wallet."
        },
        {
                "n": "05",
                "title": "Scan at Venue Doors",
                "desc": "Door staff scan passes in <0.3s with smartphone cameras for rapid executive entry."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Bangalore Tech Conferences?",
        "subtitle": "Event producers across Bangalore's enterprise tech and developer ecosystem.",
        "personas": [
                {
                        "badge": "DEVELOPER",
                        "title": "Developer & Open-Source Summits",
                        "desc": "Register thousands of software engineers, open-source contributors, and DevOps leaders."
                },
                {
                        "badge": "AI & SAAS",
                        "title": "AI & Enterprise SaaS Conclaves",
                        "desc": "Manage high-value delegate tickets, executive badge generation, and sponsor tracks."
                },
                {
                        "badge": "PRODUCT",
                        "title": "Product & Design Conferences",
                        "desc": "Issue stylish mobile wallet passes and track attendance across design workshops."
                },
                {
                        "badge": "CYBERSECURITY",
                        "title": "Infosec & Cloud Summits",
                        "desc": "Enforce strict attendee verification and secure door access control."
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
                "q": "Can delegates add their conference pass to Apple Wallet?",
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
                "a": "Yes. You can station staff with smartphone scanners at breakout room doors to scan delegates into individual sessions, generating room-by-room attendance ledgers."
        },
        {
                "q": "What are the platform fees for high-value conference tickets in Bangalore?",
                "a": "UrPass charges 0% platform ticket commission. You pay only standard merchant payment processing fees to Razorpay (typically 2% + GST) and your flat UrPass monthly subscription."
        }
],
      }}
    />
  );
}
