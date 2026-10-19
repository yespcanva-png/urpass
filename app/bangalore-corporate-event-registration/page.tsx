import type { Metadata } from "next";
import { BarChart3, FileText, ScanLine, ShieldCheck, Smartphone, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Corporate Event Registration Bangalore | UrPass",
  description: "Coordinate corporate events in Bangalore with guest registration, personalized passes and live QR attendance reporting.",
  keywords: ["bangalore corporate event registration","corporate event registration software bangalore","enterprise event check in bengaluru","company town hall check in bangalore","employee event passes karnataka"],
  alternates: {
    canonical: "https://urpass.space/bangalore-corporate-event-registration",
  },
  openGraph: {
    title: "Corporate Event Registration Bangalore | UrPass",
    description: "Coordinate corporate events in Bangalore with guest registration, personalized passes and live QR attendance reporting.",
    url: "https://urpass.space/bangalore-corporate-event-registration",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Corporate Event Registration Bangalore | UrPass",
    description: "Coordinate corporate events in Bangalore with guest registration, personalized passes and live QR attendance reporting.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BangaloreCorporateEventRegistrationPage() {
  return (
    <SEOPage
      config={{
        badge: "CORPORATE EVENTS BANGALORE",
        h1: "Corporate Event Registration Software for Bangalore",
        canonicalUrl: "https://urpass.space/bangalore-corporate-event-registration",
        description: "Coordinate corporate events in Bangalore with guest registration, personalized passes and live QR attendance reporting.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bangalore-corporate-event-registration",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Streamline Corporate Events Across Bangalore Tech Parks",
        ctaDescription: "Enforce corporate domain restrictions, issue executive Apple Wallet passes, and verify employee attendance with sub-second phone scanning.",
        directAnswer: {
        "title": "What is Corporate Event Registration Software for Bangalore?",
        "summary": "Corporate event registration software for Bangalore manages employee town halls, leadership summits, partner conclaves, and client dinners. It features domain-restricted registration (@company.com), executive digital credentials with Apple Wallet support, and discreet sub-0.3s smartphone camera check-in with tamper-proof compliance logs.",
        "keyPoints": [
                "Domain-restricted registration ensuring only verified employees with company emails can register",
                "Executive digital credentials with Apple Wallet support and calendar sync",
                "Sub-0.3 second smartphone camera scanning for discreet, rapid executive check-in",
                "Complete enterprise data isolation and GDPR/privacy-compliant audit logs"
        ]
},
        whatIs: {
        "title": "How UrPass Supports Bangalore's Corporate Enterprise Ecosystem",
        "definition": "With hundreds of multinational tech campuses, GCCs (Global Capability Centers), and enterprise headquarters across Bangalore, corporate event teams need software that satisfies strict internal security standards while providing a VIP guest experience.",
        "details": [
                "Restricts registration to corporate email domains (@enterprise.com) for internal security",
                "Generates customized executive passes with company branding and seating designations",
                "Maintains privacy compliance with strict organization data segregation and encryption",
                "Provides executive arrival notifications so event hosts know when VIPs arrive"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Generic Survey Forms & Enterprise Intranet Tools",
        "subtitle": "Why corporate workplace and event marketing teams in Bangalore switch to UrPass.",
        "headers": [
                "Operational Requirement",
                "Generic Intranet / Survey Forms",
                "UrPass Corporate Event Engine"
        ],
        "rows": [
                {
                        "col1": "Registration Security",
                        "col2": "Open links vulnerable to forwarded external registrations",
                        "col3": "Strict corporate email domain verification and approval gates"
                },
                {
                        "col1": "Gate Check-In Experience",
                        "col2": "Awkward paper roster name lookups causing lobby queues",
                        "col3": "Discreet sub-0.3s smartphone camera scanning with VIP badges"
                },
                {
                        "col1": "Mobile Executive Wallet",
                        "col2": "Static calendar attachments often buried or lost",
                        "col3": "Native Apple Wallet pass with location-based lockscreen alerts"
                },
                {
                        "col1": "Attendance Audit Trail",
                        "col2": "Unverified self-reported attendance records",
                        "col3": "Cryptographically verified arrival logs with exact timestamps"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "ENTERPRISE SECURITY",
                "title": "Domain-Restricted Registration and Role-Based Access",
                "paragraphs": [
                        "Corporate events frequently involve sensitive company announcements, roadmap presentations, and proprietary financial discussions. Allowing unauthorized external attendees or unvetted contractors into internal town halls poses a serious corporate security risk.",
                        "UrPass allows organizers to restrict registration strictly to authorized corporate email domains (such as `@enterprise.com`). Organizers can also configure mandatory approval workflows where internal department heads review and authorize attendee guest lists before passes are issued."
                ],
                "bullets": [
                        "Restrict registration forms to authorized enterprise email domains",
                        "One-click approval workflow for executive assistants and department heads",
                        "Encrypted attendee records with enterprise data isolation and zero third-party sharing",
                        "Automated calendar invites (.ics) with embedded venue coordinates and WiFi details"
                ],
                "takeaway": "Domain restrictions guarantee that sensitive corporate events remain strictly confidential."
        },
        {
                "badge": "EXECUTIVE ARRIVAL",
                "title": "Dignified, Seamless Executive Check-In with Apple Wallet Passes",
                "paragraphs": [
                        "Senior executives and high-value clients expect a seamless, dignified arrival experience. Forcing executives to wait in registration lobby lines while staff search for their names on printed paper rosters reflects poorly on your corporate brand.",
                        "UrPass provides executive passes that live natively in Apple Wallet. As executives arrive at the venue, their pass appears automatically on their phone lockscreen. Reception staff scan the pass in under 0.3 seconds using a smartphone camera, greeting the executive by name and alerting hosts of their arrival."
                ],
                "bullets": [
                        "Native Apple Wallet (.pkpass) support with automatic lockscreen presentation",
                        "Discreet scanner screen displays executive name, title, department, and table number",
                        "Audible chime or silent haptic vibration for executive boardroom discretion",
                        "Instant organizer alert when key executives and keynote speakers check in"
                ],
                "takeaway": "Deliver an effortless arrival experience worthy of your enterprise clients and leadership."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed and zero ticket fees.",
        features: [
          {
            icon: ShieldCheck,
            title: "Domain-Restricted Signups",
            desc: "Enforce corporate email validation (@company.com) to restrict registration to verified staff.",
          },
          {
            icon: Smartphone,
            title: "Apple Wallet Executive Passes",
            desc: "Deliver digital passes with lockscreen notifications as executives approach the venue.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Discreet Scanning",
            desc: "Validate attendees in milliseconds using smartphone cameras with silent haptic feedback.",
          },
          {
            icon: Users,
            title: "Seating & Table Allocation",
            desc: "Display executive table numbers, breakout tracks, and VIP badges directly on the pass.",
          },
          {
            icon: FileText,
            title: "Automated Attendance Logs",
            desc: "Export verified, timestamped attendance records for corporate compliance and HR reporting.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance Telemetry",
            desc: "Monitor arrival percentages and track room occupancy across keynote and dining halls.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Create Corporate Event",
                "desc": "Configure event details, internal agenda, and restrict signups to your corporate domain."
        },
        {
                "n": "02",
                "title": "Brand Digital Credentials",
                "desc": "Apply corporate logos, brand hex codes, and configure executive Apple Wallet passes."
        },
        {
                "n": "03",
                "title": "Distribute Invite Link",
                "desc": "Share registration link via internal Slack, Teams, or corporate email."
        },
        {
                "n": "04",
                "title": "Issue Digital Passes",
                "desc": "Employees receive personalized digital QR passes with calendar integration."
        },
        {
                "n": "05",
                "title": "Scan Attendees at the Door",
                "desc": "Reception staff scan passes with smartphone cameras for instant, discreet check-in."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Corporate Events in Bangalore?",
        "subtitle": "Enterprise workplace teams, internal comms, and corporate marketing.",
        "personas": [
                {
                        "badge": "TOWN HALLS",
                        "title": "All-Hands & Employee Meetings",
                        "desc": "Manage registrations and track physical employee attendance across tech park campuses."
                },
                {
                        "badge": "LEADERSHIP",
                        "title": "Executive Summits & Board Meets",
                        "desc": "Provide senior leadership with polished Apple Wallet passes and discreet door verification."
                },
                {
                        "badge": "CLIENT EVENTS",
                        "title": "Client Appreciation & VIP Dinners",
                        "desc": "Register enterprise clients with white-label forms and personal host arrival alerts."
                },
                {
                        "badge": "TRAINING",
                        "title": "Corporate Learning & Offsites",
                        "desc": "Track mandatory employee compliance training with verifiable timestamped check-in logs."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Executive Check-In Operates at Corporate Venues",
        "subtitle": "Silent, sophisticated entrance validation for enterprise environments.",
        "description": "Executives present their pass on their iPhone lockscreen or corporate email. Reception staff point their mobile camera at the QR code. UrPass verifies the employee identity in under 300 milliseconds, displays their department and seating allocation, and signals a discreet silent confirmation.",
        "points": [
                "Reception staff use standard company smartphones with zero hardware rentals.",
                "Silent haptic vibration mode prevents disruptive audio chimes in quiet lobbies.",
                "Database locking prevents pass sharing across multiple office entrances.",
                "Quick search by employee name or email allows manual check-in if needed."
        ]
},
        faqs: [
        {
                "q": "Can we restrict registration exclusively to employees with our company email domain in Bangalore?",
                "a": "Yes. You can specify authorized email domains (e.g. `@company.com`). Anyone attempting to register with an unauthorized personal email will be blocked automatically."
        },
        {
                "q": "Can executives save their event pass to Apple Wallet?",
                "a": "Yes. UrPass digital passes feature native Apple Wallet (.pkpass) support. Attendees can add their pass with one tap, enabling lockscreen access upon arriving at the venue."
        },
        {
                "q": "Can we track attendance for internal corporate compliance and training audits?",
                "a": "Yes. Every scan creates an immutable timestamped audit log containing employee name, email, department, scanning device, and exact check-in time, exportable to CSV anytime."
        },
        {
                "q": "Is employee data secure and kept private?",
                "a": "Yes. UrPass enforces strict organization-level data isolation. Employee data is encrypted at rest and in transit, and is never shared, marketed, or exposed to third parties."
        },
        {
                "q": "How many corporate events can we host under an UrPass subscription?",
                "a": "All UrPass plans include generous event and attendee allowances. You can manage internal town halls, client seminars, and regional offsites under a single organization account."
        }
],
      }}
    />
  );
}
