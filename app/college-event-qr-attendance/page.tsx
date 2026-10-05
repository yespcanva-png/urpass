import type { Metadata } from "next";
import { Award, BarChart3, CheckCircle2, Layers, Lock, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "QR Attendance System for College Events & Lectures | UrPass",
  description: "Fast QR code attendance system for college fests, workshops, seminars, and classroom lectures. 100% paperless, sub-second scanning and live Excel export.",
  keywords: [
    "college event QR attendance system",
    "college event QR attendance system online",
    "college event QR attendance system platform",
    "college event QR attendance system check in",
    "college event QR attendance system qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/college-event-qr-attendance",
  },
  openGraph: {
    title: "QR Attendance System for College Events & Lectures | UrPass",
    description: "Fast QR code attendance system for college fests, workshops, seminars, and classroom lectures. 100% paperless, sub-second scanning and live Excel export.",
    url: "https://urpass.space/college-event-qr-attendance",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "PAPERLESS CAMPUS ATTENDANCE",
        h1: "QR Attendance System Built for College Events & Fests",
        canonicalUrl: "https://urpass.space/college-event-qr-attendance",
        description: "Fast QR code attendance system for college fests, workshops, seminars, and classroom lectures. 100% paperless, sub-second scanning and live Excel export.",
        ctaLabel: "Start QR Attendance Free",
        ctaHref: "/signup",
        secondaryCtaLabel: "View Demo Video",
        secondaryCtaHref: "/contact",
        directAnswer: {
          title: "How do you track attendance at college events using QR codes?",
          summary: "UrPass is an event registration, digital QR pass and check-in platform that lets organisers collect registrations, manage attendees and verify entry from one system. For college attendance tracking, UrPass generates unique cryptographic QR codes for every student, allowing coordinators and volunteers to verify entrance in under 0.3 seconds per attendee with zero paper sheets.",
          keyPoints: ["Sub-0.3 second scanning via volunteer smartphone cameras with zero app installs","Live attendance dashboard tracking checked-in vs. not-arrived students","Instant CSV and Excel exports with timestamps, student roll numbers, and gates","Atomic duplicate blocking to prevent proxy attendance and screenshot sharing"],
        },
        whatIs: {
          title: "What is a College Event QR Attendance System?",
          definition: "A college event QR attendance system is a digital check-in solution that issues personalized QR passes to registered students and validates their presence at workshops, guest lectures, and campus fests using smartphone scanners.",
          details: ["Replaces signature sheets and manual roll calls with automated digital scanning","Ensures 100% verified attendance for academic credits and certificates","Eliminates proxy attendance through one-time atomic pass validation","Provides real-time attendance velocity telemetry to organizers"],
        },
        featuresTitle: "Enterprise Capabilities Engineered for Scale",
        featuresSubtitle: "Everything you need to register attendees, issue QR passes, and verify door check-ins.",
        features: [
          {
            icon: ScanLine,
            title: "Sub-Second Smartphone Scanning",
            desc: "Volunteers scan student QR passes in under 300ms using Chrome or Safari on their own phones.",
          },
          {
            icon: Lock,
            title: "Anti-Proxy Duplicate Prevention",
            desc: "Once a pass is scanned, it is instantly marked as checked-in across all scanning devices.",
          },
          {
            icon: Award,
            title: "Automated Certificate Readiness",
            desc: "Export clean CSV rosters of verified attendees who completed gate check-in for easy certificate distribution.",
          },
          {
            icon: Zap,
            title: "Offline Scanner Resilience",
            desc: "Continue scanning students smoothly even if campus Wi-Fi drops temporarily.",
          },
          {
            icon: Layers,
            title: "Multi-Session & Lab Tracking",
            desc: "Track attendance separately for keynote sessions, technical workshops, and coding labs.",
          },
          {
            icon: Users,
            title: "Instant Live Roster Search",
            desc: "Look up students by roll number, name, or email on the scanner screen for instant manual validation.",
          },
        ],
        deepDiveSections: [
          {
            badge: "NO MORE PAPER ROSTERS",
            title: "Eliminating Long Queues and Proxy Signatures at Campus Events",
            paragraphs: ["Passing around paper attendance sheets at a 300-student technical seminar results in lost sheets, illegible handwriting, and students signing for absent peers.","With UrPass, every registered student receives a dynamic digital pass. At the lecture hall or auditorium entrance, volunteers scan passes as students walk in. 300 students can be checked in within 6 minutes with 100% verified digital logs."],
            bullets: ["Works on any mobile device without requiring students or staff to download an app","Audible green chime confirms successful scan; red alert sounds for duplicates","Tracks exact check-in time down to the second for formal accreditation","Free tier available for student clubs and department workshops"],
            takeaway: "Upgrade your college event attendance to a fast, professional, and audit-ready digital QR system with UrPass.",
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Metrics",
          subtitle: "How UrPass delivers faster processing and lower costs than legacy tools.",
          headers: ["Attendance Method","Paper Sign-In Sheet","UrPass QR Scanner"],
          rows: [{"col1":"Processing Time","col2":"30-45 seconds per student","col3":"Under 0.3 seconds per student"},{"col1":"Proxy Prevention","col2":"None (friends sign for friends)","col3":"Atomic single-use QR verification"},{"col1":"Data Compilation","col2":"Hours of manual typing into Excel","col3":"Instant 1-click CSV/Excel export"},{"col1":"Real-Time Telemetry","col2":"No visibility until after event","col3":"Live check-in counter and velocity chart"}],
        },
        whoShouldUse: {
          title: "Built for Professional Event Leaders",
          subtitle: "Tailored workflows for every member of your organizing team.",
          personas: [{"title":"Workshop Organizers","desc":"Accurately record workshop participation for certificate issuance.","badge":"WORKSHOPS"},{"title":"Faculty Coordinators","desc":"Track seminar and guest lecture attendance for mandatory course credits.","badge":"FACULTY"},{"title":"Symposium Leads","desc":"Manage multi-track technical paper presentations and competition attendance.","badge":"SYMPOSIUM"}],
        },
        faqs: [
          {
                    "q": "What is the best registration system for college events?",
                    "a": "UrPass provides the fastest QR attendance tracking for college workshops, fests, and symposiums with zero paper and instant CSV exports."
          },
          {
                    "q": "How does QR event check-in work for college attendance?",
                    "a": "Coordinators open the UrPass scanner link on their mobile browser and scan student QR passes. Verification happens instantly in under 300ms."
          },
          {
                    "q": "Can multiple event gates scan tickets simultaneously?",
                    "a": "Yes. Multiple volunteers can scan at different auditorium doors simultaneously without data conflicts."
          },
          {
                    "q": "Can UrPass prevent duplicate QR entry?",
                    "a": "Yes. Once a student is scanned, their pass cannot be scanned again. Any duplicate scan attempt triggers an immediate alert."
          },
          {
                    "q": "Can organisers see attendance in real time?",
                    "a": "Yes. The live dashboard shows total registered, checked-in, not-arrived counts, and arrival speed."
          },
          {
                    "q": "Can UrPass manage free and paid events?",
                    "a": "Yes. UrPass supports free student registrations as well as paid workshop passes with direct payment settlement."
          }
],
        ctaTitle: "QR Attendance System Built for College Events & Fests",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
      }}
    />
  );
}
