import type { Metadata } from "next";
import { Mic2, Ticket, QrCode, ScanLine, Users, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Conference Registration & QR Check-In Software",
  description: "Manage conference registrations, multiple ticket types, speaker passes, and QR entry scanning. Handle large conferences with fast QR check-in. Free to start.",
  alternates: { canonical: "https://urpass.space/conferences" },
  openGraph: {
    title: "Conference Registration & QR Check-In Software | URPASS",
    description: "Conference registration with multiple pass types and QR entry scanning.",
    url: "https://urpass.space/conferences",
  },
};

export default function ConferencesPage() {
  return (
    <SEOPage
      config={{
        badge: "CONFERENCES",
        h1: "Conference Registration & QR Check-In",
        description: "Run conference registrations with multiple ticket types, speaker passes, and fast QR entry scanning. Manage hundreds of delegates from a single dashboard.",
        ctaLabel: "Register your conference",
        features: [
          { icon: Mic2, title: "Multiple pass types", desc: "Create Delegate, Speaker, VIP, Organizer, and Sponsor passes with individual capacity limits." },
          { icon: Ticket, title: "Paid conference ticketing", desc: "Collect delegate fees via Razorpay. Passes issued automatically on payment." },
          { icon: QrCode, title: "Unique QR per delegate", desc: "Every confirmed delegate receives a unique digital QR pass for entry." },
          { icon: ScanLine, title: "Multi-gate QR check-in", desc: "Manage multiple entry gates simultaneously with staff scanning on any phone." },
          { icon: Users, title: "Full delegate management", desc: "View and manage all registrations, speakers, and VIP attendees from one dashboard." },
          { icon: BarChart3, title: "Real-time attendance data", desc: "Track delegate arrivals, check-in rates, and attendance by pass type in real time." },
        ],
        callout: {
          badge: "CONFERENCE-SCALE",
          title: "Manage delegates and speakers in one place.",
          description: "URPASS handles your full conference attendee lifecycle — delegate registration, speaker pass management, payment collection, and fast QR check-in at the entrance.",
          bullets: [
            "Separate pass types for speakers and delegates",
            "Paid ticketing with Razorpay",
            "Multi-gate simultaneous scanning",
            "Real-time check-in dashboard",
          ],
        },
        useCases: [
          "Tech conferences", "Academic conferences", "Industry summits", "Business conferences",
          "Developer conferences", "Medical conferences", "Education conferences", "Startup events",
        ],
        faqs: [
          { q: "Can I create different pass types for speakers, delegates, and sponsors?", a: "Yes. You can create multiple ticket types — Delegate, Speaker, VIP, Sponsor — each with their own capacity, price, and description." },
          { q: "Does URPASS support paid conference ticketing?", a: "Yes. Starter and Pro plans support paid ticketing with Razorpay. Delegates pay online and receive QR passes automatically." },
          { q: "How many gates can I run simultaneously?", a: "Unlimited. Every staff member with a phone can serve as a separate scanner, all syncing to the same dashboard." },
          { q: "Can I track which sessions or areas delegates accessed?", a: "URPASS handles event-level check-in. Session or zone-level access tracking is a Pro feature roadmap item." },
          { q: "Can speakers register separately from delegates?", a: "Yes. Create a private registration link or ticket type for speakers, separate from the public delegate registration." },
          { q: "What is the maximum attendee capacity for conferences?", a: "The Pro plan supports up to 2,000 attendees per event. Contact us for enterprise capacity requirements." },
        ],
        ctaTitle: "Make your next conference run smoothly",
        ctaDescription: "Multiple pass types · QR entry · Payment collection · Real-time tracking",
      }}
    />
  );
}
