import type { Metadata } from "next";
import { MapPin, GraduationCap, QrCode, ScanLine, Ticket, Users, Trophy, Cpu } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Trichy — NIT Trichy & Colleges",
  description:
    "URPASS event registration and QR check-in software for Tiruchirappalli colleges and symposiums. Built for NIT Trichy, SASTRA, Bishop Heber, and St. Joseph's events.",
  keywords: [
    "event registration software Trichy",
    "QR check in Trichy",
    "NIT Trichy Festember event passes",
    "Pragyan NIT Trichy ticketing",
    "Bishop Heber college fest registration",
    "SASTRA symposium passes Trichy",
    "Tiruchirappalli event ticketing platform",
  ],
  alternates: { canonical: "https://urpass.space/in/trichy" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Trichy | URPASS",
    description:
      "Digital event registration, branded passes, and smartphone QR check-in for Trichy engineering symposiums, NIT events, and college culturals.",
    url: "https://urpass.space/in/trichy",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-TN",
    "geo.placename": "Tiruchirappalli, Tamil Nadu, India",
    "geo.position": "10.7905;78.7047",
    "ICBM": "10.7905, 78.7047",
  },
};

export default function TrichyPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · TRICHY & CENTRAL TN",
        h1: "Event Registration & QR Check-In Software for Trichy",
        canonicalUrl: "https://urpass.space/in/trichy",
        geo: {
          region: "IN-TN",
          placename: "Tiruchirappalli, Tamil Nadu, India",
          position: "10.7905;78.7047",
          latitude: 10.7905,
          longitude: 78.7047,
        },
        description:
          "Powering national technical symposiums, coding hackathons, and cultural fests across NIT Trichy, SASTRA, Bishop Heber, and St. Joseph's with sub-second digital QR passes and door scanning.",
        ctaLabel: "Start your Trichy event",
        features: [
          {
            icon: GraduationCap,
            title: "NIT Trichy & National Fests",
            desc: "Engineered to handle high-concurrency attendee waves for flagship events like Festember, Pragyan, and department symposiums.",
          },
          {
            icon: Cpu,
            title: "Hackathons & Technical Symposiums",
            desc: "Custom registration fields for team entries, GitHub profiles, college IDs, and automated paper presentation submissions.",
          },
          {
            icon: Ticket,
            title: "Direct UPI & Card Ticketing",
            desc: "Instant fee collection via Google Pay, PhonePe, UPI apps, and cards with automated passes delivered directly to WhatsApp and email.",
          },
          {
            icon: QrCode,
            title: "Ticket Studio Custom Passes",
            desc: "Design professional college fest tickets with club logos, dynamic seat numbers, sponsor branding, and anti-fraud QR codes.",
          },
          {
            icon: ScanLine,
            title: "Sub-Second In-Browser Scanner",
            desc: "Student volunteers can scan passes in <0.3s using any mobile browser with audio chimes and haptic feedback—no app download needed.",
          },
          {
            icon: Trophy,
            title: "Central TN Colleges & Institutes",
            desc: "Engineered for student committees, department symposiums, and campus events across Trichy educational institutions for hassle-free entry logistics.",
          },
        ],
        callout: {
          badge: "CENTRAL TAMIL NADU HUB",
          title: "Built for Trichy's Elite Academic & Cultural Events.",
          description:
            "From national-level technical symposiums and 24-hour coding hackathons at NIT Trichy to heritage college culturals along the Cauvery basin, URPASS delivers atomic duplicate prevention and instant gate check-ins.",
          bullets: [
            "National technical symposiums & inter-college hackathons",
            "Multi-thousand attendee cultural fests & concerts",
            "Bishop Heber & St. Joseph's inter-collegiate meets",
            "Founder Lifetime Plan (₹19,999) available for local colleges",
          ],
        },
        useCases: [
          "NIT Trichy department symposium passes",
          "Pragyan & Festember registration workflows",
          "Bishop Heber annual culturals",
          "St. Joseph's College symposiums",
          "SASTRA University tech events",
          "Trichy developer & tech meetups",
          "Central TN school & athletic championships",
          "BHEL community & corporate seminars",
        ],
        faqs: [
          {
            q: "Can college clubs in Trichy use URPASS for free events?",
            a: "Yes. The permanent Free Tier includes 2 events per month with up to 100 registrations per month at ₹0 forever with no credit card required—ideal for department workshops and student club meetups.",
          },
          {
            q: "How does URPASS manage thousands of attendees at NIT Trichy fests?",
            a: "URPASS supports simultaneous multi-gate scanning across dozens of student volunteers' smartphones with sub-50ms atomic deduplication, preventing counterfeit or shared QR passes.",
          },
          {
            q: "Can student volunteers scan passes offline without campus Wi-Fi?",
            a: "Yes. URPASS features an offline scanning engine that caches registrations in the mobile browser (IndexedDB). Check-ins are validated instantly and synchronized when internet is restored.",
          },
          {
            q: "How do students from other states pay for Trichy college symposiums?",
            a: "URPASS integrates directly with Razorpay, allowing participants from across India to pay via UPI (GPay, PhonePe, Paytm), net banking, or debit/credit cards.",
          },
          {
            q: "Is the Founder Lifetime Plan available for Trichy institutions?",
            a: "Yes. Event committees, alumni associations, and educational trusts can secure the URPASS Founder Lifetime Plan (₹19,999 one-time payment) for permanent unlimited events without monthly subscriptions (limited to 20 accounts).",
          },
        ],
        ctaTitle: "Run your Trichy event with URPASS",
        ctaDescription: "Built for college fests & symposiums · Sub-second scanning · Free to start",
      }}
    />
  );
}
