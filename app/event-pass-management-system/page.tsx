import type { Metadata } from "next";
import { CheckCircle2, Ticket, Palette, QrCode, ShieldCheck, Users, ScanLine } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Pass Management System & Digital Badge Issuer",
  description: "Issue, manage, and verify digital event passes. Organize access levels for attendees, VIPs, speakers, and staff with browser-based QR validation.",
  keywords: [
    "event pass management",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "event ticketing platform",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-pass-management-system" },
  openGraph: {
    title: "Event Pass Management System & Digital Badge Issuer | URPASS",
    description: "Issue, manage, and verify digital event passes. Organize access levels for attendees, VIPs, speakers, and staff with browser-based QR validation.",
    url: "https://urpass.space/event-pass-management-system",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "PASS MANAGEMENT SYSTEM",
        h1: "Event Pass Management System for Modern Gatherings",
        canonicalUrl: "https://urpass.space/event-pass-management-system",
        description: "Issue, manage, and verify digital event passes. Organize access levels for attendees, VIPs, speakers, and staff with browser-based QR validation.",
        ctaLabel: "Manage event passes free",
        features: [
          { icon: Ticket, title: "Tiered Access Control", desc: "Create distinct pass tiers (General, VIP, Speaker, Sponsor, Press) with visual badges and custom entry rights." },
          { icon: Palette, title: "Custom Pass Studio", desc: "Brand digital passes with organization logos, primary accent colors, and custom event metadata." },
          { icon: QrCode, title: "Single-Use QR Security", desc: "Cryptographic QR codes ensure that passes cannot be duplicated, shared, or scanned more than once." },
          { icon: ShieldCheck, title: "Instant Invalidation", desc: "Revoke or re-issue passes instantly from the organizer dashboard if details change or tickets are cancelled." },
          { icon: Users, title: "Mobile Browser Passes", desc: "Attendees view their pass on any smartphone without downloading dedicated apps or creating accounts." },
          { icon: ScanLine, title: "Live Gate Verification", desc: "Staff scan passes with any phone to immediately verify pass validity, attendee name, and access tier." },
        ],
        steps: [
          { n: "01", title: "Design Pass", desc: "Upload logo, pick brand colors, and select minimal or modern layouts." },
          { n: "02", title: "Set Access Tiers", desc: "Configure General, VIP, and Staff tiers with individual allocations." },
          { n: "03", title: "Distribute Passes", desc: "Attendees receive direct links to their responsive digital passes." },
          { n: "04", title: "Scan at Doors", desc: "Verify access tier and check in guests in under 0.3s at entrance gates." },
          { n: "05", title: "Audit Attendance", desc: "Review tier-wise arrival metrics and export complete attendee records." },
        ],
        callout: {
          badge: "ACCESS CONTROL",
          title: "Total control over who enters your event.",
          description: "Managing paper tickets and plastic wristbands is expensive and insecure. URPASS event pass management gives you fraud-proof digital passes with real-time access control.",
          bullets: [
            "Differentiated visual badges for VIPs, speakers, and staff",
            "Zero physical printing costs or shipping logistics",
            "Immediate duplicate detection and pass revocation",
            "Works on any mobile device without app installation",
          ],
        },
        useCases: [
          "Multi-Track Conferences",
          "VIP Gala Dinners",
          "Tech Summits",
          "College Festivals",
          "Backstage Production Areas",
          "Private Masterclasses",
        ],
        faqs: [
          { q: "Can I customize the visual branding on attendee passes?", a: "Yes. With the Custom Pass Designer, you can add your logo, specify brand hex colors, and toggle visible information." },
          { q: "Can an attendee share their pass with someone else?", a: "They can forward the link, but the QR code can only be scanned once. The second scan triggers an immediate duplicate warning." },
          { q: "Can passes be saved to Apple Wallet?", a: "Yes. Passes can be added directly to Apple Wallet or saved as home-screen shortcuts on Android." },
          { q: "How do staff know if a pass is for VIP or General admission?", a: "The pass display and the scanner screen clearly show the attendee tier badge (e.g., VIP, Speaker, General) upon scan." },
        ],
        ctaTitle: "Start streamlining your event with URPASS",
        ctaDescription: "Permanent free tier · 30-day free trial on paid plans · Fast sub-second check-in",
      }}
    />
  );
}
