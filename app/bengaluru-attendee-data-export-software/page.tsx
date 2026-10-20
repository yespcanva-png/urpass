import type { Metadata } from "next";
import { Clock, CreditCard, FileSpreadsheet, Filter, QrCode, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Attendee Data Export Bengaluru | UrPass",
  description: "Export attendee information and check-in records for Bengaluru events. Simplify reporting, registration analysis and follow-up workflows.",
  keywords: ["export attendee lists bengaluru","event check-in data export bangalore","event attendance csv export","post event reporting bangalore","attendee analytics bengaluru"],
  alternates: {
    canonical: "https://urpass.space/bengaluru-attendee-data-export-software",
  },
  openGraph: {
    title: "Event Attendee Data Export Bengaluru | UrPass",
    description: "Export attendee information and check-in records for Bengaluru events. Simplify reporting, registration analysis and follow-up workflows.",
    url: "https://urpass.space/bengaluru-attendee-data-export-software",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Attendee Data Export Bengaluru | UrPass",
    description: "Export attendee information and check-in records for Bengaluru events. Simplify reporting, registration analysis and follow-up workflows.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BengaluruAttendeeDataExportSoftwarePage() {
  return (
    <SEOPage
      config={{
        badge: "ATTENDEE DATA & EXPORTS",
        h1: "Export Event Attendee Lists and Check-In Data in Bengaluru",
        canonicalUrl: "https://urpass.space/bengaluru-attendee-data-export-software",
        description: "Export attendee information and check-in records for Bengaluru events. Simplify reporting, registration analysis and follow-up workflows.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bengaluru-attendee-data-export-software",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Own Your Event Attendee Data",
        ctaDescription: "Download comprehensive CSV exports with attendee contact details, custom questionnaire answers, and door check-in timestamps with one click.",
        directAnswer: {
        "title": "What is Attendee Data Export Software for Bengaluru?",
        "summary": "Attendee data export software in Bengaluru allows event organizers, marketing teams, and corporate HR leads to extract attendee contact information, registration responses, payment references, and exact gate check-in timestamps. UrPass gives you 100% data ownership with instant CSV exports and zero lock-in.",
        "keyPoints": [
                "One-click CSV exports ready for CRM, email marketing, and HR compliance systems",
                "Exact door scan timestamps provide verified proof of attendance for every guest",
                "100% attendee data privacy—your attendee directory is never marketed to or shared",
                "Export custom form responses including GSTIN, company names, job titles, and dietary needs"
        ]
},
        whatIs: {
        "title": "Why Bengaluru Event Teams Value Data Ownership with UrPass",
        "definition": "Traditional ticketing aggregators withhold attendee data or use your attendee directory to advertise competitor events. UrPass treats your data as your proprietary asset.",
        "details": [
                "100% data sovereignty: your customer lists, corporate contacts, and student directories belong to you",
                "Comprehensive export fields: Name, Email, Phone, Ticket Tier, Payment ID, and Check-In Timestamp",
                "Filter exports by checked-in attendees only, no-shows, or specific ticket categories",
                "Export financial reports with Razorpay transaction IDs for seamless corporate accounting"
        ]
},
        keyFactsTable: {
        "title": "UrPass Data Ownership vs Ticketing Aggregators",
        "subtitle": "Why Bengaluru organizers demand full attendee data control.",
        "headers": [
                "Data Policy",
                "Ticketing Aggregators",
                "UrPass Data Engine"
        ],
        "rows": [
                {
                        "col1": "Data Ownership",
                        "col2": "Aggregator owns data; markets competitor events to your guests",
                        "col3": "100% organizer ownership; zero third-party marketing"
                },
                {
                        "col1": "Export Capabilities",
                        "col2": "Restricted or masked attendee contact details",
                        "col3": "Instant, unmasked CSV exports with full contact info"
                },
                {
                        "col1": "Check-In Timestamps",
                        "col2": "Aggregated stats with no individual scan timestamps",
                        "col3": "Exact per-attendee check-in timestamps for audit trails"
                },
                {
                        "col1": "Export Speed",
                        "col2": "Delays or manual support requests required",
                        "col3": "One-click instant download anytime from your dashboard"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "POST-EVENT WORKFLOWS",
                "title": "Seamless Post-Event Marketing and CRM Integration",
                "paragraphs": [
                        "Once your conference or meetup concludes, your marketing and sales teams need to initiate follow-up campaigns, distribute post-event presentations, and update CRM records within 24 hours.",
                        "UrPass provides clean, standardized CSV files that import seamlessly into HubSpot, Salesforce, Mailchimp, or Google Sheets. Filter your export to target attendees who actually checked in, or send re-engagement emails to no-shows."
                ],
                "bullets": [
                        "Export verified attendees separately from no-shows for targeted follow-up messaging",
                        "Includes custom form answers: designation, organization, LinkedIn profile, and city",
                        "Compatible with all major CRM and marketing automation software",
                        "Automated financial reconciliation with Razorpay payment references"
                ],
                "takeaway": "Clean, standardized CSV exports accelerate post-event marketing campaigns."
        },
        {
                "badge": "AUDIT TRAILS",
                "title": "Verified Attendance Logs for Corporate Compliance and HR",
                "paragraphs": [
                        "Corporate town halls, professional certification seminars, and medical conferences in Bengaluru require verifiable attendance records for compliance, continuing education credits, and financial audits.",
                        "UrPass records an immutable server timestamp the millisecond an attendee's QR pass is scanned at the door. Your exported CSV serves as official proof of attendance with tamper-proof verification."
                ],
                "bullets": [
                        "Exact door scan timestamps verify physical presence for compliance audits",
                        "Multi-session logs show breakout room attendance for certified training credits",
                        "Export attendee GST details for corporate expense reconciliations",
                        "Strict data privacy standards protect employee and executive contact records"
                ],
                "takeaway": "Immutable scan timestamps provide official proof of attendance for corporate audits."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed, privacy, and zero ticket fees.",
        features: [
          {
            icon: FileSpreadsheet,
            title: "One-Click CSV Export",
            desc: "Download complete attendee rosters with contact info, answers, and scan logs instantly.",
          },
          {
            icon: Clock,
            title: "Exact Scan Timestamps",
            desc: "Every check-in is logged with an immutable server timestamp for compliance reporting.",
          },
          {
            icon: Filter,
            title: "Smart Export Filtering",
            desc: "Filter exports by checked-in status, ticket tier, payment method, or date range.",
          },
          {
            icon: ShieldCheck,
            title: "100% Data Sovereignty",
            desc: "Your attendee data is completely private and never shared with third-party advertisers.",
          },
          {
            icon: CreditCard,
            title: "Financial Reconciliation",
            desc: "Export sales logs with Razorpay transaction settlement IDs for easy accounting.",
          },
          {
            icon: QrCode,
            title: "Sub-0.3s Door Validation",
            desc: "Scan and check in attendees using smartphone cameras with zero hardware rentals.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Collect Registrations",
                "desc": "Set up your Bengaluru event portal with custom intake questions and payment tiers."
        },
        {
                "n": "02",
                "title": "Scan Attendees at Door",
                "desc": "Staff scan digital QR passes in <0.3s, recording exact arrival timestamps."
        },
        {
                "n": "03",
                "title": "Open Export Tool",
                "desc": "Navigate to your UrPass organizer dashboard and select 'Export Attendee Data'."
        },
        {
                "n": "04",
                "title": "Apply Filters",
                "desc": "Select all registrants, checked-in guests only, or specific ticket categories."
        },
        {
                "n": "05",
                "title": "Download Clean CSV",
                "desc": "Download your structured CSV file ready for CRM, finance, or compliance reporting."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Data Export in Bengaluru?",
        "subtitle": "Marketing directors and operations leads across Karnataka's capital.",
        "personas": [
                {
                        "badge": "B2B SUMMITS",
                        "title": "Demand Generation Teams",
                        "desc": "Export verified delegate leads to CRM systems for immediate sales follow-up."
                },
                {
                        "badge": "CORPORATE HR",
                        "title": "People & Workplace Teams",
                        "desc": "Audit employee attendance at mandatory training sessions and town halls."
                },
                {
                        "badge": "ACADEMIC",
                        "title": "Certification Institutes",
                        "desc": "Generate verifiable attendance records to issue professional course certificates."
                },
                {
                        "badge": "COMMUNITIES",
                        "title": "Tech Community Leaders",
                        "desc": "Maintain clean member directories for open-source and startup communities."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Data Capture Works at Venue Doors",
        "subtitle": "Automated telemetry that logs every check-in event in real time.",
        "description": "Attendees present their digital pass on their smartphone screen or Apple Wallet. Gate staff point their mobile camera at the pass. UrPass validates credentials in under 300 milliseconds, displays the attendee's name, and immediately records an immutable server timestamp in your event database.",
        "points": [
                "Eliminates manual paper sign-in sheets and post-event data entry work.",
                "Displays real-time pass validity with attendee name, organization, and tier.",
                "Logs exact entrance door, device ID, and timestamp for every successful check-in.",
                "Supports manual name and email lookup for fast backup check-in."
        ]
},
        faqs: [
        {
                "q": "What data fields are included in the UrPass CSV export?",
                "a": "The export includes attendee name, email address, phone number, ticket tier, registration timestamp, check-in status, door scan timestamp, payment ID, and all custom form responses."
        },
        {
                "q": "Can I export only the attendees who actually checked in at the door?",
                "a": "Yes. You can filter your export to include checked-in guests only, no-shows only, or all registered delegates."
        },
        {
                "q": "Does UrPass use our attendee contact information for marketing?",
                "a": "No, never. UrPass maintains strict data privacy standards. Your attendee contact data is completely private to your account and is never marketed to, sold, or shared."
        },
        {
                "q": "How quickly after the event can I export the data?",
                "a": "Immediately. Attendance data synchronizes in real time. You can export the complete CSV during the event or seconds after the closing keynote."
        },
        {
                "q": "What format is the export file provided in?",
                "a": "Data is exported as a standard UTF-8 CSV file, compatible with Microsoft Excel, Google Sheets, HubSpot, Salesforce, and all major database tools."
        }
],
      }}
    />
  );
}
