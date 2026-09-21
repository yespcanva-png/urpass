import type { Metadata } from "next";
import { Trophy, QrCode, Users, ScanLine, Ticket, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "College Fest Registration & QR Check-In",
  description: "Manage college fest registrations, multiple ticket types, and QR entry scanning. Handle large crowds with fast QR check-in. Free to start.",
  alternates: { canonical: "https://urpass.space/college-fests" },
  openGraph: {
    title: "College Fest Registration & QR Check-In | URPASS",
    description: "Complete registration and QR check-in system for college fests and cultural events.",
    url: "https://urpass.space/college-fests",
  },
};

export default function CollegeFestsPage() {
  return (
    <SEOPage
      config={{
        badge: "COLLEGE FESTS",
        h1: "College Fest Registration & QR Check-In",
        description: "Run your college fest with online registration, multiple ticket types, digital QR passes, and fast entry scanning. Handle thousands of attendees without chaos.",
        ctaLabel: "Run your fest with URPASS",
        features: [
          { icon: Trophy, title: "Built for high volume", desc: "Handle large college fest crowds with fast QR scanning — no queues, no paper tickets." },
          { icon: Ticket, title: "Multiple pass categories", desc: "Create General, VIP, Speaker, Organizer, and custom pass types for your fest." },
          { icon: QrCode, title: "Unique QR per registrant", desc: "Every registered attendee gets a unique QR pass — impossible to share or duplicate." },
          { icon: ScanLine, title: "Fast QR scanning", desc: "Scan hundreds of attendees per minute across multiple entry gates with phone-based scanning." },
          { icon: Users, title: "Multiple gate support", desc: "Run simultaneous check-in at multiple gates with different staff devices." },
          { icon: BarChart3, title: "Live attendance view", desc: "See total check-ins, remaining capacity, and arrival trends in real time during the fest." },
        ],
        callout: {
          badge: "HIGH-VOLUME CHECK-IN",
          title: "Hundreds of check-ins. Zero confusion.",
          description: "College fests move fast. URPASS is built to handle the rush — multiple scanning gates, instant QR validation, and a live dashboard so you always know who's in.",
          bullets: [
            "Multiple staff scanning simultaneously",
            "Sub-second QR validation",
            "Live headcount on dashboard",
            "Duplicate entry blocked automatically",
          ],
        },
        useCases: [
          "Annual college fests", "Cultural events", "Tech fests", "Sports days",
          "Farewell events", "Orientation events", "Department fests", "Inter-college events",
        ],
        faqs: [
          { q: "Can URPASS handle a fest with thousands of attendees?", a: "Yes. The Pro plan supports up to 2,000 attendees per event. For very large fests, contact us for custom capacity options." },
          { q: "Can I have different entry zones with different passes?", a: "You can create multiple ticket types (General, VIP, etc.) and have staff check the pass type displayed on the scan result for zone management." },
          { q: "How many staff can scan simultaneously?", a: "Unlimited. Every staff member with a phone can scan at the same time from different gates." },
          { q: "Can I pre-register attendees from multiple colleges?", a: "Yes. The registration link is public and can be shared with anyone. You collect their college details as part of the registration form." },
          { q: "What if the internet is slow at the fest venue?", a: "URPASS scanning is designed to work in low-connectivity environments. Scans are validated locally and synced when connectivity is restored." },
          { q: "Can I use URPASS for both free and paid fest events?", a: "Yes. You can have free registration events and paid ticketing events. Paid ticketing requires a Starter or Pro plan with Razorpay." },
        ],
        ctaTitle: "Make your college fest unforgettable",
        ctaDescription: "Multi-gate QR check-in · Live attendance · Fast setup · Free to start",
      }}
    />
  );
}
