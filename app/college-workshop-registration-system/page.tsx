import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "College Workshop Registration System — Lab Seat Caps & Passes | URPASS",
  description:
    "Dedicated college workshop registration system. Manage limited laboratory capacity, collect workshop fees directly via UPI, and scan student passes at lab entrances.",
  keywords: [
    "college workshop registration",
    "college workshop registration system",
    "technical workshop registration software",
    "hands on lab workshop ticketing",
    "campus seminar registration system",
    "student workshop pass generator",
  ],
  alternates: { canonical: "https://urpass.space/college-workshop-registration-system" },
  openGraph: {
    title: "College Workshop Registration System | URPASS Campus",
    description:
      "Run university workshops and bootcamps with strict seat quotas, instant UPI payments, and digital QR attendance tracking.",
    url: "https://urpass.space/college-workshop-registration-system",
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

export default function CollegeWorkshopRegistrationSystemPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/college-workshop-registration-system",
        badge: "HANDS-ON WORKSHOPS & BOOTCAMPS",
        h1: "College Workshop Registration System",
        hook: "Enforce seat caps, collect lab fees via UPI, and issue digital attendee passes for college hands-on workshops.",
        subDescription:
          "Avoid overcrowded computer labs and overbooked workshop sessions. Set hard seat limits, collect registrations, and verify approved participants at the lab door.",
        primaryCtaLabel: "Create Workshop Registration",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Book a Demo",
        secondaryCtaHref: "/contact",
        trustHighlights: ["Strict capacity limits", "Instant UPI payment", "Waitlist support", "Lab door QR scan"],
        currency: "INR",
        cluster: "college",
        description:
          "College workshop registration system: host technical training sessions, robotics workshops, and AI bootcamps with strict capacity limits and digital passes.",
        comparisonRows: [
          {
            criteria: "Lab Capacity Enforcement",
            urpass: "Strict real-time inventory locking prevents overbooking computer terminals or robotics kits",
            competitor: "Forms allow over-registration, forcing organizers to issue awkward refunds and turn students away",
            urpassAdvantage: true,
          },
          {
            criteria: "Payment & Spot Confirmation",
            urpass: "Instant automated pass issuance upon successful UPI / Card payment verification",
            competitor: "Organizers manually cross-check bank transaction screenshots and UTR numbers",
            urpassAdvantage: true,
          },
          {
            criteria: "Lab Entrance Verification",
            urpass: "Door coordinators scan participant passes in <0.3s ensuring only paying attendees enter the lab",
            competitor: "Uncontrolled access leading to unregistered students taking occupied workstations",
            urpassAdvantage: true,
          },
          {
            criteria: "Certificate Eligibility Attendance",
            urpass: "Real-time timestamped attendance log exports directly to CSV for certificate generation",
            competitor: "Lost or illegible paper sign-in sheets delaying certificate distribution",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Manual Google Forms & Bank Screenshot Checks",
        pageSpecificTakeaway:
          "Hands-on technical workshops have fixed physical lab capacity. Automated inventory locking and optical QR check-in ensure only confirmed delegates take up seats.",
      }}
    />
  );
}
