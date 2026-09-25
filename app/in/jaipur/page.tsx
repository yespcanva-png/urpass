import type { Metadata } from "next";
import { Building2, MapPin, QrCode, ScanLine, Ticket, Users, Sparkles, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Jaipur — URPASS",
  description:
    "URPASS event registration and QR check-in platform for Jaipur. Built for Jaipur Exhibition & Convention Centre (JECC) expos, Birla Auditorium conferences, literature festivals, and corporate destination retreats. Free to start.",
  keywords: [
    "event registration Jaipur",
    "QR check in Jaipur",
    "JECC event pass software",
    "Jaipur conference ticketing",
    "Rajasthan event registration platform",
    "Birla Auditorium event check in",
    "Razorpay event ticketing Jaipur",
  ],
  alternates: { canonical: "https://urpass.space/in/jaipur" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Jaipur | URPASS",
    description:
      "Jaipur's premier event registration and digital QR pass platform for national conventions, trade expos, and destination retreats.",
    url: "https://urpass.space/in/jaipur",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-RJ",
    "geo.placename": "Jaipur, Rajasthan, India",
    "geo.position": "26.9124;75.7873",
    ICBM: "26.9124, 75.7873",
  },
};

export default function JaipurPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · JAIPUR & RAJASTHAN",
        h1: "Event Registration & QR Check-In for Jaipur Events",
        canonicalUrl: "https://urpass.space/in/jaipur",
        geo: {
          region: "IN-RJ",
          placename: "Jaipur, Rajasthan, India",
          position: "26.9124;75.7873",
          latitude: 26.9124,
          longitude: 75.7873,
        },
        description:
          "Trusted across Jaipur for large-scale conventions at JECC, cultural literature symposiums, university fests, and corporate destination offsites. Digital QR passes, Razorpay UPI checkout, and instant door check-in.",
        ctaLabel: "Start your Jaipur event",
        features: [
          {
            icon: Building2,
            title: "JECC Convention & Trade Expos",
            desc: "Engineered for high-volume entry at the Jaipur Exhibition & Convention Centre and Sitapura industrial zone.",
          },
          {
            icon: Sparkles,
            title: "Destination Corporate Retreats",
            desc: "Branded attendee credentials and multi-day agenda passes for high-profile executive retreats in heritage resorts.",
          },
          {
            icon: Ticket,
            title: "Zero Commission Ticketing",
            desc: "Sell delegate passes via Razorpay with 0% platform ticket fees. Direct T+2 settlements into your bank account.",
          },
          {
            icon: QrCode,
            title: "Digital Web & Wallet Passes",
            desc: "Issue secure QR passes delivered via WhatsApp and email that open instantly on mobile browsers without an app.",
          },
          {
            icon: ScanLine,
            title: "Ultra-Fast Entrance Scanning",
            desc: "Turn any volunteer's smartphone into a fast optical scanner with haptic vibration and audio confirmation.",
          },
          {
            icon: ShieldCheck,
            title: "Offline-Resilient Validation",
            desc: "Ensure seamless attendee check-in even when venue mobile signals fluctuate during crowded evening sessions.",
          },
        ],
        callout: {
          badge: "JAIPUR VENUES",
          title: "From JECC Sitapura to Birla Auditorium & Diggi Palace.",
          description:
            "Jaipur is a world-renowned hub for international conferences, arts festivals, and corporate summits. URPASS provides rock-solid entry verification for every tier of attendee.",
          bullets: [
            "Conventions at Jaipur Exhibition & Convention Centre (JECC)",
            "Cultural gatherings and symposiums at Birla Auditorium and Diggi Palace",
            "Medical and scientific conferences at SMS Medical College auditoriums",
            "Campus fests at Manipal University Jaipur, MNIT Jaipur, and Amity",
          ],
        },
        useCases: [
          "JECC national trade exhibitions and industry expos",
          "Literature festivals and arts symposiums",
          "Destination corporate retreats and leadership offsites",
          "MNIT Jaipur & Manipal University fests and hackathons",
          "Medical, dental, and surgical conferences",
          "Government, civic, and policy roundtables",
        ],
        relatedLinks: [
          {
            title: "Event Registration Delhi NCR",
            href: "/in/delhi",
            category: "Location",
          },
          {
            title: "Conferences & Summits Ticketing",
            href: "/conferences",
            category: "Use Case",
          },
          {
            title: "Trade Shows & Expos Platform",
            href: "/trade-shows",
            category: "Use Case",
          },
          {
            title: "Event Ticketing with UPI",
            href: "/event-ticketing-with-upi",
            category: "Product",
          },
        ],
        faqs: [
          {
            q: "Can URPASS manage thousands of attendees at JECC Jaipur?",
            a: "Yes. URPASS is designed for high-throughput venues like JECC. Multiple gates can be scanned concurrently across halls with instant synchronization and duplicate prevention.",
          },
          {
            q: "Does URPASS support multi-day passes for conferences?",
            a: "Yes. You can issue tiered passes with multi-day validity, specific session access controls, and VIP networking privileges.",
          },
          {
            q: "Can international and domestic attendees pay online?",
            a: "Yes. Our Razorpay integration supports Indian UPI and net banking, as well as international cards (Visa, Mastercard, Amex).",
          },
        ],
        ctaTitle: "Host your Jaipur event with URPASS",
        ctaDescription: "JECC expos · Corporate retreats · Instant UPI · Zero ticket commission",
      }}
    />
  );
}
