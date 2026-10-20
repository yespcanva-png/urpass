import type { Metadata } from "next";
import { FileSpreadsheet, Key, QrCode, ScanLine, ShieldCheck, TrendingUp } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Investor Pitch Event Registration Bengaluru | UrPass",
  description: "Invite investors, founders and business guests to Bengaluru pitch events with controlled registration and digital access passes.",
  keywords: ["investor pitch event registration bengaluru","venture capital demo day bangalore","angel investor meetup passes bengaluru","startup pitch night rsvp bangalore","curated investor guest management"],
  alternates: {
    canonical: "https://urpass.space/bengaluru-investor-pitch-event-registration",
  },
  openGraph: {
    title: "Investor Pitch Event Registration Bengaluru | UrPass",
    description: "Invite investors, founders and business guests to Bengaluru pitch events with controlled registration and digital access passes.",
    url: "https://urpass.space/bengaluru-investor-pitch-event-registration",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Investor Pitch Event Registration Bengaluru | UrPass",
    description: "Invite investors, founders and business guests to Bengaluru pitch events with controlled registration and digital access passes.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BengaluruInvestorPitchEventRegistrationPage() {
  return (
    <SEOPage
      config={{
        badge: "INVESTOR PITCH EVENTS",
        h1: "Investor Pitch Event Registration and Guest Management",
        canonicalUrl: "https://urpass.space/bengaluru-investor-pitch-event-registration",
        description: "Invite investors, founders and business guests to Bengaluru pitch events with controlled registration and digital access passes.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bengaluru-investor-pitch-event-registration",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Curate Prestigious Investor Pitch Events",
        ctaDescription: "Screen startup founders and investor credentials, manage private invite codes, deliver VIP passes via WhatsApp, and check in guests in <0.3s.",
        directAnswer: {
        "title": "What is Investor Pitch Event Registration for Bengaluru?",
        "summary": "Investor pitch event registration in Bengaluru provides venture capital funds, angel syndicates, and startup accelerators with private invite management, founder vetting questionnaires, and fast-track VIP check-in for demo days and pitch nights. UrPass ensures 100% attendee confidentiality, WhatsApp pass delivery, and 0% ticket fees.",
        "keyPoints": [
                "Curated founder screening questionnaires capture pitch stage, deck URLs, and MRR",
                "Private hidden tiers accessible only via unique single-use investor invite tokens",
                "100% attendee data confidentiality—investor and founder contacts are never shared",
                "Sub-0.3s smartphone camera scanning provides dignified, queue-free arrivals"
        ]
},
        whatIs: {
        "title": "Why Venture Capitalists & Accelerators Choose UrPass",
        "definition": "Koramangala, Indiranagar, and Central Bangalore host high-stakes venture demo days connecting seed and Series A founders with angel syndicates and venture capital partners. Unvetted crowds dilute the networking value of private pitch events.",
        "details": [
                "Strict applicant review workflow: review pitch deck URLs and LinkedIn handles before issuing credentials",
                "Separate attendee badges for Angel Investors, VCs, Pitching Founders, and Ecosystem Partners",
                "Instant delivery of digital QR credentials straight to attendee WhatsApp numbers and Apple Wallet",
                "Sub-0.3s mobile camera scanning validates guests at private club and hotel doors effortlessly"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Generic Event Portals for Pitch Nights",
        "subtitle": "Why top venture networks in Bengaluru switch to UrPass.",
        "headers": [
                "Venture Requirement",
                "Generic Public Ticketing Portals",
                "UrPass Investor Pitch Engine"
        ],
        "rows": [
                {
                        "col1": "Guest Curation",
                        "col2": "Open registration allows unqualified crowds to drop in",
                        "col3": "Strict approval workflow with founder deck screening"
                },
                {
                        "col1": "Investor Privacy",
                        "col2": "Portal markets investor contact info to other events",
                        "col3": "100% confidential guest directory, strictly yours"
                },
                {
                        "col1": "Private Access Codes",
                        "col2": "Clunky manual email lists or complex invite tools",
                        "col3": "Encrypted single-use invite codes unlock VIP tiers"
                },
                {
                        "col1": "Door Check-In Speed",
                        "col2": "Slow manual name checks on paper or spreadsheets",
                        "col3": "Sub-0.3s camera scan on volunteer smartphones"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "CURATION PIPELINE",
                "title": "Founder Application Screening and Deck Evaluation",
                "paragraphs": [
                        "High-signal pitch events in Bangalore receive dozens of founder applications for 10 coveted pitching slots. Reviewing founder pitch decks and team bios manually in spreadsheets leads to administrative burnout.",
                        "UrPass provides custom intake forms. Collect startup website links, pitch deck URLs, funding stages, and LinkedIn handles before issuing passes. Review applications in a centralized dashboard and approve qualified founders with one click."
                ],
                "bullets": [
                        "Custom text fields, dropdowns, and file upload links for applicant vetting",
                        "Automated acceptance notices dispatched straight to attendee WhatsApp numbers",
                        "Separate badge tiers distinguish Pitching Founders from Attending Angels and VCs",
                        "Export complete applicant answers to CSV for investor committee evaluations"
                ],
                "takeaway": "Bespoke intake forms ensure your Bangalore gatherings maintain high signal."
        },
        {
                "badge": "PRIVATE ACCESS",
                "title": "Single-Use Invite Codes and Private Investor Tiers",
                "paragraphs": [
                        "Managing prominent angel investors and venture capital partners requires extreme discretion. Unlisted VIP ticket tiers ensure institutional investors can register without exposing their attendance publicly.",
                        "UrPass allows organizers to create private, password-protected ticket tiers. Send bespoke single-use invitation tokens to institutional investors that unlock complimentary VIP credentials on your registration page."
                ],
                "bullets": [
                        "Create hidden VIP investor tiers revealed only with valid access codes",
                        "Track investor RSVPs in real time to anticipate catering and seating needs",
                        "Deliver branded Apple Wallet passes that appear on iPhone lockscreens at the venue",
                        "Sub-0.3s fast-track check-in ensures dignitaries enter without waiting"
                ],
                "takeaway": "Single-use access codes protect investor confidentiality and exclusivity."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed, privacy, and zero ticket fees.",
        features: [
          {
            icon: TrendingUp,
            title: "Investor & Founder Tiering",
            desc: "Configure Angel, VC, Pitching Founder, and Ecosystem Partner passes with custom perks.",
          },
          {
            icon: ShieldCheck,
            title: "Applicant Vetting Engine",
            desc: "Review founder pitch decks and LinkedIn handles before issuing entrance credentials.",
          },
          {
            icon: Key,
            title: "Private Invite Access Codes",
            desc: "Create hidden VIP tiers unlocked only via bespoke single-use invitation tokens.",
          },
          {
            icon: QrCode,
            title: "WhatsApp & Wallet Passes",
            desc: "Deliver personalized QR tickets directly to attendee WhatsApp chats and Apple Wallet.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Door Validation",
            desc: "Scan and check in guests instantly using phone cameras with zero app downloads.",
          },
          {
            icon: FileSpreadsheet,
            title: "Confidential Roster Exports",
            desc: "Export verified attendee lists with full contact details and arrival timestamps.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Set Up Pitch Event",
                "desc": "Define pitch night agenda, founder intake questions, and hidden investor tiers."
        },
        {
                "n": "02",
                "title": "Distribute Invite Codes",
                "desc": "Send private invitation tokens to angels, venture partners, and selected founders."
        },
        {
                "n": "03",
                "title": "Review Applications",
                "desc": "Review founder pitch decks and approve qualified teams with one click."
        },
        {
                "n": "04",
                "title": "Issue Digital Passes",
                "desc": "Approved guests receive encrypted QR passes via WhatsApp, email, and Apple Wallet."
        },
        {
                "n": "05",
                "title": "Scan at Reception",
                "desc": "Venue staff validate passes in <0.3s with smartphone cameras for rapid entry."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Investor Pitch Events in Bengaluru?",
        "subtitle": "Venture capitalists, angel syndicates, and accelerator leads.",
        "personas": [
                {
                        "badge": "ACCELERATORS",
                        "title": "Startup Incubators & Hubs",
                        "desc": "Host cohort graduation demo days connecting founders with early-stage funds."
                },
                {
                        "badge": "ANGEL SYNDICATES",
                        "title": "Angel Networks & Clubs",
                        "desc": "Manage monthly pitch breakfasts and closed-door angel investment dinners."
                },
                {
                        "badge": "VENTURE CAPITAL",
                        "title": "VC Annual LP & Founder Days",
                        "desc": "Coordinate portfolio showcase days and executive investor roundtables."
                },
                {
                        "badge": "COMMUNITIES",
                        "title": "Founder-Led Communities",
                        "desc": "Run weekend pitch practice nights and co-founder matchmaking mixers."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Guest Validation Works at Private Venues",
        "subtitle": "Dignified, rapid arrival that preserves your event's exclusive atmosphere.",
        "description": "Investors and founders display their digital pass on their smartphone screen or Apple Wallet. The reception host points their mobile camera at the pass. UrPass validates credentials in under 300 milliseconds, displays the guest's name, tier, and affiliation, and logs the check-in immediately.",
        "points": [
                "Eliminates slow manual searching through printed guest lists at crowded doors.",
                "Displays real-time pass validity with attendee name, fund/startup name, and tier.",
                "Prevents uninvited drop-ins from entering restricted investor sessions.",
                "Supports manual name and email lookup for fast backup check-in."
        ]
},
        faqs: [
        {
                "q": "Why choose UrPass for private investor pitch events in Bengaluru?",
                "a": "UrPass guarantees 100% attendee data confidentiality, provides founder applicant screening workflows, supports hidden VIP investor tiers, and validates passes in <0.3s at the door."
        },
        {
                "q": "Can I screen startup founders before approving their attendance?",
                "a": "Yes. You can require organizers to review and approve registrations before QR passes are dispatched, collecting pitch deck URLs, funding stages, and LinkedIn handles."
        },
        {
                "q": "Can I create secret or hidden ticket tiers for venture capital partners?",
                "a": "Yes. You can create hidden ticket tiers that are only revealed when an investor enters a specific promo or access code on your registration page."
        },
        {
                "q": "Do investors need to download an app to enter the venue?",
                "a": "No. Investors show the QR pass sent to their WhatsApp, Apple Wallet, or email. Venue volunteers scan passes directly through mobile web browsers."
        },
        {
                "q": "What pricing applies to investor pitch events?",
                "a": "UrPass offers a transparent subscription starting at an introductory ₹29/month for your first 2 months (then ₹999/month), with 0% platform ticket fees on paid tiers."
        }
],
      }}
    />
  );
}
