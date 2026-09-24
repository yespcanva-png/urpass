import type { Metadata } from "next";
import { Building2, GraduationCap, MapPin, QrCode, ScanLine, Ticket } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Ahmedabad",
  description: "URPASS event registration, ticketing, and QR check-in platform for Ahmedabad and Gujarat. Built for business summits, trade expos, college fests, and startup events.",
  keywords: [
    "event registration Ahmedabad",
    "QR check-in Gujarat",
    "Ahmedabad business summits ticketing",
    "IIM Ahmedabad event passes",
    "GIFT City tech conference check-in",
    "Gujarat trade expo passes",
  ],
  alternates: { canonical: "https://urpass.space/in/ahmedabad" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Ahmedabad | URPASS",
    description: "Ahmedabad event registration and QR pass platform for business summits, colleges, and trade expos.",
    url: "https://urpass.space/in/ahmedabad",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-GJ",
    "geo.placename": "Ahmedabad, Gujarat, India",
    "geo.position": "23.0225;72.5714",
    "ICBM": "23.0225, 72.5714",
  },
};

export default function AhmedabadPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · AHMEDABAD & GUJARAT",
        h1: "Event Registration & QR Check-In for Ahmedabad Events",
        canonicalUrl: "https://urpass.space/in/ahmedabad",
        geo: {
          region: "IN-GJ",
          placename: "Ahmedabad, Gujarat, India",
          position: "23.0225;72.5714",
          latitude: 23.0225,
          longitude: 72.5714,
        },
        description: "Trusted by Gujarat's entrepreneurs, business summit organizers, and college communities across Ahmedabad, Gandhinagar, and Surat. QR passes, Razorpay UPI, and mobile gate check-in.",
        ctaLabel: "Start your Gujarat event",
        features: [
          { icon: Building2, title: "Gujarat business summits", desc: "Professional event ticketing and badge registration for Ahmedabad trade shows, expos, and investor summits." },
          { icon: MapPin, title: "GIFT City & Tech Forums", desc: "Designed for fintech conclaves, developer gatherings, and corporate retreats across Gandhinagar and SG Highway." },
          { icon: GraduationCap, title: "IIM & Gujarat college fests", desc: "Smooth registrations and pass distribution for premier universities, engineering colleges, and campus fests." },
          { icon: Ticket, title: "Instant Razorpay ticketing", desc: "Accept payments via UPI, credit/debit cards, and corporate net banking in Indian Rupees." },
          { icon: QrCode, title: "Custom digital passes", desc: "Modern tickets with your event logo, brand color accents, and tamper-proof QR codes." },
          { icon: ScanLine, title: "Zero-hardware check-in", desc: "Scan entry passes effortlessly on any mobile device without renting expensive optical scanners." },
        ],
        callout: {
          badge: "AHMEDABAD BUSINESS & ACADEMIA",
          title: "Built for Gujarat's vibrant entrepreneurial spirit.",
          description: "From startup pitch competitions on SG Highway to major trade expositions in Gandhinagar, URPASS provides an unshakeable entry workflow.",
          bullets: [
            "Quick setup in under 3 minutes with zero coding",
            "Razorpay integration with instant settlement",
            "Multi-gate scanning with live attendee sync",
            "GST compliant billing and instant pass delivery",
          ],
        },
        useCases: [
          "Ahmedabad business expos", "GIFT City fintech summits", "College symposiums Gujarat", "Startup demo days SG Highway",
          "Surat textile & trade meets", "Gandhinagar tech conclaves", "Medical and pharma conferences", "Cultural festivals Ahmedabad",
        ],
        faqs: [
          { q: "Can URPASS handle large business expos in Ahmedabad?", a: "Yes. URPASS scales effortlessly to thousands of attendees with multi-counter scanning and real-time check-in counts." },
          { q: "Does URPASS support GST invoices for business attendees in Gujarat?", a: "Yes. Attendee records and transactions are exportable with full receipt details for corporate expense claims." },
          { q: "Can attendees show passes on WhatsApp or Apple Wallet?", a: "Yes. Passes can be saved directly on smartphones, printed as PDF passes, or displayed from emails at the gate." },
          { q: "Is there a free trial or free tier available?", a: "Yes. URPASS offers a permanently free plan with 2 events/month and up to 100 registrations/month, plus a 30-day free trial on all paid plans." },
        ],
        ctaTitle: "Start your Ahmedabad event on URPASS today",
        ctaDescription: "Free tier available · Razorpay Indian payments · Instant mobile check-in",
      }}
    />
  );
}
