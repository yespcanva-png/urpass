import type { Metadata } from "next";
import { Smartphone, ScanLine, QrCode, ShieldCheck, Zap, WifiOff } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "How to Run QR Event Check-In Without an App",
  description: "Run fast QR event check-in without any app download — for staff or attendees. URPASS scanner works in any mobile browser. Attendee passes work on any phone browser.",
  alternates: { canonical: "https://urpass.space/guides/event-check-in-without-app" },
  openGraph: {
    title: "How to Run QR Event Check-In Without an App | URPASS",
    description: "QR event check-in with no app installs for anyone. Works in any mobile browser.",
    url: "https://urpass.space/guides/event-check-in-without-app",
  },
};

export default function EventCheckInWithoutAppPage() {
  return (
    <SEOPage
      config={{
        badge: "HOW-TO GUIDE",
        h1: "How to Run QR Event Check-In Without an App",
        description: "QR event check-in in URPASS requires zero app downloads — for both your check-in staff and your attendees. Everything works in a standard mobile browser.",
        ctaLabel: "Start app-free check-in",
        features: [
          { icon: Smartphone, title: "No app for attendees", desc: "Attendees receive a link to their digital QR pass. They open it in any mobile browser — Safari, Chrome, or any default browser. No install needed." },
          { icon: ScanLine, title: "No app for staff", desc: "Check-in staff opens the URPASS scanner URL in their phone browser. Grant camera permission. Start scanning. No install, no login needed for staff." },
          { icon: QrCode, title: "QR in the browser", desc: "The attendee's QR code displays as a web page. Staff scans it using the browser-based scanner. Everything stays in the browser." },
          { icon: ShieldCheck, title: "Full check-in features", desc: "No-app scanning includes full duplicate detection, invalid pass flagging, and real-time check-in recording — same as any dedicated app." },
          { icon: Zap, title: "Instant setup for staff", desc: "New staff members can start scanning in under 30 seconds — open the URL, tap Allow on the camera prompt, scan." },
          { icon: WifiOff, title: "Works in low connectivity", desc: "The browser-based scanner handles intermittent connectivity gracefully. Scans work locally and sync when the connection is stable." },
        ],
        callout: {
          badge: "BROWSER-BASED",
          title: "Just a URL. No install. No friction.",
          description: "URPASS was designed from the start to require no app installs. The attendee pass is a URL. The scanner is a URL. Anyone can participate in seconds.",
          bullets: [
            "Attendees: just open the pass link",
            "Staff: just open the scanner URL",
            "Works on Android and iOS",
            "No Play Store or App Store required",
          ],
        },
        useCases: [
          "College events with volunteer staff", "Community events", "One-time events",
          "Corporate events", "Events with older attendees", "Hackathons", "Workshops", "Seminars",
        ],
        faqs: [
          { q: "Why is no-app check-in important for events?", a: "App-based check-in creates friction — staff need to download an app, attendees may refuse to install one, and IT policies may block installs. Browser-based check-in eliminates all these barriers." },
          { q: "Does the browser scanner work on all phones?", a: "Yes. The URPASS scanner uses the browser's native camera API, which works on modern Android and iOS devices in Chrome, Safari, and most mobile browsers." },
          { q: "What permission does staff need to grant?", a: "Staff needs to grant camera permission to the browser when they open the scanner URL. This is a one-time browser prompt." },
          { q: "Do attendees need internet access during the event?", a: "Attendees should have their pass open before arriving. Once the pass page is open on their phone, they don't need an active connection to show the QR." },
          { q: "Can staff scan offline?", a: "URPASS scanner handles intermittent connectivity. Scans are validated locally and synced when the internet connection is available." },
          { q: "Is the browser-based scanner as fast as a dedicated app?", a: "Yes. The browser scanner validates passes in under a second — the same performance as a dedicated app." },
        ],
        ctaTitle: "Run QR check-in with zero app installs",
        ctaDescription: "Browser-based · No installs · Works on any phone · Free to start",
      }}
    />
  );
}
