import type { Metadata } from "next";
import { CheckCircle2, School, Users, Clock, QrCode, ScanLine, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Campus Orientation Event Registration & Student Check-In",
  description: "Run college freshman orientations, corporate onboarding sessions, and student induction weeks with automated digital passes, session attendance tracking, and zero queues.",
  keywords: [
    "campus orientation check in system",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "attendee management",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/orientation-events" },
  openGraph: {
    title: "Campus Orientation Event Registration & Student Check-In | URPASS",
    description: "Run college freshman orientations, corporate onboarding sessions, and student induction weeks with automated digital passes, session attendance tracking, and zero queues.",
    url: "https://urpass.space/orientation-events",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "ORIENTATION & INDUCTION",
        h1: "Campus Orientation Registration & Student Check-In Software",
        canonicalUrl: "https://urpass.space/orientation-events",
        description: "Run college freshman orientations, corporate onboarding sessions, and student induction weeks with automated digital passes, session attendance tracking, and zero queues.",
        ctaLabel: "Run orientation check-in free",
        features: [
          { icon: School, title: "Student Roster Import", desc: "Import pre-admitted student lists via CSV or collect registrations via custom online forms." },
          { icon: Users, title: "Orientation QR Passes", desc: "Issue digital passes with student roll numbers, assigned orientation batches, and entry QR codes." },
          { icon: Clock, title: "Sub-Second Hall Scanning", desc: "Scan student passes at auditorium doors in under 0.3s to move hundreds of freshmen quickly." },
          { icon: QrCode, title: "Session-Wise Tracking", desc: "Track attendance across multiple orientation sessions, campus tours, and safety briefings." },
          { icon: ScanLine, title: "Duplicate Entry Prevention", desc: "Ensure each student checks in once per session with automatic duplicate detection." },
          { icon: BarChart3, title: "Institutional Attendance Logs", desc: "Export complete attendance spreadsheets sorted by department and batch for academic records." },
        ],
        steps: [
          { n: "01", title: "Import Student List", desc: "Upload student roster via CSV or share a registration form link." },
          { n: "02", title: "Issue Orientation Passes", desc: "Students receive mobile passes with their assigned orientation batch." },
          { n: "03", title: "Scan at Auditorium", desc: "Student coordinators scan passes as freshmen arrive for keynotes." },
          { n: "04", title: "Track Attendance", desc: "Dashboard tracks real-time arrivals and flags missing students." },
          { n: "05", title: "Export Verification Log", desc: "Download verified attendance logs for department records." },
        ],
        callout: {
          badge: "ACCURATE ONBOARDING",
          title: "Frictionless first impressions for incoming students.",
          description: "Manual roll calls and paper sign-in sheets take 45 minutes out of your orientation schedule. URPASS scans freshmen through auditorium doors in seconds while logging accurate attendance.",
          bullets: [
            "Sub-0.3s entrance scanning eliminates hall bottlenecks",
            "Timestamped attendance records for academic compliance",
            "Runs on student volunteers' phones with zero app downloads",
            "Permanent free tier for up to 100 students per month",
          ],
        },
        useCases: [
          "Freshman Orientation Days",
          "Corporate Employee Inductions",
          "Department Welcome Meets",
          "Campus Safety Briefings",
          "Library & Lab Orientations",
          "Hostel Resident Check-Ins",
        ],
        faqs: [
          { q: "Can we track which students attended mandatory orientation sessions?", a: "Yes. Every scan records the exact timestamp and student roll number, providing an audit-ready attendance record." },
          { q: "Do new students need to download an app?", a: "No. The orientation pass opens directly in mobile web browsers and can be saved to Apple Wallet or screenshot." },
          { q: "Can we assign students to different orientation batches or houses?", a: "Yes. The pass displays the student's assigned orientation batch, group number, or house prominently." },
          { q: "Can student council volunteers scan passes at the doors?", a: "Yes. Organizers share a PIN-protected scanner link so volunteers can scan using their own phone cameras." },
        ],
        ctaTitle: "Elevate your event entry with URPASS",
        ctaDescription: "Permanent free tier · Zero hardware setup · Fast sub-second scanning",
      }}
    />
  );
}
