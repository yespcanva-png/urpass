import type { Metadata } from "next";
import { BarChart3, Activity, Users, Clock, Download, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Attendance Tracking Software | URPASS",
  description: "Track event attendance in real time with QR check-in scanning. See who has arrived, check-in rates, and live attendance stats from your dashboard. Export attendance data.",
  alternates: { canonical: "https://urpass.space/event-attendance-tracking" },
  openGraph: {
    title: "Event Attendance Tracking Software | URPASS",
    description: "Real-time attendance tracking for events. Know who is in the room at any moment.",
    url: "https://urpass.space/event-attendance-tracking",
  },
};

export default function EventAttendanceTrackingPage() {
  return (
    <SEOPage
      config={{
        badge: "EVENT ATTENDANCE TRACKING",
        h1: "Track Event Attendance in Real Time",
        description: "Know exactly who has arrived at your event and when. URPASS updates your check-in dashboard live as attendees scan in — no manual counting, no spreadsheets.",
        ctaLabel: "Track attendance free",
        features: [
          { icon: Activity, title: "Live check-in feed", desc: "See every check-in appear on your dashboard as it happens, with attendee name, pass type, and timestamp." },
          { icon: BarChart3, title: "Attendance statistics", desc: "Track total registered, total checked in, check-in rate, and remaining arrivals in real time." },
          { icon: Clock, title: "Check-in timestamps", desc: "Every scan records the exact check-in time. See arrival patterns across your event." },
          { icon: Users, title: "Attendee-level tracking", desc: "View each attendee's check-in status, pass type, application status, and contact details in one place." },
          { icon: Download, title: "Export attendance data", desc: "Export your full check-in log to CSV for reporting, post-event analysis, or compliance requirements." },
          { icon: ShieldCheck, title: "Fraud-proof tracking", desc: "QR-based check-in prevents false attendance records. Each pass is single-use and device-verified." },
        ],
        callout: {
          badge: "REAL-TIME DASHBOARD",
          title: "See your event filling up in real time.",
          description: "URPASS shows your attendance dashboard live as your event runs. Watch check-ins appear as each QR pass is scanned, with full details and timestamps.",
          bullets: [
            "Total checked in vs registered",
            "Check-in rate percentage",
            "Per-ticket-type breakdown",
            "Exportable full attendance log",
          ],
        },
        useCases: [
          "College events", "Conferences", "Workshops", "Corporate events",
          "Seminars", "Hackathons", "Community events", "Tech summits",
        ],
        faqs: [
          { q: "How does URPASS track attendance?", a: "URPASS issues each attendee a unique QR pass. When staff scans the QR at the entrance, the check-in is recorded with a timestamp and instantly reflected on the organizer's dashboard." },
          { q: "Can I see attendance data during the event?", a: "Yes. The check-in dashboard updates in real time. You can see who has arrived, the check-in rate, and the full attendance log from any device while the event is running." },
          { q: "Can I export the attendance list?", a: "Yes. Starter and Pro plans allow you to export the full attendance data to CSV, including attendee details, pass types, and check-in timestamps." },
          { q: "What if an attendee doesn't show up?", a: "No-show attendees remain in a 'Not checked in' state in your dashboard. You can see the full no-show list after the event." },
          { q: "Can I track attendance across multiple entry points?", a: "Yes. Multiple staff members can scan at different entry points simultaneously. All scans are recorded to the same central dashboard." },
          { q: "Does URPASS prevent fake check-ins?", a: "Yes. Each QR pass is unique and single-use. Staff must physically scan the QR code — they cannot manually mark someone as checked in without the pass." },
        ],
        ctaTitle: "Track your next event's attendance live",
        ctaDescription: "Real-time dashboard · CSV export · QR check-in · Free to start",
      }}
    />
  );
}
