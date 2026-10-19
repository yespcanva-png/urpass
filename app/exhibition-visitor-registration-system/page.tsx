import type { Metadata } from "next";
import { BarChart3, Building2, Layers, QrCode, ScanLine, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Exhibition Visitor Registration | UrPass",
  description: "Register exhibition visitors online, issue unique QR passes and monitor attendance at venue entrances with UrPass visitor management.",
  keywords: ["exhibition visitor registration system","trade show visitor registration","expo visitor badge software","exhibition check in system","trade fair visitor tracking","expo qr pass generator"],
  alternates: {
    canonical: "https://urpass.space/exhibition-visitor-registration-system",
  },
  openGraph: {
    title: "Exhibition Visitor Registration | UrPass",
    description: "Register exhibition visitors online, issue unique QR passes and monitor attendance at venue entrances with UrPass visitor management.",
    url: "https://urpass.space/exhibition-visitor-registration-system",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Exhibition Visitor Registration | UrPass",
    description: "Register exhibition visitors online, issue unique QR passes and monitor attendance at venue entrances with UrPass visitor management.",
  },
};

export default function ExhibitionVisitorRegistrationSystemPage() {
  return (
    <SEOPage
      config={{
        badge: "EXHIBITIONS & TRADE SHOWS",
        h1: "Exhibition Visitor Registration and Entry Tracking",
        canonicalUrl: "https://urpass.space/exhibition-visitor-registration-system",
        description: "Register exhibition visitors online, issue unique QR passes and monitor attendance at venue entrances with UrPass visitor management.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=exhibition-visitor-registration-system",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Streamline Exhibition Visitor Registration & Gate Access",
        ctaDescription: "Pre-register trade buyers, issue instant digital QR visitor badges, and clear expo hall entrance gates in under 0.3 seconds.",
        directAnswer: {
        "title": "What is an Exhibition Visitor Registration System?",
        "summary": "An exhibition visitor registration system enables trade show and expo organizers to register attendees, pre-screen trade visitors, issue digital exhibition badges, and monitor hall entry in real time with high-speed smartphone QR scanners, eliminating physical queue bottlenecks at convention center turnstiles.",
        "keyPoints": [
                "Pre-registration forms with visitor qualification questions (industry, company size, buyer role)",
                "Instant issuance of encrypted digital visitor badges with dynamic QR codes",
                "Sub-0.3 second smartphone camera scanning clearing thousands of visitors rapidly",
                "Real-time hall occupancy monitoring to comply with convention center fire safety limits"
        ]
},
        whatIs: {
        "title": "How UrPass Solves Exhibition Entrance Congestion",
        "definition": "Trade fairs, expos, and consumer exhibitions frequently suffer from massive morning entrance queues as thousands of pre-registered visitors wait to collect physical paper badges. UrPass modernizes the entire workflow by issuing digital QR visitor passes that attendees present directly on their smartphones.",
        "details": [
                "Eliminates expensive on-site badge printing kiosks and paper badge queues",
                "Enables multi-hall access control across Main Entrances, Exhibitor Doors, and VIP Lounges",
                "Tracks trade buyer attendance and footfall velocity live throughout expo days",
                "Provides exportable visitor demographic data for exhibitor ROI and post-show audits"
        ]
},
        keyFactsTable: {
        "title": "Digital QR Passes vs On-Site Thermal Badge Printing Kiosks",
        "subtitle": "Why exhibition organizers are transitioning from physical badges to digital credentials.",
        "headers": [
                "Operational Requirement",
                "On-Site Badge Printing Kiosks",
                "UrPass Digital Visitor Pass Engine"
        ],
        "rows": [
                {
                        "col1": "Equipment Costs",
                        "col2": "Heavy kiosk rentals, thermal printers, ribbons, and badge paper",
                        "col3": "₹0 hardware; door volunteers scan using their own smartphones"
                },
                {
                        "col1": "Queue Wait Times",
                        "col2": "30-90 seconds per visitor while thermal printers jam or load",
                        "col3": "Under 0.3s per visitor with direct phone camera scanning"
                },
                {
                        "col1": "Consumables Waste",
                        "col2": "Thousands of discarded plastic lanyard pouches and paper cards",
                        "col3": "100% paperless digital passes living in mobile phone browsers"
                },
                {
                        "col1": "Multi-Hall Coordination",
                        "col2": "Fragmented turnstile terminals with complex local network cabling",
                        "col3": "Centralized cloud sync across all expo hall entrance doors"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "TRADE QUALIFICATION",
                "title": "Pre-Screen Trade Buyers and Capture B2B Demographics",
                "paragraphs": [
                        "Commercial trade exhibitions depend on delivering qualified business buyers to exhibitors. Allowing unqualified public registrations dilutes exhibitor value and wastes vendor time.",
                        "UrPass allows exhibition organizers to build detailed pre-registration forms capturing visitor industry sector, purchasing authority, company size, and product interests. Organizers can configure automated trade pass issuance or review and approve business credentials before releasing exhibition entry badges."
                ],
                "bullets": [
                        "Capture trade demographics: job role, company revenue, and sourcing budget",
                        "Approval workflows to qualify B2B trade buyers before issuing badges",
                        "Role-based visitor badging: Trade Buyer, VIP Buyer, Exhibitor Staff, and Press",
                        "Automated confirmation emails with venue directions and exhibition floor maps"
                ],
                "takeaway": "Qualified visitor registration protects exhibitor satisfaction and event ROI."
        },
        {
                "badge": "HALL OCCUPANCY",
                "title": "Real-Time Ingress Velocity and Hall Capacity Compliance",
                "paragraphs": [
                        "Convention centers and trade expo halls operate under strict local municipal fire safety and maximum occupancy regulations. When thousands of visitors surge through exhibition doors during peak morning hours, organizers must maintain real-time headcount records.",
                        "UrPass provides real-time gate occupancy telemetry. Organizers view exact live entry counts per hall, arrival velocity curves, and total venue occupancy on a central dashboard, enabling immediate crowd control rebalancing when specific exhibition halls approach capacity."
                ],
                "bullets": [
                        "Live headcount telemetry showing current visitors inside each exhibition hall",
                        "Automated safety threshold alerts when hall occupancy nears safety maximums",
                        "Rebalance gate door staff based on real-time arrival velocity graphs",
                        "Complete timestamped ingress logs for venue compliance authorities"
                ],
                "takeaway": "Maintain complete real-time safety compliance across multi-hall exhibition venues."
        }
],
        featuresTitle: "Industry-Grade Capabilities",
        featuresSubtitle: "Purpose-built for your specific event operational workflows.",
        features: [
          {
            icon: Building2,
            title: "Visitor Pre-Registration",
            desc: "Build customized trade visitor registration forms with business qualification questions.",
          },
          {
            icon: QrCode,
            title: "Digital Visitor Badges",
            desc: "Issue scannable digital passes featuring visitor name, company, and trade category.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Gate Validation",
            desc: "Scan and check in visitors at expo hall doors in milliseconds using mobile cameras.",
          },
          {
            icon: ShieldCheck,
            title: "Cross-Gate Anti-Duplicate",
            desc: "Prevent pass sharing across multiple expo hall doors with atomic database row locks.",
          },
          {
            icon: Layers,
            title: "Multi-Hall Access Control",
            desc: "Manage distinct entry permissions for General Halls, VIP Lounges, and Exhibitor Zones.",
          },
          {
            icon: BarChart3,
            title: "Live Footfall Telemetry",
            desc: "Monitor visitor arrival curves, peak traffic times, and total hall headcounts in real time.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Create Exhibition Form",
                "desc": "Set up visitor registration questions, trade categories, and ticket pricing tiers."
        },
        {
                "n": "02",
                "title": "Launch Pre-Registration",
                "desc": "Publish your mobile-responsive visitor registration portal across your marketing channels."
        },
        {
                "n": "03",
                "title": "Automatic Badge Delivery",
                "desc": "Visitors receive encrypted digital QR passes via email, WhatsApp, and Apple Wallet."
        },
        {
                "n": "04",
                "title": "Scan at Expo Entrances",
                "desc": "Door staff scan visitor passes using smartphone browsers for instant green entry."
        },
        {
                "n": "05",
                "title": "Analyze Live Footfall",
                "desc": "Track visitor ingress velocity, peak hours, and export verified attendance records."
        }
],
        whoShouldUse: {
        "title": "Who Relies on UrPass for Exhibition Visitor Management?",
        "subtitle": "Trade fair producers, consumer expos, and convention organizers.",
        "personas": [
                {
                        "badge": "TRADE FAIRS",
                        "title": "B2B Trade Exhibitions",
                        "desc": "Pre-screen industrial trade buyers, manage exhibitor staff passes, and track hall admissions."
                },
                {
                        "badge": "CONSUMER EXPOS",
                        "title": "Property, Auto & Consumer Shows",
                        "desc": "Pre-sell public visitor tickets and process high-volume weekend crowds with sub-second phone scanning."
                },
                {
                        "badge": "ART & DESIGN",
                        "title": "Art Fairs & Design Biennales",
                        "desc": "Issue elegant digital invitation credentials for VIP preview nights and collector admissions."
                },
                {
                        "badge": "JOB FAIRS",
                        "title": "Career & Education Fairs",
                        "desc": "Register thousands of student jobseekers and monitor hall headcounts safely."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Visitor Check-In Operates at Expo Hall Entrances",
        "subtitle": "Frictionless, rapid door entry that eliminates entrance queues.",
        "description": "Visitors present their digital QR pass on their phone screen or WhatsApp message. Entrance staff point their smartphone camera at the pass. UrPass validates the cryptographic token in under 300 milliseconds, displays the visitor's trade category and company name, and marks them admitted.",
        "points": [
                "Zero equipment rentals; uses staff and temporary volunteer smartphones.",
                "Audible green chime confirms valid admission in noisy convention halls.",
                "Real-time cloud sync prevents screenshot sharing across multiple entrance doors.",
                "Quick search by visitor name or email allows instant lookup if a phone battery dies."
        ]
},
        faqs: [
        {
                "q": "Can visitors present their passes on their smartphones without printing?",
                "a": "Yes. UrPass is designed specifically for digital-first mobile entry. Visitors display their QR pass directly on their smartphone screen or Apple Wallet for instant scanning."
        },
        {
                "q": "How fast is the smartphone camera check-in during peak morning arrival?",
                "a": "UrPass validates passes in under 0.3 seconds. A single volunteer scanner can comfortably process 12 to 18 visitors per minute, allowing a team of four scanners to process over 1,000 visitors in approximately 15 minutes."
        },
        {
                "q": "Can we restrict certain passes to specific halls or VIP areas?",
                "a": "Yes. You can configure multi-gate and zone access rules. For example, general visitor passes can be restricted to Exhibition Halls 1-3, while VIP Buyer passes can access the VIP Lounge and Keynote Theatre."
        },
        {
                "q": "Can we collect paid ticket fees for consumer exhibitions?",
                "a": "Yes. In India, you can connect Razorpay to accept instant UPI, cards, and net banking. Internationally, connect Stripe with 0% platform ticket commission."
        },
        {
                "q": "Can we export visitor demographic data after the expo?",
                "a": "Yes. You can export complete CSV reports containing visitor registration answers, company details, job titles, and exact entry timestamps anytime."
        }
],
      }}
    />
  );
}
