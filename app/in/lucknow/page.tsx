import type { Metadata } from "next";
import { Building2, MapPin, QrCode, ScanLine, Ticket, Users, GraduationCap, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Lucknow — URPASS",
  description:
    "URPASS event registration and QR check-in platform for Lucknow and Uttar Pradesh. Built for college fests (IIM Lucknow, AKTU, BBD, Integral), Indira Gandhi Pratishthan conferences, medical symposiums, and corporate summits. Free to start.",
  keywords: [
    "event registration Lucknow",
    "QR check in Lucknow",
    "Lucknow college fest passes",
    "IIM Lucknow event ticketing",
    "Indira Gandhi Pratishthan event registration",
    "event management software Uttar Pradesh",
    "Razorpay event ticketing Lucknow",
    "AKTU symposium passes",
  ],
  alternates: { canonical: "https://urpass.space/in/lucknow" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Lucknow | URPASS",
    description:
      "Lucknow's premier event registration and digital QR pass platform for college fests, medical symposiums, and corporate summits.",
    url: "https://urpass.space/in/lucknow",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-UP",
    "geo.placename": "Lucknow, Uttar Pradesh, India",
    "geo.position": "26.8467;80.9462",
    ICBM: "26.8467, 80.9462",
  },
};

export default function LucknowPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · LUCKNOW & UP",
        h1: "Event Registration & QR Check-In for Lucknow Events",
        canonicalUrl: "https://urpass.space/in/lucknow",
        geo: {
          region: "IN-UP",
          placename: "Lucknow, Uttar Pradesh, India",
          position: "26.8467;80.9462",
          latitude: 26.8467,
          longitude: 80.9462,
        },
        description:
          "Trusted across Lucknow and Uttar Pradesh for university fests, healthcare conventions, startup conferences, and cultural exhibitions. Instant digital QR passes, Razorpay UPI checkout, and sub-0.3s gate check-in.",
        ctaLabel: "Start your Lucknow event",
        features: [
          {
            icon: GraduationCap,
            title: "Leading University & College Fests",
            desc: "Engineered for IIM Lucknow, AKTU, BBD University, Integral University, and Amity Lucknow fests and hackathons.",
          },
          {
            icon: Building2,
            title: "Convention & Healthcare Summits",
            desc: "Seamless attendee check-in and badge scanning at Indira Gandhi Pratishthan, Scientific Convention Centre, and Awadh Shilpgram.",
          },
          {
            icon: Ticket,
            title: "0% Ticket Commission",
            desc: "Keep 100% of your delegate pass and ticket revenue. Connect Razorpay directly with instant UPI and card settlements.",
          },
          {
            icon: QrCode,
            title: "Instant Digital Passes",
            desc: "Attendees receive personalized digital QR passes with instant mobile wallet access and optional WhatsApp delivery.",
          },
          {
            icon: ScanLine,
            title: "Sub-Second Smartphone Scanning",
            desc: "Volunteer scan attendants validate entry with any smartphone camera in under 0.3s. No dedicated scanners or hardware rental.",
          },
          {
            icon: ShieldCheck,
            title: "Multi-Gate Anti-Passback",
            desc: "Real-time synchronization across auditoriums and gates prevents pass sharing and fraudulent duplicate entries.",
          },
        ],
        callout: {
          badge: "LUCKNOW VENUES",
          title: "From Indira Gandhi Pratishthan to University Auditoriums.",
          description:
            "As the capital of Uttar Pradesh and a major educational and administrative hub, Lucknow hosts major industrial summits, medical conferences, and youth festivals. URPASS provides zero-delay entry.",
          bullets: [
            "Conferences and trade expos at Indira Gandhi Pratishthan, Gomti Nagar",
            "IIM Lucknow and AKTU technical festivals, symposiums, and startup summits",
            "Medical conventions and healthcare symposiums at KGMU and SGPGI",
            "Cultural gatherings, exhibitions, and handicraft expos at Awadh Shilpgram",
          ],
        },
        useCases: [
          "IIM Lucknow Manfest-Varchasva & leadership summits",
          "Indira Gandhi Pratishthan business conventions and expos",
          "AKTU & BBD technical symposiums and hackathons",
          "KGMU Scientific Convention Centre healthcare summits",
          "Gomti Nagar & Vibhuti Khand IT startup meetups",
          "Awadh Shilpgram exhibitions and cultural festivals",
          "Corporate workshops at Taj Mahal Lucknow & Renaissance",
          "Inter-school youth festivals and model UNs across Lucknow",
        ],
        relatedLinks: [
          {
            title: "Event Registration Delhi NCR",
            href: "/in/delhi",
            category: "Location",
          },
          {
            title: "Event Registration Noida & Greater Noida",
            href: "/in/noida",
            category: "Location",
          },
          {
            title: "Event Registration Jaipur",
            href: "/in/jaipur",
            category: "Location",
          },
          {
            title: "Event Registration Chandigarh",
            href: "/in/chandigarh",
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
        faqs: [
          {
            q: "Is URPASS suitable for college fests in Lucknow?",
            a: "Yes. URPASS is widely used for collegiate fests, technical symposiums, and hackathons across colleges in Lucknow and UP, including IIM Lucknow, AKTU, and BBD University.",
          },
          {
            q: "How does gate check-in work at Indira Gandhi Pratishthan?",
            a: "Organizers generate volunteer scan links. Volunteers open the camera scanner in mobile Safari or Chrome without downloading an app. Attendees are verified in under 0.3s with clear audio cues.",
          },
          {
            q: "Can I collect payments in INR via UPI for Lucknow events?",
            a: "Yes. URPASS integrates directly with Razorpay, supporting instant UPI checkout (PhonePe, Google Pay, Paytm, BHIM), debit/credit cards, and net banking with direct T+2 settlement.",
          },
          {
            q: "Does URPASS charge ticket commissions for Lucknow organizers?",
            a: "No. URPASS operates on 0% ticketing commission. Organizers pay a predictable flat software subscription starting at ₹499/mo, or use the ₹0 Free tier for smaller events.",
          },
          {
            q: "Can we generate GST-compliant tax invoices for corporate delegates?",
            a: "Yes. URPASS allows collecting company GSTIN numbers at registration and automatically issues compliant tax invoices with appropriate SAC codes.",
          },
          {
            q: "What happens if mobile network is slow at large campus grounds?",
            a: "URPASS includes offline check-in capability. The local attendee list is cached on the gate attendant's browser, allowing smooth entry even during network congestion.",
          },
        ],
        ctaTitle: "Start your Lucknow event on URPASS",
        ctaDescription:
          "Free tier available · Instant UPI payments · Sub-second QR check-in · Built for Lucknow & UP events",
      }}
    />
  );
}
