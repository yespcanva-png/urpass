import type { Metadata } from "next";
import { Ticket, QrCode, Zap, Smartphone, Palette, Mail } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Digital Event Pass & QR Pass Generator | URPASS",
  description: "Create digital QR passes for event attendees instantly. Attendees receive a mobile-ready digital pass with event details, QR code, and attendee name. No printing needed.",
  alternates: { canonical: "https://urpass.space/digital-event-pass" },
  openGraph: {
    title: "Digital Event Pass & QR Pass Generator | URPASS",
    description: "Generate digital QR passes for your event attendees in one click. Works in any mobile browser.",
    url: "https://urpass.space/digital-event-pass",
  },
};

export default function DigitalEventPassPage() {
  return (
    <SEOPage
      config={{
        badge: "DIGITAL EVENT PASS",
        h1: "Create Digital QR Passes for Events",
        description: "Issue each attendee a unique digital QR pass the moment you approve their application. They open it in any browser — no app download, no printing.",
        ctaLabel: "Generate passes free",
        features: [
          { icon: Ticket, title: "Instant pass generation", desc: "Approve an attendee and their digital QR pass is ready immediately — no manual work." },
          { icon: QrCode, title: "Unique scannable QR", desc: "Every pass has a unique QR code that your staff scans at the entrance for instant validation." },
          { icon: Smartphone, title: "Works in any browser", desc: "Attendees open their pass on any smartphone browser. No app download, no account needed." },
          { icon: Palette, title: "Branded pass design", desc: "Pro plan users can add their organisation name, logo, and custom brand colour to every pass." },
          { icon: Mail, title: "Pass delivered by link", desc: "Attendees get a direct link to their pass. They can bookmark it, screenshot it, or share it." },
          { icon: Zap, title: "Scannable at entry", desc: "Pass QR codes are validated instantly at your event entrance using the URPASS scanner." },
        ],
        callout: {
          badge: "NO PRINTING REQUIRED",
          title: "Digital passes. Scanned at the door.",
          description: "Every approved attendee gets a mobile-ready digital pass with event name, date, venue, attendee name, pass type, and a unique QR code.",
          bullets: [
            "Opens in any mobile browser",
            "QR code validated at check-in",
            "Organiser branding on Pro plan",
            "Instant delivery via registration link",
          ],
        },
        useCases: [
          "Workshops", "College events", "Conferences", "Hackathons",
          "Seminars", "Corporate events", "Fests", "Community meetups",
        ],
        faqs: [
          { q: "What is a digital event pass?", a: "A digital event pass is a mobile-ready page that contains your event details, the attendee's name and pass type, and a unique QR code. Attendees show it on their phone — staff scans the QR for entry." },
          { q: "How does an attendee receive their pass?", a: "After their application is approved, attendees receive a direct link to their digital pass. The link can be bookmarked, screenshotted, or accessed at any time." },
          { q: "Do attendees need to print their pass?", a: "No. The digital pass is designed to be shown on a smartphone screen. No printing is needed." },
          { q: "Can one QR code be used by multiple people?", a: "No. Each QR code is unique to a specific attendee and single-use. Sharing a pass QR with someone else will show as 'Already Checked In' on the second scan." },
          { q: "Can I customise the pass design?", a: "Pro plan users can add their organisation name, logo URL, and a custom brand colour which appears in the pass header." },
          { q: "What if the attendee loses access to their pass link?", a: "Attendees can re-access their pass from the confirmation page or directly via the pass URL they received." },
        ],
        ctaTitle: "Start issuing digital passes today",
        ctaDescription: "Instant QR passes · Mobile-ready · Free plan available",
      }}
    />
  );
}
