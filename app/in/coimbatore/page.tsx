import type { Metadata } from "next";
import { MapPin, GraduationCap, QrCode, ScanLine, Ticket, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Software for Colleges & Events Coimbatore | URPASS",
  description: "URPASS event registration and QR check-in for Coimbatore colleges and events. Used by PSG, Amrita, KCT, SKCET, and more. Free to start.",
  keywords: [
    "event registration Coimbatore",
    "QR check-in Coimbatore",
    "PSG tech event registration",
    "Amrita college events passes",
    "KCT event passes",
    "Coimbatore event ticketing software",
  ],
  alternates: { canonical: "https://urpass.space/in/coimbatore" },
  openGraph: {
    title: "Event Registration Software Coimbatore | URPASS",
    description: "Digital event registration and QR check-in for Coimbatore college and corporate events.",
    url: "https://urpass.space/in/coimbatore",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-TN",
    "geo.placename": "Coimbatore, Tamil Nadu, India",
    "geo.position": "11.0168;76.9558",
    "ICBM": "11.0168, 76.9558",
  },
};

export default function CoimbatorePage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · COIMBATORE",
        h1: "Event Registration & QR Check-In for Coimbatore",
        canonicalUrl: "https://urpass.space/in/coimbatore",
        geo: {
          region: "IN-TN",
          placename: "Coimbatore, Tamil Nadu, India",
          position: "11.0168;76.9558",
          latitude: 11.0168,
          longitude: 76.9558,
        },
        description: "Run college and corporate event registrations in Coimbatore with digital QR passes and phone-based check-in. Trusted by Coimbatore colleges and event teams.",
        ctaLabel: "Start your Coimbatore event",
        features: [
          { icon: GraduationCap, title: "Coimbatore college events", desc: "Used by PSG College of Technology, Amrita, KCT, SKCET, and other Coimbatore colleges for events and workshops." },
          { icon: MapPin, title: "Local to Coimbatore", desc: "INR pricing, Razorpay payments, and support for the type of events Coimbatore organisers run." },
          { icon: Ticket, title: "Free and paid events", desc: "Run free college events or collect fees for paid workshops and conferences." },
          { icon: QrCode, title: "Digital QR passes", desc: "Issue digital QR passes instantly to every approved attendee — no printing needed." },
          { icon: ScanLine, title: "Phone-based check-in", desc: "Scan attendee passes at your Coimbatore venue using any smartphone." },
          { icon: Users, title: "Attendee management", desc: "View, approve, and manage all registrations from your organiser dashboard." },
        ],
        callout: {
          badge: "COIMBATORE COLLEGES",
          title: "Designed for Coimbatore's event culture.",
          description: "Coimbatore's colleges and corporate parks host hundreds of events every year — technical symposiums, workshops, cultural fests, and corporate seminars. URPASS simplifies all of them.",
          bullets: [
            "Technical symposiums and workshops",
            "Cultural and sports events",
            "Corporate and startup events",
            "College fest registrations",
          ],
        },
        useCases: [
          "PSG Tech symposiums", "Amrita college events", "KCT workshops", "SKCET events",
          "Coimbatore hackathons", "CRI corporate events", "TIDEL Park meetups", "Coimbatore tech events",
        ],
        faqs: [
          { q: "Is URPASS used by Coimbatore colleges?", a: "Yes. URPASS is used by college event organisers at PSG, Amrita, KCT, SKCET, and other colleges across Coimbatore." },
          { q: "Is URPASS free for Coimbatore college events?", a: "Yes. The free plan supports one event with 50 attendees — perfect for department workshops and small college events." },
          { q: "Can I manage a Coimbatore college fest with URPASS?", a: "Yes. The Pro plan supports up to 2,000 attendees per event — suitable for large Coimbatore college fests." },
          { q: "How do Coimbatore attendees pay for events?", a: "Razorpay supports UPI, cards, and net banking — the payment methods commonly used in Coimbatore." },
          { q: "Can I run events for multiple departments in the same college?", a: "Yes. Each department or club can create their own events from one URPASS account." },
          { q: "Do I need internet at the venue to do QR check-in?", a: "URPASS handles low-connectivity scenarios well. Scans work in poor internet conditions and sync when connectivity is restored." },
        ],
        ctaTitle: "Run your Coimbatore event with URPASS",
        ctaDescription: "Trusted by Coimbatore colleges · Free to start · QR passes",
      }}
    />
  );
}
