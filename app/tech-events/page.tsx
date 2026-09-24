import type { Metadata } from "next";
import { Cpu, QrCode, Users, ClipboardList, ScanLine, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Tech Event Registration & QR Check-In",
  description: "Run tech event registrations with digital QR passes and fast check-in. Ideal for developer meetups, hackathons, AI events, and tech conferences. Free to start.",
  alternates: { canonical: "https://urpass.space/tech-events" },
  openGraph: {
    title: "Tech Event Registration & QR Check-In | URPASS",
    description: "Tech event registration with QR passes and check-in. Developer-friendly, fast setup.",
    url: "https://urpass.space/tech-events",
  },
};

export default function TechEventsPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/tech-events",
        badge: "TECH EVENTS",
        h1: "Tech Event Registration & QR Check-In",
        description: "Share a registration link, collect developer details, issue digital QR passes, and check in attendees at your tech event. Built with the same simplicity that engineers expect.",
        ctaLabel: "Create your tech event",
        features: [
          { icon: Cpu, title: "Tech-forward registration", desc: "Collect developer-specific details — tech stack, GitHub, experience level — with custom form fields." },
          { icon: ClipboardList, title: "Application-based or open", desc: "Run selective applications with manual review, or open sign-ups with auto-approval." },
          { icon: QrCode, title: "Digital QR pass", desc: "Approved attendees get a unique QR pass on their phone — no printing, no app download." },
          { icon: ScanLine, title: "Fast QR check-in", desc: "Scan attendees at the venue entrance using any phone. Sub-second validation." },
          { icon: Users, title: "Participant management", desc: "Filter attendees by status, search by name, and manage your full participant list." },
          { icon: BarChart3, title: "Live attendance tracking", desc: "Monitor who has arrived and your check-in rate in real time during the event." },
        ],
        callout: {
          badge: "DEVELOPER MEETUPS",
          title: "For events by developers, for developers.",
          description: "From developer meetups to AI summits to hackathons — URPASS handles the logistics so you can focus on the content.",
          bullets: [
            "Open API access on Pro plan",
            "Webhook integration for automation",
            "Custom registration fields",
            "No app install for attendees",
          ],
        },
        useCases: [
          "Developer meetups", "Hackathons", "AI/ML events", "Startup pitches",
          "Open-source events", "Tech conferences", "Product launches", "Engineering workshops",
        ],
        faqs: [
          { q: "Is there an API for integrating URPASS with my event website?", a: "Yes. The Pro plan includes API access so you can programmatically create events, manage attendees, and access check-in data." },
          { q: "Can I collect GitHub or LinkedIn from developers at registration?", a: "Yes. Custom registration fields let you ask for any information — GitHub username, LinkedIn, tech stack, or years of experience." },
          { q: "Does URPASS have webhooks?", a: "Yes. The Pro plan supports webhooks so you can trigger automations when a new attendee registers, is approved, or checks in." },
          { q: "Can I use URPASS for a free tech meetup?", a: "Yes. The free plan covers 2 events/month with up to 100 registrations/month at ₹0 forever — perfect for developer meetups and tech talks." },
          { q: "How do I share the registration link for my tech event?", a: "Your event gets a unique URL. Share it on Discord, Slack, Twitter/X, LinkedIn, Luma, or your community newsletter." },
          { q: "What happens when my meetup fills up?", a: "Registrations close automatically when you reach your capacity limit. You can also manage a waitlist manually." },
        ],
        ctaTitle: "Run your tech event with URPASS",
        ctaDescription: "API access · Webhooks · QR check-in · Developer-friendly · Free to start",
      }}
    />
  );
}
