import type { Metadata } from "next";
import { Building2, MapPin, QrCode, ScanLine, Ticket, Users, GraduationCap, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Chandigarh & Mohali — URPASS",
  description:
    "URPASS event registration and QR check-in platform for Chandigarh, Mohali, and Panchkula (Tricity). Built for college fests (Panjab University, PEC, Chitkara), IT park summits, and corporate workshops. Free to start.",
  keywords: [
    "event registration Chandigarh",
    "QR check in Mohali",
    "Chandigarh college fest passes",
    "Panjab University event ticketing",
    "Mohali IT Park corporate events",
    "Tricity event registration software",
    "Razorpay event ticketing Chandigarh",
  ],
  alternates: { canonical: "https://urpass.space/in/chandigarh" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Chandigarh | URPASS",
    description:
      "Tricity's premier event registration and digital QR pass platform for college fests, Mohali IT tech summits, and corporate conferences.",
    url: "https://urpass.space/in/chandigarh",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-CH",
    "geo.placename": "Chandigarh, Tricity, India",
    "geo.position": "30.7333;76.7794",
    ICBM: "30.7333, 76.7794",
  },
};

export default function ChandigarhPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · CHANDIGARH TRICITY",
        h1: "Event Registration & QR Check-In for Chandigarh Events",
        canonicalUrl: "https://urpass.space/in/chandigarh",
        geo: {
          region: "IN-CH",
          placename: "Chandigarh, Tricity, India",
          position: "30.7333;76.7794",
          latitude: 30.7333,
          longitude: 76.7794,
        },
        description:
          "Trusted across Chandigarh, Mohali, and Panchkula for university cultural fests, IT tech meetups, and corporate training summits. Instant QR passes, Razorpay UPI checkout, and sub-0.3s gate check-in.",
        ctaLabel: "Start your Chandigarh event",
        features: [
          {
            icon: GraduationCap,
            title: "Premier University Fests",
            desc: "Designed for Panjab University, PEC Chandigarh, Chitkara, and Chandigarh University fests.",
          },
          {
            icon: Building2,
            title: "Mohali IT Park & City Summits",
            desc: "Streamlined registration workflows for growing SaaS startups, IT services firms, and tech conferences.",
          },
          {
            icon: Ticket,
            title: "0% Ticket Commission",
            desc: "Sell delegate passes with zero per-ticket platform cuts. 100% of revenue goes directly to your bank.",
          },
          {
            icon: QrCode,
            title: "Instant Digital Passes",
            desc: "Participants receive digital QR passes that open instantly on mobile devices with Apple Wallet support.",
          },
          {
            icon: ScanLine,
            title: "Fast Mobile Camera Scanning",
            desc: "Scan passes at auditorium doors and sports complexes using any mobile browser with audio confirmation.",
          },
          {
            icon: ShieldCheck,
            title: "Prevent Gate Bottlenecks",
            desc: "Anti-passback protection and offline-ready sync eliminate entry delays during high-attendance evening shows.",
          },
        ],
        callout: {
          badge: "TRICITY VENUES",
          title: "From Panjab University to Mohali Exhibition Centres.",
          description:
            "Chandigarh Tricity is a thriving educational and tech corridor. URPASS helps student councils, event directors, and corporate organizers manage seamless entry.",
          bullets: [
            "Panjab University and PEC campus festivals and hackathons",
            "Chitkara University and Chandigarh University mega events",
            "Tech meetups across Mohali IT City and Sector 67 tech hub",
            "Corporate conferences at Hyatt Regency and JW Marriott Chandigarh",
          ],
        },
        useCases: [
          "Panjab University & PEC youth festivals",
          "Mohali IT startup meetups and hackathons",
          "Chitkara & CU technical symposiums",
          "Medical conferences at PGI Chandigarh",
          "Music concerts and cultural exhibitions",
          "Corporate workshops and trade seminars",
        ],
        relatedLinks: [
          {
            title: "Event Registration Delhi NCR",
            href: "/in/delhi",
            category: "Location",
          },
          {
            title: "College Events & Fest Ticketing",
            href: "/college-events",
            category: "Use Case",
          },
          {
            title: "College Fest Registration Form Guide",
            href: "/guides/how-to-create-college-fest-registration-form",
            category: "Guide",
          },
          {
            title: "Event Ticketing with UPI",
            href: "/event-ticketing-with-upi",
            category: "Product",
          },
        ],
        faqs: [
          {
            q: "Can URPASS handle large college fest crowds in Chandigarh?",
            a: "Yes. URPASS is battle-tested for high-density campus festivals, supporting multi-entrance scanning that validates each attendee pass in under 0.3 seconds.",
          },
          {
            q: "Can attendees pay for fest tickets using UPI?",
            a: "Yes. Our direct Razorpay integration supports Google Pay, PhonePe, Paytm, and all UPI apps, settling funds directly into your college or society bank account.",
          },
          {
            q: "Is an app required for attendees or volunteers?",
            a: "No app is needed. Attendees access their pass via a responsive web URL or save it to Apple Wallet, and volunteers scan passes using mobile Chrome or Safari.",
          },
        ],
        ctaTitle: "Host your Tricity event with URPASS",
        ctaDescription: "College fests · Tech summits · Instant UPI payments · Free tier available",
      }}
    />
  );
}
