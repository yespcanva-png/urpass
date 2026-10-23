import type { Metadata } from "next";
import { CreditCard, FileSpreadsheet, GraduationCap, QrCode, ScanLine, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Alumni Meet Registration Bengaluru | UrPass",
  description: "Coordinate Bengaluru alumni reunions with RSVP registration, guest information, QR invitations and event-day attendance tracking.",
  keywords: ["alumni meet registration bengaluru","college reunion ticketing bangalore","alumni association event software bangalore","iit iim alumni meet bengaluru","alumni reunion qr check in"],
  alternates: {
    canonical: "https://urpass.space/bengaluru-alumni-meet-registration",
  },
  openGraph: {
    title: "Alumni Meet Registration Bengaluru | UrPass",
    description: "Coordinate Bengaluru alumni reunions with RSVP registration, guest information, QR invitations and event-day attendance tracking.",
    url: "https://urpass.space/bengaluru-alumni-meet-registration",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alumni Meet Registration Bengaluru | UrPass",
    description: "Coordinate Bengaluru alumni reunions with RSVP registration, guest information, QR invitations and event-day attendance tracking.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BengaluruAlumniMeetRegistrationPage() {
  return (
    <SEOPage
      config={{
        badge: "ALUMNI REUNIONS & NETWORKING",
        h1: "Alumni Reunion Registration and Digital Passes in Bengaluru",
        canonicalUrl: "https://urpass.space/bengaluru-alumni-meet-registration",
        description: "Coordinate Bengaluru alumni reunions with RSVP registration, guest information, QR invitations and event-day attendance tracking.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bengaluru-alumni-meet-registration",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Celebrate Alumni Reunions Seamlessly",
        ctaDescription: "Collect batch RSVPs, coordinate family tickets, collect dinner contributions via Razorpay with 0% commission, and welcome alumni in <0.3s.",
        directAnswer: {
        "title": "What is Alumni Reunion Registration Software for Bengaluru?",
        "summary": "Alumni reunion registration software in Bengaluru coordinates batch registrations, family guest passes, alumni directory updates, and gate check-in for engineering colleges, business schools, and school alumni associations. UrPass provides custom intake fields for graduation year, WhatsApp pass delivery, and 0% ticket fees.",
        "keyPoints": [
                "Batch and graduation year tiering: Silver Jubilee, Golden Jubilee, and Young Alumni passes",
                "Family and plus-one ticket bundles allow alumni to register spouses and children",
                "Direct UPI and card collection via Razorpay for dinner fees with 0% platform commission",
                "Sub-0.3s smartphone camera scanning validates arriving alumni without paper roster delays"
        ]
},
        whatIs: {
        "title": "Why Bengaluru Alumni Associations Choose UrPass",
        "definition": "Bengaluru hosts premier alumni chapters representing IITs, IIMs, IISc, BITS, and prominent local institutions like RVCE, PES, and BMS. Coordinating alumni reunions with spreadsheets and manual bank transfers causes administrative headaches.",
        "details": [
                "Keep 100% of alumni dinner contributions: 0% platform commission via direct Razorpay integration",
                "Capture essential alumni updates: current company, designation, city, and LinkedIn profile",
                "Deliver personalized digital invitations with vintage college imagery directly to WhatsApp",
                "Fast mobile camera check-in preserves a warm, welcoming reunion atmosphere without lines"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Manual Spreadsheets for Alumni Meets",
        "subtitle": "Why Bangalore alumni networks upgrade to UrPass.",
        "headers": [
                "Reunion Feature",
                "Manual Spreadsheets & Bank Transfers",
                "UrPass Alumni Reunion Engine"
        ],
        "rows": [
                {
                        "col1": "Payment Collection",
                        "col2": "Manual UPI screenshot verification and reconciliation",
                        "col3": "Automated Razorpay UPI checkout with instant confirmation"
                },
                {
                        "col1": "Family / Guest Passes",
                        "col2": "Confusing headcount tracking across messy email threads",
                        "col3": "Unified family ticket bundles with individual QR passes"
                },
                {
                        "col1": "Door Check-In",
                        "col2": "Slow manual searching through printed batch binders",
                        "col3": "Sub-0.3s camera scan on volunteer smartphones"
                },
                {
                        "col1": "Directory Updates",
                        "col2": "Outdated contact details scattered across WhatsApp groups",
                        "col3": "Clean, standardized CSV exports with updated contact info"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "BATCH CATEGORIES",
                "title": "Tiered Registration by Graduation Year and Milestone Batches",
                "paragraphs": [
                        "Alumni reunions often celebrate specific milestones: 25-Year Silver Jubilee, 10-Year Decennial, or 50-Year Golden Jubilee batches, each requiring distinct dinner seatings, memorabilia, and ticket pricing.",
                        "UrPass allows organizers to create graduation year ticket categories. Alumni select their batch during registration, and custom questions collect their current organization, designation, and city of residence."
                ],
                "bullets": [
                        "Configure ticket tiers by graduation year (e.g., Batch of 1999, Batch of 2014)",
                        "Family package tiers allow alumni to purchase tickets for spouses and children in one checkout",
                        "Collect updated professional profiles for the institutional alumni directory",
                        "Automated confirmation email containing Apple Wallet pass and QR credential"
                ],
                "takeaway": "Batch-specific tiers make milestone reunion organization effortless."
        },
        {
                "badge": "0% COMMISSION",
                "title": "Direct Razorpay UPI Settlement for Reunion Dinner Contributions",
                "paragraphs": [
                        "Alumni association committees operate on tight budgets funded by attendee contributions. Traditional ticketing aggregators deduct 5% to 8% from dinner fees and delay payouts for weeks.",
                        "UrPass charges 0% commission on ticket sales. Link your alumni association's Razorpay account, and payments from Google Pay, PhonePe, credit cards, and net banking settle straight into your organization's bank account."
                ],
                "bullets": [
                        "Retain 100% of alumni contributions across dinner and banquet ticket sales",
                        "Automated financial reconciliation matching alumni names with payment references",
                        "Support multiple payment methods: UPI, corporate cards, debit cards, and net banking",
                        "Transparent software pricing starting from ₹499/month"
                ],
                "takeaway": "Direct payment routing protects alumni funds and simplifies accounting."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed, privacy, and zero ticket fees.",
        features: [
          {
            icon: GraduationCap,
            title: "Graduation Batch Tiers",
            desc: "Configure Silver Jubilee, Golden Jubilee, and Young Alumni ticket categories with custom rules.",
          },
          {
            icon: CreditCard,
            title: "0% Commission via Razorpay",
            desc: "Receive dinner contributions directly via UPI with zero platform percentage deductions.",
          },
          {
            icon: Users,
            title: "Family & Plus-One Bundles",
            desc: "Enable alumni to register spouses and children in a single frictionless checkout.",
          },
          {
            icon: QrCode,
            title: "WhatsApp & Wallet Passes",
            desc: "Deliver personalized QR tickets directly to alumni WhatsApp chats and Apple Wallet.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Door Validation",
            desc: "Scan and welcome returning alumni instantly using phone cameras with zero app installs.",
          },
          {
            icon: FileSpreadsheet,
            title: "Alumni Directory Exports",
            desc: "Export updated alumni contact details, current companies, and attendance logs to CSV.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Set Up Reunion Page",
                "desc": "Define reunion schedule, batch ticket categories, dinner pricing, and directory questions."
        },
        {
                "n": "02",
                "title": "Connect Razorpay",
                "desc": "Link your alumni association's Razorpay account to collect dinner contributions directly."
        },
        {
                "n": "03",
                "title": "Share Registration Link",
                "desc": "Share your branded portal across alumni WhatsApp groups, email newsletters, and LinkedIn."
        },
        {
                "n": "04",
                "title": "Issue Digital Passes",
                "desc": "Alumni receive personalized digital QR passes via WhatsApp, email, and Apple Wallet."
        },
        {
                "n": "05",
                "title": "Welcome at Venue",
                "desc": "Student volunteers scan passes in <0.3s with smartphone cameras for rapid entry."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Alumni Reunions in Bengaluru?",
        "subtitle": "Alumni office bearers and batch coordinators across Bengaluru.",
        "personas": [
                {
                        "badge": "IIT & IIM",
                        "title": "National Institute Chapters",
                        "desc": "Host annual Bengaluru chapter galas and alumni networking dinners."
                },
                {
                        "badge": "ENGINEERING",
                        "title": "Local Engineering Colleges",
                        "desc": "Coordinate 25-year silver jubilee reunions for RVCE, PES, BMS, and MSRIT alumni."
                },
                {
                        "badge": "MEDICAL",
                        "title": "Medical & Healthcare Colleges",
                        "desc": "Manage continuing education seminars and doctor batch reunions."
                },
                {
                        "badge": "SCHOOLS",
                        "title": "High School Alumni Clubs",
                        "desc": "Organize decennial and golden anniversary school reunions with family tickets."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Alumni Check-In Works at the Banquet Hall",
        "subtitle": "Warm, dignified arrival that eliminates registration desk lines.",
        "description": "Returning alumni display their digital pass on their smartphone screen or Apple Wallet. The volunteer host points their mobile camera at the pass. UrPass validates credentials in under 300 milliseconds, displays the alumnus's name, batch year, and guest count, and marks them present immediately.",
        "points": [
                "Eliminates slow manual searching through printed batch binders at the banquet entrance.",
                "Displays real-time pass validity with alumnus name, graduation year, and guest count.",
                "Prevents uninvited drop-ins and duplicate entries automatically.",
                "Supports manual name and email lookup for fast backup check-in."
        ]
},
        faqs: [
        {
                "q": "How does UrPass help organize alumni reunions in Bengaluru?",
                "a": "UrPass streamlines reunion operations by creating batch-specific registration pages, collecting dinner contributions via UPI with 0% platform commission, dispatching WhatsApp passes, and validating alumni in <0.3s at the door."
        },
        {
                "q": "Can alumni purchase tickets for their spouse and children?",
                "a": "Yes. You can create family ticket bundles or add-on guest passes, allowing alumni to register their family in a single transaction while generating individual digital passes for each attendee."
        },
        {
                "q": "Can we collect updated contact information for our alumni database?",
                "a": "Yes. Custom registration form questions let you capture current company, designation, residential city, and LinkedIn profile URLs, exportable to CSV anytime."
        },
        {
                "q": "Do older alumni find digital QR passes easy to use?",
                "a": "Yes! Passes are delivered directly into their WhatsApp chat with clear venue directions. Alumni simply open the message and display their screen at the entrance."
        },
        {
                "q": "What pricing applies to alumni association events?",
                "a": "UrPass offers transparent flat software subscriptions starting from ₹499/month, with 0% platform ticket fees on paid tiers."
        }
],
      }}
    />
  );
}
