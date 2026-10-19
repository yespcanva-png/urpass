import type { Metadata } from "next";
import { CreditCard, FileSpreadsheet, QrCode, Rocket, ScanLine, Sliders } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Koramangala Startup Events | UrPass",
  description: "Run Koramangala startup demo days, founder meetups and pitch events with RSVP forms, attendee lists and QR entry passes.",
  keywords: ["startup event registration koramangala","koramangala pitch night ticketing","bangalore demo day registration","koramangala founder meetup passes","startup mixer check-in bangalore"],
  alternates: {
    canonical: "https://urpass.space/koramangala-startup-event-registration",
  },
  openGraph: {
    title: "Koramangala Startup Events | UrPass",
    description: "Run Koramangala startup demo days, founder meetups and pitch events with RSVP forms, attendee lists and QR entry passes.",
    url: "https://urpass.space/koramangala-startup-event-registration",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Koramangala Startup Events | UrPass",
    description: "Run Koramangala startup demo days, founder meetups and pitch events with RSVP forms, attendee lists and QR entry passes.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function KoramangalaStartupEventRegistrationPage() {
  return (
    <SEOPage
      config={{
        badge: "KORAMANGALA STARTUP TICKETING",
        h1: "Startup Event Registration & QR Passes in Koramangala",
        canonicalUrl: "https://urpass.space/koramangala-startup-event-registration",
        description: "Host startup meetups, pitch nights, and demo days in Koramangala, Bangalore. Custom registration forms, QR passes on WhatsApp, and zero ticket commission.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=koramangala-startup-event-registration",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Launch Your Koramangala Startup Event",
        ctaDescription: "Create founder-first registration pages, collect UPI payments with 0% platform cuts, and scan QR passes in <0.3s at Koramangala cafes and spaces.",
        directAnswer: {
        "title": "What is Startup Event Registration for Koramangala?",
        "summary": "Startup event registration in Koramangala powers pitch nights, founder meetups, investor demo days, and VC mixers across Koramangala blocks 1 through 8. UrPass provides sleek registration forms, custom founder vetting questionnaires, direct Razorpay UPI payment collection with 0% commission, and instant WhatsApp QR passes.",
        "keyPoints": [
                "Built for Koramangala founder cafes, co-working studios, and venture accelerator hubs",
                "Custom application questionnaires to screen founders, startups, and investor profiles",
                "Direct UPI settlement via Razorpay with 0% platform commission on paid tickets",
                "Instant WhatsApp QR pass delivery and sub-0.3s camera check-in on any mobile phone"
        ]
},
        whatIs: {
        "title": "Why Koramangala Founders and Communities Choose UrPass",
        "definition": "As Bangalore's startup epicenter, Koramangala hosts daily founder breakfasts, product teardowns, and venture demo nights. UrPass gives startup community hosts an agile ticketing engine that respects their margins.",
        "details": [
                "Zero ticket commission—keep 100% of your registration revenue instead of surrendering 8% to brokers",
                "Screen attendees with custom qualification questions covering startup stage, MRR, and portfolio",
                "Instant delivery of digital QR badges straight to attendee WhatsApp numbers and Apple Wallet",
                "Rapid mobile camera scanning that welcomes founders at venue doors without slow manual rosters"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Generic Ticketing in Koramangala",
        "subtitle": "Why startup event hosts in Koramangala are switching to UrPass.",
        "headers": [
                "Community Feature",
                "Generic Ticketing Brokers",
                "UrPass Koramangala Engine"
        ],
        "rows": [
                {
                        "col1": "Platform Commission",
                        "col2": "5% to 10% fee taken from every ticket",
                        "col3": "0% ticket commission; plans from ₹29/month"
                },
                {
                        "col1": "Attendee Data Privacy",
                        "col2": "Broker markets competitors to your community",
                        "col3": "100% private attendee data, strictly yours"
                },
                {
                        "col1": "Founder Screening",
                        "col2": "Rigid forms with zero qualification logic",
                        "col3": "Custom fields for LinkedIn, stage, and pitch links"
                },
                {
                        "col1": "Door Check-In Speed",
                        "col2": "Slow manual name searches on paper or spreadsheets",
                        "col3": "Sub-0.3s camera scan on volunteer smartphones"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "COMMUNITY CURATION",
                "title": "Founder and Investor Screening with Custom Intake Questions",
                "paragraphs": [
                        "High-signal startup mixers and pitch nights in Koramangala require strict attendee curation to ensure founders, angels, and operators get genuine networking value rather than low-context crowds.",
                        "UrPass allows event creators to add bespoke questionnaire fields to registration flows. Collect startup website links, pitch deck URLs, funding stages, and LinkedIn handles before issuing passes."
                ],
                "bullets": [
                        "Custom text fields, drop-down menus, and URL links for applicant vetting",
                        "Automated attendee confirmation emails with calendar (.ics) sync",
                        "Optional invitation codes for private, unlisted VIP investor tiers",
                        "One-click CSV exports with complete applicant answers for review"
                ],
                "takeaway": "Bespoke intake forms ensure your Koramangala gatherings maintain high signal."
        },
        {
                "badge": "0% COMMISSION",
                "title": "Keep 100% of Ticket Revenue with Direct Razorpay UPI Settlement",
                "paragraphs": [
                        "Startup communities and event operators run on tight budgets. Traditional ticketing aggregators cut 5% to 10% from ticket sales and delay payouts for weeks after the meetup concludes.",
                        "UrPass eliminates ticket fees entirely. Pay a transparent flat subscription (starting at introductory ₹29/month), connect your Razorpay account, and receive attendee UPI payments directly with immediate settlement."
                ],
                "bullets": [
                        "Zero commission on paid tickets regardless of event size",
                        "Support Google Pay, PhonePe, Paytm, credit cards, and corporate net banking",
                        "Real-time payment confirmation and instant pass dispatch via WhatsApp",
                        "Transparent accounting with automated Razorpay transaction reconciliation"
                ],
                "takeaway": "Direct payment routing protects community revenues and eliminates broker deductions."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed and zero ticket fees.",
        features: [
          {
            icon: Rocket,
            title: "Startup Event Tiering",
            desc: "Configure Founder, Angel, General, and Speaker passes with custom access permissions.",
          },
          {
            icon: CreditCard,
            title: "0% Platform Fee",
            desc: "Receive ticket revenue directly into your Razorpay account with zero platform cuts.",
          },
          {
            icon: QrCode,
            title: "WhatsApp & Wallet Passes",
            desc: "Deliver personalized QR tickets directly to attendee WhatsApp chats and Apple Wallet.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Camera Scan",
            desc: "Scan and check in founders instantly using volunteer phone cameras with zero app installs.",
          },
          {
            icon: Sliders,
            title: "Custom Intake Fields",
            desc: "Capture company name, funding stage, LinkedIn profile, and pitch deck links easily.",
          },
          {
            icon: FileSpreadsheet,
            title: "Instant Roster Export",
            desc: "Export verified attendee lists with full answers and arrival timestamps to CSV anytime.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Create Meetup Page",
                "desc": "Set up your Koramangala demo night, ticket tiers, and custom founder qualification questions."
        },
        {
                "n": "02",
                "title": "Connect Razorpay",
                "desc": "Link your verified Razorpay merchant account to collect registration fees via UPI."
        },
        {
                "n": "03",
                "title": "Publish & Share Link",
                "desc": "Share your high-converting registration portal on WhatsApp, Twitter, and LinkedIn."
        },
        {
                "n": "04",
                "title": "Issue Digital Passes",
                "desc": "Approved attendees receive dynamic QR passes via WhatsApp, email, and Apple Wallet."
        },
        {
                "n": "05",
                "title": "Scan at Door",
                "desc": "Venue staff validate passes in <0.3s with smartphone cameras to keep venue lines moving."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Koramangala Startup Events?",
        "subtitle": "Community builders and venture leaders across Koramangala's startup hub.",
        "personas": [
                {
                        "badge": "COMMUNITY HOSTS",
                        "title": "Startup Communities & Clubs",
                        "desc": "Organize weekend founder mixers, co-founder dating nights, and product teardowns."
                },
                {
                        "badge": "VENTURE TEAMS",
                        "title": "VC Accelerators & Angels",
                        "desc": "Host curated pitch sessions, portfolio showcase days, and investor dinners."
                },
                {
                        "badge": "CO-WORKING",
                        "title": "Co-Working Studio Managers",
                        "desc": "Manage community events, networking mixers, and masterclasses across Koramangala."
                },
                {
                        "badge": "CREATORS",
                        "title": "Tech Creators & Podcasters",
                        "desc": "Host live audience meetups, book launches, and masterminds with instant UPI checkout."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Gate Check-In Functions at Koramangala Venues",
        "subtitle": "Effortless, friendly arrival that eliminates cafe and studio congestion.",
        "description": "Attendees present their digital pass on their smartphone screen or Apple Wallet. Venue hosts point their mobile camera at the QR code. UrPass checks the pass in under 300 milliseconds, displays the attendee's name and tier, and marks them checked in immediately.",
        "points": [
                "Eliminates slow manual searching through printed spreadsheets at crowded cafe doors.",
                "Displays real-time pass validity with attendee name, company, and tier.",
                "Prevents duplicate entry attempts across multiple cafe or co-working doors automatically.",
                "Supports manual name and email lookup for fast backup check-in."
        ]
},
        faqs: [
        {
                "q": "Why choose UrPass for Koramangala startup events?",
                "a": "UrPass eliminates the 5–10% ticket commissions charged by traditional ticketing platforms while providing modern features startup attendees love, like WhatsApp QR passes and frictionless UPI checkout."
        },
        {
                "q": "Can we screen attendees before accepting paid registrations?",
                "a": "Yes. UrPass lets you create custom registration forms where applicants share company details, LinkedIn profiles, and funding stages for organizer vetting."
        },
        {
                "q": "How fast can I launch a pitch night registration page?",
                "a": "You can launch a clean, responsive registration page in under 3 minutes, configure ticket tiers, connect Razorpay UPI, and start accepting registrations immediately."
        },
        {
                "q": "Do attendees need to download an app to enter the venue?",
                "a": "No. Attendees show the QR pass sent to their WhatsApp, Apple Wallet, or email. Venue volunteers scan passes directly through their smartphone cameras."
        },
        {
                "q": "Can attendees save their startup event pass to Apple Wallet?",
                "a": "Yes. UrPass digital passes feature native Apple Wallet (.pkpass) support. Attendees can add their pass with one tap and retrieve it from their iPhone lockscreen upon arriving at the venue."
        }
],
      }}
    />
  );
}
