import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Event Check-In App — Browser-Based Smartphone Scanner | URPASS",
  description:
    "The fastest event check-in app that requires zero installation. Scan tickets on iOS and Android in <0.3s, track live attendance, and prevent duplicate passes.",
  keywords: [
    "event check-in app",
    "event scanner app",
    "mobile ticket scanner app",
    "ticket validation app",
    "best event check in app",
    "guest check in app",
  ],
  alternates: { canonical: "https://urpass.space/event-check-in-app" },
  openGraph: {
    title: "Event Check-In App | Browser-Based Smartphone Scanner | URPASS",
    description:
      "Transform any smartphone into an event check-in scanner. No app download needed, sub-0.3s QR validation, and real-time gate telemetry.",
    url: "https://urpass.space/event-check-in-app",
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

export default function EventCheckInAppPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/event-check-in-app",
        badge: "NO-INSTALLATION EVENT SCANNER",
        h1: "Event Check-In App",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Turn any volunteer's smartphone into a high-speed optical gate scanner. Works directly inside mobile Safari or Chrome with zero app downloads or account logins.",
        primaryCtaLabel: "Try check-in",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Book a Demo",
        secondaryCtaHref: "/contact",
        trustHighlights: ["₹0 to start", "Razorpay / UPI", "QR check-in", "WhatsApp passes"],
        currency: "INR",
        cluster: "ticketing",
        description:
          "Event check-in app: scan passes in <0.3s using any mobile browser, coordinate multiple entrance gates, and monitor attendance live.",
        comparisonRows: [
          {
            criteria: "App Store Installation",
            urpass: "Zero app download required (In-browser Web Scanner)",
            competitor: "Volunteers must download 50MB+ mobile app",
            urpassAdvantage: true,
          },
          {
            criteria: "Gate Volunteer Onboarding",
            urpass: "Volunteers scan a secure PIN or gate link in 3 seconds",
            competitor: "Staff must register accounts and verify logins",
            urpassAdvantage: true,
          },
          {
            criteria: "Scan Verification Latency",
            urpass: "< 0.3s optical decoding with audio feedback",
            competitor: "2 to 4 seconds per attendee",
            urpassAdvantage: true,
          },
          {
            criteria: "Offline Mode Support",
            urpass: "IndexedDB local cache continues validating tickets",
            competitor: "Fails or locks out volunteers when WiFi drops",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Traditional Mobile Ticketing Apps",
        pageSpecificTakeaway:
          "The best event check-in app is one that requires no installation at all. By operating directly inside mobile browsers, URPASS equips entire volunteer teams in seconds without hardware overhead.",
      }}
    />
  );
}
