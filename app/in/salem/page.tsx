import type { Metadata } from "next";
import { MapPin, GraduationCap, QrCode, ScanLine, Ticket, Users, Award, Building } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Salem — Colleges & Fests",
  description:
    "URPASS event registration and QR check-in software for Salem colleges, engineering symposiums, and business conventions. Sona College, GCE Salem, Vinayaka Mission, and Periyar University ticketing.",
  keywords: [
    "event registration software Salem",
    "QR check in Salem",
    "Sona college symposium passes",
    "GCE Salem event ticketing",
    "Vinayaka Mission conference passes",
    "Salem college fest registration",
    "Salem event ticketing platform",
  ],
  alternates: { canonical: "https://urpass.space/in/salem" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Salem | URPASS",
    description:
      "Digital event registration, fast QR entry passes, and phone check-in for Salem colleges, industrial conventions, and Yercaud retreats.",
    url: "https://urpass.space/in/salem",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-TN",
    "geo.placename": "Salem, Tamil Nadu, India",
    "geo.position": "11.6643;78.1460",
    "ICBM": "11.6643, 78.1460",
  },
};

export default function SalemPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · SALEM",
        h1: "Event Registration & QR Check-In Software for Salem",
        canonicalUrl: "https://urpass.space/in/salem",
        geo: {
          region: "IN-TN",
          placename: "Salem, Tamil Nadu, India",
          position: "11.6643;78.1460",
          latitude: 11.6643,
          longitude: 78.146,
        },
        description:
          "Powering engineering college fests, academic conferences, and industrial summits across Salem with instant digital QR passes, automated UPI ticketing, and reliable offline entrance check-in.",
        ctaLabel: "Launch your Salem event",
        features: [
          {
            icon: GraduationCap,
            title: "Salem College Symposiums",
            desc: "Purpose-built for Sona College of Technology, Government College of Engineering (GCE) Salem, and Periyar University academic conferences and tech fests.",
          },
          {
            icon: Building,
            title: "Industrial & Chamber Events",
            desc: "Manage attendee registrations, badge printing, and gate credentials for Salem Steel, mining, and industrial chamber business meets.",
          },
          {
            icon: Ticket,
            title: "Seamless UPI & Card Ticketing",
            desc: "Direct attendee payment collection via UPI (GPay, PhonePe), net banking, and cards with automated tax receipts and ticket generation.",
          },
          {
            icon: QrCode,
            title: "Tamper-Proof QR Passes",
            desc: "Every approved attendee receives a unique, unforgeable digital QR pass with customizable branding, seat assignment, and anti-screenshot safeguards.",
          },
          {
            icon: ScanLine,
            title: "Fast Mobile & Laser Scanning",
            desc: "Admit attendees in under 0.3 seconds using student smartphones or handheld Bluetooth laser guns with audible chimes and tactile haptics.",
          },
          {
            icon: Award,
            title: "Yercaud Offsites & Retreats",
            desc: "Coordinate executive retreats, medical workshops, and corporate seminars hosted in Salem and scenic Yercaud resort venues.",
          },
        ],
        callout: {
          badge: "ACADEMIC & INDUSTRIAL HUB",
          title: "Streamlining Salem's Fast-Growing Event Calendar.",
          description:
            "From high-energy inter-college culturals and national coding hackathons to corporate conventions and medical summits in Salem, URPASS provides flawless guest logistics and multi-gate access control.",
          bullets: [
            "National technical symposiums & project presentations",
            "Medical & healthcare conferences at Vinayaka Mission",
            "College annual culturals & sports tournaments",
            "Founder Lifetime Plan (₹19,999) available for local institutions",
          ],
        },
        useCases: [
          "Sona College tech symposiums",
          "GCE Salem annual fest registrations",
          "Vinayaka Mission medical conferences",
          "Periyar University seminar passes",
          "Yercaud corporate leadership retreats",
          "Salem district industrial exhibitions",
          "Salem startup & developer meetups",
          "Inter-school athletic & cultural meets",
        ],
        faqs: [
          {
            q: "Can Salem student committees use URPASS for free events?",
            a: "Yes. The permanent Free Tier supports 2 events/month and up to 100 registrations/month at ₹0 forever with no credit card required—perfect for departmental paper presentations and club meetings.",
          },
          {
            q: "How many attendees can URPASS scan at large Salem college fests?",
            a: "URPASS easily scales from small 50-person department workshops to 10,000+ attendee multi-day college festivals with distributed multi-gate check-in scanning.",
          },
          {
            q: "Does the scanner work if mobile internet is spotty on campus?",
            a: "Yes. URPASS features an offline verification mode that caches attendee manifests directly in the device's browser (IndexedDB) and synchronizes check-ins when reconnected.",
          },
          {
            q: "Can we sell tickets for paid workshops and technical events in Salem?",
            a: "Yes. You can configure paid ticket tiers with instant Razorpay checkout, allowing students to pay effortlessly via UPI apps like Google Pay and PhonePe.",
          },
          {
            q: "Is there a lifetime software deal for Salem organizers?",
            a: "Yes. Event production agencies, colleges, and conference organizers can apply for the URPASS Founder Lifetime Plan (₹19,999 one-time) for unlimited lifetime access without monthly fees.",
          },
        ],
        ctaTitle: "Manage your Salem event with URPASS",
        ctaDescription: "Loved by college committees · QR passes · Zero setup fee",
      }}
    />
  );
}
