import type { Metadata } from "next";
import {
  ScanLine,
  Smartphone,
  Zap,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "QR Check-In Software UK — Sub-Second Entrance Scanner | URPASS",
  description:
    "Fast QR check-in software for UK venues and events. Scan attendee passes in <0.3s directly within standard smartphone browsers. Offline caching, multi-gate sync.",
  keywords: [
    "qr check-in software uk",
    "qr event check-in uk",
    "event gate scanner uk",
    "browser qr scanner uk",
    "event check-in app uk",
  ],
  alternates: {
    canonical: "https://urpass.space/uk/qr-check-in",
  },
  openGraph: {
    title: "QR Check-In Software UK — Sub-Second Entrance Scanner | URPASS",
    description:
      "Turn any smartphone into an entrance QR scanner. Fast, queue-free attendee check-in across UK venues.",
    url: "https://urpass.space/uk/qr-check-in",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
  },
};

export default function UkQrCheckInAliasPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/qr-check-in",
        badge: "UK QR GATE CHECK-IN · ZERO APP DOWNLOADS",
        h1: "QR Check-In Software for UK Venues & Organisers",
        description:
          "Keep UK entrance queues moving seamlessly. Validate attendee QR passes in under 0.3 seconds on volunteer smartphones without downloading apps or renting expensive hardware.",
        ctaLabel: "Create Your Event Free →",
        directAnswer: {
          title: "How does QR check-in work with URPASS in the UK?",
          summary:
            "URPASS QR check-in runs directly inside any modern mobile web browser (Safari, Chrome, Edge). Door staff open a secure gate link, enter a 4-digit PIN, and scan attendee QR passes using their phone's camera. The system validates entries in under 0.3 seconds with instant visual and haptic feedback, blocking duplicate passes in real time.",
          keyPoints: [
            "Sub-second (<0.3s) camera scanning without app store downloads",
            "Multi-door synchronization in real time across unlimited phones",
            "Offline caching engine keeps scanning functional if Wi-Fi drops",
            "0% commission and transparent GBP pricing",
          ],
        },
        features: [
          {
            icon: ScanLine,
            title: "Sub-Second Camera Scan",
            desc: "Validate passes with instant green confirmation from over 30cm away in under 300 milliseconds.",
          },
          {
            icon: Smartphone,
            title: "Zero Hardware Rentals",
            desc: "Staff and volunteers scan tickets using their personal smartphones. No laser terminals or extra costs.",
          },
          {
            icon: Zap,
            title: "Offline Vault Caching",
            desc: "Rosters cache locally in the browser, keeping scanning operational even in thick-walled UK venues with zero signal.",
          },
        ],
        relatedLinks: [
          {
            title: "QR Code Event Check-In UK",
            href: "/uk/qr-code-event-check-in",
            category: "Product",
          },
          {
            title: "Event Check-In Software UK",
            href: "/uk/event-check-in-software",
            category: "Product",
          },
          {
            title: "UK Event Registration Software",
            href: "/uk/event-registration-software",
            category: "Product",
          },
        ],
        faqs: [
          {
            q: "Do gate staff need to download an app from Google Play or the App Store?",
            a: "No. The URPASS scanner runs directly inside Safari or Chrome on iOS and Android. Volunteers open your private gate link and begin scanning immediately.",
          },
          {
            q: "How fast is QR check-in at the doors?",
            a: "Scanning takes under 0.28 seconds with instant audio chimes and visual green validation checkmarks.",
          },
          {
            q: "Can multiple volunteers scan simultaneously across different venue doors?",
            a: "Yes. Scanners synchronize in real time over the cloud to prevent duplicate check-ins across multiple entrances.",
          },
          {
            q: "What happens if venue Wi-Fi stutters?",
            a: "URPASS includes local browser caching that validates tickets offline and syncs entry logs once network connection resumes.",
          },
        ],
      }}
    />
  );
}
