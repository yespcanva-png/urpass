import type { Metadata } from "next";
import { Zap, MapPin, QrCode, CreditCard, Users, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Eventbrite Alternative for QR Event Check-In | URPASS",
  description: "Looking for an Eventbrite alternative? URPASS offers event registration, digital QR passes, and check-in scanning with INR pricing and Razorpay. Free plan available.",
  alternates: { canonical: "https://urpass.space/compare/eventbrite-alternative" },
  openGraph: {
    title: "Eventbrite Alternative for QR Event Check-In | URPASS",
    description: "URPASS — a simpler, India-focused Eventbrite alternative with QR check-in and free plan.",
    url: "https://urpass.space/compare/eventbrite-alternative",
  },
};

export default function EventbriteAlternativePage() {
  return (
    <SEOPage
      config={{
        badge: "EVENTBRITE ALTERNATIVE",
        h1: "Looking for an Eventbrite Alternative?",
        description: "URPASS is a simpler, India-built event registration platform with digital QR passes, Razorpay payment integration, and a permanent free plan. No per-ticket fees from URPASS.",
        ctaLabel: "Try URPASS free",
        features: [
          { icon: MapPin, title: "Built for India", desc: "URPASS is built for Indian events with INR pricing, Razorpay for UPI/cards, and support for college, corporate, and community events." },
          { icon: Zap, title: "Simpler setup", desc: "Create an event, share the link, and start collecting registrations in under 5 minutes — no complex configuration." },
          { icon: QrCode, title: "Digital QR passes", desc: "Every attendee gets a unique digital QR pass. Staff scans it at entry using any phone browser — no dedicated hardware." },
          { icon: CreditCard, title: "Razorpay — not Stripe", desc: "Payments are collected via Razorpay — the payment gateway that Indian attendees actually use: UPI, cards, net banking." },
          { icon: Users, title: "Attendee management", desc: "Full registration, approval, and check-in management from one simple dashboard." },
          { icon: BarChart3, title: "Real-time attendance", desc: "Live check-in dashboard, attendance rates, and CSV export on paid plans." },
        ],
        callout: {
          badge: "WHY URPASS?",
          title: "Simpler. Built for India. Free to start.",
          description: "Eventbrite is powerful but complex, globally focused, and relies on Stripe which isn't ideal for Indian payment preferences. URPASS is purpose-built for the Indian event market.",
          bullets: [
            "Free plan — no credit card required",
            "Razorpay for Indian payment methods",
            "QR check-in included in all plans",
            "No per-ticket fees from URPASS",
          ],
        },
        useCases: [
          "College events in India", "Workshops", "Hackathons", "Corporate events",
          "Community events", "Paid conferences", "Seminars", "Tech events",
        ],
        faqs: [
          { q: "Why would I use URPASS instead of Eventbrite?", a: "If you're running events in India, URPASS is built for you — INR pricing, Razorpay for UPI/cards, college and community event support, and a free plan that requires no credit card. Eventbrite is globally focused and primarily uses USD and Stripe." },
          { q: "Does URPASS charge per-ticket fees?", a: "No. URPASS charges a monthly subscription. Razorpay charges their standard payment processing fee. There are no per-ticket platform fees from URPASS." },
          { q: "Can I use URPASS for free?", a: "Yes. URPASS has a permanent free tier for 2 events/month with up to 100 registrations/month — no credit card required. You can also try any paid plan free for 30 days." },
          { q: "Does URPASS have QR check-in like Eventbrite?", a: "Yes. Every URPASS plan includes QR-based check-in scanning. Attendees get digital QR passes and staff scans them at the entrance using any phone browser." },
          { q: "Can I accept UPI payments on URPASS?", a: "Yes. URPASS uses Razorpay which supports UPI, Google Pay, PhonePe, credit/debit cards, and net banking." },
          { q: "Is URPASS suitable for small events?", a: "Yes. URPASS is specifically designed for small to medium events — workshops, college fests, hackathons, and community meetups — not just large-scale ticketing." },
        ],
        ctaTitle: "Try URPASS — India's event registration platform",
        ctaDescription: "Free plan · Razorpay payments · QR check-in · Built for India",
      }}
    />
  );
}
