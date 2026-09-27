import type { Metadata } from "next";
import { Building2, MapPin, QrCode, ScanLine, Ticket, Users, GraduationCap, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Surat — URPASS",
  description:
    "URPASS event registration and QR check-in platform for Surat and South Gujarat. Built for SIECC Sarsana expos, Surat Diamond Bourse conventions, and SVNIT college fests. Free to start.",
  keywords: [
    "event registration Surat",
    "QR check in Surat",
    "Surat trade expo passes",
    "SIECC Sarsana event ticketing",
    "Surat Diamond Bourse conventions",
    "SVNIT MindBend passes",
    "Sanjeev Kumar Auditorium events",
    "event management software Gujarat",
    "Razorpay event ticketing Surat",
  ],
  alternates: { canonical: "https://urpass.space/in/surat" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Surat | URPASS",
    description:
      "Surat's premier event registration and digital QR pass platform for trade expos, diamond conclaves, and collegiate festivals.",
    url: "https://urpass.space/in/surat",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-GJ",
    "geo.placename": "Surat, Gujarat, India",
    "geo.position": "21.1702;72.8311",
    ICBM: "21.1702, 72.8311",
  },
};

export default function SuratPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · SURAT & SOUTH GUJARAT",
        h1: "Event Registration & QR Check-In for Surat Events",
        canonicalUrl: "https://urpass.space/in/surat",
        geo: {
          region: "IN-GJ",
          placename: "Surat, Gujarat, India",
          position: "21.1702;72.8311",
          latitude: 21.1702,
          longitude: 72.8311,
        },
        description:
          "Trusted across Surat and Gujarat for diamond and textile trade expos, national engineering festivals, business symposiums, and startup meets. Instant QR passes, Razorpay UPI checkout, and sub-0.3s gate check-in.",
        ctaLabel: "Start your Surat event",
        features: [
          {
            icon: Building2,
            title: "Trade & Convention Mega-Hubs",
            desc: "Designed for high-density trade buyer registration and multi-gate access at SIECC Sarsana, Surat Diamond Bourse, and Sanjeev Kumar Auditorium.",
          },
          {
            icon: GraduationCap,
            title: "Premier Institute Fests",
            desc: "Custom registration and branded digital passes for SVNIT Surat (MindBend & Sparsh), VNSGU, and Auro University technical symposiums.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Offline QR Scanning",
            desc: "Ensure zero queue bottlenecks at exhibition turnstiles and auditorium gates even when trade halls suffer mobile network dead zones.",
          },
          {
            icon: Ticket,
            title: "0% Ticket Platform Fees",
            desc: "Collect delegate and trade visitor registration fees via Razorpay UPI (PhonePe, GPay, Paytm) directly to your account with zero platform cuts.",
          },
          {
            icon: Users,
            title: "Multi-Gate Volunteer Check-In",
            desc: "Equip registration desk volunteers with secure browser PIN links to scan attendee badges and tickets across all exhibition bays simultaneously.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Passback Fraud Security",
            desc: "Dynamic QR codes eliminate badge sharing, screenshot duplication, and unauthorized buyer re-entry into VIP and B2B zones.",
          },
        ],
        callout: {
          badge: "SURAT VENUES",
          title: "From SIECC Sarsana & Surat Diamond Bourse to SVNIT.",
          description:
            "Recognized globally as the Diamond City and India's fastest-growing commercial powerhouse, Surat hosts international trade summits, industrial machinery expos, and premier technical symposiums. URPASS ensures frictionless visitor flow.",
          bullets: [
            "International buyer expos at Surat International Exhibition & Convention Centre (SIECC)",
            "Global gem and jewelry conclaves at Surat Diamond Bourse (SDB)",
            "SVNIT MindBend technical symposium & Sparsh youth cultural fest",
            "Auditorium conferences and seminars at Sanjeev Kumar Auditorium, Pal",
          ],
        },
        useCases: [
          "SIECC Sarsana textile, machinery, and jewelry trade exhibitions",
          "Surat Diamond Bourse international diamond conferences",
          "SVNIT Surat MindBend technical festival & hackathons",
          "Veer Narmad South Gujarat University youth fests and convocations",
          "Sanjeev Kumar Auditorium drama, comedy, and cultural summits",
          "Pandit Dindayal Upadhyay Indoor Stadium sports tournaments & expos",
          "Southern Gujarat Chamber of Commerce and Industry (SGCCI) conclaves",
          "Surat startup pitch sessions and investor demo days",
        ],
        faqs: [
          {
            q: "Can URPASS handle large trade exhibitions like SIECC Sarsana?",
            a: "Yes. URPASS accommodates buyer pre-registration, GST tax invoice issuance, visitor category badges (Exhibitor, VIP, Visitor), and instant QR pass generation via WhatsApp and Email.",
          },
          {
            q: "How fast is ticket validation at busy trade expo gates?",
            a: "Passes are validated in under 0.3 seconds using phone cameras on Chrome or Safari. The system provides clear audio chimes and vibration cues for instant verification.",
          },
          {
            q: "Can we collect registration fees via UPI for paid workshops in Surat?",
            a: "Yes. With direct Razorpay integration, attendees can pay instantly via PhonePe, Google Pay, Paytm, cards, or net banking, with funds settling straight to your account with 0% commission.",
          },
          {
            q: "Can we monitor entry counts per gate or hall in real time?",
            a: "Yes. The live organizer dashboard displays real-time check-in stats, peak hour entry graphs, and gate-by-gate attendance counts.",
          },
        ],
        relatedLinks: [
          {
            title: "Event Registration Ahmedabad",
            href: "/in/ahmedabad",
            category: "Location",
          },
          {
            title: "Event Registration Mumbai",
            href: "/in/mumbai",
            category: "Location",
          },
          {
            title: "Event Registration Pune",
            href: "/in/pune",
            category: "Location",
          },
          {
            title: "Event Registration India Hub",
            href: "/in",
            category: "Location",
          },
          {
            title: "Event Ticketing with UPI",
            href: "/event-ticketing-with-upi",
            category: "Product",
          },
          {
            title: "Compare: Eventbrite Alternative India",
            href: "/compare/eventbrite-alternative-india",
            category: "Comparison",
          },
        ],
      }}
    />
  );
}
