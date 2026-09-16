import type { Metadata } from "next";
import { Gift, ClipboardList, QrCode, ScanLine, BarChart3, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Free Event Registration & QR Check-In Software | URPASS",
  description: "Start event registration for free. Create an event, collect registrations, issue digital QR passes, and check in attendees at zero cost. No credit card required.",
  alternates: { canonical: "https://urpass.space/free-event-registration" },
  openGraph: {
    title: "Free Event Registration & QR Check-In Software | URPASS",
    description: "Free event registration with digital QR passes and check-in. No card needed. Start in 5 minutes.",
    url: "https://urpass.space/free-event-registration",
  },
};

export default function FreeEventRegistrationPage() {
  return (
    <SEOPage
      config={{
        badge: "FREE EVENT REGISTRATION",
        h1: "Start Event Registration for Free",
        description: "URPASS free plan lets you run a complete event — registrations, digital QR passes, and check-in — at zero cost. No credit card, no trial period, no hidden charges.",
        ctaLabel: "Create free event",
        features: [
          { icon: Gift, title: "Permanently free plan", desc: "Not a trial. The free plan is available forever — 1 active event, 50 attendees, full QR check-in." },
          { icon: ClipboardList, title: "Registration form included", desc: "Collect name, email, phone, and custom fields at no cost." },
          { icon: QrCode, title: "Digital QR passes", desc: "Every approved attendee gets a digital QR pass automatically — no printing, no manual work." },
          { icon: ScanLine, title: "QR check-in scanning", desc: "Check in attendees by scanning their QR pass on any phone. Included free." },
          { icon: BarChart3, title: "Check-in dashboard", desc: "See real-time attendance and check-in stats from your free dashboard." },
          { icon: Zap, title: "Up in 5 minutes", desc: "Create an account, set up your event, and share the registration link — in 5 minutes flat." },
        ],
        callout: {
          badge: "FREE FOREVER",
          title: "Everything you need. Zero cost.",
          description: "The URPASS free plan isn't a time-limited trial. It gives you permanent access to the core registration + QR check-in flow for your first event.",
          bullets: [
            "1 active event at a time",
            "Up to 50 attendees per event",
            "Digital QR passes included",
            "QR check-in scanning included",
          ],
        },
        useCases: [
          "Small college events", "Workshop pilots", "Community meetups", "Trial events",
          "Class reunions", "Small seminars", "Local hackathons", "Club events",
        ],
        faqs: [
          { q: "Is URPASS really free?", a: "Yes. The free plan is permanently available with 1 active event and up to 50 attendees. You get full registration, digital QR passes, and check-in scanning at no cost." },
          { q: "Do I need a credit card to start?", a: "No. You can sign up and create your first event with zero payment details required." },
          { q: "What is the difference between free and paid plans?", a: "Free supports 1 event and 50 attendees. Starter (₹299/month) supports 5 events and 500 attendees. Pro (₹799/month) supports unlimited events and 2,000 attendees per event, plus custom branding and data export." },
          { q: "Can I upgrade from free to a paid plan later?", a: "Yes. You can upgrade at any time from your billing page. All your existing events and data are retained." },
          { q: "Is there a free plan for paid/ticketed events?", a: "The free plan only supports free (₹0) events. Paid ticketing requires a Starter or Pro subscription." },
          { q: "Can I run multiple events on the free plan?", a: "The free plan supports 1 active event at a time. You can archive an event to free up the slot for a new one." },
        ],
        ctaTitle: "Start your free event today",
        ctaDescription: "Free forever · No credit card · 1 event · 50 attendees · Full QR check-in",
      }}
    />
  );
}
