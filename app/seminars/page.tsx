import type { Metadata } from "next";
import { Megaphone, ClipboardList, QrCode, ScanLine, Zap, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Seminar Registration & Attendance Software | URPASS",
  description: "Manage seminar registrations, attendance tracking, and QR check-in. Issue digital passes, scan attendees at entry, and track seminar attendance in real time.",
  alternates: { canonical: "https://urpass.space/seminars" },
  openGraph: {
    title: "Seminar Registration & Attendance Software | URPASS",
    description: "Simple seminar registration with QR passes and attendance tracking.",
    url: "https://urpass.space/seminars",
  },
};

export default function SeminarsPage() {
  return (
    <SEOPage
      config={{
        badge: "SEMINARS",
        h1: "Seminar Registration & Attendance Tracking",
        description: "Create a seminar registration page, collect attendee sign-ups, issue digital QR passes, and track who attended. All from one simple platform.",
        ctaLabel: "Register your seminar",
        features: [
          { icon: Megaphone, title: "Seminar registration page", desc: "Publish a registration link in minutes. No website or technical skills required." },
          { icon: ClipboardList, title: "Attendee information collection", desc: "Collect name, institution, designation, email, and any seminar-specific questions." },
          { icon: Zap, title: "Instant or reviewed sign-ups", desc: "Auto-approve registrations for open seminars, or review each sign-up manually." },
          { icon: QrCode, title: "Digital QR pass", desc: "Each attendee gets a unique QR pass on approval — scannable at the seminar entrance." },
          { icon: ScanLine, title: "QR check-in at venue", desc: "Scan attendees at the seminar entrance using any smartphone. Fast and reliable." },
          { icon: Users, title: "Attendance records", desc: "Keep a precise attendance record for every seminar with check-in timestamps." },
        ],
        callout: {
          badge: "PRECISE ATTENDANCE",
          title: "Know exactly who attended your seminar.",
          description: "URPASS generates an accurate, timestamp-based attendance record for every scan. No manual sign-in sheets. No guesswork.",
          bullets: [
            "QR scan = attendance confirmed",
            "Exact check-in time recorded",
            "Full attendance export on paid plans",
            "No show-up marked separately",
          ],
        },
        useCases: [
          "Academic seminars", "Industry seminars", "College guest lectures", "Corporate seminars",
          "Research presentations", "Medical CMEs", "Career seminars", "Professional development",
        ],
        faqs: [
          { q: "Can I use URPASS to track attendance for a seminar?", a: "Yes. Every attendee who scans their QR pass is marked as checked in with a precise timestamp. You can export the full attendance list." },
          { q: "Is URPASS suitable for academic or college seminars?", a: "Yes. URPASS is designed for exactly this use case — it's used by college organisers across India for guest lectures, seminars, and workshops." },
          { q: "Can I get an attendance report after the seminar?", a: "Yes. You can view the full check-in list in your dashboard and export it to CSV on paid plans." },
          { q: "What if some attendees walk in without registering?", a: "You can manually add walk-in attendees directly from the attendee management dashboard and check them in manually." },
          { q: "How do I share the seminar registration link?", a: "Once your event is published, you get a unique URL you can share via WhatsApp, email, Instagram, or your institution's notice board." },
          { q: "Can I use URPASS for free?", a: "Yes. The free plan supports one seminar with up to 50 attendees — perfect for smaller sessions." },
        ],
        ctaTitle: "Track seminar attendance precisely",
        ctaDescription: "Registration · QR passes · Attendance records · Free to start",
      }}
    />
  );
}
