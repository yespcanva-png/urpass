import type { Metadata } from "next";
import { PlusCircle, Share2, CheckSquare, QrCode, ScanLine, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "How to Create QR Passes for an Event | URPASS",
  description: "Step-by-step guide to creating digital QR passes for your event attendees. Create an event, collect registrations, approve attendees, and issue QR passes in minutes.",
  alternates: { canonical: "https://urpass.space/guides/how-to-create-qr-event-pass" },
  openGraph: {
    title: "How to Create QR Passes for an Event | URPASS",
    description: "Step-by-step guide to creating QR passes for event attendees using URPASS.",
    url: "https://urpass.space/guides/how-to-create-qr-event-pass",
  },
};

export default function HowToCreateQrEventPassPage() {
  return (
    <SEOPage
      config={{
        badge: "HOW-TO GUIDE",
        h1: "How to Create QR Passes for an Event",
        description: "Creating QR passes for your event takes 5 minutes with URPASS. Here's the complete step-by-step process — from event creation to QR scanning at the entrance.",
        ctaLabel: "Create QR passes now",
        steps: [
          { n: "01", title: "Create event", desc: "Sign up for URPASS, create your event, add the event name, date, venue, and description." },
          { n: "02", title: "Set up registration", desc: "Configure your registration form fields — what information you want to collect from attendees." },
          { n: "03", title: "Share the link", desc: "Publish your event and share the registration link on WhatsApp, email, Instagram, or anywhere." },
          { n: "04", title: "Approve attendees", desc: "Review applications and approve them — passes are issued automatically on approval." },
          { n: "05", title: "Scan at entry", desc: "Use the URPASS scanner on any phone to scan QR passes at your event entrance." },
        ],
        features: [
          { icon: PlusCircle, title: "Step 1 — Create your event", desc: "Sign up for URPASS (free). Create an event with name, date, time, venue, and capacity. Choose manual or auto-approval." },
          { icon: Share2, title: "Step 2 — Share the link", desc: "Your event gets a unique registration URL. Share it however you reach your audience — WhatsApp, email, Instagram, posters." },
          { icon: CheckSquare, title: "Step 3 — Approve applications", desc: "Attendees apply through the public link. You review each application and approve it. QR passes are generated instantly." },
          { icon: QrCode, title: "Step 4 — QR pass is ready", desc: "Each approved attendee gets a digital QR pass they can open on their phone. No printing, no app download." },
          { icon: ScanLine, title: "Step 5 — Scan at the door", desc: "Open the URPASS scanner in a browser on any phone at your event. Scan each attendee's QR. Instant valid/invalid." },
          { icon: BarChart3, title: "Step 6 — Track attendance", desc: "Watch your check-in dashboard update live as attendees arrive. Export attendance data at the end." },
        ],
        callout: {
          badge: "AUTO-APPROVAL OPTION",
          title: "Skip the approval step for open events.",
          description: "If you want attendees to receive their QR pass immediately on registration — without manual approval — enable auto-approval in your event settings.",
          bullets: [
            "Enable auto-approval in event settings",
            "QR pass issued within seconds of registration",
            "Attendees get their pass instantly",
            "You can still see all registrations in your dashboard",
          ],
        },
        useCases: [
          "College workshops", "Hackathons", "Tech events", "Seminars",
          "Corporate events", "Community meetups", "Conferences", "Fests",
        ],
        faqs: [
          { q: "How long does it take to create QR passes for an event?", a: "Under 5 minutes. Create an account, set up your event, and your registration link is ready. QR passes are generated automatically as you approve attendees." },
          { q: "Do I need to create QR codes manually?", a: "No. URPASS generates unique QR codes automatically for every approved attendee. You just approve — the system handles everything else." },
          { q: "Can I create QR passes without technical skills?", a: "Yes. URPASS is designed for anyone to use. No coding or technical knowledge is required." },
          { q: "What does a QR event pass look like?", a: "It's a mobile-friendly web page showing the event name, date, venue, attendee name, pass type, and a scannable QR code. Attendees open it on their phone." },
          { q: "Can I add my organisation's branding to the QR passes?", a: "Yes. Pro plan users can add their organisation name, logo, and brand colour to every QR pass." },
          { q: "Is creating QR passes for events free?", a: "Yes. The free plan lets you create QR passes for one event with up to 50 attendees at no cost." },
        ],
        ctaTitle: "Create your first QR event passes",
        ctaDescription: "5-minute setup · Automatic QR generation · Free plan available",
      }}
    />
  );
}
