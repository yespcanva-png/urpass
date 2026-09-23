import type { Metadata } from "next";
import { Activity, BarChart3, QrCode, Users, ShieldAlert, Clock, ArrowRight, CheckCircle2, Smartphone } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Live Event Check-In Dashboard | URPASS",
  description: "Track event check-ins live from one real-time dashboard. Monitor multi-gate arrivals, entrance scanner velocity, and attendance percentages in sub-seconds.",
  keywords: [
    "live event check in dashboard",
    "event check in dashboard",
    "real time event attendance tracking",
    "event gate check in monitor",
    "QR code check in software dashboard",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-check-in-dashboard" },
  openGraph: {
    title: "Live Event Check-In Dashboard | URPASS",
    description: "Track event check-ins live from one real-time dashboard.",
    url: "https://urpass.space/event-check-in-dashboard",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "REAL-TIME MONITORING",
        h1: "Track Event Check-Ins Live from One Dashboard",
        canonicalUrl: "https://urpass.space/event-check-in-dashboard",
        description:
          "A live event check-in dashboard gives organizers instant visibility into physical gate admissions, queue velocity, check-in percentages, and scanner throughput across all entrances. URPASS synchronizes mobile scanner readings in under 0.3 seconds, empowering operations teams to balance entrance crowds, spot duplicate tickets, and maintain safe venue capacities.",
        ctaLabel: "Open Live Dashboard",
        features: [
          { icon: Activity, title: "Sub-Second Live Telemetry", desc: "Watch attendee counts tick upward in real time without refreshing your browser as staff scan passes at the doors." },
          { icon: BarChart3, title: "Gate-by-Gate Throughput", desc: "Compare entry volumes across different entrance gates to reallocate volunteers to congested queues dynamically." },
          { icon: Clock, title: "Peak Arrival Velocity Curves", desc: "Visualize check-in velocity (scans per minute) to identify exact arrival rushes and plan food/beverage or seating schedules." },
          { icon: Users, title: "Tier-Specific Attendance Breakdowns", desc: "Track VIP, Speaker, General Admission, and Sponsor check-in percentages separately in real time." },
          { icon: ShieldAlert, title: "Instant Duplicate Alerts", desc: "Receive immediate visual alerts if a fraudulent duplicate ticket or invalidated pass is scanned at any entrance." },
          { icon: Smartphone, title: "Volunteer Scanner Activity", desc: "See which volunteer or security phone scanned which attendee and verify that all entrance gates are actively operating." },
        ],
        steps: [
          { n: "01", title: "Launch Scanner Stations", desc: "Volunteers open the zero-install web scanner on their smartphones across entrance gates." },
          { n: "02", title: "Open Live Command Center", desc: "Lead organizers and venue directors open the live check-in dashboard on laptops or tablets." },
          { n: "03", title: "Real-Time Scan Updates", desc: "Every sub-0.3s QR scan transmits attendee data to the dashboard via secure WebSockets." },
          { n: "04", title: "Reallocate Gate Staff", desc: "Identify congested entrances and shift staff to balance arrival lines before queues build." },
          { n: "05", title: "Instant Post-Event Audit", desc: "Export final attendance counts, scan timelines, and no-show rosters as soon as the event concludes." },
        ],
        callout: {
          badge: "OPERATIONAL PEACE OF MIND",
          title: "Never wonder how many people have arrived at your event.",
          description: "Organizers running events with paper guest lists or disconnected scanning hardware are constantly in the dark about actual crowd arrivals. URPASS provides a unified operational command center that tells you exact attendance numbers at any second.",
          bullets: [
            "Live check-in progress bar: registered vs physically checked in",
            "Zero installation needed: runs in any desktop or mobile browser",
            "Color-coded scanner logs for instant duplicate ticket identification",
            "Shareable read-only dashboard links for venue security and fire marshals",
          ],
        },
        deepDiveSections: [
          {
            badge: "QUEUE MANAGEMENT",
            title: "How does a real-time check-in dashboard eliminate entrance bottlenecks?",
            paragraphs: [
              "Entrance congestion occurs when attendees cluster at the most visible gate (e.g. Main Entrance) while secondary gates (e.g. East Gate or Student Gate) remain under-utilized. With legacy tools, organizers only notice the bottleneck after lines spill into the street.",
              "The URPASS live dashboard displays a real-time breakdown of scans per minute at each gate. When one entrance shows an arrival surge while another is quiet, coordinators can instantly redirect staff and crowd flow using public signage or line stewards.",
            ],
            takeaway: "Real-time gate telemetry enables active crowd balancing, keeping lines short and moving fast.",
          },
          {
            badge: "SECURITY & INTEGRITY",
            title: "How does the dashboard detect and prevent duplicate ticket attempts?",
            paragraphs: [
              "When an attendee attempts to scan a pass that has already been validated, the volunteer scanner flashes a bright red warning screen with an audible error tone.",
              "Simultaneously, the live organizer dashboard logs the incident with the exact timestamp, original entry gate, and secondary gate location. This immediate detection stops screenshot sharing, scalped duplicate sales, and pass sharing dead in its tracks.",
            ],
            takeaway: "Instantaneous duplicate alerts protect venue revenue and capacity compliance across every door.",
          },
        ],
        faqs: [
          {
            q: "Can multiple organizers monitor the live dashboard simultaneously?",
            a: "Yes. Any number of team members, stage managers, and security leads can view the live dashboard concurrently.",
          },
          {
            q: "Does the live dashboard require special hardware or dedicated WiFi?",
            a: "No. The dashboard runs in any modern browser on laptops, iPads, or smartphones and operates smoothly on standard 4G/5G mobile data.",
          },
          {
            q: "Can I search for an attendee manually on the dashboard if their phone battery died?",
            a: "Yes. The dashboard includes a rapid live search bar where staff can look up an attendee by name, email, or phone number and check them in manually with one click.",
          },
        ],
        relatedLinks: [
          { title: "Event Capacity Management", href: "/event-capacity-management", category: "Product" },
          { title: "Event No-Show Tracking", href: "/event-no-show-tracking", category: "Product" },
          { title: "Multi-Gate Event Check-in", href: "/multi-gate-event-check-in", category: "Product" },
          { title: "Event Registration Analytics", href: "/event-registration-analytics", category: "Product" },
        ],
      }}
    />
  );
}
