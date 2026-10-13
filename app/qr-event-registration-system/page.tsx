import type { Metadata } from "next";
import { ClipboardList, QrCode, ScanLine, ShieldCheck, Smartphone, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "QR Event Registration System | UrPass",
  description:
    "Connect online registration with unique QR passes and fast on-site scanning. Set up your event with UrPass.",
  keywords: [
    "QR event registration system",
    "QR event registration",
    "QR code event registration",
    "event registration with QR code",
    "QR check-in system",
  ],
  alternates: { canonical: "https://urpass.space/qr-event-registration-system" },
  openGraph: {
    title: "QR Event Registration System | UrPass",
    description:
      "Connect online registration with unique QR passes and fast on-site scanning. Set up your event with UrPass.",
    url: "https://urpass.space/qr-event-registration-system",
    locale: "en_IN",
    type: "website",
  },
};

export default function QrEventRegistrationSystemPage() {
  return (
    <SEOPage
      config={{
        badge: "QR REGISTRATION SYSTEM",
        h1: "QR Event Registration and Check-In System",
        canonicalUrl: "https://urpass.space/qr-event-registration-system",
        description:
          "Use UrPass to collect attendee registrations, issue unique QR passes and validate those passes at the event entrance with fast mobile scanning.",
        ctaLabel: "Create QR Registration",
        ctaHref: "/signup",
        directAnswer: {
          title: "How does a QR event registration system work?",
          summary:
            "A QR event registration system collects attendee information online and issues each valid attendee a unique QR credential. At the venue, staff scan the QR pass to confirm entry and block duplicate use. UrPass connects the full workflow: registration form, attendee approval, pass delivery, scanning and attendance reporting.",
          keyPoints: [
            "Collect registrations through a hosted event page",
            "Generate unique QR passes for approved attendees",
            "Scan QR passes at entry using mobile devices",
            "Track attendance and duplicate attempts in real time",
          ],
        },
        features: [
          { icon: ClipboardList, title: "Online Registration Forms", desc: "Capture attendee details, custom answers and ticket information before the event." },
          { icon: QrCode, title: "Unique QR Passes", desc: "Issue a distinct QR credential for each attendee to support secure event entry." },
          { icon: Smartphone, title: "Mobile Pass Delivery", desc: "Attendees can open their pass on a phone without installing a separate app." },
          { icon: ScanLine, title: "Phone-Based Scanning", desc: "Gate teams scan QR passes using browser-based camera scanning." },
          { icon: ShieldCheck, title: "Duplicate Protection", desc: "Already scanned passes are flagged to reduce ticket sharing and unauthorized entry." },
          { icon: Users, title: "Attendance Records", desc: "Keep registration and check-in data connected for exports and post-event review." },
        ],
        steps: [
          { n: "01", title: "Publish registration", desc: "Create a public event page with your required attendee fields." },
          { n: "02", title: "Approve or accept attendees", desc: "Use automatic or manual workflows depending on your event." },
          { n: "03", title: "Send QR passes", desc: "Give each valid attendee a digital pass with a scannable QR code." },
          { n: "04", title: "Scan at the entrance", desc: "Validate the QR pass when attendees arrive." },
          { n: "05", title: "Review attendance", desc: "Use check-in records for reporting, certificates or sponsor updates." },
        ],
        relatedLinks: [
          { title: "QR Code Event Registration System", href: "/qr-code-event-registration-system", category: "Product" },
          { title: "Event Registration with QR Code", href: "/event-registration-with-qr-code", category: "Product" },
          { title: "Event Check-In Software", href: "/event-check-in-software", category: "Product" },
          { title: "What is QR Event Check-In?", href: "/guides/what-is-qr-event-check-in", category: "Guide" },
        ],
        faqs: [
          { q: "Can UrPass generate QR codes for event attendees?", a: "Yes. UrPass issues unique digital QR passes for attendees after registration, approval or ticket purchase." },
          { q: "Can a QR pass be scanned more than once?", a: "The scanner flags duplicate scans so staff can see when a pass has already been used." },
          { q: "Do attendees need to print their QR pass?", a: "No. Attendees can present the digital QR pass on a phone." },
          { q: "Does this work for colleges and conferences?", a: "Yes. QR registration and check-in workflows are suitable for college events, workshops, conferences, summits and community events." },
        ],
        ctaTitle: "Launch a QR registration workflow",
        ctaDescription: "Collect registrations, issue QR passes and scan attendees at the door.",
      }}
    />
  );
}
