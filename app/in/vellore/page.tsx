import type { Metadata } from "next";
import { MapPin, GraduationCap, QrCode, ScanLine, Ticket, Users, Trophy, Stethoscope } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Vellore — VIT & Colleges",
  description:
    "URPASS event registration and sub-second QR check-in software for Vellore colleges, symposiums, and medical conferences. Built for VIT Riviera, graVITas, CMC, and Thiruvalluvar University.",
  keywords: [
    "event registration software Vellore",
    "QR check in Vellore",
    "VIT Riviera event passes",
    "graVITas VIT ticketing software",
    "CMC Vellore medical conference registration",
    "Vellore Institute of Technology event passes",
    "college symposium registration Vellore",
    "Katpadi event ticketing platform",
  ],
  alternates: { canonical: "https://urpass.space/in/vellore" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Vellore | URPASS",
    description:
      "Digital event registration, branded passes, and smartphone QR check-in for Vellore engineering fests, VIT symposiums, and CMC medical conferences.",
    url: "https://urpass.space/in/vellore",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-TN",
    "geo.placename": "Vellore, Tamil Nadu, India",
    "geo.position": "12.9165;79.1325",
    "ICBM": "12.9165, 79.1325",
  },
};

export default function VellorePage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · VELLORE & KATPADI HUB",
        h1: "Event Registration & QR Check-In Software for Vellore",
        canonicalUrl: "https://urpass.space/in/vellore",
        geo: {
          region: "IN-TN",
          placename: "Vellore, Tamil Nadu, India",
          position: "12.9165;79.1325",
          latitude: 12.9165,
          longitude: 79.1325,
        },
        description:
          "Powering mega collegiate festivals, coding buildathons, and international healthcare conferences across VIT Vellore, CMC, and Thiruvalluvar University with sub-second digital QR passes and multi-gate entry scanning.",
        ctaLabel: "Start your Vellore event",
        features: [
          {
            icon: GraduationCap,
            title: "VIT Vellore Mega Fests & Hackathons",
            desc: "Engineered to handle high-traffic registration surges for flagship events like Riviera, graVITas, and 36-hour developer hackathons with zero downtime.",
          },
          {
            icon: Stethoscope,
            title: "CMC Medical Conferences & CMEs",
            desc: "Custom registration workflows for healthcare professionals, CME accreditation tracking, paper presentations, and badge generation at CMC Vellore.",
          },
          {
            icon: Ticket,
            title: "Direct UPI & Card Ticketing",
            desc: "Instant fee collection via Google Pay, PhonePe, Paytm, and net banking with automated passes delivered directly to WhatsApp and email.",
          },
          {
            icon: QrCode,
            title: "Ticket Studio Custom Passes",
            desc: "Design professional college fest tickets with club logos, student roll number verification, dynamic gate directions, and anti-fraud QR codes.",
          },
          {
            icon: ScanLine,
            title: "Sub-Second In-Browser Scanner",
            desc: "Student volunteers scan passes in <0.3s using any smartphone browser with audio chimes and haptic cues—zero App Store downloads required.",
          },
          {
            icon: Trophy,
            title: "Multi-Gate Security & Anti-Fraud",
            desc: "Atomic database locking blocks pass screenshot sharing across campus gates, auditorium turnstiles, and outdoor concert grounds simultaneously.",
          },
        ],
        callout: {
          badge: "VELLORE HIGHER EDUCATION HUB",
          title: "Built for Vellore's World-Class Academic & Cultural Venues.",
          description:
            "From 30,000-attendee concerts and sporting events at VIT's outdoor stadium to specialized medical symposiums at Christian Medical College, URPASS delivers atomic duplicate protection, instant volunteer deployment, and sub-second gate check-in.",
          bullets: [
            "VIT Riviera, graVITas & student club symposiums",
            "CMC Vellore international medical conferences & CME seminars",
            "Multi-gate campus entrance & hostel pass coordination",
            "Founder Lifetime Plan (₹19,999) available for university clubs",
          ],
        },
        useCases: [
          "VIT student club technical symposiums (ACM, IEEE, CSI)",
          "Riviera & graVITas participant registration workflows",
          "CMC Vellore healthcare conferences & doctor summits",
          "Auxilium College annual cultural meets",
          "Thiruvalluvar University inter-collegiate athletic meets",
          "Ranipet industrial association summits & vendor expos",
        ],
        relatedLinks: [
          { title: "Event Registration Software India", href: "/in", category: "Location" },
          { title: "Chennai College Events & Fests", href: "/in/chennai", category: "Location" },
          { title: "Bangalore Tech Events & Meetups", href: "/in/bangalore", category: "Location" },
          { title: "College Events Software", href: "/college-events", category: "Use Case" },
          { title: "College Fests Software", href: "/college-fests", category: "Use Case" },
          { title: "Multi-Gate Event Check-In", href: "/multi-gate-event-check-in", category: "Product" },
          { title: "WhatsApp Event Tickets", href: "/whatsapp-event-tickets", category: "Product" },
        ],
        faqs: [
          {
            q: "Can URPASS handle thousands of students entering VIT campus gates simultaneously?",
            a: "Yes. URPASS is architected for extreme concurrency. Gate volunteers can scan up to 30 attendee passes per minute per lane using their personal smartphones, processing thousands of students smoothly without entrance queues.",
          },
          {
            q: "Can we collect student registration numbers and college IDs?",
            a: "Yes. URPASS custom form builder lets you add mandatory text fields, dropdowns, and file uploads for student roll numbers, college identity cards, and department branches.",
          },
          {
            q: "Does URPASS work if campus cellular connectivity becomes congested during concerts?",
            a: "Yes. URPASS features an offline-first scanning engine. The scanner caches the attendee roster into the phone's browser memory (IndexedDB), verifying passes locally in under 0.3s even with zero internet signal.",
          },
          {
            q: "How do student clubs in Vellore collect registration fees?",
            a: "You can connect your club or department Razorpay account to collect ticket fees directly via UPI (Google Pay, PhonePe, Paytm, BHIM) and cards. URPASS charges 0% commission on ticket sales.",
          },
        ],
      }}
    />
  );
}
