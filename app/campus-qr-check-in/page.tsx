import type { Metadata } from "next";
import { QrCode, ScanLine, Smartphone, ShieldCheck, Zap, Users, WifiOff, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Campus QR Check-In System for Colleges & Universities | URPASS",
  description:
    "Fast, tamper-proof campus QR check-in software for college gates, auditoriums, and fests. Sub-0.28s scanning, PIN access, and offline synchronization.",
  keywords: [
    "campus qr check-in",
    "college gate check-in system",
    "university event qr scanner",
    "campus auditorium check-in",
    "offline college event scanner",
  ],
  alternates: { canonical: "https://urpass.space/campus-qr-check-in" },
  openGraph: {
    title: "Campus QR Check-In System for Colleges & Universities | URPASS",
    description: "Fast, secure QR check-in system for campus gates, auditoriums, and student fests with 0.28s scanning.",
    url: "https://urpass.space/campus-qr-check-in",
    locale: "en_IN",
    type: "website",
  },
};

export default function CampusQrCheckInPage() {
  return (
    <SEOPage
      config={{
        badge: "CAMPUS ACCESS CONTROL",
        h1: "Campus QR Check-In System for Colleges & Universities",
        canonicalUrl: "https://urpass.space/campus-qr-check-in",
        description:
          "Eliminate gate bottlenecks and prevent unauthorized campus entry. Scan student and visitor QR passes in 0.28s using any mobile camera with offline sync and PIN security.",
        ctaLabel: "Test Scanner Demo",
        ctaHref: "/scan",
        secondaryCtaLabel: "Campus Platform Overview",
        secondaryCtaHref: "/campus-event-management-platform",
        directAnswer: {
          title: "How Does Campus QR Check-In Work for College Events?",
          summary:
            "URPASS converts student volunteers' existing smartphones into industrial-grade gate scanners. Volunteers open a secure URL in Safari or Chrome, enter a 6-digit gate PIN, and scan digital student QR passes. Each pass is validated in under 0.28 seconds against the central event database, triggering green audio chimes for valid tickets or loud red alerts for duplicate screenshot attempts.",
          keyPoints: [
            "Sub-0.28s Verification: Zero waiting lines with camera-based instant barcode detection",
            "Multi-Gate Operations: Assign distinct devices to Gate 1 (North), Gate 2 (VIP), and Auditoriums",
            "Offline Tolerance: Scans cache locally and sync automatically if campus Wi-Fi drops",
            "No App Required: Runs entirely in mobile browsers with zero app store downloads",
          ],
        },
        productProof: {
          badge: "REAL-TIME GATE VERIFICATION",
          title: "Multi-Gate Campus Entry Control",
          description:
            "Assign security guards and student volunteers to specific entrances. Monitor live attendance and flow rates directly from the organizer control center.",
          type: "scanner",
        },
        features: [
          { icon: ScanLine, title: "0.28s Fast Gate Scanning", desc: "Instantly reads QR codes in direct sunlight, low light, or from cracked phone screens." },
          { icon: ShieldCheck, title: "Screenshot Fraud Detection", desc: "Flags duplicate scans immediately and displays previous check-in gate, timestamp, and device." },
          { icon: WifiOff, title: "Full Offline Capability", desc: "Keep gates running during campus internet outages with local SQLite/IndexedDB caching and batch sync." },
          { icon: Smartphone, title: "No App Installation", desc: "Guards and student volunteers open a web link with a temporary PIN — zero IT setup needed." },
          { icon: Users, title: "Gate-Specific Routing", desc: "Enforce student badge zones ensuring General Admission passes cannot enter VIP or faculty lounges." },
          { icon: BarChart3, title: "Real-Time Campus Dashboard", desc: "View live attendance counts, gate throughput velocity, and peak entry hours across all venues." },
        ],
        faqs: [
          { q: "What happens if campus Wi-Fi fails during a major college fest?", a: "URPASS includes offline check-in mode. Volunteers continue scanning tickets normally; all verifications are buffered locally and reconcile with the cloud as soon as connection is restored." },
          { q: "Can a student forward their QR pass screenshot to friends?", a: "No. The moment a pass is scanned at any campus gate, its status changes to Checked-In globally. Any subsequent presentation triggers a loud duplicate entry alarm indicating when and where it was first scanned." },
          { q: "Can we restrict student volunteers from seeing organizer settings?", a: "Yes. Volunteers access the scanner using a gate-specific PIN that gives them scanning abilities only, without access to financials, attendee emails, or event settings." },
        ],
        relatedLinks: [
          { title: "Campus Event Management Platform", href: "/campus-event-management-platform", category: "Product" },
          { title: "College Event Registration Software", href: "/college-event-registration-software", category: "Product" },
          { title: "Placement Drive Registration Software", href: "/placement-drive-registration-software", category: "Use Case" },
          { title: "Student Club Event Management", href: "/student-club-event-management", category: "Use Case" },
        ],
      }}
    />
  );
}
