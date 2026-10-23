import type { Metadata } from "next";
import { Award, CreditCard, FileSpreadsheet, QrCode, ScanLine, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Award Ceremony Guest Management Bengaluru | UrPass",
  description: "Manage award ceremony invitations, VIP guest lists and arrival tracking for Bengaluru business and corporate events with UrPass.",
  keywords: ["award ceremony guest management bengaluru","bengaluru corporate awards ticketing","vip red carpet guest check-in bangalore","annual business awards passes bengaluru","award gala table seating passes"],
  alternates: {
    canonical: "https://urpass.space/bengaluru-award-ceremony-guest-management",
  },
  openGraph: {
    title: "Award Ceremony Guest Management Bengaluru | UrPass",
    description: "Manage award ceremony invitations, VIP guest lists and arrival tracking for Bengaluru business and corporate events with UrPass.",
    url: "https://urpass.space/bengaluru-award-ceremony-guest-management",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Award Ceremony Guest Management Bengaluru | UrPass",
    description: "Manage award ceremony invitations, VIP guest lists and arrival tracking for Bengaluru business and corporate events with UrPass.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BengaluruAwardCeremonyGuestManagementPage() {
  return (
    <SEOPage
      config={{
        badge: "AWARD CEREMONIES & RED CARPET",
        h1: "Award Ceremony Guest Registration and VIP Entry",
        canonicalUrl: "https://urpass.space/bengaluru-award-ceremony-guest-management",
        description: "Manage award ceremony invitations, VIP guest lists and arrival tracking for Bengaluru business and corporate events with UrPass.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bengaluru-award-ceremony-guest-management",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Elevate Your Award Ceremony Experience",
        ctaDescription: "Manage nominee RSVPs, corporate table bookings, VIP red-carpet fast-track entry, and table seating assignments with digital passes and 0% ticket fees.",
        directAnswer: {
        "title": "What is Award Ceremony Guest Management for Bengaluru?",
        "summary": "Award ceremony guest management in Bengaluru organizes nominee registrations, corporate sponsor table allocations, VIP red-carpet arrivals, and seating credentials for business awards, industry galas, and corporate celebrations. UrPass provides custom-branded digital passes, sub-0.3s camera check-in, and table seating information.",
        "keyPoints": [
                "Nominee and VIP guest curation with personalized digital badges displaying table numbers",
                "Corporate table packages allow sponsors to book 8-10 seat banquet tables in one checkout",
                "Sub-0.3s fast-track mobile camera scanning at red-carpet entrances—no bulky hardware",
                "Direct Razorpay integration for paid banquet tickets with 0% platform ticket commission"
        ]
},
        whatIs: {
        "title": "Why Bengaluru Event Producers Trust UrPass for Galas",
        "definition": "Bengaluru's business communities host prestigious annual technology awards, leadership galas, and corporate celebrations at 5-star hotel ballrooms. Clunky paper guest lists and doorway congestion undermine the glamour of the evening.",
        "details": [
                "Prestigious digital passes on Apple Wallet and WhatsApp eliminate paper tickets and plastic badges",
                "Dynamic table seating: digital passes display the guest's assigned banquet table number (e.g. Table 14)",
                "VIP red-carpet fast-track lanes process nominees and dignitaries in under 300 milliseconds",
                "Automated corporate GST tax invoices delivered directly to corporate sponsors and table buyers"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Paper Guest Binders at Award Galas",
        "subtitle": "Why Bangalore corporate award producers choose UrPass.",
        "headers": [
                "Gala Feature",
                "Paper Guest Binders & Table Cards",
                "UrPass Digital Gala Engine"
        ],
        "rows": [
                {
                        "col1": "Red-Carpet Entrance Speed",
                        "col2": "30 to 60 seconds finding guest names alphabetically",
                        "col3": "Under 0.3 seconds via smartphone camera scan"
                },
                {
                        "col1": "Table Seating Info",
                        "col2": "Guests wander around asking ushers for their table",
                        "col3": "Pass displays assigned table number on phone screen"
                },
                {
                        "col1": "Corporate Table Sales",
                        "col2": "Chasing companies with manual bank invoices",
                        "col3": "Automated table bundle checkout via Razorpay UPI"
                },
                {
                        "col1": "Platform Commission",
                        "col2": "5% to 8% cut on expensive banquet ticket tiers",
                        "col3": "0% ticket commission; plans from ₹499/month"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "RED-CARPET INGRESS",
                "title": "Fast-Track Ingress with Dynamic Table Number Badges",
                "paragraphs": [
                        "Arriving at a black-tie award ceremony in Bengaluru should feel prestigious and seamless. Guests should not have to wait in lobby lines while ushers flip through alphabetical paper binders.",
                        "UrPass provides high-speed camera validation that processes arriving dignitaries in under 300 milliseconds. When scanned, the ticket confirms guest identity and displays their assigned banquet table number directly on the screen."
                ],
                "bullets": [
                        "Scanner displays attendee name, organization, VIP tier, and assigned table number",
                        "Color-coded visual confirmation confirms VIP red-carpet and lounge access privileges",
                        "Prevents duplicate entry attempts automatically with cryptographic token locks",
                        "Offline mode ensures scanning continues smoothly in basement hotel ballrooms"
                ],
                "takeaway": "Digital passes displaying table numbers ensure a flawless guest arrival."
        },
        {
                "badge": "TABLE BUNDLES",
                "title": "Corporate Table Packages with Automated GST Invoicing",
                "paragraphs": [
                        "Corporate award ceremonies generate significant revenue by selling corporate banquet tables (typically seating 8 to 10 executives and clients). Managing individual delegate details across 20 corporate tables manually is time-consuming.",
                        "UrPass supports multi-seat table packages. Sponsoring companies purchase a table package via Razorpay with automated GST tax invoicing, and easily assign seats to their nominated executives, automatically dispatching personalized QR credentials to each guest."
                ],
                "bullets": [
                        "Sell 8-seat or 10-seat corporate banquet tables with single-transaction checkout",
                        "Automated GST invoice generation matching corporate expense requirements",
                        "Corporate liaisons can assign and reallocate guest seats up to event day",
                        "0% platform commission on premium table tiers protects your gala profit margins"
                ],
                "takeaway": "Table package workflows simplify corporate sales and delegate allocation."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed, privacy, and zero ticket fees.",
        features: [
          {
            icon: Award,
            title: "Nominee & VIP Tiering",
            desc: "Configure Nominee, Jury, Sponsor Table, and General Guest pass categories with custom perks.",
          },
          {
            icon: CreditCard,
            title: "0% Commission via Razorpay",
            desc: "Keep 100% of gala ticket and table revenue. Connect Razorpay for direct UPI payments.",
          },
          {
            icon: QrCode,
            title: "WhatsApp & Wallet Passes",
            desc: "Deliver personalized VIP credentials directly to attendee WhatsApp chats and Apple Wallet.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Door Validation",
            desc: "Scan and check in guests instantly using phone cameras on mobile browsers.",
          },
          {
            icon: Users,
            title: "Table Seating Assignments",
            desc: "Display assigned banquet table numbers directly on the guest's digital pass.",
          },
          {
            icon: FileSpreadsheet,
            title: "Instant Ingress Exports",
            desc: "Export verified VIP arrival logs with exact timestamps for post-event reporting.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Set Up Award Ceremony",
                "desc": "Define award categories, nominee tiers, corporate table packages, and pricing."
        },
        {
                "n": "02",
                "title": "Connect Razorpay",
                "desc": "Link your verified Razorpay merchant account to collect table and ticket fees via UPI."
        },
        {
                "n": "03",
                "title": "Assign Table Numbers",
                "desc": "Allocate banquet table numbers to confirmed nominees and corporate table guests."
        },
        {
                "n": "04",
                "title": "Issue Digital Passes",
                "desc": "Guests receive personalized digital QR passes via email, WhatsApp, and Apple Wallet."
        },
        {
                "n": "05",
                "title": "Scan at Red Carpet",
                "desc": "Ushers scan passes in <0.3s with smartphone cameras to guide guests to their tables."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Award Ceremonies in Bengaluru?",
        "subtitle": "Event leads and corporate producers across Karnataka's business hub.",
        "personas": [
                {
                        "badge": "TECH AWARDS",
                        "title": "SaaS & Developer Awards",
                        "desc": "Host annual industry excellence galas recognizing top tech leaders and startups."
                },
                {
                        "badge": "BUSINESS",
                        "title": "Chamber of Commerce Galas",
                        "desc": "Manage annual leadership dinners, trade awards, and business milestone celebrations."
                },
                {
                        "badge": "INTERNAL",
                        "title": "Corporate Annual Awards",
                        "desc": "Celebrate enterprise top performers, leadership milestones, and employee excellence."
                },
                {
                        "badge": "MEDIA & PR",
                        "title": "Brand & Agency Awards",
                        "desc": "Coordinate red-carpet check-in, media credentials, and nominee seating."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Red-Carpet Check-In Operates at Award Galas",
        "subtitle": "Dignified, rapid arrival that eliminates lobby congestion.",
        "description": "Dignitaries and nominees display their digital pass on their smartphone screen or Apple Wallet. The usher points their mobile camera at the pass. UrPass validates credentials in under 300 milliseconds, displays the guest's name, company, and assigned table number (e.g. Table 12), and marks them admitted immediately.",
        "points": [
                "Eliminates slow manual searching through printed alphabetical binders at the door.",
                "Displays real-time pass validity with attendee name, organization, and table assignment.",
                "Prevents duplicate entry attempts across multiple entrance gates automatically.",
                "Supports manual name and email lookup for fast backup check-in."
        ]
},
        faqs: [
        {
                "q": "How does UrPass help manage award ceremonies in Bengaluru?",
                "a": "UrPass streamlines award gala operations: configuring nominee tiers, selling corporate banquet tables with automated GST invoices, displaying table numbers on digital passes, and scanning guests in <0.3s at red-carpet doors."
        },
        {
                "q": "Can digital passes show the attendee's assigned dinner table number?",
                "a": "Yes. You can assign table numbers in your dashboard, and the attendee's digital pass on WhatsApp and Apple Wallet dynamically displays their assigned table number."
        },
        {
                "q": "Can companies purchase a corporate table for 10 guests?",
                "a": "Yes. You can configure multi-seat table packages. The sponsoring company purchases the package in one checkout and assigns seats to their team members."
        },
        {
                "q": "Do guests need to print their tickets for an award ceremony?",
                "a": "No. UrPass is 100% paperless. Guests show their personalized QR pass on their smartphone screen via WhatsApp or Apple Wallet."
        },
        {
                "q": "What pricing applies to award ceremonies on UrPass?",
                "a": "UrPass offers transparent flat software subscriptions starting from ₹499/month, with 0% platform ticket fees on paid tiers."
        }
],
      }}
    />
  );
}
