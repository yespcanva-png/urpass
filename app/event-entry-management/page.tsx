import type { Metadata } from "next";
import { DoorOpen, ShieldCheck, ScanLine, Users, Zap, AlertCircle } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Entry Management & QR Access System",
  description: "Manage event entry with QR code scanning. Control who enters, block duplicates, flag invalid passes, and track every entry in real time. Works on any phone.",
  alternates: { canonical: "https://urpass.space/event-entry-management" },
  openGraph: {
    title: "Event Entry Management & QR Access System | URPASS",
    description: "Streamline event entry with QR scanning. Instant validation, duplicate prevention, real-time tracking.",
    url: "https://urpass.space/event-entry-management",
  },
};

export default function EventEntryManagementPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/event-entry-management",
        badge: "EVENT ENTRY MANAGEMENT",
        h1: "Make Event Entry Faster and Simpler",
        description: "Replace slow manual check-in queues with instant QR scanning. Staff uses any phone to validate passes at the door — no hardware, no printed lists, no confusion.",
        ctaLabel: "Simplify entry management",
        features: [
          { icon: ScanLine, title: "QR scanning at entry", desc: "Staff scans attendee QR passes in under a second using any smartphone camera." },
          { icon: ShieldCheck, title: "Duplicate entry blocked", desc: "Each pass can only be used once. Second attempts are rejected with the original entry timestamp." },
          { icon: AlertCircle, title: "Invalid pass flagging", desc: "Fake, expired, or tampered passes are instantly identified and flagged with a clear error." },
          { icon: Zap, title: "Instant validation", desc: "Entry is confirmed or rejected in under a second — no slowdowns, no waiting in line." },
          { icon: Users, title: "Multi-gate support", desc: "Multiple staff on multiple devices can scan simultaneously from different entry points." },
          { icon: DoorOpen, title: "No hardware needed", desc: "Any Android or iOS phone becomes an entry scanner. No dedicated hardware to buy or rent." },
        ],
        callout: {
          badge: "QR ENTRY CONTROL",
          title: "Entry is as fast as a scan.",
          description: "When attendees arrive, staff opens the URPASS scanner in a browser. Scan the QR from the pass on the attendee's phone — green means in, red means not on the list.",
          bullets: [
            "Green — valid pass, entry granted",
            "Yellow — already checked in, entry blocked",
            "Red — invalid or not found, entry denied",
            "All entries logged with timestamp",
          ],
        },
        useCases: [
          "Large college fests", "Conferences", "Corporate events", "Paid events",
          "Workshops", "Tech events", "Community events", "Seminars",
        ],
        faqs: [
          { q: "What is event entry management?", a: "Event entry management is the process of controlling who enters your event. With URPASS, this is done via QR scanning — each approved attendee has a unique QR pass that is scanned at the entrance for instant verification." },
          { q: "Can I have multiple check-in points?", a: "Yes. Multiple staff members with their own devices can scan simultaneously. All entries sync to the central dashboard in real time." },
          { q: "What if someone shows a screenshot of another person's pass?", a: "The QR code is unique and single-use. If an attendee has already used their pass, the scan shows 'Already Checked In' — so sharing screenshots won't allow duplicate entry." },
          { q: "Do I need a dedicated QR scanner device?", a: "No. Any Android or iOS smartphone with a camera and a browser works as a scanner. No special hardware required." },
          { q: "Can I see entry activity live?", a: "Yes. The check-in dashboard updates in real time — you can see who is entering, entry rates, and total headcount from any device." },
          { q: "What happens if a scanner device goes offline mid-event?", a: "URPASS handles intermittent connectivity. Scans are validated locally and synced when the connection is restored." },
        ],
        ctaTitle: "Take control of your event entry",
        ctaDescription: "Any phone as a scanner · Instant validation · Duplicate prevention",
      }}
    />
  );
}
