import type { Metadata } from "next";
import { BarChart3, FileText, ScanLine, ShieldCheck, Smartphone, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Corporate Event Check-In Software | UrPass",
  description: "Streamline employee events, corporate meetings and business conferences with attendee registration, digital passes and live check-ins.",
  keywords: ["corporate event check in software","enterprise event check in","corporate meeting attendee management","internal event check in system","employee event qr pass","business conference check in"],
  alternates: {
    canonical: "https://urpass.space/corporate-event-check-in-software",
  },
  openGraph: {
    title: "Corporate Event Check-In Software | UrPass",
    description: "Streamline employee events, corporate meetings and business conferences with attendee registration, digital passes and live check-ins.",
    url: "https://urpass.space/corporate-event-check-in-software",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Corporate Event Check-In Software | UrPass",
    description: "Streamline employee events, corporate meetings and business conferences with attendee registration, digital passes and live check-ins.",
  },
};

export default function CorporateEventCheckInSoftwarePage() {
  return (
    <SEOPage
      config={{
        badge: "CORPORATE EVENT MANAGEMENT",
        h1: "Corporate Event Check-In and Attendee Management",
        canonicalUrl: "https://urpass.space/corporate-event-check-in-software",
        description: "Streamline employee events, corporate meetings and business conferences with attendee registration, digital passes and live check-ins.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=corporate-event-check-in-software",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Modernize Your Corporate Events with Secure Digital Check-In",
        ctaDescription: "Streamline all-hands meetings, leadership summits, and client conferences with domain-restricted registration and sub-second phone scanning.",
        directAnswer: {
        "title": "What is Corporate Event Check-In Software?",
        "summary": "Corporate event check-in software provides enterprise-grade guest registration, executive badge generation, and secure attendee entry tracking for all-hands meetings, leadership summits, and client conferences. Features include corporate domain email restrictions, enterprise privacy compliance, and real-time arrival telemetry.",
        "keyPoints": [
                "Domain-restricted registration ensuring only verified employees with company emails can register",
                "Executive digital credentials with Apple Wallet support and calendar sync",
                "Sub-0.3 second smartphone camera scanning for discreet, rapid executive check-in",
                "Complete enterprise data isolation and GDPR/privacy-compliant audit logs"
        ]
},
        whatIs: {
        "title": "How UrPass Simplifies Internal and External Corporate Events",
        "definition": "UrPass replaces spreadsheets and ad-hoc email RSVPs with a secure, brand-aligned corporate event platform. Whether organizing an internal town hall for 5,000 employees or an exclusive VIP dinner for 50 C-suite clients, UrPass ensures frictionless registration and professional door operations.",
        "details": [
                "Restricts registration to corporate email domains (@company.com) for internal security",
                "Generates customized executive passes with company branding and seating designations",
                "Maintains privacy compliance with strict organization data segregation and encryption",
                "Provides executive arrival notifications so event hosts know when VIPs arrive"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Generic Survey Forms & Enterprise Intranet Tools",
        "subtitle": "Why corporate workplace and event marketing teams switch to UrPass.",
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
                        "UrPass allows organizers to restrict registration strictly to authorized corporate email domains (such as @enterprise.com). Organizers can also configure mandatory approval workflows where internal department heads review and authorize attendee guest lists before passes are issued."
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
                "badge": "VIP EXPERIENCE",
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
        featuresTitle: "Industry-Grade Capabilities",
        featuresSubtitle: "Purpose-built for your specific event operational workflows.",
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
        "title": "Who Uses UrPass for Corporate Events?",
        "subtitle": "Enterprise workplace teams, internal comms, and corporate marketing.",
        "personas": [
                {
                        "badge": "TOWN HALLS",
                        "title": "All-Hands & Employee Meetings",
                        "desc": "Manage registrations and track physical employee attendance across global corporate offices."
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
                "q": "Can we restrict registration exclusively to employees with our company email domain?",
                "a": "Yes. You can specify authorized email domains (e.g. @company.com). Anyone attempting to register with an unauthorized public or personal email will be blocked automatically."
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
                "q": "Is our employee data secure and kept private?",
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
