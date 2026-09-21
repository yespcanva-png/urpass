import type { Metadata } from "next";
import { CheckCircle2, BarChart3, ScanLine, Users, Clock, Download, Activity } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "How to Track Event Attendance in Real Time: Live Dashboards",
  description: "Track event attendance in real time using a live organizer dashboard connected to your gate scanners. As staff scans QR passes at venue doors, the dashboard instantly reflects current headcount, peak entry velocity, remaining expected arrivals, and attendance breakdowns by ticket category.",
  keywords: [
    "how to track event attendance in real time",
    "QR event check-in guide",
    "digital event pass tutorial",
    "event check-in best practices",
    "college fest check-in",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/guides/how-to-track-event-attendance-in-real-time" },
  openGraph: {
    title: "How to Track Event Attendance in Real Time: Live Dashboards | URPASS",
    description: "Track event attendance in real time using a live organizer dashboard connected to your gate scanners. As staff scans QR passes at venue doors, the dashboard instantly reflects current headcount, peak entry velocity, remaining expected arrivals, and attendance breakdowns by ticket category.",
    url: "https://urpass.space/guides/how-to-track-event-attendance-in-real-time",
    locale: "en_IN",
    type: "article",
  },
};

export default function GuidePage() {
  return (
    <SEOPage
      config={{
        badge: "ANALYTICS GUIDE",
        h1: "How to Track Event Attendance in Real Time",
        canonicalUrl: "https://urpass.space/guides/how-to-track-event-attendance-in-real-time",
        description: "Track event attendance in real time using a live organizer dashboard connected to your gate scanners. As staff scans QR passes at venue doors, the dashboard instantly reflects current headcount, peak entry velocity, remaining expected arrivals, and attendance breakdowns by ticket category.",
        ctaLabel: "Track attendance live free",
        features: [
          { icon: BarChart3, title: "Live Headcount Counter", desc: "Watch total admissions increment instantly as each attendee pass is verified at venue gates." },
          { icon: ScanLine, title: "Arrival Velocity Graph", desc: "Visualize check-in speed over time to identify arrival spikes, busy doors, and queue bottlenecks." },
          { icon: Users, title: "Ticket Tier Distribution", desc: "Track attendance breakdown across VIP, Speaker, General, and Student ticket categories live." },
          { icon: Clock, title: "Searchable Check-In Feed", desc: "See a chronological feed of recent check-ins with attendee names, tiers, and exact timestamps." },
          { icon: Download, title: "Multi-Gate Synchronization", desc: "Consolidate scan data from dozens of volunteer scanners and entrance doors into a single view." },
          { icon: Activity, title: "One-Click CSV Export", desc: "Export timestamped attendance logs at any point during or after the event for instant reporting." },
        ],
        steps: [
          { n: "01", title: "Launch Check-In", desc: "Open the URPASS organizer dashboard on your laptop, tablet, or phone." },
          { n: "02", title: "Volunteers Scan", desc: "Door staff scan attendee QR passes at entrance gates in under 0.3s." },
          { n: "03", title: "Dashboard Syncs", desc: "Headcount, percentages, and arrival velocity update in real time." },
          { n: "04", title: "Manage Flow", desc: "Direct attendees to faster gates based on real-time arrival counts." },
          { n: "05", title: "Export Log", desc: "Download verified attendance data with timestamps for records." },
        ],
        callout: {
          badge: "REAL-TIME VISIBILITY",
          title: "Know exactly who is in the room at any moment.",
          description: "Manual check-in rosters leave organizers blind until hours after an event ends. With URPASS, you know the exact attendance number and arrival rate the moment guests enter.",
          bullets: [
            "Zero delay between gate scan and dashboard tally",
            "Identify crowd bottlenecks before queues form",
            "Timestamped audit logs for fire safety and compliance",
            "Exportable reports for sponsors and institutional records",
          ],
        },
        useCases: [
          "Large Conference Keynotes",
          "College Fest Auditoriums",
          "Corporate Annual Meets",
          "Academic Symposiums",
          "Exhibition Floor Entrances",
          "Shareholder Gatherings",
        ],
        faqs: [
          { q: "How quickly does the dashboard update when an attendee scans in?", a: "The dashboard updates in real time via live websocket connections within milliseconds of each scan." },
          { q: "Can multiple organizers view the live attendance dashboard?", a: "Yes. Multiple team members can monitor the dashboard simultaneously across different devices." },
          { q: "Can we see which specific gate an attendee entered through?", a: "Yes. The check-in log records the specific scanner device and timestamp for every verified attendee." },
          { q: "Can we export attendance data while the event is still running?", a: "Yes. You can export a CSV snapshot of checked-in attendees at any time during the event." },
        ],
        ctaTitle: "Streamline your event check-in with URPASS",
        ctaDescription: "Permanent free tier · Zero app downloads · Fast sub-second scanning",
      }}
    />
  );
}
