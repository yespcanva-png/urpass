import type { Metadata } from "next";
import { BarChart3, CreditCard, GraduationCap, QrCode, ScanLine, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "College Symposium Registration Software | UrPass",
  description: "Manage college symposium registrations, participant approvals, QR passes and entry scanning in one place. Designed for campus event teams.",
  keywords: ["college symposium registration software","college fest registration software","technical symposium registration","college event qr passes","campus event check in system","student symposium ticketing"],
  alternates: {
    canonical: "https://urpass.space/college-symposium-registration-software",
  },
  openGraph: {
    title: "College Symposium Registration Software | UrPass",
    description: "Manage college symposium registrations, participant approvals, QR passes and entry scanning in one place. Designed for campus event teams.",
    url: "https://urpass.space/college-symposium-registration-software",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "College Symposium Registration Software | UrPass",
    description: "Manage college symposium registrations, participant approvals, QR passes and entry scanning in one place. Designed for campus event teams.",
  },
};

export default function CollegeSymposiumRegistrationSoftwarePage() {
  return (
    <SEOPage
      config={{
        badge: "COLLEGE SYMPOSIUMS & FESTS",
        h1: "College Symposium Registration, Passes & QR Entry",
        canonicalUrl: "https://urpass.space/college-symposium-registration-software",
        description: "Manage college symposium registrations, participant approvals, QR passes and entry scanning in one place. Designed for campus event teams.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=college-symposium-registration-software",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Streamline Your College Symposium in Minutes",
        ctaDescription: "Replace chaotic Google Sheets and unverified UPI screenshots. Launch branded registration, multi-event passes, and sub-second phone scanning.",
        directAnswer: {
        "title": "What is College Symposium Registration Software?",
        "summary": "College symposium registration software is a specialized platform built for student committees and faculty convenors to manage multi-track academic and technical festivals. It automates participant registration, accepts direct UPI payments via Razorpay, issues individualized QR entry badges, and validates students at campus gates in under 0.3 seconds.",
        "keyPoints": [
                "Multi-track registration for paper presentations, coding contests, workshops, and robotics",
                "Direct Razorpay UPI integration with 0% platform ticket fees",
                "Encrypted digital QR passes delivered to student WhatsApp chats and email inboxes",
                "Sub-0.3 second camera check-in on student volunteer phones with zero hardware rentals"
        ]
},
        whatIs: {
        "title": "How UrPass Elevates College Fest & Symposium Operations",
        "definition": "UrPass replaces clunky Google Forms and manual WhatsApp coordination with an end-to-end campus event platform. Student organizers can manage department fests, set capacity caps per technical event, screen participants, and coordinate multiple campus entrance gates seamlessly.",
        "details": [
                "Allows single-registration bundles covering multiple department sub-events",
                "Validates college ID cards and student roll numbers upon form submission",
                "Eliminates fake UPI transaction screenshots with cryptographic payment verification",
                "Empowers student volunteers to scan attendee QR passes using personal smartphones"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Google Forms & Paper Checklists for College Fests",
        "subtitle": "Why hundreds of engineering and arts colleges across India switch to UrPass.",
        "headers": [
                "Operational Requirement",
                "Google Forms + Spreadsheets",
                "UrPass Symposium Platform"
        ],
        "rows": [
                {
                        "col1": "Payment Verification",
                        "col2": "Manual review of 1,000+ unverified UPI transaction screenshots",
                        "col3": "Instant automated UPI verification via Razorpay into college bank"
                },
                {
                        "col1": "Gate Queue Speed",
                        "col2": "Slow manual name cross-referencing causing 45-minute gate queues",
                        "col3": "Sub-0.3s smartphone camera scanning clearing 1,000 students in 15 min"
                },
                {
                        "col1": "Ticket Sharing Fraud",
                        "col2": "High fraud; students share forwarded confirmation emails",
                        "col3": "Atomic database locking blocks forwarded QR pass screenshots"
                },
                {
                        "col1": "Sub-Event Tracking",
                        "col2": "Disjointed sheets per event with zero attendance synchronization",
                        "col3": "Unified attendee QR badge scannable at hackathons, labs & auditoriums"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "CAMPUS WORKFLOWS",
                "title": "Multi-Track Event Management Under One Department Banner",
                "paragraphs": [
                        "Engineering symposiums typically feature 10 to 20 parallel events: paper presentations, coding marathons, circuit debugging, robotics, gaming tournaments, and guest lectures. Tracking registrations across multiple sub-events with standard forms leads to duplicated rosters and scheduling conflicts.",
                        "UrPass allows student teams to create a master symposium portal where participants choose their specific tracks, submit abstracts or GitHub links, and receive a unified digital QR badge. Organizers can cap capacities for individual laboratory sessions while keeping general symposium registration open."
                ],
                "bullets": [
                        "Configure individual capacity limits for coding labs and seminar halls",
                        "Collect team member rosters for multi-student group competitions",
                        "Automated participant abstract and project presentation file uploads",
                        "Live telemetry showing registered headcounts per department contest"
                ],
                "takeaway": "Manage multi-track symposiums from a single unified organizer dashboard."
        },
        {
                "badge": "CAMPUS ENTRY",
                "title": "Volunteer-Driven Smartphone Scanning at Campus Gates",
                "paragraphs": [
                        "On the morning of an inter-college fest, hundreds of visiting students arrive from different institutions simultaneously. Rented barcode scanners are far too expensive for student budgets, while manual paper registers create immense congestion at campus security gates.",
                        "UrPass turns student committee members' personal smartphones into high-speed QR scanners in seconds. Volunteers scan a coordinator authorization code to launch the web scanner in Safari or Chrome, clearing incoming buses and crowds rapidly with audible green confirmations."
                ],
                "bullets": [
                        "Zero equipment rentals; volunteers use their personal Android or iPhone devices",
                        "Sub-0.3 second camera scan speed keeps campus gates moving smoothly",
                        "Instant duplicate warnings catch forwarded ticket screenshots immediately",
                        "Volunteer roles keep college financial accounts secure and private"
                ],
                "takeaway": "Empower student volunteers to run enterprise-grade entrance operations with zero budget strain."
        }
],
        featuresTitle: "Industry-Grade Capabilities",
        featuresSubtitle: "Purpose-built for your specific event operational workflows.",
        features: [
          {
            icon: GraduationCap,
            title: "Department Track Management",
            desc: "Organize technical competitions, workshops, and paper presentations under one symposium portal.",
          },
          {
            icon: CreditCard,
            title: "Direct UPI & Razorpay",
            desc: "Accept student registration fees via GPay, PhonePe, and Paytm with zero platform commission.",
          },
          {
            icon: QrCode,
            title: "Unified Student Badges",
            desc: "Issue scannable digital QR passes customized with college logos, student roll numbers, and tracks.",
          },
          {
            icon: ScanLine,
            title: "Volunteer Smartphone Scanner",
            desc: "Turn student committee phones into sub-0.3s ticket scanners with zero app installation.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Screenshot Protection",
            desc: "Atomic database locking catches shared pass screenshots across campus entry gates.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance Analytics",
            desc: "Track real-time turnout across department tracks and export verified participant logs to CSV.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Create Symposium Portal",
                "desc": "Set up your department fest, technical events, workshops, and team registration tiers."
        },
        {
                "n": "02",
                "title": "Connect Payment Gateway",
                "desc": "Link Razorpay to collect registration fees directly into the college or club bank account."
        },
        {
                "n": "03",
                "title": "Share Registration Link",
                "desc": "Distribute your mobile-friendly event registration page across colleges and social media."
        },
        {
                "n": "04",
                "title": "Automated Pass Dispatch",
                "desc": "Students receive dynamic digital QR passes via WhatsApp and email instantly."
        },
        {
                "n": "05",
                "title": "Scan at Campus Gates",
                "desc": "Student volunteers scan passes in <0.3s using their phone cameras for fast entry."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Campus Events?",
        "subtitle": "Academic institutions, student unions, and faculty convenors.",
        "personas": [
                {
                        "badge": "ENGINEERING",
                        "title": "Technical Symposium Committees",
                        "desc": "Manage coding competitions, paper presentations, and tech workshops across engineering departments."
                },
                {
                        "badge": "CULTURAL",
                        "title": "Annual Cultural Fest Teams",
                        "desc": "Process thousands of inter-college attendees for concerts, dance battles, and dramatic arts nights."
                },
                {
                        "badge": "MANAGEMENT",
                        "title": "B-School Business Meets",
                        "desc": "Register case study delegates, manage business plan presentations, and issue executive digital passes."
                },
                {
                        "badge": "SPORTS",
                        "title": "Inter-University Tournaments",
                        "desc": "Track collegiate sports delegations, team rosters, and stadium entry with QR credentials."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Gate Scanning Works on Fest Day",
        "subtitle": "Lightning-fast campus access for visiting student delegations.",
        "description": "Visiting students present their digital QR pass on their phone or WhatsApp chat. Student committee volunteers point their phone camera at the code. UrPass checks the cryptographic token, validates enrollment, and displays a green confirmation in under 300 milliseconds.",
        "points": [
                "Volunteers scan passes on their personal phones with no app store downloads.",
                "Audible chimes signal successful entry even in noisy campus courtyard environments.",
                "Passes can also be scanned at individual workshop halls to track room-by-room turnout.",
                "Full attendance logs can be downloaded immediately to issue participation certificates."
        ]
},
        faqs: [
        {
                "q": "How does UrPass help college symposiums prevent fake registration payments?",
                "a": "Unlike Google Forms where students upload unverified UPI transaction screenshots that require manual checking, UrPass integrates directly with Razorpay. Passes are issued only after the bank cryptographically confirms payment completion, eliminating payment fraud entirely."
        },
        {
                "q": "Can we collect team member details for group competitions like hackathons or robotics?",
                "a": "Yes. UrPass supports group and team registration forms. The team lead registers and enters team member names, emails, and college IDs. UrPass can issue individual passes for each team member or a single unified team pass."
        },
        {
                "q": "Do student volunteers need to download an app to scan passes at the entrance gates?",
                "a": "No. Student volunteers simply open a secure scanner link on their mobile Safari or Chrome browser. They can immediately scan attendee QR codes with their phone camera, clearing gate queues in seconds."
        },
        {
                "q": "Can we manage both free and paid competitions within the same symposium?",
                "a": "Yes. You can configure multiple ticket tiers, some completely free (e.g. general symposium entry or paper presentation) and others paid (e.g. specialized AI/Robotics workshops), all within a single registration portal."
        },
        {
                "q": "How much does UrPass cost for college symposiums?",
                "a": "UrPass offers an introductory plan starting at ₹29/month for your first 2 months with 0% platform ticket commission. Single event pay-as-you-go passes are also available starting from ₹299."
        }
],
      }}
    />
  );
}
