import type { Metadata } from "next";
import { MapPin, GraduationCap, QrCode, ScanLine, Ticket, Users, Building2, Flame } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Erode — Colleges & Expos",
  description:
    "URPASS event registration and QR check-in software for Erode colleges, engineering symposiums, and Texvalley business expos. Kongu Engineering, Nandha, IRTT, and Bannari Amman event ticketing.",
  keywords: [
    "event registration software Erode",
    "QR check in Erode",
    "Kongu engineering college symposium registration",
    "Nandha college event passes",
    "Texvalley Erode expo ticketing",
    "Erode event ticketing platform",
    "college fest ticketing Perundurai",
  ],
  alternates: { canonical: "https://urpass.space/in/erode" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Erode | URPASS",
    description:
      "Digital event registration, branded passes, and smartphone QR check-in for Erode colleges, symposiums, and Texvalley trade expos.",
    url: "https://urpass.space/in/erode",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-TN",
    "geo.placename": "Erode, Tamil Nadu, India",
    "geo.position": "11.3410;77.7172",
    "ICBM": "11.3410, 77.7172",
  },
};

export default function ErodePage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · ERODE & PERUNDURAI",
        h1: "Event Registration & QR Check-In Software for Erode",
        canonicalUrl: "https://urpass.space/in/erode",
        geo: {
          region: "IN-TN",
          placename: "Erode, Tamil Nadu, India",
          position: "11.3410;77.7172",
          latitude: 11.341,
          longitude: 77.7172,
        },
        description:
          "Powering engineering symposiums, college culturals, and Texvalley business expos across Erode and Perundurai with digital QR passes, instant UPI ticketing, and offline door scanning.",
        ctaLabel: "Start your Erode event",
        features: [
          {
            icon: GraduationCap,
            title: "Kongu Region College Events",
            desc: "Tailored for Kongu Engineering College, Nandha, Bannari Amman, and IRTT department symposiums, hackathons, and annual cultural festivals.",
          },
          {
            icon: Building2,
            title: "Texvalley & Trade Expos",
            desc: "Fast visitor registration and digital badge check-in for textile machinery expos, trade fairs, and B2B vendor conventions in Erode.",
          },
          {
            icon: Ticket,
            title: "Instant UPI & Razorpay Ticketing",
            desc: "Direct attendee payments via GPay, PhonePe, Paytm, and cards with instant QR pass issuance delivered straight to WhatsApp and email.",
          },
          {
            icon: QrCode,
            title: "Custom Branded Passes",
            desc: "Design professional college symposium and conference passes using Ticket Studio with department logos, sponsor watermarks, and seat numbers.",
          },
          {
            icon: ScanLine,
            title: "Offline Sub-Second Scanner",
            desc: "Scan passes at campus auditoriums and auditorium entry gates without worrying about fluctuating campus Wi-Fi or cellular dead-zones.",
          },
          {
            icon: Users,
            title: "Multi-Gate & Volunteer Controls",
            desc: "Deploy student volunteers with smartphone cameras or handheld Bluetooth laser guns across multiple entrances with zero double-entry risk.",
          },
        ],
        callout: {
          badge: "KONGU EVENT ECOSYSTEM",
          title: "Built for Erode's Engineering & Industrial Event Culture.",
          description:
            "From national-level inter-college technical symposiums in Perundurai to large-scale textile and commercial trade shows along the NH-544 corridor, URPASS replaces slow paper rosters with instant digital verification.",
          bullets: [
            "Department technical symposiums & paper presentations",
            "Texvalley trade expos & business networking meets",
            "Inter-college cultural fests & hackathons",
            "Founder Lifetime Plan (₹19,999) available for local organizers",
          ],
        },
        useCases: [
          "Kongu Engineering symposiums",
          "Nandha College tech fests",
          "Bannari Amman hackathons",
          "Texvalley textile trade fairs",
          "IRTT inter-college competitions",
          "Erode district association conferences",
          "Perundurai industrial seminars",
          "Kongu arts & science culturals",
        ],
        faqs: [
          {
            q: "Can college clubs in Erode use URPASS for free events?",
            a: "Yes. The permanent Free Tier includes 2 events per month with up to 100 registrations per month at ₹0 forever with no credit card required—ideal for department workshops and student association meetings.",
          },
          {
            q: "How does URPASS handle poor connectivity in campus auditoriums?",
            a: "URPASS includes an offline-first scanning engine with IndexedDB manifest caching. Student volunteers can validate tickets and admit attendees even if the auditorium Wi-Fi completely drops, auto-syncing when back online.",
          },
          {
            q: "Can we collect registration fees via UPI for paid symposiums?",
            a: "Yes. URPASS connects directly with Razorpay, allowing attendees from colleges across Tamil Nadu to pay via Google Pay, PhonePe, UPI apps, or debit/credit cards.",
          },
          {
            q: "Is the Founder Lifetime Plan available for Erode event organizers?",
            a: "Yes. Local event teams, educational trusts, and exhibition organizers can secure the URPASS Founder Lifetime Plan (₹19,999 one-time) for unlimited events with zero recurring subscription fees, limited to the first 20 accounts.",
          },
          {
            q: "Can we issue distinct passes for Participants, Judges, and VIPs?",
            a: "Yes. Ticket Studio allows you to create separate pass tiers (Participant, VIP, Speaker, Organizer) with customized colors, access privileges, and gate zone restrictions.",
          },
        ],
        ctaTitle: "Host your next Erode event with URPASS",
        ctaDescription: "Trusted across Kongu colleges · Digital QR passes · Free to start",
      }}
    />
  );
}
