import type { Metadata } from "next";
import { UserCheck, FileText, BarChart3, ScanLine, Clock, Users, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration and Attendance System | URPASS by Yesp",
  description: "End-to-end event registration and attendance system by Yesp Corporation. Connect applicant registration, pass issuance, door scanning, and real-time attendance analytics.",
  keywords: [
    "event registration and attendance system",
    "event attendance tracking software",
    "registration and attendance management",
    "event check-in and attendance",
    "URPASS attendance system"
  ],
  alternates: { canonical: "https://urpass.space/event-registration-and-attendance-system" },
  openGraph: {
    title: "Event Registration and Attendance System | URPASS by Yesp",
    description: "End-to-end event registration and attendance system by Yesp Corporation. Connect applicant registration, door scanning, and attendance analytics.",
    url: "https://urpass.space/event-registration-and-attendance-system",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "REGISTRATION & ATTENDANCE",
        h1: "Unified Event Registration and Attendance System",
        canonicalUrl: "https://urpass.space/event-registration-and-attendance-system",
        description: "URPASS by Yesp Corporation bridges the gap between registration and physical event arrival. Collect registrations, issue digital passes, verify guests at the entrance, and monitor live turnout in one synchronized dashboard.",
        ctaLabel: "Launch Attendance System",
        directAnswer: {
          title: "Why integrate event registration with attendance tracking?",
          summary: "Disconnecting registration forms from entrance gate tracking leads to spreadsheet exports, paper rosters, and lost check-in data. URPASS unifies the entire workflow: when an attendee registers, their profile is instantly prepared for entrance scanning. Gate staff scan passes with phone cameras, instantly updating attendance figures and providing accurate headcount metrics.",
          keyPoints: [
            "Seamless data continuity from form submission to entrance validation",
            "Real-time turnout percentage and no-show analysis",
            "Sub-second QR verification with anti-passback security",
            "Audit-ready attendance CSV reports with timestamped entry records"
          ]
        },
        features: [
          { icon: FileText, title: "Form-to-Gate Pipeline", desc: "No manual spreadsheet transfers. Approved registrations automatically generate scannable digital passes." },
          { icon: ScanLine, title: "Sub-Second Gate Scans", desc: "Validate attendance in under 0.3s per attendee using standard smartphone web browsers." },
          { icon: BarChart3, title: "Real-Time Turnout Rates", desc: "Monitor live arrival curves, peak check-in hours, and overall attendance conversion percentages." },
          { icon: Clock, title: "Exact Timestamp Logging", desc: "Every check-in is recorded with precise millisecond timestamps for attendance compliance and audits." },
          { icon: ShieldCheck, title: "Duplicate Entry Prevention", desc: "Stop attendee credential sharing with single-use verification algorithms." },
          { icon: Users, title: "Comprehensive CSV Exports", desc: "Download full attendee rosters showing application status, pass issuance, check-in status, and entry time." }
        ],
        faqs: [
          { q: "Can we use this for college student attendance certification?", a: "Yes. Many engineering institutions use URPASS to record verified physical attendance before issuing certificates or academic credits." },
          { q: "What happens if someone checks in and tries to re-enter?", a: "The scanner alerts gate staff that the pass has already been admitted, displaying the exact initial check-in time." },
          { q: "Who operates URPASS?", a: "URPASS is engineered and maintained by Yesp Corporation." }
        ]
      }}
    />
  );
}
