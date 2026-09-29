import type { Metadata } from "next";
import { UserCheck, ScanLine, Smartphone, BarChart3, Users, Zap, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Attendee Check-In System | URPASS by Yesp Corporation",
  description: "Simple, powerful attendee check-in system developed by Yesp Corporation. Verify passes, track attendance rates, and manage guest check-ins from any smartphone.",
  keywords: [
    "attendee check-in system",
    "event attendee check-in",
    "attendee check-in app",
    "guest check-in software",
    "conference attendee check-in"
  ],
  alternates: { canonical: "https://urpass.space/attendee-check-in-system" },
  openGraph: {
    title: "Attendee Check-In System | URPASS by Yesp Corporation",
    description: "Simple, powerful attendee check-in system developed by Yesp Corporation. Verify passes and track attendance rates from any smartphone.",
    url: "https://urpass.space/attendee-check-in-system",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "ATTENDEE CHECK-IN SYSTEM",
        h1: "Fast, Reliable Attendee Check-In System",
        canonicalUrl: "https://urpass.space/attendee-check-in-system",
        description: "URPASS by Yesp Corporation streamlines the attendee arrival experience. Validate digital passes with smartphone cameras, conduct rapid manual lookups, and monitor attendance metrics in real time.",
        ctaLabel: "Start Checking In",
        directAnswer: {
          title: "How does the URPASS attendee check-in system work?",
          summary: "The URPASS attendee check-in system replaces printed rosters and clunky check-in apps with a web-first QR scanning and lookup engine. Door staff open the scanner in their mobile browser, scan an attendee's digital pass, and the system confirms admission and logs attendance in under 0.3s.",
          keyPoints: [
            "Scan QR passes or search guests by name/email in one unified interface",
            "Real-time attendance percentage and verified turnout counts",
            "Single-use validation prevents multiple entries on the same pass",
            "Instant CSV report generation with exact check-in timestamps"
          ]
        },
        features: [
          { icon: UserCheck, title: "Dual Check-In Methods", desc: "Scan digital QR passes with the camera or use quick manual search for attendees who forgot their phone." },
          { icon: Zap, title: "Sub-Second Response", desc: "Instantaneous pass evaluation keeps entrance queues moving without delays." },
          { icon: BarChart3, title: "Live Turnout Tracking", desc: "Watch registered vs checked-in counts update live on your organizer dashboard." },
          { icon: Smartphone, title: "Zero Setup Required", desc: "Staff simply tap a secure scanner link on any phone — no app store installations needed." },
          { icon: ShieldCheck, title: "Anti-Fraud Architecture", desc: "Prevent ticket reuse with real-time single-check-in enforcement across all team devices." },
          { icon: Users, title: "Unlimited Check-In Staff", desc: "Invite multiple volunteers or coordinators to scan tickets simultaneously across all gates." }
        ],
        faqs: [
          { q: "What happens if a guest's name is misspelled?", a: "The check-in search feature supports partial matching on name and email, allowing staff to quickly locate and admit attendees." },
          { q: "Can we track check-ins across multiple days?", a: "Yes. Every check-in event logs a precise timestamp, and multi-session passes can be configured for multi-day conferences." },
          { q: "Who operates this attendee check-in software?", a: "URPASS is engineered and operated by Yesp Corporation." }
        ]
      }}
    />
  );
}
