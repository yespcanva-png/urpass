import type { Metadata } from "next";
import { CheckCircle2, Users, Share2, QrCode, ScanLine, Smartphone, Clock } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Networking Event Registration & Digital Guest Pass Software",
  description: "Organize business mixers, community networking nights, and professional meetups. Collect LinkedIn profiles, issue branded digital passes, and eliminate door wait times.",
  keywords: [
    "networking event registration software",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "attendee management",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/networking-events" },
  openGraph: {
    title: "Networking Event Registration & Digital Guest Pass Software | URPASS",
    description: "Organize business mixers, community networking nights, and professional meetups. Collect LinkedIn profiles, issue branded digital passes, and eliminate door wait times.",
    url: "https://urpass.space/networking-events",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "NETWORKING EVENTS",
        h1: "Networking Event Registration & Digital Guest Check-In",
        canonicalUrl: "https://urpass.space/networking-events",
        description: "Organize business mixers, community networking nights, and professional meetups. Collect LinkedIn profiles, issue branded digital passes, and eliminate door wait times.",
        ctaLabel: "Host networking event free",
        features: [
          { icon: Users, title: "Professional Profile Fields", desc: "Gather attendee company name, job designation, industry, and LinkedIn URLs on your registration form." },
          { icon: Share2, title: "Digital Name Badges", desc: "Digital passes display attendee name, company, and industry pill for easy icebreaking and verification." },
          { icon: QrCode, title: "Sub-Second Door Entry", desc: "Keep venue entrances queue-free so attendees can begin networking immediately upon arrival." },
          { icon: ScanLine, title: "Single-Use Gate Security", desc: "Ensure only confirmed, registered professionals gain access to private networking sessions." },
          { icon: Smartphone, title: "Mobile Browser Passes", desc: "Guests view their pass in Safari or Chrome without downloading proprietary networking apps." },
          { icon: Clock, title: "Post-Mixer Feedback", desc: "Collect automated attendee ratings and reviews to improve future community gatherings." },
        ],
        steps: [
          { n: "01", title: "Setup Mixer", desc: "Enter mixer date, lounge venue, and maximum attendee capacity." },
          { n: "02", title: "Collect Profiles", desc: "Attendees submit professional details via public registration link." },
          { n: "03", title: "Deliver Digital Passes", desc: "Confirmed guests receive personal QR passes with company details." },
          { n: "04", title: "Seamless Welcome", desc: "Door staff scan passes in under 0.3s for effortless entrance." },
          { n: "05", title: "Review Connections", desc: "Export verified attendee lists for community follow-ups." },
        ],
        callout: {
          badge: "FRICTIONLESS MIXERS",
          title: "First impressions matter at professional networking events.",
          description: "Long registration lines and manual paper clipboards ruin the vibe of an upscale networking evening. URPASS provides an elegant, instant digital entry experience.",
          bullets: [
            "Clean digital passes with attendee professional details",
            "Sub-0.3s check-in gets professionals networking faster",
            "Permanent free tier for up to 100 professionals per month",
            "Instant duplicate entry lockout prevents uninvited guests",
          ],
        },
        useCases: [
          "Executive Business Mixers",
          "Alumni Networking Evenings",
          "Tech Founder Happy Hours",
          "Women in Tech Meetups",
          "Creative Industry Gatherings",
          "Local Chamber Mixers",
        ],
        faqs: [
          { q: "Can we collect company and designation details on the form?", a: "Yes. You can add required custom fields for company name, job title, and LinkedIn profile." },
          { q: "Do attendees need an app to show their networking pass?", a: "No. The digital pass opens directly in mobile web browsers and can be saved to Apple Wallet." },
          { q: "Can we charge a cover fee for networking mixers?", a: "Yes. Native Razorpay integration allows you to sell paid tickets via UPI, cards, and net banking with zero platform cuts." },
          { q: "Can door hosts look up guests by name if they forgot their phone?", a: "Yes. Staff can search attendees by name or email directly inside the mobile scanner interface." },
        ],
        ctaTitle: "Elevate your event entry with URPASS",
        ctaDescription: "Permanent free tier · Zero hardware setup · Fast sub-second scanning",
      }}
    />
  );
}
