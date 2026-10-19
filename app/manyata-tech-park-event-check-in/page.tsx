import type { Metadata } from "next";
import { BarChart3, CreditCard, QrCode, ScanLine, ShieldCheck, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Manyata Tech Park Event Check-In | UrPass",
  description: "Simplify corporate event check-ins near Manyata Tech Park with mobile QR scanning, digital guest passes and attendance reporting.",
  keywords: ["manyata tech park event check in","north bangalore conference registration","hebbal corporate event passes","nagavara tech summit check in","manyata embassy business park events"],
  alternates: {
    canonical: "https://urpass.space/manyata-tech-park-event-check-in",
  },
  openGraph: {
    title: "Manyata Tech Park Event Check-In | UrPass",
    description: "Simplify corporate event check-ins near Manyata Tech Park with mobile QR scanning, digital guest passes and attendance reporting.",
    url: "https://urpass.space/manyata-tech-park-event-check-in",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manyata Tech Park Event Check-In | UrPass",
    description: "Simplify corporate event check-ins near Manyata Tech Park with mobile QR scanning, digital guest passes and attendance reporting.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function ManyataTechParkEventCheckInPage() {
  return (
    <SEOPage
      config={{
        badge: "MANYATA TECH PARK CHECK-IN",
        h1: "QR Check-In for Corporate Events Near Manyata Tech Park",
        canonicalUrl: "https://urpass.space/manyata-tech-park-event-check-in",
        description: "Manage event check-in and attendee registration near Manyata Tech Park, North Bangalore. QR scanning on any mobile phone, no hardware rentals needed.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=manyata-tech-park-event-check-in",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Modernize Manyata Tech Park Event Check-In",
        ctaDescription: "Clear morning entrance queues in <0.3s, issue digital QR passes on WhatsApp, and manage multi-gate check-in near Manyata Embassy Business Park.",
        directAnswer: {
        "title": "What is Event Check-In Software for Manyata Tech Park?",
        "summary": "Event check-in software for Manyata Tech Park provides enterprise summits, tech conferences, and corporate town halls near Manyata Embassy Business Park with rapid QR badge verification, multi-gate sync, and real-time attendance dashboards. UrPass turns everyday mobile phones into sub-0.3s barcode scanners with zero hardware rentals and 0% ticket commission.",
        "keyPoints": [
                "Optimized for North Bangalore conference venues across Manyata Tech Park, Nagavara, and Hebbal",
                "Sub-0.3s smartphone camera scanning validates attendees on mobile Safari and Chrome",
                "Synchronized multi-gate ingress control across main lobby, breakout halls, and executive lounges",
                "Zero scanner rental costs—coordinate dozens of volunteers with secure browser scan links"
        ]
},
        whatIs: {
        "title": "Why North Bangalore Event Producers Rely on UrPass",
        "definition": "Manyata Embassy Business Park hosts leading software multinationals and engineering centers. Corporate conferences and partner conclaves held in North Bangalore require fast, professional gate check-in.",
        "details": [
                "Eliminate expensive scanner hardware rentals—volunteers use their own smartphones",
                "Sub-0.3s scan latency clears peak morning conference registration lines effortlessly",
                "Multi-gate cloud synchronization ensures atomic pass locking and prevents duplicate entries",
                "Real-time attendance dashboard displays arrival velocity and hall capacities live"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Hardware Scanner Rentals near Manyata",
        "subtitle": "Why North Bangalore corporate event teams switch to UrPass mobile check-in.",
        "headers": [
                "Operational Feature",
                "Hardware Scanner Rental Companies",
                "UrPass Mobile Check-In"
        ],
        "rows": [
                {
                        "col1": "Hardware Costs",
                        "col2": "₹2,500 to ₹5,000 per scanner rental per day",
                        "col3": "₹0 hardware cost; runs on standard smartphones"
                },
                {
                        "col1": "Setup & Training",
                        "col2": "Complex hardware pairing and battery recharging",
                        "col3": "Zero training; open camera web link and start scanning"
                },
                {
                        "col1": "Scan Latency",
                        "col2": "1 to 2 seconds with mechanical laser scanners",
                        "col3": "Sub-0.3s camera scan on mobile browsers"
                },
                {
                        "col1": "Attendance Reporting",
                        "col2": "Data extracted manually via USB cable post-event",
                        "col3": "Live cloud dashboard with instant CSV exports"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "MULTI-GATE INGRESS",
                "title": "Synchronized Multi-Gate Ingress Across Tech Park Entrances",
                "paragraphs": [
                        "Conferences near Manyata Tech Park typically have multiple entry checkpoints: main ground floor security, pre-function lobby registration, VIP fast-track desks, and breakout room doors.",
                        "UrPass provides real-time multi-gate synchronization. When an attendee pass is scanned at one gate, the database immediately locks the token, preventing unauthorized pass re-use at other entrances."
                ],
                "bullets": [
                        "Assign unique scan stations for general admission, VIP speakers, and media",
                        "Real-time duplicate detection alerts staff with visual audio warning if a pass is reused",
                        "Offline-resilient scanning mode ensures continuity during temporary network drops",
                        "Track entrance-by-entrance traffic volumes to dynamically reallocate volunteer staff"
                ],
                "takeaway": "Real-time synchronization prevents pass reuse across multiple conference doors."
        },
        {
                "badge": "HARDWARE SAVINGS",
                "title": "Zero Equipment Rentals with Universal Smartphone Scanning",
                "paragraphs": [
                        "Renting optical barcode scanning hardware for large corporate summits costs tens of thousands of rupees and creates logistical headaches with charging cables, pairing errors, and equipment returns.",
                        "UrPass operates directly inside mobile web browsers. Event managers send a secure scanning link to volunteers and security teams, allowing them to start validating passes instantly with their phone cameras."
                ],
                "bullets": [
                        "Compatible with iOS Safari and Android Google Chrome browsers",
                        "No app installation required for volunteers or gate staff",
                        "High-contrast visual feedback (green pass, amber duplicate, red invalid)",
                        "Search attendee by name or corporate email for instant manual check-in"
                ],
                "takeaway": "Browser-based scanning eliminates hardware costs and streamlines staff operations."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed and zero ticket fees.",
        features: [
          {
            icon: ScanLine,
            title: "Sub-0.3s Phone Scanning",
            desc: "Turn any volunteer smartphone into an enterprise QR scanner via standard web browsers.",
          },
          {
            icon: ShieldCheck,
            title: "Atomic Pass Locking",
            desc: "Cryptographic QR tokens prevent ticket pass-backs and duplicate entries across gates.",
          },
          {
            icon: Users,
            title: "Multi-Gate Synchronization",
            desc: "Coordinate dozens of volunteer scanning stations across multiple lobby entrances.",
          },
          {
            icon: CreditCard,
            title: "0% Commission via Razorpay",
            desc: "Collect delegate ticket payments directly with zero platform percentage deductions.",
          },
          {
            icon: QrCode,
            title: "WhatsApp & Apple Wallet",
            desc: "Deliver personalized digital passes straight to attendee WhatsApp and Apple Wallet.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance Telemetry",
            desc: "Monitor arrival throughput, peak door traffic, and real-time hall capacity live.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Set Up Manyata Event Page",
                "desc": "Define summit tracks, delegate tiers, early bird pricing, and corporate GST details."
        },
        {
                "n": "02",
                "title": "Configure Ticket Tiers",
                "desc": "Set up general admission, executive delegate, speaker, and sponsor pass categories."
        },
        {
                "n": "03",
                "title": "Share Registration Link",
                "desc": "Publish your mobile-responsive registration page to prospective summit attendees."
        },
        {
                "n": "04",
                "title": "Issue Digital Passes",
                "desc": "Attendees receive personalized digital QR passes via email, WhatsApp, and Apple Wallet."
        },
        {
                "n": "05",
                "title": "Scan at Lobby Doors",
                "desc": "Gate staff scan passes in <0.3s with smartphone cameras for rapid executive entry."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass near Manyata Tech Park?",
        "subtitle": "Enterprise event teams and conference coordinators across North Bangalore.",
        "personas": [
                {
                        "badge": "TECH ENTERPRISES",
                        "title": "Multinational IT Campuses",
                        "desc": "Host enterprise summits, company all-hands, and developer symposiums near Manyata."
                },
                {
                        "badge": "B2B SUMMITS",
                        "title": "Corporate Conference Teams",
                        "desc": "Manage high-value delegate credentials, executive check-in, and sponsor tracks."
                },
                {
                        "badge": "HOTEL CONVENTIONS",
                        "title": "Hebbal & Nagavara Venues",
                        "desc": "Coordinate wedding receptions, corporate galas, and trade expos in North Bangalore."
                },
                {
                        "badge": "TRAINING CONCLAVES",
                        "title": "Professional Training Institutes",
                        "desc": "Manage multi-day corporate training workshops with automated digital attendance logs."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Check-In Operates at Manyata Venues",
        "subtitle": "Lightning-fast executive arrival that eliminates lobby congestion.",
        "description": "Attendees present their digital pass on their smartphone screen or Apple Wallet. Reception staff point their mobile camera at the pass. UrPass validates credentials in under 300 milliseconds, displays the attendee's name and ticket tier, and logs the check-in immediately.",
        "points": [
                "Eliminates slow manual searching through printed alphabetical attendee rosters.",
                "Displays real-time pass validity with attendee name, organization, and tier.",
                "Prevents duplicate entry attempts across multiple entrance gates automatically.",
                "Supports manual name and email lookup for fast backup check-in."
        ]
},
        faqs: [
        {
                "q": "How does UrPass speed up morning check-in at Manyata Tech Park events?",
                "a": "UrPass utilizes high-speed web camera scanning on smartphones capable of verifying QR passes in under 500 milliseconds, allowing multiple volunteer check-in lines to process hundreds of delegates per minute."
        },
        {
                "q": "Can we manage multiple entrances simultaneously?",
                "a": "Yes. You can assign different volunteer scan links for each gate, reception desk, or auditorium entrance, all synchronizing in real time to prevent duplicate entry attempts."
        },
        {
                "q": "Does the scanner work if mobile internet drops in basement halls?",
                "a": "Yes. UrPass incorporates client-side offline ticket caching so gate scanning continues without pause even during temporary connectivity drops."
        },
        {
                "q": "How do corporate delegates access their passes?",
                "a": "Delegates receive their digital passes instantly on WhatsApp, Apple Wallet, or corporate email, ready to be scanned right from their smartphone screens."
        },
        {
                "q": "Can delegates add their conference pass to Apple Wallet?",
                "a": "Yes. UrPass digital passes feature native Apple Wallet (.pkpass) support. Delegates can add their pass with one tap and retrieve it from their iPhone lockscreen upon arriving at the venue."
        }
],
      }}
    />
  );
}
