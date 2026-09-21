import type { Metadata } from "next";
import { CheckCircle2, Users, Monitor, QrCode, ScanLine, Zap, Heart } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Developer Meetup Registration & Tech Community Check-In",
  description: "Host tech meetups, open-source circles, and developer workshops. Collect GitHub handles, issue digital QR passes, and check in techies in under 0.3s with zero app downloads.",
  keywords: [
    "developer meetup registration and check in",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "attendee management",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/developer-meetups" },
  openGraph: {
    title: "Developer Meetup Registration & Tech Community Check-In | URPASS",
    description: "Host tech meetups, open-source circles, and developer workshops. Collect GitHub handles, issue digital QR passes, and check in techies in under 0.3s with zero app downloads.",
    url: "https://urpass.space/developer-meetups",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "DEVELOPER MEETUPS",
        h1: "Developer Meetup Registration & Community Gate Check-In",
        canonicalUrl: "https://urpass.space/developer-meetups",
        description: "Host tech meetups, open-source circles, and developer workshops. Collect GitHub handles, issue digital QR passes, and check in techies in under 0.3s with zero app downloads.",
        ctaLabel: "Host developer meetup free",
        features: [
          { icon: Users, title: "Developer Profile Fields", desc: "Collect GitHub usernames, technical roles, company/college, and tech stack preferences on custom forms." },
          { icon: Monitor, title: "Permanent Free Tier", desc: "Host 2 community meetups per month with up to 100 developers per month for ₹0 forever." },
          { icon: QrCode, title: "Instant QR Pass Delivery", desc: "Developers receive sleek mobile passes accessible in any browser with zero app installation." },
          { icon: ScanLine, title: "Sub-Second Door Entry", desc: "Volunteers scan passes in under 0.3s at office reception desks, getting developers to talks faster." },
          { icon: Zap, title: "Accurate Swag & Pizza Headcount", desc: "Track exact real-time attendance numbers to accurately order food, drinks, and community swag." },
          { icon: Heart, title: "Automated Feedback Collection", desc: "Post-meetup surveys gather developer feedback, talk ratings, and speaker suggestions automatically." },
        ],
        steps: [
          { n: "01", title: "Setup Meetup", desc: "Set meetup title, speaker agenda, office venue, and RSVP capacity." },
          { n: "02", title: "Collect RSVPs", desc: "Share registration link across Discord, Slack, and developer channels." },
          { n: "03", title: "Deliver Tech Passes", desc: "Attendees receive clean digital passes featuring dark mode aesthetic." },
          { n: "04", title: "Scan at Office Door", desc: "Volunteers scan passes with phone cameras for instant green entry." },
          { n: "05", title: "Collect Feedback", desc: "Automate post-meetup speaker ratings and community suggestions." },
        ],
        callout: {
          badge: "COMMUNITY FIRST",
          title: "Engineered by developers, for developer communities.",
          description: "Developers appreciate clean, ad-free tools that don't force app downloads or slow down entry. URPASS provides an ultra-fast, modern registration and check-in experience.",
          bullets: [
            "Zero app downloads required for organizers or attendees",
            "₹0 free forever plan for community-run meetups",
            "Accurate headcount data for food, drinks, and venue seating",
            "Built-in post-event survey tools for talk reviews",
          ],
        },
        useCases: [
          "Local Developer Circles",
          "JavaScript & Python User Groups",
          "AI/ML Workshops",
          "DevOps & Cloud Meetups",
          "Open Source Hack Nights",
          "Web3 Builder Gatherings",
        ],
        faqs: [
          { q: "Is URPASS really free for tech community meetups?", a: "Yes. Our permanent free tier allows you to host 2 meetups per month with up to 100 attendees per month at zero cost." },
          { q: "Can we collect GitHub handles and tech interests on the form?", a: "Yes. You can add custom questions to collect developer profiles and topic interests." },
          { q: "Do developers need to create an URPASS account to RSVP?", a: "No. Developers RSVP via a public link and receive their pass without creating an account." },
          { q: "Can office security use the scanner at the corporate building lobby?", a: "Yes. Security guards or volunteers open the scanner URL in their mobile browser to verify guest passes." },
        ],
        ctaTitle: "Elevate your event entry with URPASS",
        ctaDescription: "Permanent free tier · Zero hardware setup · Fast sub-second scanning",
      }}
    />
  );
}
