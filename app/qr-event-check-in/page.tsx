import type { Metadata } from "next";
import { ScanLine, ShieldCheck, Zap, Smartphone, BarChart3, WifiOff } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "QR Code Event Check-In Software",
  description: "Fast QR code check-in for events. Scan attendee digital passes at the entrance using any phone or tablet. No app required. Duplicate entry prevention. Real-time dashboard.",
  alternates: { canonical: "https://urpass.space/qr-event-check-in" },
  openGraph: {
    title: "QR Code Event Check-In Software | URPASS",
    description: "Check in attendees instantly with QR code scanning. Works on any device. No app for attendees or staff.",
    url: "https://urpass.space/qr-event-check-in",
  },
};

export default function QrEventCheckInPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/qr-event-check-in",
        badge: "QR CODE EVENT CHECK-IN",
        h1: "Fast QR Check-In for Every Event",
        description: "Open the URPASS scanner on any phone or tablet, point it at a QR pass, and entry is validated in under a second. No app install. No manual lists.",
        ctaLabel: "Set up QR check-in free",
        features: [
          { icon: ScanLine, title: "One-tap QR scanning", desc: "Staff opens the URPASS scanner in any browser and starts scanning immediately — no app download, no training needed." },
          { icon: ShieldCheck, title: "Duplicate entry blocked", desc: "Each QR pass can only be scanned once. A second scan shows the original check-in time with a clear rejection." },
          { icon: Zap, title: "Under-second validation", desc: "Pass validity is checked and confirmed in under a second — no waiting, no delays at the entrance." },
          { icon: Smartphone, title: "Works on any device", desc: "Use any Android or iOS device as your scanner. No dedicated hardware, no extra cost." },
          { icon: BarChart3, title: "Real-time check-in stats", desc: "Track who has arrived, how many are checked in, and your attendance rate live as the event runs." },
          { icon: WifiOff, title: "Works in low connectivity", desc: "Passes are validated locally so check-ins stay smooth even when internet is spotty." },
        ],
        callout: {
          badge: "HOW IT WORKS",
          title: "Entry takes one scan.",
          description: "URPASS generates a unique QR code for every approved attendee. Your staff opens the scanner in a browser, scans the QR at the entrance, and gets an instant valid or invalid response.",
          bullets: [
            "Valid pass — green screen, name displayed",
            "Already checked in — yellow screen with timestamp",
            "Invalid pass — red screen with reason",
            "All scans logged in real time",
          ],
        },
        useCases: [
          "College fests", "Hackathons", "Workshops", "Corporate events",
          "Conferences", "Seminars", "Community events", "Tech events",
        ],
        faqs: [
          { q: "What is QR event check-in?", a: "QR event check-in means each attendee has a unique QR code on their digital pass. Staff scans this QR at the entrance to verify the pass and record the check-in. URPASS handles the full flow from registration to QR generation to scanning." },
          { q: "Do staff need to install an app to scan?", a: "No. The URPASS scanner works directly in any mobile browser. Staff just opens the scanner URL, grants camera permission, and starts scanning." },
          { q: "What happens if someone tries to scan the same pass twice?", a: "URPASS blocks it immediately and shows an 'Already Checked In' result with the original check-in time. This prevents duplicate or shared pass abuse." },
          { q: "Can multiple staff scan at the same time?", a: "Yes. Multiple staff on different devices can scan simultaneously from multiple entry points. All check-ins appear on the central dashboard in real time." },
          { q: "What if the attendee's phone is dead?", a: "Each pass has a short code printed below the QR. Staff can manually verify using the pass code from the attendee dashboard." },
          { q: "Does the scanner work offline?", a: "The scanner works in low-connectivity environments. It periodically syncs and handles edge cases gracefully." },
        ],
        ctaTitle: "Replace manual lists with QR check-in",
        ctaDescription: "Any phone becomes a scanner · Instant validation · No app for attendees",
      }}
    />
  );
}
