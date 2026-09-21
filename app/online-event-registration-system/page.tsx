import type { Metadata } from "next";
import { CheckCircle2, ClipboardList, CreditCard, QrCode, ScanLine, Lock, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Online Event Registration System & Digital QR Pass Issuer",
  description: "Launch online registrations, collect payments, issue digital QR passes, and manage check-ins from a cloud-based system built for colleges and enterprises.",
  keywords: [
    "online event registration system",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "event ticketing platform",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/online-event-registration-system" },
  openGraph: {
    title: "Online Event Registration System & Digital QR Pass Issuer | URPASS",
    description: "Launch online registrations, collect payments, issue digital QR passes, and manage check-ins from a cloud-based system built for colleges and enterprises.",
    url: "https://urpass.space/online-event-registration-system",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "ONLINE REGISTRATION SYSTEM",
        h1: "Online Event Registration System with Instant QR Ticketing",
        canonicalUrl: "https://urpass.space/online-event-registration-system",
        description: "Launch online registrations, collect payments, issue digital QR passes, and manage check-ins from a cloud-based system built for colleges and enterprises.",
        ctaLabel: "Create registration system free",
        features: [
          { icon: ClipboardList, title: "Hosted Registration Pages", desc: "Clean, responsive public registration links that load quickly on all mobile devices and desktops." },
          { icon: CreditCard, title: "Automated QR Pass Delivery", desc: "Registered participants receive a digital pass with verified QR tokens immediately upon payment or approval." },
          { icon: QrCode, title: "Payment Gateway Integration", desc: "Accept payments securely via Razorpay with support for UPI, credit cards, debit cards, and net banking." },
          { icon: ScanLine, title: "Entrance Access Control", desc: "Transform smartphones into door scanners that authenticate passes and block duplicate check-ins." },
          { icon: Lock, title: "Capacity & Ticket Tiers", desc: "Configure General, VIP, Student, and Early Bird tiers with distinct pricing and allocation limits." },
          { icon: BarChart3, title: "Live Headcount Monitoring", desc: "Monitor real-time arrival counts and attendance metrics from a central organizer dashboard." },
        ],
        steps: [
          { n: "01", title: "Configure Form", desc: "Set event details, registration questions, and ticketing tiers." },
          { n: "02", title: "Collect Entries", desc: "Distribute your public registration link across social media and websites." },
          { n: "03", title: "Auto-Generate Passes", desc: "System generates single-use digital QR codes for verified attendees." },
          { n: "04", title: "Scan at Doors", desc: "Gate staff scan passes in under 0.3s using mobile browser scanners." },
          { n: "05", title: "Export Attendance", desc: "Download complete timestamped arrival records for institutional audits." },
        ],
        callout: {
          badge: "ENTERPRISE RELIABILITY",
          title: "Cloud infrastructure engineered for peak registration spikes.",
          description: "Whether registration opens for a popular 500-seat hackathon or a 5,000-student cultural fest, URPASS scales automatically to handle traffic bursts without downtime.",
          bullets: [
            "Robust cloud infrastructure with real-time replication",
            "Zero per-ticket commissions — flat, transparent pricing",
            "Instant pass revocation and duplicate fraud prevention",
            "Detailed attendance logs with entrance timestamps",
          ],
        },
        useCases: [
          "University Fests",
          "Inter-College Competitions",
          "Professional Workshops",
          "Annual Corporate Meets",
          "Industry Summits",
          "Creator Meetups",
        ],
        faqs: [
          { q: "How does this system prevent duplicate entry?", a: "Each registrant receives a cryptographically unique QR pass. When scanned at the door, it is recorded and invalidated for any future entry attempts." },
          { q: "Can we restrict registration to specific institutions or email domains?", a: "You can require specific institutional fields (such as university roll number or corporate email) within the form builder." },
          { q: "Is the registration form mobile-friendly?", a: "Yes. The registration interface is 100% responsive and optimized for mobile devices." },
          { q: "Can we export attendee lists to Excel?", a: "Yes. You can export your full attendee roster and check-in logs to CSV format at any time." },
        ],
        ctaTitle: "Start streamlining your event with URPASS",
        ctaDescription: "Permanent free tier · 30-day free trial on paid plans · Fast sub-second check-in",
      }}
    />
  );
}
