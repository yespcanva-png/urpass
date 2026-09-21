import type { Metadata } from "next";
import { CheckCircle2, Mail, Smartphone, Link2, QrCode, Share2, Download } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "How to Send QR Tickets to Attendees: Best Delivery Methods",
  description: "You can send QR tickets to attendees by sharing an instant web pass link directly upon form completion, sending confirmation emails with embedded pass URLs, or providing mobile-optimized wallet passes that attendees can save to Apple Wallet or their camera roll.",
  keywords: [
    "how to send qr tickets to attendees",
    "QR event check-in guide",
    "digital event pass tutorial",
    "event check-in best practices",
    "college fest check-in",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/guides/how-to-send-qr-tickets-to-attendees" },
  openGraph: {
    title: "How to Send QR Tickets to Attendees: Best Delivery Methods | URPASS",
    description: "You can send QR tickets to attendees by sharing an instant web pass link directly upon form completion, sending confirmation emails with embedded pass URLs, or providing mobile-optimized wallet passes that attendees can save to Apple Wallet or their camera roll.",
    url: "https://urpass.space/guides/how-to-send-qr-tickets-to-attendees",
    locale: "en_IN",
    type: "article",
  },
};

export default function GuidePage() {
  return (
    <SEOPage
      config={{
        badge: "DELIVERY GUIDE",
        h1: "How to Send QR Tickets to Attendees",
        canonicalUrl: "https://urpass.space/guides/how-to-send-qr-tickets-to-attendees",
        description: "You can send QR tickets to attendees by sharing an instant web pass link directly upon form completion, sending confirmation emails with embedded pass URLs, or providing mobile-optimized wallet passes that attendees can save to Apple Wallet or their camera roll.",
        ctaLabel: "Send QR tickets free",
        features: [
          { icon: Mail, title: "Instant Confirmation Link", desc: "Upon registration or ticket purchase, the confirmation screen immediately displays a direct link to their digital pass." },
          { icon: Smartphone, title: "Direct Mobile URL", desc: "Attendees receive a clean, permanent web link that displays their dynamic pass with live event updates." },
          { icon: Link2, title: "Apple Wallet Integration", desc: "Attendees on iOS devices can add their pass directly to Apple Wallet for easy lock-screen access." },
          { icon: QrCode, title: "Save as Image / Screenshot", desc: "The high-contrast QR code is optimized so attendees can take a quick screenshot and present it offline." },
          { icon: Share2, title: "Printable PDF Download", desc: "Attendees who prefer physical tickets can download and print a formatted PDF pass with folding guides." },
          { icon: Download, title: "Automated Resend Options", desc: "Organizers can easily resend or copy pass links from the dashboard if an attendee misplaces their confirmation." },
        ],
        steps: [
          { n: "01", title: "Set Up Event", desc: "Configure your event registration form and ticketing details on URPASS." },
          { n: "02", title: "Attendee Registers", desc: "Participant completes the online registration form or ticket purchase." },
          { n: "03", title: "Pass Generated", desc: "System creates a unique, encrypted QR code tied to the attendee profile." },
          { n: "04", title: "Pass Delivered", desc: "Attendee receives instant pass link on confirmation screen and email." },
          { n: "05", title: "Scanned at Entrance", desc: "Attendee shows pass on phone; volunteer scans code in under 0.3 seconds." },
        ],
        callout: {
          badge: "FRICTIONLESS ACCESS",
          title: "Never lose an attendee ticket again.",
          description: "Printed paper tickets get left at home, and heavy mobile apps get uninstalled. URPASS digital passes live on responsive web links that attendees can access anywhere.",
          bullets: [
            "Works on any mobile browser without downloading an app",
            "Supported on Apple Wallet, Android home screen, and PDF",
            "Dynamic updates if venue, room, or timing changes",
            "Single-use security preventing forwarded pass fraud",
          ],
        },
        useCases: [
          "Conferences & Summits",
          "College Culturals & Fests",
          "Professional Masterclasses",
          "VIP Networking Dinners",
          "Hackathon Admissions",
          "Community Meetups",
        ],
        faqs: [
          { q: "Do attendees need to download an app to receive their ticket?", a: "No. The ticket is delivered as a responsive web link that opens directly in Safari, Chrome, or any mobile browser." },
          { q: "What happens if an attendee loses their confirmation link?", a: "Organizers can look up the attendee by name or email on the dashboard and instantly copy or resend their pass URL." },
          { q: "Can an attendee save the pass for offline viewing at the venue?", a: "Yes. Attendees can save the pass to Apple Wallet, bookmark it, or take a screenshot to show offline at the door." },
          { q: "Can we customize the branding of the digital pass?", a: "Yes. Organizers can customize pass colors, upload logos, and configure visible attendee fields." },
        ],
        ctaTitle: "Streamline your event check-in with URPASS",
        ctaDescription: "Permanent free tier · Zero app downloads · Fast sub-second scanning",
      }}
    />
  );
}
