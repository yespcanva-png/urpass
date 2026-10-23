import type { Metadata } from "next";
import { BarChart3, Briefcase, CreditCard, FileText, QrCode, ScanLine } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Seminar Registration Bangalore | UrPass",
  description: "Collect registrations for Bangalore business seminars and distribute digital QR passes with streamlined attendee check-in.",
  keywords: ["bangalore business seminar registration","business seminar registration bangalore","seminar ticketing software bengaluru","corporate training registration karnataka","seminar qr check in bangalore"],
  alternates: {
    canonical: "https://urpass.space/bangalore-business-seminar-registration",
  },
  openGraph: {
    title: "Seminar Registration Bangalore | UrPass",
    description: "Collect registrations for Bangalore business seminars and distribute digital QR passes with streamlined attendee check-in.",
    url: "https://urpass.space/bangalore-business-seminar-registration",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seminar Registration Bangalore | UrPass",
    description: "Collect registrations for Bangalore business seminars and distribute digital QR passes with streamlined attendee check-in.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BangaloreBusinessSeminarRegistrationPage() {
  return (
    <SEOPage
      config={{
        badge: "BUSINESS SEMINARS BANGALORE",
        h1: "Business Seminar Registration and QR Passes in Bangalore",
        canonicalUrl: "https://urpass.space/bangalore-business-seminar-registration",
        description: "Collect registrations for Bangalore business seminars and distribute digital QR passes with streamlined attendee check-in.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bangalore-business-seminar-registration",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Streamline Registration for Your Next Bangalore Business Seminar",
        ctaDescription: "Accept delegate payments with 0% ticket commission, issue automated tax invoices, and check in participants in under 0.3 seconds.",
        directAnswer: {
        "title": "What is Business Seminar Registration Software for Bangalore?",
        "summary": "Business seminar registration software manages professional registrations, ticket payments, tax compliance, and entrance check-in for corporate seminars and industry masterclasses in Bangalore. UrPass enables organizers to accept UPI and card payments via Razorpay with 0% platform ticket commission and scan attendees at seminar doors in under 0.3 seconds.",
        "keyPoints": [
                "Direct Razorpay UPI and card integration with 0% platform ticket commission into your bank",
                "Automated GST invoice generation with corporate tax details for business expense reimbursement",
                "Encrypted digital QR tickets delivered to attendee WhatsApp chats and email inboxes",
                "Sub-0.3 second smartphone camera scanning for fast, professional entrance validation"
        ]
},
        whatIs: {
        "title": "Why Bangalore Seminar Organizers Switch to UrPass",
        "definition": "Bangalore hosts hundreds of executive seminars on taxation, leadership, AI strategy, and compliance. UrPass replaces manual invoicing and clunky ticketing aggregators with an automated, professional platform tailored for business educators.",
        "details": [
                "Keeps 100% of seminar ticket revenue minus standard payment processor interchange fees",
                "Enforces hard capacity limits so seminars never exceed boardroom or auditorium seating",
                "Includes automated calendar (.ics) invites and seminar syllabus in confirmation emails",
                "Provides rapid smartphone camera check-in to verify enrolled delegates at the seminar door"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Commercial Ticketing Aggregators for Business Seminars",
        "subtitle": "Why business seminar producers in Bangalore keep more profit with UrPass.",
        "headers": [
                "Operational Factor",
                "Ticketing Aggregators (5% to 10% Fee)",
                "UrPass Seminar Platform"
        ],
        "rows": [
                {
                        "col1": "Platform Commission",
                        "col2": "5% to 8% deducted from every delegate ticket",
                        "col3": "0% ticket fee; flat subscription starting from ₹499/mo"
                },
                {
                        "col1": "Corporate Invoicing",
                        "col2": "Manual invoicing taking days of finance team effort",
                        "col3": "Automated GST tax receipts delivered with confirmation"
                },
                {
                        "col1": "Payout Schedule",
                        "col2": "Payouts held until 7-14 days after seminar finishes",
                        "col3": "Direct settlement to your bank via Razorpay (T+2)"
                },
                {
                        "col1": "Entrance Verification",
                        "col2": "Manual paper sign-in sheets causing lobby queues",
                        "col3": "Sub-0.3s smartphone camera scanner on staff phones"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "TAX & COMPLIANCE",
                "title": "Automated Corporate GST Invoicing for Business Delegates",
                "paragraphs": [
                        "Corporate delegates attending professional seminars in Bangalore require formal tax invoices with company GSTIN numbers to claim input tax credits and corporate expense reimbursement. Managing this manually across hundreds of corporate attendees creates severe accounting friction.",
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
                "badge": "DOOR EFFICIENCY",
                "title": "Punctual Seminar Starts with Sub-Second Door Scanning",
                "paragraphs": [
                        "Business seminars operate on strict executive schedules. If registration desks spend 45 seconds searching paper rosters for each delegate, morning keynote sessions are delayed and attendees grow frustrated.",
                        "UrPass equips your reception staff with a web-based smartphone camera scanner that decodes passes in under 300 milliseconds. Volunteers scan an organizer setup QR code to activate the scanner in Safari or Chrome, validating passes and admitting delegates seamlessly."
                ],
                "bullets": [
                        "Sub-0.3s camera scan clears 500 delegates in approximately 10 minutes",
                        "Audible green chime confirms valid admission in crowded venue foyers",
                        "Atomic database row locking prevents pass reuse across multiple entrance doors",
                        "Quick manual search allows backup check-in if an attendee phone is uncharged"
                ],
                "takeaway": "Fast smartphone scanning ensures business seminars start punctually on schedule."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed and zero ticket fees.",
        features: [
          {
            icon: Briefcase,
            title: "Executive Seminar Ticketing",
            desc: "Configure early bird tiers, corporate bundles, and VIP packages with automated seat caps.",
          },
          {
            icon: CreditCard,
            title: "Direct Razorpay UPI",
            desc: "Accept UPI, cards, and net banking with direct bank payouts and 0% ticket fees.",
          },
          {
            icon: FileText,
            title: "Automated GST Invoices",
            desc: "Generate itemized tax invoices with company GST numbers automatically upon checkout.",
          },
          {
            icon: QrCode,
            title: "Instant Digital Passes",
            desc: "Issue scannable digital passes delivered via WhatsApp, Apple Wallet, and email.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Door Check-In",
            desc: "Verify enrolled delegates at the seminar door using any smartphone camera.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance Telemetry",
            desc: "Monitor check-in percentages and export verified arrival ledgers to CSV anytime.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Set Up Seminar Page",
                "desc": "Define seminar agenda, speaker bios, delegate tiers, and corporate tax details."
        },
        {
                "n": "02",
                "title": "Connect Razorpay",
                "desc": "Link Razorpay to receive 100% of ticket sales directly into your bank account."
        },
        {
                "n": "03",
                "title": "Share Registration Link",
                "desc": "Publish your high-converting, ad-free page across LinkedIn, email, and social media."
        },
        {
                "n": "04",
                "title": "Delegates Buy Tickets",
                "desc": "Attendees complete checkout via UPI or cards and receive instant digital passes."
        },
        {
                "n": "05",
                "title": "Scan at the Door",
                "desc": "Verify delegates at the seminar door in <0.3s using your smartphone camera."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Business Seminars in Bangalore?",
        "subtitle": "Professional associations, executive educators, and corporate consultancy firms.",
        "personas": [
                {
                        "badge": "EXECUTIVE",
                        "title": "Leadership & Management Seminars",
                        "desc": "Host C-suite roundtables and strategic management seminars at premier business hotels."
                },
                {
                        "badge": "FINANCE",
                        "title": "Taxation & Legal Masterclasses",
                        "desc": "Collect delegate fees with automated GST tax invoicing and verifiable attendance logs."
                },
                {
                        "badge": "TECHNOLOGY",
                        "title": "AI Strategy & Tech Briefings",
                        "desc": "Register enterprise technology leaders with polished digital passes and calendar sync."
                },
                {
                        "badge": "CONSULTING",
                        "title": "Corporate HR & Sales Workshops",
                        "desc": "Deliver intensive training sessions with strict room capacity limits and zero ticket fees."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Check-In Operates at the Seminar Entrance",
        "subtitle": "Instant delegate verification that keeps seminar schedules running smoothly.",
        "description": "When delegates arrive at the seminar room, they present their digital pass on their smartphone screen or WhatsApp chat. Reception staff point their mobile camera at the pass. UrPass validates payment and enrollment in under 0.3 seconds, signaling green entry.",
        "points": [
                "No searching through paper student rosters or cross-referencing bank statements.",
                "Works smoothly on any smartphone browser with zero app installation.",
                "Quick search by delegate name or email allows manual check-in if needed.",
                "Download attendance records to issue completion certificates after class."
        ]
},
        faqs: [
        {
                "q": "Can delegates enter their company GSTIN number for tax invoices?",
                "a": "Yes. Attendees can enter their company name and GSTIN during checkout. UrPass automatically generates an itemized tax invoice attached to their confirmation email."
        },
        {
                "q": "What payment methods can seminar delegates use in Bangalore?",
                "a": "Delegates can pay using all UPI apps (Google Pay, PhonePe, Paytm, Cred), corporate credit/debit cards, and net banking via direct Razorpay integration."
        },
        {
                "q": "Does UrPass charge a percentage commission on seminar delegate fees?",
                "a": "No. UrPass charges 0% platform ticket commission. You keep 100% of your delegate revenue minus standard gateway interchange fees and your flat UrPass monthly subscription."
        },
        {
                "q": "Can delegates add their seminar pass to Apple Wallet?",
                "a": "Yes. UrPass digital passes feature native Apple Wallet (.pkpass) support. Delegates can add their pass with one tap and retrieve it from their iPhone lockscreen upon arriving at the venue."
        },
        {
                "q": "How do reception staff scan delegates when they arrive?",
                "a": "Staff simply open your event scanner URL on their smartphone browser (Safari or Chrome). Pointing the camera at the delegate's digital pass validates the ticket in under 0.3 seconds."
        }
],
      }}
    />
  );
}
