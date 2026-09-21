import type { Metadata } from "next";
import { CheckCircle2, Award, Users, ShieldCheck, ScanLine, Palette, Clock } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Award Ceremony Guest List & VIP Table Check-In Software",
  description: "Manage guest lists, nominee invitations, and VIP table seating for prestigious award ceremonies, annual galas, and recognition banquets with sub-second QR check-in.",
  keywords: [
    "award ceremony guest list and entry",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "attendee management",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/award-ceremonies" },
  openGraph: {
    title: "Award Ceremony Guest List & VIP Table Check-In Software | URPASS",
    description: "Manage guest lists, nominee invitations, and VIP table seating for prestigious award ceremonies, annual galas, and recognition banquets with sub-second QR check-in.",
    url: "https://urpass.space/award-ceremonies",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "AWARDS & GALAS",
        h1: "Award Ceremony Guest List & VIP Door Management",
        canonicalUrl: "https://urpass.space/award-ceremonies",
        description: "Manage guest lists, nominee invitations, and VIP table seating for prestigious award ceremonies, annual galas, and recognition banquets with sub-second QR check-in.",
        ctaLabel: "Manage award ceremony free",
        features: [
          { icon: Award, title: "VIP & Nominee Tiers", desc: "Differentiate Nominees, Sponsors, Jury Members, VIPs, and General Guests with elegant visual badge pills." },
          { icon: Users, title: "Curated Approval Queues", desc: "Review guest RSVPs and seat allocations before issuing confirmed digital gala passes." },
          { icon: ShieldCheck, title: "Table & Seating Assignment", desc: "Display assigned table numbers and seating zones directly on the attendee's digital pass." },
          { icon: ScanLine, title: "Prestigious Pass Studio", desc: "Design bespoke digital tickets with midnight dark themes, gold accent colors, and sponsor logos." },
          { icon: Palette, title: "Queue-Free Red Carpet Entry", desc: "Door staff scan passes in under 0.3s or look up VIP names with instant visual confirmation." },
          { icon: Clock, title: "Duplicate Entry Prevention", desc: "Single-use cryptographic tokens prevent pass-forwarding and uninvited gala crashers." },
        ],
        steps: [
          { n: "01", title: "Setup Ceremony", desc: "Configure gala date, ballroom venue, and table seating quotas." },
          { n: "02", title: "Send Invites", desc: "Share private RSVP links with nominees, sponsors, and jury." },
          { n: "03", title: "Assign Tables", desc: "Approve guests and assign table or seat numbers on their passes." },
          { n: "04", title: "Red Carpet Welcome", desc: "Door hosts scan digital passes with zero waiting lines." },
          { n: "05", title: "Track Arrivals", desc: "Monitor VIP table arrival status in real time from your dashboard." },
        ],
        callout: {
          badge: "PRESTIGE & SECURITY",
          title: "Flawless red carpet admissions for your biggest night.",
          description: "At high-profile award shows, door chaos and unauthorized attendees are unacceptable. URPASS ensures an elegant, secure entrance experience for your honored guests.",
          bullets: [
            "Custom branded passes with table number assignments",
            "Sub-0.3s check-in with instant VIP visual confirmation",
            "Zero uninvited guests with single-use cryptographic tokens",
            "Real-time arrival feed to alert coordinators when VIPs enter",
          ],
        },
        useCases: [
          "Industry Excellence Awards",
          "University Annual Galas",
          "Corporate Recognition Nights",
          "Media & Film Award Ceremonies",
          "Charity Fundraiser Banquets",
          "Alumni Achievement Dinners",
        ],
        faqs: [
          { q: "Can we display table and seat numbers on the attendee pass?", a: "Yes. You can customize the pass layout to display table numbers, seat allocations, or VIP zone tags." },
          { q: "Can staff check in guests manually by name?", a: "Yes. Door staff can search VIP names directly in the scanner interface and confirm admission with a single tap." },
          { q: "Can uninvited guests use a forwarded pass?", a: "No. Each QR pass is strictly single-use. Once scanned, any duplicate presentation is immediately flagged." },
          { q: "Can we customize the pass design with our sponsors' logos?", a: "Yes. You can upload sponsor logos and set custom brand accent colors in the pass designer." },
        ],
        ctaTitle: "Elevate your event entry with URPASS",
        ctaDescription: "Permanent free tier · Zero hardware setup · Fast sub-second scanning",
      }}
    />
  );
}
