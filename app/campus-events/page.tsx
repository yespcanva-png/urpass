import type { Metadata } from "next";
import { School, QrCode, ClipboardList, ScanLine, Users, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Campus Event Registration & Attendance System",
  description: "Manage campus event registrations, digital QR passes, and attendance tracking. Replace manual sign-in sheets with QR-based campus attendance. Free to start.",
  alternates: { canonical: "https://urpass.space/campus-events" },
  openGraph: {
    title: "Campus Event Registration & Attendance System | URPASS",
    description: "Digital registration, QR passes, and attendance tracking for campus events.",
    url: "https://urpass.space/campus-events",
  },
};

export default function CampusEventsPage() {
  return (
    <SEOPage
      config={{
        badge: "CAMPUS EVENTS",
        h1: "Registration & Attendance for Campus Events",
        description: "Replace manual sign-in sheets with digital registration and QR check-in for all campus events — from department seminars to annual cultural fests.",
        ctaLabel: "Set up your campus event",
        features: [
          { icon: School, title: "Built for campus scale", desc: "Handles everything from a 20-person department seminar to a 2,000-person annual fest." },
          { icon: ClipboardList, title: "Student registration form", desc: "Collect student ID, department, year, and any event-specific information." },
          { icon: QrCode, title: "Digital QR student pass", desc: "Approved students get a QR pass on their phone — show it at the campus event gate." },
          { icon: ScanLine, title: "QR scanning at campus gates", desc: "Scan student passes using any phone at the campus venue entrance." },
          { icon: Users, title: "Student attendance tracking", desc: "Get a precise attendance record for every campus event with check-in timestamps." },
          { icon: BarChart3, title: "Department-wise reporting", desc: "Track which departments attended and export full attendance data for records." },
        ],
        callout: {
          badge: "CAMPUS-WIDE",
          title: "One platform for all your campus events.",
          description: "Workshops, seminars, cultural fests, sports days, orientation events — use the same URPASS setup for every campus event and keep all your records in one place.",
          bullets: [
            "Works for any campus event size",
            "Consistent digital attendance records",
            "Exportable attendance logs",
            "Any department, any event",
          ],
        },
        useCases: [
          "Department seminars", "Annual fests", "Orientation events", "Sports meets",
          "Guest lectures", "Alumni meets", "Farewell events", "Placement drives",
        ],
        faqs: [
          { q: "Can I use URPASS across multiple departments in the same college?", a: "Yes. Multiple organisers can have separate accounts for their department events, or a single account can manage events for the whole campus." },
          { q: "Can I collect student ID or roll number at registration?", a: "Yes. Add a custom field for student ID, roll number, department, or year in your registration form." },
          { q: "Does URPASS help with maintaining official attendance records?", a: "Yes. Every check-in is timestamped and stored. You can export the full attendance log to CSV for official records." },
          { q: "Is URPASS free for campus events?", a: "The free plan supports one event with 50 attendees. For larger campus events, paid plans start at ₹299/month." },
          { q: "Can multiple clubs or committees use URPASS?", a: "Yes. Each club or committee can create their own URPASS account, or multiple team members can share one account on the Pro plan." },
          { q: "Can I run campus events for both students and external guests?", a: "Yes. The registration form is public. You can differentiate internal students from external guests using custom form fields." },
        ],
        ctaTitle: "Modernise your campus event management",
        ctaDescription: "Digital QR passes · Attendance tracking · Any event size · Free to start",
      }}
    />
  );
}
