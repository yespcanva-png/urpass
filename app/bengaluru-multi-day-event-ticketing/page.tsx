import type { Metadata } from "next";
import { Calendar, CreditCard, FileSpreadsheet, Layers, QrCode, ScanLine } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Multi-Day Event Ticketing Bengaluru | UrPass",
  description: "Manage multi-day Bengaluru events with digital passes, ticket categories and event-day attendance tracking using UrPass.",
  keywords: ["multi-day event ticketing bengaluru","multi day conference passes bangalore","3-day event pass qr code","bengaluru summit attendance tracking","multi-session check-in bangalore"],
  alternates: {
    canonical: "https://urpass.space/bengaluru-multi-day-event-ticketing",
  },
  openGraph: {
    title: "Multi-Day Event Ticketing Bengaluru | UrPass",
    description: "Manage multi-day Bengaluru events with digital passes, ticket categories and event-day attendance tracking using UrPass.",
    url: "https://urpass.space/bengaluru-multi-day-event-ticketing",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Multi-Day Event Ticketing Bengaluru | UrPass",
    description: "Manage multi-day Bengaluru events with digital passes, ticket categories and event-day attendance tracking using UrPass.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BengaluruMultiDayEventTicketingPage() {
  return (
    <SEOPage
      config={{
        badge: "MULTI-DAY EVENT PASSES",
        h1: "Multi-Day Event Ticketing and QR Entry in Bengaluru",
        canonicalUrl: "https://urpass.space/bengaluru-multi-day-event-ticketing",
        description: "Manage multi-day Bengaluru events with digital passes, ticket categories and event-day attendance tracking using UrPass.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bengaluru-multi-day-event-ticketing",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Power Multi-Day Bengaluru Events",
        ctaDescription: "Issue all-access 2-day and 3-day passes, track daily gate attendance independently, and prevent pass sharing with encrypted QR tokens.",
        directAnswer: {
        "title": "What is Multi-Day Event Ticketing for Bengaluru?",
        "summary": "Multi-day event ticketing in Bengaluru manages conference passes, summit badges, and festival credentials valid across multiple event days (e.g. Day 1, Day 2, Day 3). UrPass allows organizers to issue unified QR passes, configure single-day vs all-access tiers, track daily attendance separately, and prevent credential pass-backs with 0% ticket commission.",
        "keyPoints": [
                "Unified digital QR passes valid for specific days or the entire multi-day schedule",
                "Independent daily check-in validation prevents attendees from sharing passes across days",
                "Direct Razorpay integration for multi-day tiers with 0% platform ticket commissions",
                "Sub-0.3s smartphone camera scanning validates daily credentials without reprinting badges"
        ]
},
        whatIs: {
        "title": "Why Bengaluru Conference Producers Choose UrPass",
        "definition": "Major developer conferences, academic symposiums, and trade conclaves across KTPO, BIEC, and Palace Grounds run over 2 to 4 consecutive days. Managing multi-day entry traditionally required wasteful daily wristbands or clunky badges.",
        "details": [
                "One permanent digital pass stored on WhatsApp or Apple Wallet that works across all event days",
                "Configurable day-by-day access rules: All-Days Pass, Day 1 Only, Day 2 Workshops Only",
                "Detailed daily attendance logs comparing Day 1 opening keynote vs Day 2 breakout sessions",
                "Atomic server-side check-in validation resets daily so delegates can scan in each morning"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Daily Paper Wristbands in Bengaluru",
        "subtitle": "Why multi-day event teams upgrade to UrPass digital credentials.",
        "headers": [
                "Operational Feature",
                "Daily Wristbands & Lanyards",
                "UrPass Multi-Day Digital Pass"
        ],
        "rows": [
                {
                        "col1": "Material Cost",
                        "col2": "₹50 to ₹150 per delegate in plastic wristbands/badges",
                        "col3": "₹0 paperless digital pass on WhatsApp & Apple Wallet"
                },
                {
                        "col1": "Daily Morning Check-In",
                        "col2": "Slow daily re-issuance creating long lobby queues",
                        "col3": "Sub-0.3s daily camera scan on attendee's existing QR pass"
                },
                {
                        "col1": "Ticket Sharing Fraud",
                        "col2": "Wristbands cut and passed to non-paying colleagues",
                        "col3": "Encrypted token tied to attendee identity & atomic lock"
                },
                {
                        "col1": "Day-by-Day Analytics",
                        "col2": "Impossible to know exact daily drop-off without paper tally",
                        "col3": "Live daily attendance telemetry exported to CSV"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "DAILY VALIDATION",
                "title": "Intelligent Daily Check-In Logic Without Badge Reprints",
                "paragraphs": [
                        "Multi-day conferences in Bengaluru face a dilemma: issuing separate badges for each day creates logistical chaos, while a single physical badge can easily be handed off to an unregistered colleague for Day 2.",
                        "UrPass solves this with smart multi-day QR pass logic. A delegate retains one digital QR pass in their Apple Wallet or WhatsApp. The scanner verifies whether their ticket is authorized for the current date, marks them admitted for that specific day, and locks re-entry."
                ],
                "bullets": [
                        "Configure ticket validity: Full Summit (All Days), Single-Day (Friday Only), or Weekend Pass",
                        "Scanner displays clear visual indicators: Green for valid today, Red for wrong day",
                        "Automated daily reset allows authorized delegates to check in each morning seamlessly",
                        "Track daily attendance retention from Day 1 keynote to Day 3 closing panel"
                ],
                "takeaway": "One digital pass validates attendance across multiple days with zero reprinting."
        },
        {
                "badge": "REVENUE OPTIMIZATION",
                "title": "Tiered Multi-Day Packages with Direct Razorpay Settlement",
                "paragraphs": [
                        "Conference producers maximize ticket yields by selling tiered multi-day bundles: Early Bird All-Access Passes, Single-Day Keynote passes, and VIP Executive passes with dinner access.",
                        "UrPass supports unlimited ticket categories and connects directly to your verified Razorpay merchant account. Collect ticket revenues via UPI, corporate credit cards, and net banking with 0% platform commission deductions."
                ],
                "bullets": [
                        "Create Early Bird, Regular, and Late Bird price shifts for multi-day passes",
                        "Automated GST invoice generation matching corporate expense requirements",
                        "Support student payment options: UPI, debit cards, credit cards, and net banking",
                        "Transparent software pricing starting from ₹499/month"
                ],
                "takeaway": "Direct payment routing maximizes multi-day conference ticket yields."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed, privacy, and zero ticket fees.",
        features: [
          {
            icon: Calendar,
            title: "Multi-Day Tiering",
            desc: "Configure All-Access, Single-Day, Weekend, and Workshop-Only ticket categories.",
          },
          {
            icon: CreditCard,
            title: "0% Commission via Razorpay",
            desc: "Collect multi-day delegate fees directly with zero platform percentage deductions.",
          },
          {
            icon: QrCode,
            title: "Unified Digital Pass",
            desc: "One dynamic QR credential stored on WhatsApp and Apple Wallet for all event days.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Daily Scanning",
            desc: "Validate daily gate access instantly on standard phone cameras with zero hardware rentals.",
          },
          {
            icon: Layers,
            title: "Day-by-Day Access Rules",
            desc: "Enforce strict daily date validation to prevent single-day pass misuse.",
          },
          {
            icon: FileSpreadsheet,
            title: "Daily Attendance Telemetry",
            desc: "Export verified daily attendance logs with exact timestamps to CSV anytime.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Set Up Multi-Day Event",
                "desc": "Define summit schedule, dates, ticket categories (All-Access vs Single Day), and pricing."
        },
        {
                "n": "02",
                "title": "Connect Razorpay",
                "desc": "Link your verified Razorpay merchant account to collect registration fees directly via UPI."
        },
        {
                "n": "03",
                "title": "Publish Registration Portal",
                "desc": "Share your high-converting, mobile-responsive page with prospective attendees."
        },
        {
                "n": "04",
                "title": "Issue Unified Passes",
                "desc": "Delegates receive personalized digital QR passes via email, WhatsApp, and Apple Wallet."
        },
        {
                "n": "05",
                "title": "Scan Daily at Gates",
                "desc": "Door staff scan passes each morning in <0.3s to validate that day's entry."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Multi-Day Events in Bengaluru?",
        "subtitle": "Producers hosting multi-day conferences and festivals across Karnataka.",
        "personas": [
                {
                        "badge": "TECH CONFERENCES",
                        "title": "3-Day Developer Summits",
                        "desc": "Manage all-access passes, keynote attendance, and multi-track breakout sessions."
                },
                {
                        "badge": "ACADEMIC",
                        "title": "University Symposiums",
                        "desc": "Coordinate multi-day college fests, technical competitions, and paper presentations."
                },
                {
                        "badge": "TRADE EXPOS",
                        "title": "B2B Industrial Exhibitions",
                        "desc": "Issue buyer and exhibitor badges valid across 3 to 4 exhibition days at BIEC or KTPO."
                },
                {
                        "badge": "BOOTCAMPS",
                        "title": "Weekend Training Bootcamps",
                        "desc": "Verify student attendance across Saturday and Sunday hands-on coding sessions."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Daily Check-In Operates at Multi-Day Events",
        "subtitle": "Fast, accurate attendance tracking each morning of your event.",
        "description": "Delegates display their unified digital pass on their smartphone screen or Apple Wallet each morning. Gate staff point their mobile camera at the pass. UrPass verifies that the ticket is valid for that specific day in under 300 milliseconds, displays the delegate's name, and logs that day's check-in timestamp.",
        "points": [
                "Eliminates the need to reprint paper badges or distribute plastic wristbands each morning.",
                "Displays real-time pass validity with attendee name, organization, and authorized days.",
                "Prevents duplicate entry attempts on the same day automatically.",
                "Supports manual name and email lookup for fast backup check-in."
        ]
},
        faqs: [
        {
                "q": "How does UrPass handle multi-day event ticketing in Bengaluru?",
                "a": "UrPass issues a single digital QR pass that works across all authorized event days. The scanner automatically checks whether the delegate's pass is valid for today's date and marks them admitted for that specific day."
        },
        {
                "q": "Can I sell both Single-Day passes and All-Days passes on UrPass?",
                "a": "Yes. You can configure multiple ticket categories (e.g. 'Day 1 Only', 'Day 2 Only', 'Full Summit Pass') with custom pricing and dates."
        },
        {
                "q": "Does the system prevent someone from passing their ticket to a friend on Day 2?",
                "a": "Yes. Every pass is bound to the attendee's name and email, and organizers can verify identity directly on the scanner screen showing the attendee's name and photo or badge details."
        },
        {
                "q": "Do attendees need a new QR code for each day of the conference?",
                "a": "No. Attendees keep the same digital QR pass on their WhatsApp or Apple Wallet. The cloud database automatically resets daily validation so they can scan in each morning."
        },
        {
                "q": "Can I see which delegates attended Day 1 vs Day 2?",
                "a": "Yes. The organizer dashboard displays day-by-day attendance breakdowns, and you can export a CSV showing exact check-in timestamps for each individual day."
        }
],
      }}
    />
  );
}
