import type { Metadata } from "next";
import { HelpCircle, ScanLine, QrCode, ShieldCheck, Smartphone, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "What Is QR Event Check-In? Complete Guide",
  description: "Learn how QR event check-in works. Understand digital QR passes, scanning at entry, duplicate prevention, and real-time attendance tracking. Then try it with URPASS.",
  alternates: { canonical: "https://urpass.space/guides/what-is-qr-event-check-in" },
  openGraph: {
    title: "What Is QR Event Check-In? Complete Guide | URPASS",
    description: "A complete guide to QR event check-in — how it works, why it's better, and how to set it up.",
    url: "https://urpass.space/guides/what-is-qr-event-check-in",
  },
};

export default function WhatIsQrEventCheckInPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/guides/what-is-qr-event-check-in",
        badge: "GUIDE",
        h1: "What Is QR Event Check-In?",
        description: "QR event check-in replaces manual name lists and paper tickets with a digital QR code on each attendee's phone. Staff scans the code at the entrance for instant, fraud-proof verification.",
        ctaLabel: "Try QR check-in free",
        features: [
          { icon: QrCode, title: "Each attendee gets a unique QR", desc: "When you approve an attendee's registration, they receive a digital pass with a unique QR code. This code is tied to their specific registration and cannot be reused." },
          { icon: ScanLine, title: "Staff scans at the entrance", desc: "Your staff opens a scanner on any smartphone browser, points it at the attendee's QR code, and sees an instant result — valid, already used, or invalid." },
          { icon: ShieldCheck, title: "Duplicate entry is blocked", desc: "Each QR can only be scanned once. A second scan attempt shows the original check-in timestamp and is blocked — preventing shared or copied passes." },
          { icon: Smartphone, title: "No app required for anyone", desc: "Attendees show their QR on a phone screen (no app needed). Staff scans using a phone browser (no dedicated app needed)." },
          { icon: Zap, title: "Attendance is tracked live", desc: "Every scan updates your organiser dashboard in real time — you can see who has arrived without any manual counting." },
          { icon: HelpCircle, title: "Works for any event type", desc: "QR check-in works for college events, workshops, conferences, corporate events, hackathons, and any event where you need to verify attendees at entry." },
        ],
        callout: {
          badge: "WHY QR CHECK-IN?",
          title: "Better than manual check-in in every way.",
          description: "Manual check-in is slow, error-prone, and provides no real-time data. QR check-in is instant, fraud-proof, and automatically builds your attendance record.",
          bullets: [
            "No manual name-checking at the door",
            "Instant valid/invalid feedback",
            "Live attendance dashboard",
            "Duplicate entries automatically blocked",
          ],
        },
        useCases: [
          "College events", "Workshops", "Conferences", "Hackathons",
          "Corporate events", "Seminars", "Community events", "Tech events",
        ],
        faqs: [
          { q: "What is QR event check-in?", a: "QR event check-in is a method where each attendee carries a unique QR code (on their phone or printed). At the event entrance, staff scans the QR code to verify the attendee and record their check-in." },
          { q: "How does a QR code prevent duplicate entry?", a: "Each QR code is single-use. Once scanned and checked in, the system marks the pass as used. Any subsequent scan of the same QR shows 'Already Checked In' and is blocked." },
          { q: "Do attendees need to install an app?", a: "No. In URPASS, the digital QR pass is a web page — attendees open it in any mobile browser and show the QR code on their screen." },
          { q: "Do staff need a dedicated scanner device?", a: "No. Any Android or iOS smartphone with a camera and a browser works as a QR scanner with URPASS." },
          { q: "How accurate is QR check-in tracking?", a: "Very accurate. Every scan is recorded with a timestamp. There is no human error in manually crossing off names — the QR scan is the attendance record." },
          { q: "What is the difference between QR check-in and paper ticket check-in?", a: "Paper tickets can be photocopied or shared. QR tickets on a phone are single-use — a scan marks the specific token as used, making copying useless." },
        ],
        ctaTitle: "Set up QR check-in for your next event",
        ctaDescription: "Free plan available · Works on any phone · 5-minute setup",
      }}
    />
  );
}
