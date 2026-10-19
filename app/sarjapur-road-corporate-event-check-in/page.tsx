import type { Metadata } from "next";
import { BarChart3, CreditCard, QrCode, ScanLine, Users, WifiOff } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Sarjapur Road Event Check-In | UrPass",
  description: "Manage Sarjapur Road corporate gatherings with digital registration, QR guest verification and real-time attendee counts.",
  keywords: ["corporate event check in sarjapur road","sarjapur road event registration","doddakannelli corporate check-in","sarjapur tech park event passes","carmelaram conference check in"],
  alternates: {
    canonical: "https://urpass.space/sarjapur-road-corporate-event-check-in",
  },
  openGraph: {
    title: "Sarjapur Road Event Check-In | UrPass",
    description: "Manage Sarjapur Road corporate gatherings with digital registration, QR guest verification and real-time attendee counts.",
    url: "https://urpass.space/sarjapur-road-corporate-event-check-in",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarjapur Road Event Check-In | UrPass",
    description: "Manage Sarjapur Road corporate gatherings with digital registration, QR guest verification and real-time attendee counts.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function SarjapurRoadCorporateEventCheckInPage() {
  return (
    <SEOPage
      config={{
        badge: "SARJAPUR ROAD CORPORATE CHECK-IN",
        h1: "Corporate Event QR Check-In for Sarjapur Road",
        canonicalUrl: "https://urpass.space/sarjapur-road-corporate-event-check-in",
        description: "QR check-in and attendee management for corporate events on Sarjapur Road, Bangalore. Fast scanning, offline support, and multi-gate entry management.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=sarjapur-road-corporate-event-check-in",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Power Corporate Event Check-In on Sarjapur Road",
        ctaDescription: "Clear hotel ballroom and campus gates in <0.3s, issue digital QR passes on WhatsApp, and manage offline-resilient check-in on Sarjapur Road.",
        directAnswer: {
        "title": "What is Corporate Event Check-In for Sarjapur Road?",
        "summary": "Corporate event check-in on Sarjapur Road provides business parks, hotel convention centers, and tech campuses along Sarjapur Road and Doddakannelli with high-speed QR badge verification, multi-gate sync, and offline-resilient scanning. UrPass turns standard mobile phone cameras into sub-0.3s barcode scanners with 0% ticketing commission.",
        "keyPoints": [
                "Tailored for business parks, hotel convention centers, and tech corridors along Sarjapur Road",
                "Sub-0.3s smartphone camera scanning validates attendee QR passes in mobile Safari and Chrome",
                "Offline-resilient caching guarantees uninterrupted scanning during banquet hall Wi-Fi drops",
                "Multi-gate cloud synchronization prevents pass reuse across multiple conference doors"
        ]
},
        whatIs: {
        "title": "Why Sarjapur Road Event Directors Run on UrPass",
        "definition": "Sarjapur Road and the Carmelaram-Doddakannelli corridor host rapidly expanding enterprise tech parks and luxury event venues. UrPass replaces sluggish hardware rentals and paper rosters with an agile mobile check-in engine.",
        "details": [
                "Zero scanner hardware rentals—volunteers use standard smartphones to validate badges",
                "Offline-resilient scanning continues uninterrupted even when basement reception drops",
                "Multi-gate cloud synchronization ensures atomic pass locking and prevents duplicate entries",
                "Real-time attendance dashboard displays arrival velocity and hall capacities live"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Hardware Scanner Rentals on Sarjapur Road",
        "subtitle": "Why corporate event teams on Sarjapur Road choose UrPass mobile scanning.",
        "headers": [
                "Operational Feature",
                "Hardware Rental Scanners",
                "UrPass Mobile Scanning"
        ],
        "rows": [
                {
                        "col1": "Hardware Costs",
                        "col2": "₹2,500 to ₹5,000 per scanner rental per day",
                        "col3": "₹0 hardware cost; runs on standard smartphones"
                },
                {
                        "col1": "Offline Reliability",
                        "col2": "Prone to connection drops and data loss",
                        "col3": "Built-in client-side offline ticket verification"
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
                "badge": "OFFLINE RESILIENCE",
                "title": "Offline-Resilient Validation for Hotel Ballrooms and Basements",
                "paragraphs": [
                        "Hotel ballrooms and tech park banquet venues along Sarjapur Road frequently suffer from congested cellular connectivity and fluctuating Wi-Fi when hundreds of attendees gather in enclosed spaces.",
                        "UrPass incorporates client-side offline ticket caching. Scanning devices pre-load the encrypted attendee validation roster. When internet drops, phone cameras continue verifying QR passes in under 300 milliseconds without pause."
                ],
                "bullets": [
                        "Local ticket validation continues smoothly during Wi-Fi outages",
                        "Automated background sync reconciles check-ins once connectivity is restored",
                        "Eliminates embarrassing registration delays caused by venue cellular dead zones",
                        "Visual color-coded indicators inform staff of online and offline sync status"
                ],
                "takeaway": "Offline-resilient scanning guarantees zero check-in downtime at challenging venues."
        },
        {
                "badge": "MULTI-GATE SYNC",
                "title": "Multi-Gate Cloud Synchronization Across Reception Points",
                "paragraphs": [
                        "Corporate conferences on Sarjapur Road often utilize multiple entrance gates: main lobby registration, executive VIP desks, and breakout room doors.",
                        "UrPass provides real-time multi-gate synchronization. When an attendee pass is scanned at one gate, the database immediately locks the token, preventing unauthorized pass re-use at other entrances."
                ],
                "bullets": [
                        "Assign unique scan stations for general admission, VIP speakers, and media",
                        "Real-time duplicate detection alerts staff with visual audio warning if a pass is reused",
                        "Zero scanner hardware rentals—coordinate dozens of staff with secure browser scan links",
                        "Track entrance-by-entrance traffic volumes to dynamically reallocate volunteer staff"
                ],
                "takeaway": "Real-time synchronization prevents pass reuse across multiple conference doors."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed and zero ticket fees.",
        features: [
          {
            icon: ScanLine,
            title: "Sub-0.3s Camera Check-In",
            desc: "Turn any volunteer smartphone into an enterprise QR scanner via standard web browsers.",
          },
          {
            icon: WifiOff,
            title: "Offline-Resilient Caching",
            desc: "Validate passes seamlessly even when ballroom Wi-Fi or cellular networks fluctuate.",
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
            title: "Live Attendance Metrics",
            desc: "Monitor arrival throughput, peak door traffic, and real-time hall capacity live.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Set Up Sarjapur Event",
                "desc": "Define summit tracks, delegate tiers, early bird pricing, and corporate GST details."
        },
        {
                "n": "02",
                "title": "Configure Ticket Tiers",
                "desc": "Set up general admission, executive delegate, speaker, and sponsor pass categories."
        },
        {
                "n": "03",
                "title": "Publish Registration Portal",
                "desc": "Share your responsive registration page with prospective summit attendees."
        },
        {
                "n": "04",
                "title": "Issue Digital Passes",
                "desc": "Attendees receive personalized digital QR passes via email, WhatsApp, and Apple Wallet."
        },
        {
                "n": "05",
                "title": "Scan at Venue Doors",
                "desc": "Gate staff scan passes in <0.3s with smartphone cameras for rapid executive entry."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass on Sarjapur Road?",
        "subtitle": "Corporate event producers and facility directors along Sarjapur Road.",
        "personas": [
                {
                        "badge": "TECH ENTERPRISES",
                        "title": "Sarjapur Road Tech Campuses",
                        "desc": "Host all-hands town halls, annual conventions, and global leadership summits."
                },
                {
                        "badge": "HOTEL CONVENTIONS",
                        "title": "Banquet & Convention Centers",
                        "desc": "Coordinate corporate galas, partner conclaves, and industry conferences."
                },
                {
                        "badge": "HR & INTERNAL",
                        "title": "People & Talent Teams",
                        "desc": "Coordinate employee offsites, wellness days, and cultural celebrations with paperless passes."
                },
                {
                        "badge": "TRAINING CONCLAVES",
                        "title": "Executive Seminars",
                        "desc": "Manage high-value leadership roundtables and technology symposiums with privacy assurance."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Gate Check-In Functions at Sarjapur Road Venues",
        "subtitle": "Fast, organized arrival that clears corporate lobby check-in desks.",
        "description": "Employees and guests display their digital pass on their smartphone screen or Apple Wallet. Reception staff point their mobile camera at the pass. UrPass validates credentials in under 300 milliseconds, displays the attendee's name and tier, and marks them present.",
        "points": [
                "Eliminates slow manual searching through printed corporate attendee binders.",
                "Displays real-time pass validity with attendee name, designation, and tier.",
                "Prevents duplicate entry attempts across multiple entrance gates automatically.",
                "Supports manual name and email lookup for fast backup check-in."
        ]
},
        faqs: [
        {
                "q": "Why is offline QR check-in crucial for Sarjapur Road venues?",
                "a": "Convention halls and hotel banquets along Sarjapur Road often suffer from congested cellular reception. UrPass caches attendee validation lists locally on scanning phones, ensuring instant verification without network delays."
        },
        {
                "q": "Can we assign different entrance gates for VIPs and general delegates?",
                "a": "Yes. UrPass lets you create distinct gate-specific scanning stations, tracking arrivals by entrance point in real time."
        },
        {
                "q": "How do guests receive their entry credentials?",
                "a": "Guests receive digital QR badges delivered instantly to their WhatsApp numbers and email inboxes upon registration, ready to be presented at arrival."
        },
        {
                "q": "Does UrPass charge commission on ticketed corporate seminars?",
                "a": "No. UrPass charges 0% commission on ticket sales. You connect your own Razorpay account and pay only a flat monthly software subscription."
        },
        {
                "q": "Can attendees save their corporate pass to Apple Wallet?",
                "a": "Yes. UrPass digital passes feature native Apple Wallet (.pkpass) support. Attendees can add their pass with one tap and retrieve it from their iPhone lockscreen upon arriving at the venue."
        }
],
      }}
    />
  );
}
