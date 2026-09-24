import type { Metadata } from "next";
import { Gift, ClipboardList, QrCode, ScanLine, BarChart3, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Free Event Registration & QR Check-In Software",
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
        canonicalUrl: "https://urpass.space/free-event-registration",
        badge: "FREE EVENT REGISTRATION",
        h1: "Start Event Registration for Free",
        description: "URPASS free plan lets you run complete events — registrations, digital QR passes, and check-in — at zero cost. No credit card, no trial period, no hidden charges.",
        ctaLabel: "Create free event",
        features: [
          { icon: Gift, title: "Permanently free plan", desc: "Not a trial. The free plan is available forever — 2 events/month, 100 registrations/month, full QR check-in." },
          { icon: ClipboardList, title: "Registration form included", desc: "Collect name, email, phone, and custom fields at no cost." },
          { icon: QrCode, title: "Digital QR passes", desc: "Every approved attendee gets a digital QR pass automatically — no printing, no manual work." },
          { icon: ScanLine, title: "QR check-in scanning", desc: "Check in attendees by scanning their QR pass on any phone. Included free." },
          { icon: BarChart3, title: "Check-in dashboard", desc: "See real-time attendance and check-in stats from your free dashboard." },
          { icon: Zap, title: "Up in 5 minutes", desc: "Create an account, set up your event, and share the registration link — in 5 minutes flat." },
        ],
        callout: {
          badge: "FREE FOREVER",
          title: "Everything you need. Zero cost.",
          description: "The URPASS free plan isn't a time-limited trial. It gives you permanent access to the core registration + QR check-in flow for up to 2 events and 100 registrations every month.",
          bullets: [
            "2 events per month",
            "Up to 100 registrations per month",
            "Digital QR passes included",
            "QR check-in scanning included",
          ],
        },
        useCases: [
          "Small college events", "Workshop pilots", "Community meetups", "Trial events",
          "Class reunions", "Small seminars", "Local hackathons", "Club events",
        ],
        faqs: [
          { q: "Is URPASS really free?", a: "Yes. The free plan is permanently available with 2 events per month and up to 100 registrations per month. You get full registration, digital QR passes, and check-in scanning at no cost." },
          { q: "Do I need a credit card to start?", a: "No. You can sign up and create your first event with zero payment details required." },
          { q: "What is the difference between free and paid plans?", a: "Free supports 2 events/month and 100 registrations/month. Starter (₹499/month) supports 10 events and 500 registrations/month. Pro (₹999/month) supports unlimited events and 2,500 registrations/month with custom pass design and priority support. Business (₹2,499/month) supports 10,000 registrations/month." },
          { q: "Can I upgrade from free to a paid plan later?", a: "Yes. You can upgrade at any time from your billing page. All your existing events and data are retained." },
          { q: "Is there a free trial for paid plans?", a: "Yes. You can try Starter, Pro, or Business free for 30 days with no credit card required." },
          { q: "Can I run multiple events on the free plan?", a: "The free plan supports 2 events per month. Paid plans support 10 events (Starter) or unlimited events (Pro & Business)." },
        ],
        ctaTitle: "Start your free event today",
        ctaDescription: "Free forever · No credit card · 2 events/mo · 100 registrations/mo · Full QR check-in",
      }}
    />
  );
}
