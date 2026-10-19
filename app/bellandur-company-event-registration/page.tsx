import type { Metadata } from "next";
import { Building2, CreditCard, FileSpreadsheet, QrCode, ScanLine, Sliders } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Bellandur Corporate Events | UrPass",
  description: "Coordinate Bellandur company events and training sessions with online registration, guest approval and QR attendance tracking.",
  keywords: ["company event registration bellandur","bellandur outer ring road event check-in","orr corporate event registration","ecospace company town hall passes","prestige tech park corporate events"],
  alternates: {
    canonical: "https://urpass.space/bellandur-company-event-registration",
  },
  openGraph: {
    title: "Bellandur Corporate Events | UrPass",
    description: "Coordinate Bellandur company events and training sessions with online registration, guest approval and QR attendance tracking.",
    url: "https://urpass.space/bellandur-company-event-registration",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bellandur Corporate Events | UrPass",
    description: "Coordinate Bellandur company events and training sessions with online registration, guest approval and QR attendance tracking.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BellandurCompanyEventRegistrationPage() {
  return (
    <SEOPage
      config={{
        badge: "BELLANDUR CORPORATE TICKETING",
        h1: "Company Event Registration and Guest Passes in Bellandur",
        canonicalUrl: "https://urpass.space/bellandur-company-event-registration",
        description: "Register employees, clients, and guests for corporate events along Bellandur and Outer Ring Road. Fast check-in, real-time rosters, and exportable reports.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bellandur-company-event-registration",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Power Corporate Events in Bellandur",
        ctaDescription: "Streamline employee town halls, GCC offsites, and partner summits along Outer Ring Road with paperless QR badges and zero ticket fees.",
        directAnswer: {
        "title": "What is Company Event Registration for Bellandur?",
        "summary": "Company event registration in Bellandur enables Global Capability Centers (GCCs), SaaS enterprises, and technology multinationals along the Outer Ring Road (ORR) tech corridor to manage employee RSVPs, client summits, and town halls. UrPass provides custom corporate intake fields, Apple Wallet credentials, sub-0.3s smartphone camera check-in, and 0% ticketing commission.",
        "keyPoints": [
                "Tailored for Bellandur, Ecospace, Prestige Tech Park, and Outer Ring Road tech corridors",
                "Custom employee intake forms: employee ID, business unit, bus route, and dietary preferences",
                "Direct Razorpay integration for paid industry conclaves with 0% platform ticket commissions",
                "Sub-0.3s camera check-in on volunteer smartphones with real-time CSV attendance exports"
        ]
},
        whatIs: {
        "title": "Why Bellandur & ORR Enterprises Choose UrPass",
        "definition": "Bellandur forms the heart of Bangalore's Outer Ring Road tech belt, hosting hundreds of multinational technology hubs and GCCs. UrPass replaces cumbersome manual badge sheets with an automated digital check-in system.",
        "details": [
                "0% ticket commission on paid partner summits; flat, predictable software pricing",
                "Seamless internal employee RSVPs with automated digital badge distribution via WhatsApp",
                "Fast mobile camera scanning prevents lobby security bottlenecks during peak morning arrivals",
                "Instant post-event attendance audit logs with scan timestamps for HR and facilities compliance"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Manual Badge Lists in Bellandur",
        "subtitle": "Why Outer Ring Road corporate organizers upgrade to UrPass.",
        "headers": [
                "Operational Feature",
                "Manual Paper Lists & Plastic Badges",
                "UrPass Digital Event Solution"
        ],
        "rows": [
                {
                        "col1": "Platform Ticketing Fee",
                        "col2": "5% to 8% deduction per paid delegate pass",
                        "col3": "0% ticket commission; plans from ₹29/month"
                },
                {
                        "col1": "Morning Gate Check-In",
                        "col2": "Slow alphabetical paper searches causing lobby lines",
                        "col3": "Sub-0.3s camera scan on volunteer smartphones"
                },
                {
                        "col1": "Pass Delivery",
                        "col2": "Physical printed cards prone to misplacement",
                        "col3": "Instant WhatsApp & Apple Wallet digital credentials"
                },
                {
                        "col1": "Compliance Reporting",
                        "col2": "Days spent typing up paper checkmarks into Excel",
                        "col3": "One-click CSV export with exact scan timestamps"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "ORR LOGISTICS",
                "title": "Built for High-Density Outer Ring Road Tech Corridors",
                "paragraphs": [
                        "Organizing employee offsites and leadership town halls along Bellandur and the Outer Ring Road requires managing high attendee volumes arriving simultaneously from across the city.",
                        "UrPass provides frictionless mobile camera scanning that validates badges in under 300 milliseconds. Event volunteers simply open a secure link on their company smartphones or tablets, eliminating expensive hardware scanner rentals."
                ],
                "bullets": [
                        "Coordinate multiple lobby registration desks across tech park campus entrances",
                        "Cryptographic QR tokens prevent duplicate badge scanning and badge pass-backs",
                        "Offline check-in mode guarantees uninterrupted operation during basement network dips",
                        "Monitor live room capacity and arrival pacing from any central organizer laptop"
                ],
                "takeaway": "High-speed mobile camera scanning prevents lobby queues and speeds up event start times."
        },
        {
                "badge": "COMPLIANCE & HR",
                "title": "Comprehensive Attendee Telemetry and CSV Audit Reporting",
                "paragraphs": [
                        "Enterprise HR, corporate communications, and workplace facilities teams in Bellandur require detailed attendance records for corporate governance, vendor billing, and safety compliance.",
                        "UrPass logs every attendee validation with an immutable server timestamp. Organizers can download an itemized CSV report showing exact arrival times, attendee business units, and dietary choices."
                ],
                "bullets": [
                        "One-click CSV exports ready for import into corporate HR and ERP systems",
                        "Track verified attendance percentages vs registered RSVPs in real time",
                        "Capture custom employee fields including department, office branch, and employee ID",
                        "Strict data privacy standards ensure employee contact details remain confidential"
                ],
                "takeaway": "Instant CSV exports simplify corporate compliance and HR reporting."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed and zero ticket fees.",
        features: [
          {
            icon: Building2,
            title: "Enterprise RSVP Workflows",
            desc: "Manage internal employee town halls, leadership summits, and partner offsites easily.",
          },
          {
            icon: CreditCard,
            title: "0% Commission with Razorpay",
            desc: "Collect registration fees directly into your Razorpay account with zero platform cuts.",
          },
          {
            icon: QrCode,
            title: "WhatsApp & Wallet Badges",
            desc: "Send personalized digital passes directly to attendee WhatsApp numbers and Apple Wallet.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Ingress Validation",
            desc: "Scan and validate passes instantly using volunteer smartphone cameras on mobile browsers.",
          },
          {
            icon: Sliders,
            title: "Custom Corporate Fields",
            desc: "Capture employee IDs, business units, bus transit routes, and dietary preferences.",
          },
          {
            icon: FileSpreadsheet,
            title: "Compliance-Ready CSV Logs",
            desc: "Export verified attendee check-in logs with exact arrival timestamps with one click.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Create Company Event",
                "desc": "Set up your Bellandur town hall or partner summit, ticket tiers, and custom employee questions."
        },
        {
                "n": "02",
                "title": "Configure RSVPs & Invoicing",
                "desc": "Enable free internal RSVPs or connect Razorpay for paid delegate ticketing with GST invoices."
        },
        {
                "n": "03",
                "title": "Share Registration Link",
                "desc": "Distribute your branded portal across corporate Slack channels, intranet, or email."
        },
        {
                "n": "04",
                "title": "Issue Digital Passes",
                "desc": "Attendees receive personalized digital QR passes via email, WhatsApp, and Apple Wallet."
        },
        {
                "n": "05",
                "title": "Scan at Reception Desks",
                "desc": "Lobby staff validate passes in <0.3s with smartphone cameras to keep foot traffic moving."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass in Bellandur & Outer Ring Road?",
        "subtitle": "Workplace leaders and event coordinators across Bellandur's enterprise hub.",
        "personas": [
                {
                        "badge": "GCCs & MNCS",
                        "title": "Global Capability Centers",
                        "desc": "Host annual all-hands, innovation expos, and global leadership town halls."
                },
                {
                        "badge": "HR & PEOPLE",
                        "title": "People & Culture Teams",
                        "desc": "Coordinate employee offsites, wellness days, and cultural celebrations with paperless passes."
                },
                {
                        "badge": "B2B CONCLAVES",
                        "title": "Enterprise SaaS Firms",
                        "desc": "Manage customer advisory boards, partner summits, and regional user group meetups."
                },
                {
                        "badge": "FACILITIES",
                        "title": "Workplace Operations",
                        "desc": "Track vendor and visitor attendance at campus events for workplace safety compliance."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Gate Check-In Functions at Bellandur Tech Campuses",
        "subtitle": "Fast, organized arrival that clears corporate lobby check-in desks.",
        "description": "Employees and guests display their digital pass on their smartphone screen or Apple Wallet. Reception staff point their mobile camera at the pass. UrPass validates credentials in under 300 milliseconds, displays the attendee's name and business unit, and marks them present.",
        "points": [
                "Eliminates slow manual searching through printed corporate attendee binders.",
                "Displays real-time pass validity with attendee name, designation, and business unit.",
                "Prevents duplicate entry attempts across multiple entrance gates automatically.",
                "Supports manual name and email lookup for fast backup check-in."
        ]
},
        faqs: [
        {
                "q": "Can UrPass handle internal company RSVPs without ticket fees?",
                "a": "Yes. UrPass is ideal for free internal corporate events and employee town halls. You can capture RSVPs, send QR entry badges via WhatsApp and email, and track check-ins at zero per-ticket cost."
        },
        {
                "q": "Can we collect specific employee details during registration?",
                "a": "Yes. You can configure custom form questions for employee IDs, branch locations, dietary choices, and team departments."
        },
        {
                "q": "How do security guards or reception teams scan passes in Bellandur?",
                "a": "Organizers simply open the UrPass scanner link on their smartphones or iPads. The camera instantly reads digital QR badges with real-time verification."
        },
        {
                "q": "Is UrPass compliant with enterprise security standards?",
                "a": "Yes. UrPass uses secure HTTPS encryption, role-based organizer access, and strict data privacy protocols ensuring attendee details remain completely private."
        },
        {
                "q": "Can attendees save their company pass to Apple Wallet?",
                "a": "Yes. UrPass digital passes feature native Apple Wallet (.pkpass) support. Attendees can add their pass with one tap and retrieve it from their iPhone lockscreen upon arriving at the venue."
        }
],
      }}
    />
  );
}
