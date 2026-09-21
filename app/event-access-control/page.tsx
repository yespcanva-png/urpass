import type { Metadata } from "next";
import { Lock, ShieldCheck, ScanLine, AlertCircle, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Access Control & QR Check-In Software",
  description: "Control event access with digital QR passes and scanning. Block unauthorised entry, prevent duplicates, and track every entry in real time. Works on any phone.",
  alternates: { canonical: "https://urpass.space/event-access-control" },
  openGraph: {
    title: "Event Access Control & QR Check-In Software | URPASS",
    description: "QR-based event access control. Only approved attendees with valid passes get in.",
    url: "https://urpass.space/event-access-control",
  },
};

export default function EventAccessControlPage() {
  return (
    <SEOPage
      config={{
        badge: "EVENT ACCESS CONTROL",
        h1: "Control Event Entry with QR Passes",
        description: "Only approved attendees with valid QR passes get in. URPASS validates every pass at the entrance in under a second — blocking duplicates, invalid passes, and gate-crashers.",
        ctaLabel: "Set up access control",
        features: [
          { icon: Lock, title: "Approved-only entry", desc: "Only attendees you have approved and issued a QR pass to can enter. No registration means no entry." },
          { icon: ShieldCheck, title: "Duplicate prevention", desc: "Each QR pass is single-use. An already-used pass is immediately rejected with the original check-in time." },
          { icon: AlertCircle, title: "Invalid pass detection", desc: "Fake, expired, or unregistered passes are flagged immediately with a clear rejection screen." },
          { icon: ScanLine, title: "QR scanning at gates", desc: "Staff scans QR passes on any phone at entry gates. No dedicated hardware needed." },
          { icon: Users, title: "Multi-gate access control", desc: "Run multiple entry gates simultaneously with different staff devices, all synced in real time." },
          { icon: Zap, title: "Under-second validation", desc: "Every scan is validated in under a second — no slowdowns, no queues at the door." },
        ],
        callout: {
          badge: "SECURITY LAYER",
          title: "Gate-crashers don't get past QR.",
          description: "Without a valid QR pass, there is no entry. URPASS gives your door staff a clear signal — green for valid, red for invalid — with no ambiguity.",
          bullets: [
            "Only registered + approved attendees",
            "Single-use QR — no sharing or copying",
            "Instant invalid detection",
            "Every scan logged with timestamp",
          ],
        },
        useCases: [
          "Paid conferences", "Corporate events", "Exclusive workshops", "Hackathons",
          "College fests", "VIP events", "Product launches", "Large seminars",
        ],
        faqs: [
          { q: "How does QR-based event access control work?", a: "URPASS issues a unique QR pass to every approved attendee. At the entrance, staff scans each QR code using the URPASS scanner app in a browser. Valid passes show green. Invalid or already-used passes show red — entry is denied." },
          { q: "Can someone share their QR code with a friend?", a: "No. Each QR pass is single-use. Once it has been scanned and checked in, any subsequent scan of the same QR shows 'Already Checked In' and is blocked." },
          { q: "How do I prevent gate-crashing?", a: "Only attendees with a valid URPASS QR pass can be checked in. Unregistered or unapproved individuals do not have a valid QR code and will be denied at scanning." },
          { q: "Does URPASS work for VIP and tiered access?", a: "Yes. You can assign different pass types (Participant, VIP, Speaker, Organizer) with different access designations. Your staff can see the pass type on the scan result." },
          { q: "Do I need security hardware?", a: "No. Any smartphone with a camera and browser works as a scanner. No dedicated QR hardware, handheld scanners, or turnstiles required." },
          { q: "How many entry points can I operate simultaneously?", a: "Unlimited. Every staff member with a phone can act as an independent scanner, all syncing to the same dashboard." },
        ],
        ctaTitle: "Take control of your event access",
        ctaDescription: "QR validation · Duplicate prevention · Multi-gate support · No hardware",
      }}
    />
  );
}
