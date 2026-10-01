import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Event Guest Management Software — VIP Lists, Invites & Door Check-In | URPASS",
  description:
    "Professional event guest management software. Manage VIP invitations, custom guest tiers, automated WhatsApp passes, and rapid smartphone check-in.",
  keywords: [
    "event guest management software",
    "vip guest list software",
    "event guest list app",
    "guest check in management",
    "invitation and rsvp software",
    "private event guest list",
  ],
  alternates: { canonical: "https://urpass.space/event-guest-management-software" },
  openGraph: {
    title: "Event Guest Management Software | VIP Lists & Passes | URPASS",
    description:
      "Manage guest lists, private RSVPs, and VIP door check-in with URPASS. Deliver digital passes via WhatsApp and scan guests in <0.3s.",
    url: "https://urpass.space/event-guest-management-software",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "geo.position": "20.5937;78.9629",
    "ICBM": "20.5937, 78.9629",
  },
};

export default function EventGuestManagementSoftwarePage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/event-guest-management-software",
        badge: "VIP & GUEST MANAGEMENT",
        h1: "Event Guest Management Software",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Manage private guest lists, VIP invitations, speaker badges, and sponsor passes. Deliver personalized digital passes and welcome guests seamlessly at the door.",
        primaryCtaLabel: "Manage guests",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Book a Demo",
        secondaryCtaHref: "/contact",
        trustHighlights: ["₹0 to start", "VIP tier tagging", "WhatsApp passes", "Sub-0.3s check-in"],
        currency: "INR",
        cluster: "enterprise",
        description:
          "Event guest management software: import guest lists, assign custom tier tags, send automated WhatsApp QR passes, and check in VIPs smoothly.",
        comparisonRows: [
          {
            criteria: "VIP Arrival Experience",
            urpass: "Instant <0.3s scan with discreet color-coded VIP badges",
            competitor: "Awkward paper sheet cross-offs and delayed welcoming",
            urpassAdvantage: true,
          },
          {
            criteria: "Invitation & RSVP Workflow",
            urpass: "Direct WhatsApp and email RSVP links with automated passes",
            competitor: "Disconnected email tools with manual RSVP tracking",
            urpassAdvantage: true,
          },
          {
            criteria: "Guest List Import & Export",
            urpass: "1-click CSV import with automatic phone number validation",
            competitor: "Tedious manual entry one attendee at a time",
            urpassAdvantage: true,
          },
          {
            criteria: "Platform Pricing",
            urpass: "Free Tier includes full guest management up to 100 guests",
            competitor: "Expensive corporate minimums and per-guest fees",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Generic Guest List Apps",
        pageSpecificTakeaway:
          "High-touch events require effortless guest onboarding and dignified VIP entry. URPASS combines custom pass branding with sub-second door validation without paper clipboards.",
      }}
    />
  );
}
