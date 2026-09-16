import type { Metadata } from "next";
import { Users2, QrCode, Zap, ScanLine, ClipboardList, Gift } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Community Event Registration Software | URPASS",
  description: "Manage community event registrations with digital QR passes and simple check-in. Free plan for small communities. Scale as you grow.",
  alternates: { canonical: "https://urpass.space/community-events" },
  openGraph: {
    title: "Community Event Registration Software | URPASS",
    description: "Free and simple event registration for community events. QR passes included.",
    url: "https://urpass.space/community-events",
  },
};

export default function CommunityEventsPage() {
  return (
    <SEOPage
      config={{
        badge: "COMMUNITY EVENTS",
        h1: "Simple Registration for Community Events",
        description: "Run community events with a clean registration page, digital QR passes, and phone-based check-in. Free for small communities. No complicated setup.",
        ctaLabel: "Register your community event",
        features: [
          { icon: Users2, title: "Built for community organisers", desc: "Designed for volunteer-run and community-led events — simple enough for anyone to set up." },
          { icon: Gift, title: "Free plan available", desc: "Small communities can use the full registration and QR check-in flow at zero cost." },
          { icon: ClipboardList, title: "Simple registration form", desc: "Collect name and contact details, or add custom questions for your community." },
          { icon: Zap, title: "Auto-approval for open events", desc: "Enable auto-approval so community members get their QR pass instantly on registering." },
          { icon: QrCode, title: "Digital QR pass", desc: "Every member gets a QR pass they can show on their phone at the event entrance." },
          { icon: ScanLine, title: "Quick QR check-in", desc: "Scan member passes at the venue with any phone. No extra equipment required." },
        ],
        callout: {
          badge: "VOLUNTEER-FRIENDLY",
          title: "One person can run the whole event.",
          description: "A single community organiser can create the event, share the registration link, manage sign-ups, and run check-in on the day — all from URPASS.",
          bullets: [
            "No technical skills needed",
            "Free for small events",
            "Share registration link anywhere",
            "QR check-in on any phone",
          ],
        },
        useCases: [
          "Neighbourhood events", "NGO events", "Club meetups", "Alumni events",
          "Religious events", "Charity events", "Support groups", "Sports events",
        ],
        faqs: [
          { q: "Is URPASS suitable for small community events?", a: "Absolutely. The free plan is designed for exactly this — one event with up to 50 attendees at zero cost." },
          { q: "Do I need technical skills to use URPASS?", a: "No. URPASS is designed to be used by anyone. Creating an event and sharing the registration link takes about 5 minutes." },
          { q: "Can community members register without creating an account?", a: "Yes. Attendees register through the public link — no account, no login, no app required on their end." },
          { q: "Can I use URPASS for recurring community meetups?", a: "You can create a new event for each meetup. On paid plans, you can run multiple events simultaneously." },
          { q: "What if my community grows and I need more than 50 attendees?", a: "You can upgrade to a paid plan — Starter at ₹299/month supports 500 attendees per event." },
          { q: "Is there a mobile app for community event organisers?", a: "URPASS works entirely in a mobile browser — no app download needed for organisers or attendees." },
        ],
        ctaTitle: "Bring your community together with URPASS",
        ctaDescription: "Free for small events · Simple setup · QR check-in · No tech skills needed",
      }}
    />
  );
}
