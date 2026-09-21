import type { Metadata } from "next";
import { QrCode, Link2, ClipboardList, Ticket, ScanLine, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "QR Code Event Registration System",
  description: "Connect event registration directly to QR code entry. Attendees register online, receive a unique QR pass, and scan in at the entrance. No manual steps.",
  alternates: { canonical: "https://urpass.space/qr-event-registration" },
  openGraph: {
    title: "QR Code Event Registration System | URPASS",
    description: "From registration link to QR pass to entry scan — one connected system.",
    url: "https://urpass.space/qr-event-registration",
  },
};

export default function QrEventRegistrationPage() {
  return (
    <SEOPage
      config={{
        badge: "QR CODE EVENT REGISTRATION",
        h1: "Registration to QR Check-In in One Platform",
        description: "Attendees register through your public link. They get a QR pass on approval. You scan it at the door. The entire flow — registration, pass, entry — in one place.",
        ctaLabel: "Create your registration link",
        features: [
          { icon: Link2, title: "Public registration link", desc: "Share a single link for attendees to register. No account required on their end." },
          { icon: ClipboardList, title: "Custom registration form", desc: "Collect the details you need — name, email, phone, college, or any custom question." },
          { icon: Ticket, title: "QR pass on approval", desc: "Approved attendees receive a digital QR pass immediately. No manual sending." },
          { icon: QrCode, title: "Unique per attendee", desc: "Every pass has a unique QR code tied to that specific registration. Sharing or duplicating is blocked." },
          { icon: ScanLine, title: "Scan at entry", desc: "Staff opens the URPASS scanner on any phone and scans passes at the entrance. No extra hardware." },
          { icon: BarChart3, title: "Live registration stats", desc: "See total registrations, approvals, and check-ins in real time as your event fills up." },
        ],
        callout: {
          badge: "THE FULL FLOW",
          title: "One link from registration to entry.",
          description: "Share your event registration link. Attendees fill in their details. You review and approve. They get a QR pass. You scan it at the door. That's the whole flow.",
          bullets: [
            "No attendee app required",
            "Approvals with one click",
            "QR pass delivered instantly",
            "Real-time check-in dashboard",
          ],
        },
        useCases: [
          "College events", "Hackathons", "Workshops", "Conferences",
          "Seminars", "Corporate events", "Tech events", "Community events",
        ],
        faqs: [
          { q: "How does QR event registration work?", a: "With URPASS, you create an event and share a registration link. Attendees fill in their details. You review and approve applications. Approved attendees receive a unique QR pass. Staff scans the QR at your event entrance." },
          { q: "Can I set auto-approval so passes are issued instantly?", a: "Yes. Enable auto-approval for your event and attendees will receive their QR pass the moment they submit their registration." },
          { q: "How does the QR pass work for attendees?", a: "Attendees receive a link to their digital pass. They open it on their phone and show the QR code at the entrance. No app needed." },
          { q: "Can I share the registration link on social media?", a: "Yes. The registration link is a public URL you can share anywhere — WhatsApp, Instagram, email, LinkedIn, or your college notice board." },
          { q: "How quickly do attendees get their QR pass?", a: "With manual approval, passes are issued as soon as you approve the application. With auto-approval, passes are issued within seconds of registration." },
          { q: "Is there a limit on registrations?", a: "Free plan supports up to 50 attendees. Starter supports 500/event. Pro supports 2,000/event." },
        ],
        ctaTitle: "Set up QR registration for your next event",
        ctaDescription: "Public registration link · Instant QR passes · Live check-in",
      }}
    />
  );
}
