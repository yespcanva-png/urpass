import type { Metadata } from "next";
import { GraduationCap, MapPin, QrCode, ScanLine, Ticket, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Kochi Kerala",
  description: "URPASS event registration, ticketing, and QR check-in platform for Kochi and Kerala. Built for college fests, tech symposiums, startup summits, and workshops.",
  keywords: [
    "event registration Kochi",
    "QR check-in Kerala",
    "Kochi tech events pass",
    "Kerala college fest passes",
    "CUSAT event registration",
    "Infopark Kochi meetups ticketing",
  ],
  alternates: { canonical: "https://urpass.space/in/kochi" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Kochi Kerala | URPASS",
    description: "Kochi & Kerala event registration and QR pass platform for colleges, startups, and community events.",
    url: "https://urpass.space/in/kochi",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-KL",
    "geo.placename": "Kochi, Kerala, India",
    "geo.position": "9.9312;76.2673",
    "ICBM": "9.9312, 76.2673",
  },
};

export default function KochiPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS · KOCHI & KERALA",
        h1: "Event Registration & QR Check-In for Kochi & Kerala",
        canonicalUrl: "https://urpass.space/in/kochi",
        geo: {
          region: "IN-KL",
          placename: "Kochi, Kerala, India",
          position: "9.9312;76.2673",
          latitude: 9.9312,
          longitude: 76.2673,
        },
        description: "Trusted by colleges, tech startups, and event organisers across Kochi, Trivandrum, and Kerala. Digital QR passes, Razorpay UPI payments, and fast camera check-in.",
        ctaLabel: "Start your Kerala event",
        features: [
          { icon: GraduationCap, title: "Kerala college events", desc: "Run registration and QR pass check-ins for CUSAT, Model Engineering College, Rajagiri, and Kerala college symposiums." },
          { icon: MapPin, title: "Infopark & Startup Village", desc: "Designed for Kochi developer meetups, startup pitch sessions, and tech conferences with UPI payments." },
          { icon: Ticket, title: "Instant ticketing with Razorpay", desc: "Collect payments via UPI, Google Pay, PhonePe, Paytm, and cards with instant QR pass issuance." },
          { icon: QrCode, title: "Custom digital passes", desc: "Branded attendee passes featuring your event colors, custom logo, and anti-duplicate secure QR codes." },
          { icon: ScanLine, title: "Zero-hardware phone scanning", desc: "Volunteers and gate teams scan passes in under a second using any iPhone or Android camera." },
          { icon: Users, title: "Real-time attendee rosters", desc: "Monitor live check-in counts, export attendee CSVs, and send email passes automatically." },
        ],
        callout: {
          badge: "KOCHI TECH & CULTURALS",
          title: "Simplifying event entry across God's Own Country.",
          description: "From Kakkanad tech conferences to college cultural festivals across Ernakulam, URPASS ensures smooth attendee queues with zero paper tickets.",
          bullets: [
            "Seamless Razorpay UPI payments in INR",
            "CUSAT, MEC & Kerala college fests",
            "Infopark & SmartCity developer meetups",
            "Real-time attendance stats with CSV export",
          ],
        },
        useCases: [
          "Kochi developer meetups", "Kerala startup fests", "CUSAT campus events", "Ernakulam workshops",
          "Trivandrum tech conferences", "Kerala cultural fests", "Hackathons Kerala", "Design summits Kochi",
        ],
        faqs: [
          { q: "Can I use URPASS for a college fest in Kerala?", a: "Yes. URPASS is widely used for college fests, technical symposiums, and cultural events across Kerala with fast approval and QR ticketing." },
          { q: "Does URPASS support UPI payments in Kerala?", a: "Yes. Attendees can pay via Google Pay, PhonePe, Paytm, BHIM UPI, and credit/debit cards powered by Razorpay." },
          { q: "Do entrance volunteers need to install a special app?", a: "No. The scanner works right in the mobile browser with camera permissions. No App Store or Play Store downloads required." },
          { q: "Is there a free plan for community events in Kochi?", a: "Yes. URPASS provides a 100% free plan for 2 events/month with up to 100 registrations/month with full QR check-in capabilities. Paid plans start at ₹499/month with a 30-day free trial." },
        ],
        ctaTitle: "Launch your Kochi or Kerala event on URPASS",
        ctaDescription: "Free to start · Instant UPI ticketing · QR check-in without apps",
      }}
    />
  );
}
