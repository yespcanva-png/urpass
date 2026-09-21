import type { Metadata } from "next";
import { CheckCircle2, Smartphone, ScanLine, Zap, ShieldCheck, Users, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Check-In App for Mobile Web (iOS & Android)",
  description: "Scan QR passes, verify attendees in under 0.3s, and track real-time admissions. Runs directly in Chrome and Safari on any iOS or Android phone.",
  keywords: [
    "event check in app",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "event ticketing platform",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-check-in-app" },
  openGraph: {
    title: "Event Check-In App for Mobile Web (iOS & Android) | URPASS",
    description: "Scan QR passes, verify attendees in under 0.3s, and track real-time admissions. Runs directly in Chrome and Safari on any iOS or Android phone.",
    url: "https://urpass.space/event-check-in-app",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "MOBILE CHECK-IN APP",
        h1: "Event Check-In App for Any Mobile Browser — No Downloads",
        canonicalUrl: "https://urpass.space/event-check-in-app",
        description: "Scan QR passes, verify attendees in under 0.3s, and track real-time admissions. Runs directly in Chrome and Safari on any iOS or Android phone.",
        ctaLabel: "Open mobile check-in app free",
        features: [
          { icon: Smartphone, title: "Zero App Store Downloads", desc: "Volunteers and door staff open your check-in URL directly in Safari or Chrome. Ready to scan in 5 seconds." },
          { icon: ScanLine, title: "Rapid Camera Scanner", desc: "Decodes QR passes from phone screens, printed badges, and awkward angles in under 0.3 seconds." },
          { icon: Zap, title: "Instant Duplicate Protection", desc: "Screen turns bright green for valid check-in and red for already-used passes with sound feedback." },
          { icon: ShieldCheck, title: "Search & Manual Check-In", desc: "Search attendee names or emails instantly if a guest's phone battery died or they lost their pass." },
          { icon: Users, title: "PIN-Protected Access", desc: "Staff access the scanning camera using an event PIN with zero access to financial or account settings." },
          { icon: BarChart3, title: "Battery & Data Optimized", desc: "Lightweight web application engineered for minimal battery consumption and low cellular data usage." },
        ],
        steps: [
          { n: "01", title: "Open Scanner URL", desc: "Navigate to your event check-in URL on any smartphone or tablet." },
          { n: "02", title: "Enter PIN", desc: "Input the event check-in PIN set by the organizer for secure access." },
          { n: "03", title: "Allow Camera", desc: "Grant one-time browser camera permission with a single tap." },
          { n: "04", title: "Scan Passes", desc: "Aim camera at attendee passes for instant green/red entry confirmation." },
          { n: "05", title: "Track Arrivals", desc: "Live headcount updates automatically on the organizer dashboard." },
        ],
        callout: {
          badge: "NO INSTALLATION",
          title: "The fastest way to deploy volunteer door scanners.",
          description: "Asking entrance volunteers to download heavy apps, create accounts, and remember passwords creates massive delays. URPASS runs instantly in their browser with zero friction.",
          bullets: [
            "Works on any iPhone, iPad, or Android phone",
            "No Apple App Store or Google Play Store downloads",
            "Continuous scanning with sub-0.3s recognition speed",
            "PIN-protected gate security protecting organizer data",
          ],
        },
        useCases: [
          "Volunteer Gate Staff",
          "Registration Desk Teams",
          "Auditorium Ushers",
          "VIP Door Hosts",
          "Workshop Entrance Staff",
          "Late-Night Security Guards",
        ],
        faqs: [
          { q: "Do volunteers need an iPhone or Android specifically?", a: "URPASS works seamlessly on both iOS (Safari) and Android (Chrome) as well as tablets and laptops." },
          { q: "Does the scanner consume a lot of mobile data?", a: "No. The scanning application is ultra-lightweight and uses minimal network data to verify pass tokens." },
          { q: "Can volunteers access my organizer account or billing details?", a: "No. Scanner links are restricted strictly to ticket scanning and attendee lookup, keeping your sensitive data private." },
          { q: "Does the camera scan QR codes in low-light conditions?", a: "Yes. The scanner leverages native camera auto-focus and includes an on-screen torch toggle for evening venues." },
        ],
        ctaTitle: "Start streamlining your event with URPASS",
        ctaDescription: "Permanent free tier · 30-day free trial on paid plans · Fast sub-second check-in",
      }}
    />
  );
}
