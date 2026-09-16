import type { Metadata } from "next";
import { ShieldCheck, AlertCircle, Lock, QrCode, ScanLine, Clock } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "How to Prevent Duplicate Event Check-Ins | URPASS",
  description: "Learn how to prevent duplicate entry at your event using QR code check-in. Single-use QR passes block re-entry, photo copies, and shared passes automatically.",
  alternates: { canonical: "https://urpass.space/guides/prevent-duplicate-event-entry" },
  openGraph: {
    title: "How to Prevent Duplicate Event Check-Ins | URPASS",
    description: "Prevent duplicate and fraudulent event entry with single-use QR passes and URPASS scanning.",
    url: "https://urpass.space/guides/prevent-duplicate-event-entry",
  },
};

export default function PreventDuplicateEventEntryPage() {
  return (
    <SEOPage
      config={{
        badge: "HOW-TO GUIDE",
        h1: "How to Prevent Duplicate Event Check-Ins",
        description: "Duplicate entry at events — whether from sharing passes, photocopying tickets, or re-entering without permission — is blocked automatically with single-use QR passes in URPASS.",
        ctaLabel: "Block duplicate entries",
        features: [
          { icon: QrCode, title: "Single-use QR passes", desc: "Every attendee gets a unique QR code. Once scanned and checked in, the QR is marked as used and cannot be accepted again." },
          { icon: ShieldCheck, title: "Instant duplicate detection", desc: "When a duplicate scan is attempted, URPASS shows 'Already Checked In' with the original entry timestamp — and denies access." },
          { icon: AlertCircle, title: "Shared passes blocked", desc: "If someone shares their QR code with another person, the second scan is rejected. The original attendee is already checked in." },
          { icon: Lock, title: "Screenshots blocked too", desc: "Screenshotting a QR pass and sharing the image doesn't help — the QR token is single-use regardless of how it's shown." },
          { icon: Clock, title: "Original entry time shown", desc: "Staff can see the exact time the legitimate check-in occurred — making any re-entry claim verifiable." },
          { icon: ScanLine, title: "Works across multiple gates", desc: "All scanners sync in real time, so a pass used at Gate A is instantly blocked at Gate B." },
        ],
        callout: {
          badge: "AUTOMATIC PROTECTION",
          title: "No duplicate entry — by design.",
          description: "URPASS builds duplicate prevention directly into every QR pass. You do not need to configure anything — it works automatically for every event, every attendee.",
          bullets: [
            "Works for all events automatically",
            "No configuration needed",
            "Applies across multiple scanners",
            "Deters pass sharing proactively",
          ],
        },
        useCases: [
          "Paid events", "Exclusive workshops", "Corporate events", "College fests",
          "Conferences", "VIP events", "Hackathons", "Any event with limited seats",
        ],
        faqs: [
          { q: "How does URPASS prevent duplicate event entry?", a: "Each QR pass in URPASS contains a cryptographically unique token. When staff scans a pass, the token is marked as used. Any attempt to scan the same token again shows 'Already Checked In' and is blocked." },
          { q: "What happens if someone photographs another attendee's QR code and tries to use it?", a: "The first scan checks the QR in. Any subsequent scan of the same QR — even from a photograph — shows 'Already Checked In' and is rejected." },
          { q: "What if two people try to scan the same pass at two different gates simultaneously?", a: "URPASS uses real-time server-side validation. The first request to check in with a pass wins — the second request (even milliseconds later) is blocked." },
          { q: "Can I manually mark someone as having entered without scanning?", a: "Organisers can manually update check-in status from the dashboard — but this is a logged action. It does not affect the anti-duplicate enforcement for scans." },
          { q: "Does URPASS prevent someone from registering multiple times?", a: "URPASS checks for duplicate email addresses at registration. The same email cannot register twice for the same event." },
          { q: "Can I override a 'duplicate entry' block for a legitimate re-entry?", a: "Organisers with dashboard access can manually reset a pass's check-in status if re-entry is legitimately needed (e.g., multi-day events)." },
        ],
        ctaTitle: "Prevent duplicate entry at your event",
        ctaDescription: "Single-use QR passes · Automatic duplicate detection · Real-time sync",
      }}
    />
  );
}
