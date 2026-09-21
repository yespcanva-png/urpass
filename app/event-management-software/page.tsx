import type { Metadata } from "next";
import { CheckCircle2, Calendar, Ticket, ScanLine, Users, BarChart3, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Management Software for Modern Events",
  description: "Plan, register, issue digital QR passes, and check in attendees from one unified platform. Engineered for colleges, conferences, hackathons, and corporate organizers.",
  keywords: [
    "event management software",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "event ticketing platform",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-management-software" },
  openGraph: {
    title: "Event Management Software for Modern Events | URPASS",
    description: "Plan, register, issue digital QR passes, and check in attendees from one unified platform. Engineered for colleges, conferences, hackathons, and corporate organizers.",
    url: "https://urpass.space/event-management-software",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "EVENT MANAGEMENT SOFTWARE",
        h1: "Event Management Software for Modern Organizers",
        canonicalUrl: "https://urpass.space/event-management-software",
        description: "Plan, register, issue digital QR passes, and check in attendees from one unified platform. Engineered for colleges, conferences, hackathons, and corporate organizers.",
        ctaLabel: "Start managing events free",
        features: [
          { icon: Calendar, title: "Complete Event Lifecycle", desc: "Manage everything from public registration page launch to live entrance check-in and post-event survey analytics." },
          { icon: Ticket, title: "Custom Registration Forms", desc: "Build branded application forms with custom questions, department selectors, file uploads, and ticket categories." },
          { icon: ScanLine, title: "Digital QR Credentials", desc: "Automatically distribute fraud-proof digital passes with unique QR codes upon application approval or payment." },
          { icon: Users, title: "Sub-Second Gate Check-In", desc: "Scan attendee passes in under 0.3s using any mobile browser without renting expensive barcode hardware." },
          { icon: BarChart3, title: "Unified Attendee Roster", desc: "Filter, search, approve, or export attendee data with instant real-time synchronization across team members." },
          { icon: ShieldCheck, title: "Live Attendance Analytics", desc: "Track entrance velocity, gate check-in volume, and remaining capacity live as your event progresses." },
        ],
        steps: [
          { n: "01", title: "Create Event", desc: "Configure your event schedule, venue address, and ticket capacities." },
          { n: "02", title: "Collect Signups", desc: "Publish and share your responsive registration link across channels." },
          { n: "03", title: "Review & Approve", desc: "Approve registrations in bulk or enable instant automated approvals." },
          { n: "04", title: "Scan at Doors", desc: "Volunteers open the browser scanner to check guests in instantly." },
          { n: "05", title: "Review Insights", desc: "Export timestamped attendance logs and post-event survey feedback." },
        ],
        callout: {
          badge: "STREAMLINED OPERATIONS",
          title: "One software platform. Zero operational fragmentation.",
          description: "Stop stitching together spreadsheets, form builders, email mergers, and rented barcode scanners. URPASS consolidates your entire event workflow into one fast, reliable cloud system.",
          bullets: [
            "No per-ticket platform commissions or hidden service fees",
            "Native INR payments with Razorpay (UPI, cards, net banking)",
            "Multi-counter gate check-in with duplicate entry lockout",
            "Export full attendee lists to CSV/Excel in one click",
          ],
        },
        useCases: [
          "College Fests & Culturals",
          "Tech Conferences",
          "Hackathons & Buildathons",
          "Corporate Summits",
          "Hands-on Workshops",
          "Department Seminars",
          "Community Meetups",
          "Annual Campus Festivals",
        ],
        faqs: [
          { q: "What makes URPASS different from legacy event management software?", a: "Legacy event software is often bloated, requires specialized scanner rentals, and charges 3% to 10% per-ticket commission. URPASS operates on transparent flat pricing, runs entirely in mobile browsers, and verifies passes in under 0.3 seconds." },
          { q: "Can team members collaborate on managing the event?", a: "Yes. Organizers can invite team members with role-based permissions to manage registration review, badge design, and entrance gate scanning." },
          { q: "Does URPASS support free events?", a: "Yes. You can host 2 events per month with up to 100 registrations per month for ₹0 forever on our free plan." },
          { q: "Can we collect payments for ticket sales in India?", a: "Yes. Native Razorpay integration allows Indian organizers to collect registration fees via UPI, credit/debit cards, and net banking directly into their accounts." },
        ],
        ctaTitle: "Start streamlining your event with URPASS",
        ctaDescription: "Permanent free tier · 30-day free trial on paid plans · Fast sub-second check-in",
      }}
    />
  );
}
