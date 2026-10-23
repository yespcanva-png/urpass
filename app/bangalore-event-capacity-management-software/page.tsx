import type { Metadata } from "next";
import { BarChart3, CreditCard, FileSpreadsheet, ScanLine, ShieldAlert, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Capacity Management Bangalore | UrPass",
  description: "Control registration limits and ticket availability for Bangalore events. Track capacity and manage attendee registrations with UrPass.",
  keywords: ["event capacity management bangalore","registration limit software bengaluru","event venue capacity tracking","prevent event overselling bangalore","real-time attendance limit"],
  alternates: {
    canonical: "https://urpass.space/bangalore-event-capacity-management-software",
  },
  openGraph: {
    title: "Event Capacity Management Bangalore | UrPass",
    description: "Control registration limits and ticket availability for Bangalore events. Track capacity and manage attendee registrations with UrPass.",
    url: "https://urpass.space/bangalore-event-capacity-management-software",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Capacity Management Bangalore | UrPass",
    description: "Control registration limits and ticket availability for Bangalore events. Track capacity and manage attendee registrations with UrPass.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BangaloreEventCapacityManagementSoftwarePage() {
  return (
    <SEOPage
      config={{
        badge: "EVENT CAPACITY CONTROLS",
        h1: "Event Capacity and Registration Limit Management in Bangalore",
        canonicalUrl: "https://urpass.space/bangalore-event-capacity-management-software",
        description: "Control registration limits and ticket availability for Bangalore events. Track capacity and manage attendee registrations with UrPass.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bangalore-event-capacity-management-software",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Prevent Venue Overcrowding",
        ctaDescription: "Enforce strict seat caps, automate waitlists, prevent fire code violations, and monitor real-time hall occupancy across Bangalore venues.",
        directAnswer: {
        "title": "What is Event Capacity Management Software for Bangalore?",
        "summary": "Event capacity management software in Bangalore regulates registration limits, ticket inventory, and real-time room occupancy for venues across Koramangala, Whitefield, and Central Bangalore. UrPass automatically closes sold-out tiers, opens waitlists, and tracks live entry/exit headcounts with sub-0.3s smartphone camera scanning.",
        "keyPoints": [
                "Strict seat and registration inventory limits prevent venue overcrowding",
                "Automated waitlist management promotes waitlisted guests when spots open",
                "Real-time hall occupancy tracking monitors active headcounts inside the venue",
                "Sub-0.3s mobile camera scanning validates passes without equipment rental costs"
        ]
},
        whatIs: {
        "title": "Why Bangalore Venue Organizers Choose UrPass for Capacity",
        "definition": "From boutique studios in Indiranagar to 1,000-seat auditoriums in Whitefield, Bangalore venues enforce strict fire safety and seating capacities. Overselling leads to hazardous conditions and negative attendee reviews.",
        "details": [
                "Atomic database-level locking guarantees tickets can never oversell during high-concurrency drops",
                "Room-by-room capacity management for breakout sessions, workshops, and VIP lounges",
                "Real-time occupancy telemetry tracking active in-venue headcounts vs checked-out guests",
                "0% ticket commission on all paid capacity tiers with direct Razorpay settlement"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Manual Capacity Tracking in Bangalore",
        "subtitle": "Why event coordinators upgrade to UrPass capacity management.",
        "headers": [
                "Capacity Dimension",
                "Manual Google Forms / Spreadsheets",
                "UrPass Capacity Engine"
        ],
        "rows": [
                {
                        "col1": "Overselling Risk",
                        "col2": "High risk: forms stay open during concurrent registrations",
                        "col3": "Zero risk: atomic server locks enforce strict capacity caps"
                },
                {
                        "col1": "Waitlist Automation",
                        "col2": "Manual emails and spreadsheet copy-pasting",
                        "col3": "Automated waitlist queue with instant spot reallocation"
                },
                {
                        "col1": "Live In-Venue Headcount",
                        "col2": "Unknown; organizers rely on rough visual estimates",
                        "col3": "Live occupancy telemetry with entry and exit scanning"
                },
                {
                        "col1": "Breakout Room Limits",
                        "col2": "Crowds overflow into hallways creating safety hazards",
                        "col3": "Room-level scanning enforces individual room capacities"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "ATOMIC LOCKING",
                "title": "Atomic Concurrency Locking Prevents Accidental Overselling",
                "paragraphs": [
                        "When registration opens for highly anticipated tech meetups or exclusive masterclasses in Bangalore, hundreds of prospective attendees register simultaneously within minutes.",
                        "UrPass utilizes database-level atomic locking. When the final available seat is claimed, concurrent transactions are instantly rejected or redirected to the waitlist, ensuring your venue capacity is never exceeded."
                ],
                "bullets": [
                        "Atomic ticket reservation prevents race conditions during high-traffic registration rushes",
                        "Set global event capacity caps or tier-specific limits (e.g., 50 Early Bird, 150 General)",
                        "Real-time countdown display encourages fast registration before spots run out",
                        "Automated registration closing triggers a polite 'Sold Out' notice immediately"
                ],
                "takeaway": "Atomic database locking guarantees you never oversell your venue capacity."
        },
        {
                "badge": "ROOM OCCUPANCY",
                "title": "Real-Time Occupancy Telemetry and Breakout Session Limits",
                "paragraphs": [
                        "Large conferences often have different capacities for the main auditorium versus smaller breakout workshop rooms. Preventing breakout overcrowding is essential for a good attendee experience.",
                        "UrPass allows event teams to station door volunteers outside specific breakout rooms. Volunteers scan passes in sub-0.3s, tracking room headcounts in real time and alerting staff when room limits are reached."
                ],
                "bullets": [
                        "Configure unique capacity limits for individual breakout halls and keynote tracks",
                        "Live room occupancy gauges inform staff when an auditorium is approaching capacity",
                        "Optional exit scanning allows organizers to track dynamic active in-venue headcounts",
                        "Export hall-by-hall attendance logs to CSV for post-conference analytics"
                ],
                "takeaway": "Room-level capacity tracking prevents auditorium congestion and fire hazards."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed, privacy, and zero ticket fees.",
        features: [
          {
            icon: ShieldAlert,
            title: "Strict Capacity Limits",
            desc: "Define exact capacity caps per ticket tier or for the entire event venue.",
          },
          {
            icon: Users,
            title: "Automated Waitlists",
            desc: "Automatically queue interested attendees and promote them when spots open up.",
          },
          {
            icon: BarChart3,
            title: "Live Occupancy Gauges",
            desc: "Monitor real-time active headcounts, ingress flow, and room capacity live.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Camera Scanning",
            desc: "Scan and validate passes instantly on any standard iOS or Android phone browser.",
          },
          {
            icon: CreditCard,
            title: "0% Commission via Razorpay",
            desc: "Collect ticket payments directly into your Razorpay account with zero platform fees.",
          },
          {
            icon: FileSpreadsheet,
            title: "Compliance-Ready Logs",
            desc: "Export verified attendance logs with scan timestamps for venue and fire compliance.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Set Venue Capacity",
                "desc": "Define your Bangalore event details, maximum venue capacity, and ticket tier allocations."
        },
        {
                "n": "02",
                "title": "Configure Waitlist",
                "desc": "Enable automated waitlisting to capture demand once tickets sell out."
        },
        {
                "n": "03",
                "title": "Publish Registration Link",
                "desc": "Share your high-converting registration portal across email, WhatsApp, and social media."
        },
        {
                "n": "04",
                "title": "Monitor Ingress Live",
                "desc": "Gate staff scan passes in <0.3s with smartphone cameras as attendees arrive."
        },
        {
                "n": "05",
                "title": "Review Occupancy Logs",
                "desc": "Download verified attendee check-in records with exact timestamps with one click."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Capacity Management in Bangalore?",
        "subtitle": "Event producers managing physical venue limits across Bengaluru.",
        "personas": [
                {
                        "badge": "WORKSHOPS",
                        "title": "Intensive Bootcamps",
                        "desc": "Enforce strict 30-student limits for coding bootcamps and design masterclasses."
                },
                {
                        "badge": "AUDITORIUMS",
                        "title": "Corporate Conclaves",
                        "desc": "Manage 500+ seat auditoriums in Whitefield and Electronic City without overflow."
                },
                {
                        "badge": "MEETUPS",
                        "title": "Co-Working Mixers",
                        "desc": "Ensure community events in Koramangala and HSR Layout comply with cafe capacities."
                },
                {
                        "badge": "EXPOS",
                        "title": "Trade & Industry Expos",
                        "desc": "Monitor concurrent hall occupancy across exhibition pavilions at KTPO or BIEC."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Gate Check-In Enforces Capacity Limits",
        "subtitle": "Fast, accurate attendance tracking that protects venue safety.",
        "description": "Attendees present their digital pass on their smartphone screen or Apple Wallet. Gate staff point their mobile camera at the pass. UrPass validates credentials in under 300 milliseconds, displays the attendee's name, logs their entry, and updates live venue occupancy gauges immediately.",
        "points": [
                "Eliminates manual headcount clickers and paper tally sheets at the door.",
                "Displays real-time pass validity with attendee name, organization, and tier.",
                "Prevents unverified guests from entering once venue capacity is reached.",
                "Supports manual name and email lookup for fast backup check-in."
        ]
},
        faqs: [
        {
                "q": "How does UrPass prevent events from overselling?",
                "a": "UrPass uses database-level atomic locking. The moment your configured seat limit is reached, registration instantly closes or redirects new applicants to a waitlist."
        },
        {
                "q": "Can I manage capacities for individual breakout rooms?",
                "a": "Yes. You can assign different scanning stations to different breakout tracks or auditoriums to monitor room-by-room capacity and prevent overcrowding."
        },
        {
                "q": "What happens when an attendee cancels their registration?",
                "a": "If an attendee cancels, UrPass can automatically notify and promote the next person on your waitlist, ensuring your venue reaches 100% capacity."
        },
        {
                "q": "Can I track how many people are currently inside the venue?",
                "a": "Yes. By enabling optional exit scanning alongside entry scanning, your organizer dashboard displays a live in-venue active headcount."
        },
        {
                "q": "What pricing applies to capacity-managed events?",
                "a": "UrPass offers a transparent subscription starting from ₹499/month, with 0% platform ticket fees on paid tiers."
        }
],
      }}
    />
  );
}
