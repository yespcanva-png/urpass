import type { Metadata } from "next";
import { Building2, MapPin, QrCode, ScanLine, Ticket, Users, GraduationCap, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Vadodara — URPASS",
  description:
    "URPASS event registration and QR check-in platform for Vadodara (Baroda) and Central Gujarat. Built for MS University, Parul University, Sir Sayajirao Nagargruh, and FGI Business Centre. Free to start.",
  keywords: [
    "event registration Vadodara",
    "QR check in Vadodara",
    "Baroda college fest passes",
    "MS University event passes",
    "Parul University TechFest",
    "Sir Sayajirao Nagargruh events",
    "FGI Business Centre Vadodara",
    "event management software Baroda",
    "Razorpay event ticketing Vadodara",
  ],
  alternates: { canonical: "https://urpass.space/in/vadodara" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Vadodara | URPASS",
    description:
      "Vadodara's premier event registration and digital QR pass platform for collegiate fests, cultural concerts, and industrial conventions.",
    url: "https://urpass.space/in/vadodara",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-GJ",
    "geo.placename": "Vadodara, Gujarat, India",
    "geo.position": "22.3072;73.1812",
    ICBM: "22.3072, 73.1812",
  },
};

export default function VadodaraPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · VADODARA & CENTRAL GUJARAT",
        h1: "Event Registration & QR Check-In for Vadodara Events",
        canonicalUrl: "https://urpass.space/in/vadodara",
        geo: {
          region: "IN-GJ",
          placename: "Vadodara, Gujarat, India",
          position: "22.3072;73.1812",
          latitude: 22.3072,
          longitude: 73.1812,
        },
        description:
          "Trusted across Vadodara and Gujarat for mega collegiate festivals, cultural arts celebrations, industrial trade symposiums, and engineering conferences. Instant QR passes, Razorpay UPI checkout, and sub-0.3s gate check-in.",
        ctaLabel: "Start your Vadodara event",
        features: [
          {
            icon: GraduationCap,
            title: "Premier University Fests",
            desc: "Customized registration and branded digital passes for Maharaja Sayajirao University (MSU), Parul University, and Navrachana University symposiums.",
          },
          {
            icon: Building2,
            title: "Cultural Auditoriums & FGI Hubs",
            desc: "Designed for seamless audience check-in at Sir Sayajirao Nagargruh, C.C. Mehta Auditorium, and FGI Business Centre.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Offline QR Scanning",
            desc: "Ensure instant gate flow even during high-density youth festivals and Garba season gatherings when cell towers are congested.",
          },
          {
            icon: Ticket,
            title: "0% Ticket Platform Fees",
            desc: "Collect delegate and registration ticket revenue via Razorpay UPI (PhonePe, GPay, Paytm) directly to your account with zero platform commissions.",
          },
          {
            icon: Users,
            title: "Multi-Gate Volunteer Check-In",
            desc: "Provide student volunteers and gate security with PIN-based browser scanner links to manage entry gates in parallel.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Passback Security",
            desc: "Dynamic QR codes prevent ticket counterfeiting, screenshot forwarding, and unauthorized pass handover across all venue checkpoints.",
          },
        ],
        callout: {
          badge: "VADODARA VENUES",
          title: "From Sir Sayajirao Nagargruh to MS University & Parul Campuses.",
          description:
            "Celebrated as Gujarat's cultural capital and a massive higher education center, Vadodara hosts international heritage celebrations, engineering techfests, and industrial exhibitions. URPASS guarantees zero gate congestion.",
          bullets: [
            "Cultural concerts and theatre festivals at Sir Sayajirao Nagargruh (Akota)",
            "MS University Faculty of Technology & Engineering national symposiums",
            "Parul University PU TechFest and Dhoom annual youth celebrations",
            "Industrial and business conclaves at Federation of Gujarat Industries (FGI)",
          ],
        },
        useCases: [
          "MS University of Baroda Footprints technical fest & youth symposiums",
          "Parul University PU TechFest & Dhoom annual cultural festivals",
          "Navrachana University collegiate conferences & workshops",
          "Sir Sayajirao Nagargruh drama, classical dance, and comedy shows",
          "Federation of Gujarat Industries (FGI) trade & manufacturing summits",
          "Alembic City art exhibitions and heritage gallery walks",
          "Vadodara Marathon delegate check-in and volunteer badging",
          "Navlakhi Ground seasonal cultural celebrations and fairs",
        ],
        faqs: [
          {
            q: "Can URPASS handle mega campus fests like MSU Footprints or Parul TechFest?",
            a: "Yes. URPASS is built to handle tens of thousands of simultaneous registrations, offering custom registration fields (roll number, department, college ID) and instant WhatsApp/Email ticket delivery.",
          },
          {
            q: "Does the scanner app work offline at outdoor grounds?",
            a: "Yes. URPASS offline scan mode pre-caches your attendee list so volunteers can validate entries in under 0.3 seconds without requiring cellular coverage.",
          },
          {
            q: "How are payments settled for paid tickets in Vadodara?",
            a: "URPASS integrates directly with Razorpay. Payments via UPI, cards, and net banking go straight into your bank account with 0% platform commission.",
          },
          {
            q: "Can we track department-wise and club attendance?",
            a: "With URPASS Campus integration, academic coordinators can view real-time attendance and registration analytics broken down by department, student club, and year.",
          },
        ],
        relatedLinks: [
          {
            title: "Event Registration Surat",
            href: "/in/surat",
            category: "Location",
          },
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
