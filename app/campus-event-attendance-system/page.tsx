import type { Metadata } from "next";
import { AlertTriangle, BarChart3, Building2, CheckCircle2, Lock, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Campus Event Attendance System & Academic QR Verification | UrPass",
  description: "Track verified student attendance for campus seminars, workshops, fests, and guest lectures. Instant mobile QR scanning and academic export logs.",
  keywords: [
    "campus event attendance system",
    "campus event attendance system online",
    "campus event attendance system platform",
    "campus event attendance system check in",
    "campus event attendance system qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/campus-event-attendance-system",
  },
  openGraph: {
    title: "Campus Event Attendance System & Academic QR Verification | UrPass",
    description: "Track verified student attendance for campus seminars, workshops, fests, and guest lectures. Instant mobile QR scanning and academic export logs.",
    url: "https://urpass.space/campus-event-attendance-system",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "ACADEMIC & CAMPUS ATTENDANCE",
        h1: "Campus Event Attendance System & Real-Time QR Verification",
        canonicalUrl: "https://urpass.space/campus-event-attendance-system",
        description: "Track verified student attendance for campus seminars, workshops, fests, and guest lectures. Instant mobile QR scanning and academic export logs.",
        ctaLabel: "Set Up Campus Attendance",
        ctaHref: "/signup",
        secondaryCtaLabel: "View Academic Solutions",
        secondaryCtaHref: "/pricing",
        directAnswer: {
          title: "What is the best campus event attendance tracking system?",
          summary: "UrPass is an event registration, digital ticketing and QR check-in platform by Yesp Corporation. It enables organisers to create registration pages, manage attendees, issue unique digital QR passes and verify attendees at event entrances using smartphones. For universities and colleges, UrPass provides tamper-proof digital QR passes, sub-0.3s student scanning, atomic duplicate prevention to stop proxy attendance, and exportable academic attendance audit trails.",
          keyPoints: ["Eliminates paper sign-in sheets and proxy attendance with unique cryptographic QR passes","Instant 0.28s mobile camera scanning at auditorium, classroom, and lab entrances","Atomic duplicate blocking stops students from sharing QR passes to fake attendance","Clean CSV/Excel attendance exports with roll numbers and timestamps for academic records"],
        },
        whatIs: {
          title: "What is a Campus Event Attendance System?",
          definition: "A campus event attendance system is a digital verification solution that enables university departments, faculty advisors, and coordinators to record and verify student attendance at campus lectures, workshops, and mandatory seminars.",
          details: ["Eliminates proxy attendance (signing in for absent friends) on paper sheets","Provides accredited attendance logs for course credits, certifications, and compliance","Enables faculty and teaching assistants to scan hundreds of students in minutes","Integrates seamlessly with campus learning management systems via clean CSV exports"],
        },
        featuresTitle: "Core Platform Capabilities Engineered for High Performance",
        featuresSubtitle: "Everything you need to register attendees, issue digital QR passes, and verify door check-ins without hardware.",
        features: [
          {
            icon: Building2,
            title: "Student Roll Number Capture",
            desc: "Mandatory student ID, branch, semester, and institution fields on registration forms.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Proxy QR Validation",
            desc: "Single-use cryptographic QR passes locked atomically to prevent duplicate scanning.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s TA & Faculty Scanning",
            desc: "Teaching assistants scan student phone screens in 0.28 seconds using mobile browsers.",
          },
          {
            icon: CheckCircle2,
            title: "Multi-Room Session Tracking",
            desc: "Track attendance independently across different lecture halls and workshop breakout rooms.",
          },
          {
            icon: BarChart3,
            title: "Instant Academic CSV Export",
            desc: "Download verified attendance logs with exact entry timestamps and student details.",
          },
          {
            icon: Zap,
            title: "Zero Hardware Costs",
            desc: "Operates entirely on standard faculty and student smartphones without RFID reader costs.",
          },
        ],
        deepDiveSections: [
          {
            badge: "ACADEMIC INTEGRITY & DATA",
            title: "Ending Paper Sign-In Sheets and Proxy Attendance on Campus",
            paragraphs: ["In university guest lectures, mandatory seminars, and departmental symposiums, paper attendance sheets are notoriously unreliable. Students routinely sign attendance for absent friends (proxy attendance), pass sign-in sheets around classrooms during lectures, and lose attendance sheets before data entry.","UrPass establishes complete academic attendance integrity. Each student receives a unique digital QR pass tied to their verified roll number. When students enter the auditorium, faculty or student coordinators scan their pass in 0.28 seconds. The student's arrival is permanently logged with an immutable timestamp, making proxy attendance impossible."],
            bullets: ["Completely eliminates proxy attendance and fake paper signatures","Processes 500+ students entering an auditorium in under 12 minutes","Provides HoDs and faculty advisors with verified digital attendance audit trails","Eliminates hours of manual data entry from paper sheets into university databases"],
            takeaway: "UrPass delivers effortless academic attendance tracking with 100% data accuracy and integrity.",
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Benchmarks",
          subtitle: "How UrPass delivers faster processing, zero commission fees, and foolproof duplicate protection.",
          headers: ["Campus Attendance Metric","Paper Sign-In Sheets / Google Form","UrPass Academic Attendance System"],
          rows: [{"col1":"Proxy Attendance Risk","col2":"High (students sign for absent friends)","col3":"0% (atomic single-use QR pass)"},{"col1":"Verification Speed","col2":"15–30 minutes passing paper sheets","col3":"0.28s optical camera scan at entrance"},{"col1":"Data Accuracy","col2":"Illegible handwriting and lost papers","col3":"100% verified digital records with timestamps"},{"col1":"Hardware Requirement","col2":"None (or expensive RFID readers)","col3":"Standard smartphones via web browser"}],
        },
        whoShouldUse: {
          title: "Built for High-Stakes Event Leaders",
          subtitle: "Tailored workflows for organizing committees, operations crew, and security staff.",
          personas: [{"title":"Department Heads & HoDs","desc":"Track verified attendance for accredited departmental seminars and guest lectures.","badge":"HODS"},{"title":"Faculty Advisors & Professors","desc":"Verify student participation in lab workshops and research colloquiums.","badge":"FACULTY"},{"title":"Campus Placement Cells","desc":"Manage student attendance at pre-placement talks and recruitment drives.","badge":"PLACEMENTS"},{"title":"University Event Committees","desc":"Record attendance at orientation programs, convocations, and annual fests.","badge":"COMMITTEES"}],
        },
        relatedLinks: [
        {
                "title": "Events in India Hub",
                "href": "/in",
                "category": "Location"
        },
        {
                "title": "College Event Management Software",
                "href": "/college-event-management-software",
                "category": "Use Case"
        },
        {
                "title": "Free QR Ticket Generator",
                "href": "/free-qr-ticket-generator",
                "category": "Product"
        },
        {
                "title": "Event Features Suite",
                "href": "/features",
                "category": "Product"
        },
        {
                "title": "URPASS Sitelinks Directory",
                "href": "/sitelinks",
                "category": "Guide"
        }
],
        faqs: [
          {
                    "q": "How does UrPass stop proxy attendance at campus events?",
                    "a": "Each student receives a unique, cryptographically signed QR pass tied to their roll number. When scanned at the door, the pass is locked in real time in under 150ms. A student cannot share their pass with another person once scanned."
          },
          {
                    "q": "Can faculty members and teaching assistants scan passes on their phones?",
                    "a": "Yes. Faculty and TAs can open a secure scanner link on their mobile browsers, enter a PIN, and scan student passes in 0.28 seconds without downloading any app."
          },
          {
                    "q": "Can we collect student roll numbers and department details during registration?",
                    "a": "Yes. You can add mandatory fields to capture student ID, department, section, and academic year."
          },
          {
                    "q": "How do we export attendance data for university records?",
                    "a": "You can download a clean CSV or Excel spreadsheet containing student names, roll numbers, departments, and exact entry timestamps in one click."
          },
          {
                    "q": "Can we track attendance across multiple breakout rooms or workshops?",
                    "a": "Yes. You can assign different scanning stations to specific rooms and sessions to track multi-track conference attendance."
          },
          {
                    "q": "Do students need internet connectivity to display their QR pass?",
                    "a": "No. Once a student receives their QR pass via email or adds it to Apple/Google Wallet, it can be displayed on screen completely offline."
          },
          {
                    "q": "Is UrPass suitable for both small departmental talks and large campus fests?",
                    "a": "Yes. UrPass scales effortlessly from 30-person classroom workshops to 5,000-person campus-wide festivals."
          }
],
        ctaTitle: "Campus Event Attendance System & Real-Time QR Verification",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
      }}
    />
  );
}
