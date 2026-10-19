import type { Metadata } from "next";
import { BarChart3, CreditCard, GraduationCap, QrCode, ScanLine, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "College Fest Registration Bengaluru | UrPass",
  description: "Simplify college fest registration in Bengaluru with custom student fields, digital QR passes and multiple entry gates.",
  keywords: ["bengaluru college fest registration","college fest registration bangalore","campus event ticketing bengaluru","student fest qr check in bangalore","college symposium registration karnataka"],
  alternates: {
    canonical: "https://urpass.space/bengaluru-college-fest-registration",
  },
  openGraph: {
    title: "College Fest Registration Bengaluru | UrPass",
    description: "Simplify college fest registration in Bengaluru with custom student fields, digital QR passes and multiple entry gates.",
    url: "https://urpass.space/bengaluru-college-fest-registration",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "College Fest Registration Bengaluru | UrPass",
    description: "Simplify college fest registration in Bengaluru with custom student fields, digital QR passes and multiple entry gates.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BengaluruCollegeFestRegistrationPage() {
  return (
    <SEOPage
      config={{
        badge: "COLLEGE FESTS BENGALURU",
        h1: "College Fest Registration and QR Entry in Bengaluru",
        canonicalUrl: "https://urpass.space/bengaluru-college-fest-registration",
        description: "Simplify college fest registration in Bengaluru with custom student fields, digital QR passes and multiple entry gates.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bengaluru-college-fest-registration",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Run Your Bangalore College Fest the Modern Way",
        ctaDescription: "Replace chaotic Google Sheets and unverified UPI screenshots. Launch branded registration, multi-event passes, and sub-second phone scanning.",
        directAnswer: {
        "title": "What is the Best College Fest Registration Software for Bengaluru?",
        "summary": "UrPass is a specialized college fest registration platform built for Bangalore student committees and faculty convenors. It manages multi-track academic symposiums and cultural fests, accepts direct UPI payments via Razorpay with 0% platform ticket fees, issues digital QR passes, and verifies thousands of visiting students at campus gates in under 0.3 seconds.",
        "keyPoints": [
                "Multi-track registration for cultural events, battle of bands, coding contests, and dance competitions",
                "Direct Razorpay UPI integration with 0% platform ticket fees into college bank accounts",
                "Encrypted digital QR passes delivered to student WhatsApp chats and email inboxes",
                "Sub-0.3 second camera check-in on student volunteer phones with multi-gate duplicate protection"
        ]
},
        whatIs: {
        "title": "Why Bangalore Engineering and Arts Colleges Run on UrPass",
        "definition": "Bengaluru's top universities and engineering colleges host massive annual fests attracting thousands of inter-college participants. UrPass eliminates entrance chaos, fake payment screenshots, and ticket forwarding with an automated, fraud-proof digital credential platform.",
        "details": [
                "Allows single-registration bundles covering multiple department sub-events and workshops",
                "Validates college ID cards and student roll numbers upon form submission",
                "Eliminates fake UPI transaction screenshots with cryptographic payment verification",
                "Empowers student volunteers to scan attendee QR passes using personal smartphones"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Google Forms & Paper Rosters for Bangalore College Fests",
        "subtitle": "Why campus organizing committees across Bengaluru switch to UrPass.",
        "headers": [
                "Operational Requirement",
                "Google Forms + Spreadsheets",
                "UrPass College Fest Platform"
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
                        "col3": "Unified attendee QR badge scannable at labs, stages & auditoriums"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "CAMPUS WORKFLOWS",
                "title": "Multi-Track Event Management Under One Fest Banner",
                "paragraphs": [
                        "College fests typically feature 15 to 30 parallel events: battle of the bands, street plays, coding marathons, robotics, gaming tournaments, and celebrity concerts. Tracking registrations across multiple sub-events with standard forms leads to duplicated rosters and scheduling conflicts.",
                        "UrPass allows student teams to create a master fest portal where participants choose their specific tracks, submit team rosters, and receive a unified digital QR badge. Organizers can cap capacities for individual auditorium contests while keeping general fest registration open."
                ],
                "bullets": [
                        "Configure individual capacity limits for competitive tracks and pro-nites",
                        "Collect team member rosters for multi-student group competitions",
                        "Automated participant ID verification and college roll number validation",
                        "Live telemetry showing registered headcounts per department contest"
                ],
                "takeaway": "Manage multi-track campus festivals from a single unified organizer dashboard."
        },
        {
                "badge": "GATE ACCESS",
                "title": "Volunteer-Driven Smartphone Scanning at Campus Gates",
                "paragraphs": [
                        "On the morning of an inter-college fest, hundreds of visiting students arrive from different institutions simultaneously. Rented barcode scanners are far too expensive for student budgets, while manual paper registers create immense congestion at campus security gates.",
                        "UrPass turns student committee members' personal smartphones into high-speed QR scanners in seconds. Volunteers scan a coordinator authorization code to launch the web scanner in Safari or Chrome, clearing incoming crowds rapidly with audible green confirmations."
                ],
                "bullets": [
                        "Zero equipment rentals; volunteers use their personal Android or iPhone devices",
                        "Sub-0.3 second camera scan speed keeps campus security gates moving smoothly",
                        "Instant duplicate warnings catch forwarded ticket screenshots immediately",
                        "Volunteer roles keep college financial accounts secure and private"
                ],
                "takeaway": "Empower student volunteers to run enterprise-grade entrance operations with zero budget strain."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed and zero ticket fees.",
        features: [
          {
            icon: GraduationCap,
            title: "Multi-Track Fest Management",
            desc: "Organize cultural competitions, technical events, and concerts under one fest portal.",
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
            desc: "Track real-time turnout across fest venues and export verified participant logs to CSV.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Create Fest Portal",
                "desc": "Set up your college fest, department events, pro-nites, and team registration tiers."
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
        "title": "Who Uses UrPass for Campus Events in Bengaluru?",
        "subtitle": "Engineering colleges, arts universities, student unions, and faculty convenors.",
        "personas": [
                {
                        "badge": "CULTURAL",
                        "title": "Annual Cultural Fest Teams",
                        "desc": "Process thousands of inter-college attendees for concerts, dance battles, and dramatic arts nights."
                },
                {
                        "badge": "ENGINEERING",
                        "title": "Technical Symposium Committees",
                        "desc": "Manage coding competitions, paper presentations, and tech workshops across engineering departments."
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
                "q": "How does UrPass help Bangalore college fests prevent fake registration payments?",
                "a": "Unlike Google Forms where students upload unverified UPI transaction screenshots that require manual checking, UrPass integrates directly with Razorpay. Passes are issued only after the bank cryptographically confirms payment completion, eliminating payment fraud entirely."
        },
        {
                "q": "Can we collect team member details for group competitions like dance battles or battle of the bands?",
                "a": "Yes. UrPass supports group and team registration forms. The team lead registers and enters team member names, emails, and college IDs. UrPass can issue individual passes for each team member or a single unified team pass."
        },
        {
                "q": "Do student volunteers need to download an app to scan passes at the entrance gates?",
                "a": "No. Student volunteers simply open a secure scanner link on their mobile Safari or Chrome browser. They can immediately scan attendee QR codes with their phone camera, clearing gate queues in seconds."
        },
        {
                "q": "Can we manage both free and paid competitions within the same fest?",
                "a": "Yes. You can configure multiple ticket tiers, some completely free (e.g. general fest entry or paper presentation) and others paid (e.g. pro-nite concert or specialized AI workshops), all within a single registration portal."
        },
        {
                "q": "How much does UrPass cost for college fests in Bangalore?",
                "a": "UrPass offers an introductory plan starting at ₹29/month for your first 2 months with 0% platform ticket commission. Single event pay-as-you-go passes are also available starting from ₹299."
        }
],
      }}
    />
  );
}
