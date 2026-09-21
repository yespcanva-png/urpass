import type { Metadata } from "next";
import { CheckCircle2, Users, Mail, QrCode, ScanLine, ShieldCheck, CheckSquare } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event RSVP Software & Digital Guest List Management",
  description: "Manage invitations, collect RSVPs, approve guest lists, and issue digital QR passes for invite-only gatherings, VIP summits, and corporate events.",
  keywords: [
    "event RSVP software",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "event ticketing platform",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-rsvp-software" },
  openGraph: {
    title: "Event RSVP Software & Digital Guest List Management | URPASS",
    description: "Manage invitations, collect RSVPs, approve guest lists, and issue digital QR passes for invite-only gatherings, VIP summits, and corporate events.",
    url: "https://urpass.space/event-rsvp-software",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "EVENT RSVP SOFTWARE",
        h1: "Event RSVP Software for Private & Curated Gatherings",
        canonicalUrl: "https://urpass.space/event-rsvp-software",
        description: "Manage invitations, collect RSVPs, approve guest lists, and issue digital QR passes for invite-only gatherings, VIP summits, and corporate events.",
        ctaLabel: "Manage event RSVPs free",
        features: [
          { icon: Users, title: "Curated RSVP Workflows", desc: "Collect RSVPs with approval controls to ensure only verified, invited guests receive event access." },
          { icon: Mail, title: "Digital Invitation Passes", desc: "Approved RSVPs receive personalized digital passes featuring their name, tier, and unique entry QR code." },
          { icon: QrCode, title: "Headcount & Meal Tracking", desc: "Gather dietary requirements, guest plus-ones, and arrival confirmations directly on your RSVP form." },
          { icon: ScanLine, title: "Private & Gated Links", desc: "Share private registration links or require organizer approval before credentials become active." },
          { icon: ShieldCheck, title: "Seamless VIP Check-In", desc: "Door staff scan passes in under 0.3s or search guest names instantly for high-touch entrance management." },
          { icon: CheckSquare, title: "Live RSVP Dashboard", desc: "Track confirmed attendees, pending invites, and actual door arrivals in real time." },
        ],
        steps: [
          { n: "01", title: "Create RSVP Form", desc: "Configure event details, dress code, RSVP deadlines, and custom questions." },
          { n: "02", title: "Send Invitations", desc: "Share the RSVP link with your private guest list or community." },
          { n: "03", title: "Approve Guests", desc: "Review RSVPs and approve attendees to issue their verified digital passes." },
          { n: "04", title: "Fast Door Entry", desc: "Greet guests and scan QR passes at the entrance with zero waiting lines." },
          { n: "05", title: "Review Attendance", desc: "View confirmed versus attended ratios and export final guest lists." },
        ],
        callout: {
          badge: "CURATED EXPERIENCES",
          title: "Elevate your private event entrance.",
          description: "Printed paper RSVP lists look sloppy and cause entrance delays. URPASS gives your private gathering a prestigious, frictionless digital RSVP and door verification experience.",
          bullets: [
            "Personalized digital passes with organization branding",
            "Single-use QR security preventing uninvited guest crashers",
            "Instant name search fallback on door scanner screens",
            "Live attendance visibility throughout the evening",
          ],
        },
        useCases: [
          "Executive Dinners",
          "VIP Product Launches",
          "Founder & Investor Mixers",
          "Alumni Banquets",
          "Private Awards Ceremonies",
          "Exclusive Masterclasses",
        ],
        faqs: [
          { q: "Can I approve RSVPs before passes are issued?", a: "Yes. Enable manual approval mode so attendees only receive a valid QR pass after your team approves their RSVP." },
          { q: "Can guests bring a plus-one?", a: "You can add form fields to collect plus-one names or require each guest to submit an individual RSVP." },
          { q: "Do guests need an app to show their RSVP pass?", a: "No. The RSVP pass opens directly in mobile web browsers or can be saved to Apple Wallet." },
          { q: "Can uninvited guests enter if a pass is forwarded?", a: "Each QR pass is strictly single-use. Once scanned, any duplicate presentation is immediately flagged and blocked." },
        ],
        ctaTitle: "Start streamlining your event with URPASS",
        ctaDescription: "Permanent free tier · 30-day free trial on paid plans · Fast sub-second check-in",
      }}
    />
  );
}
