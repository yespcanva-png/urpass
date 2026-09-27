import type { Metadata } from "next";
import { MapPin, Building2, QrCode, ScanLine, Ticket, Users, Briefcase, Sparkles } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Pass Software Tiruppur — Textile Expos & Conferences",
  description:
    "URPASS event registration and QR check-in software for Tiruppur textile trade shows, Knit Show expos, apparel conferences, and NIFT-TEA events. Fast buyer badge check-in.",
  keywords: [
    "event registration software Tiruppur",
    "Tiruppur textile expo ticketing",
    "Knit Show Tiruppur visitor badge passes",
    "NIFT-TEA event registration",
    "Tiruppur trade show check in software",
    "apparel export conference passes Tiruppur",
    "QR badge generator Tiruppur",
  ],
  alternates: { canonical: "https://urpass.space/in/tiruppur" },
  openGraph: {
    title: "Event Registration & QR Pass Software Tiruppur | URPASS",
    description:
      "Digital visitor registration, digital QR badges, and rapid gate check-in for Tiruppur textile trade expos, apparel meets, and business conferences.",
    url: "https://urpass.space/in/tiruppur",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-TN",
    "geo.placename": "Tiruppur, Tamil Nadu, India",
    "geo.position": "11.1085;77.3411",
    "ICBM": "11.1085, 77.3411",
  },
};

export default function TiruppurPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · TIRUPPUR KNIT CAPITAL",
        h1: "Event Registration & QR Pass Software for Tiruppur",
        canonicalUrl: "https://urpass.space/in/tiruppur",
        geo: {
          region: "IN-TN",
          placename: "Tiruppur, Tamil Nadu, India",
          position: "11.1085;77.3411",
          latitude: 11.1085,
          longitude: 77.3411,
        },
        description:
          "Streamline visitor registration, digital trade badges, and door check-in for Tiruppur textile machinery expos, international buyer-seller meets, and apparel conferences.",
        ctaLabel: "Start your Tiruppur event",
        features: [
          {
            icon: Briefcase,
            title: "Textile Trade Expos & Buyer Meets",
            desc: "Custom registration workflows for international buyers, domestic fabricators, knitwear exporters, and raw material suppliers.",
          },
          {
            icon: Building2,
            title: "Trade Fair Visitor Badges",
            desc: "Generate professional digital QR visitor badges for major trade expos like Knit Show, yarn exhibitions, and garment machinery shows.",
          },
          {
            icon: QrCode,
            title: "WhatsApp Pass Delivery",
            desc: "Send digital entry passes directly to visitors' WhatsApp numbers—eliminating printed paper receipts and lengthy entrance queues.",
          },
          {
            icon: ScanLine,
            title: "Sub-Second Gate Turnstiles",
            desc: "Equip registration desk volunteers and security staff with high-speed smartphone scanners or USB/Bluetooth barcode guns.",
          },
          {
            icon: Ticket,
            title: "Instant UPI & B2B Ticketing",
            desc: "Collect delegate registration fees, stall booking fees, and visitor entry charges via instant UPI, credit cards, or net banking.",
          },
          {
            icon: Users,
            title: "NIFT-TEA & Academic Events",
            desc: "Manage college symposiums, fashion design exhibitions, and student design runway shows with automated attendee approvals.",
          },
        ],
        callout: {
          badge: "KNITWEAR & EXPORT HUB",
          title: "Engineered for Tiruppur's High-Velocity Business Events.",
          description:
            "As India's knitwear export capital, Tiruppur hosts thousands of domestic and global delegates. URPASS eliminates crowded registration desks with instant QR badge validation and live gate footfall analytics.",
          bullets: [
            "Textile & garment machinery trade fairs",
            "Buyer-seller conventions & exporter association meets",
            "Fashion & apparel technology conferences at NIFT-TEA",
            "Founder Lifetime Plan (₹19,999) available for exhibition teams",
          ],
        },
        useCases: [
          "Knit Show Tiruppur visitor passes",
          "Textile machinery expo badges",
          "Tiruppur Exporters Association (TEA) meetings",
          "NIFT-TEA fashion design runway fests",
          "Yarn & fabric manufacturer conventions",
          "Apparel sustainability & compliance summits",
          "B2B networking & export award ceremonies",
          "Industrial safety & labor welfare seminars",
        ],
        faqs: [
          {
            q: "Can Tiruppur trade fair organizers issue badges with company names?",
            a: "Yes. Ticket Studio allows you to include dynamic attendee fields such as Company Name, Designation, Country/City, and Stall Category directly on the digital pass.",
          },
          {
            q: "How does URPASS reduce entrance queues at large textile expos?",
            a: "Visitors register online or via QR codes placed at the venue. Their digital badge arrives instantly on WhatsApp, which gate staff scan in under 0.3 seconds using any mobile device.",
          },
          {
            q: "Is there an offline mode if convention hall cellular signals are blocked?",
            a: "Yes. URPASS caches all approved registrations locally in the browser (IndexedDB). Scanners validate passes offline with instant audible feedback and sync check-ins automatically.",
          },
          {
            q: "Can we collect delegate fees through UPI?",
            a: "Yes. Integrated with Razorpay, your attendees can pay seamlessly with Google Pay, PhonePe, Paytm, BHIM, cards, or corporate net banking.",
          },
          {
            q: "Is the Founder Lifetime Plan suitable for Tiruppur expo organizers?",
            a: "Absolutely. Exhibition organizers and trade bodies can lock in unlimited events and scanning with the URPASS Founder Lifetime Plan (₹19,999 one-time payment, limited to 20 accounts).",
          },
        ],
        ctaTitle: "Elevate your Tiruppur expo with URPASS",
        ctaDescription: "Built for trade fairs & conferences · Instant digital passes · Zero hassle",
      }}
    />
  );
}
