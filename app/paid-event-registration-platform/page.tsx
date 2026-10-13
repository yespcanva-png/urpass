import type { Metadata } from "next";
import { BarChart3, CreditCard, QrCode, ScanLine, ShieldCheck, Ticket } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Paid Event Registration Software | UrPass",
  description:
    "Create paid event tickets, collect registrations and manage the check-in process. Explore ticketing on UrPass.",
  keywords: [
    "paid event registration platform",
    "paid event registration software",
    "paid event ticketing",
    "event ticket payment",
    "paid ticket QR check-in",
  ],
  alternates: { canonical: "https://urpass.space/paid-event-registration-platform" },
  openGraph: {
    title: "Paid Event Registration Software | UrPass",
    description:
      "Create paid event tickets, collect registrations and manage the check-in process. Explore ticketing on UrPass.",
    url: "https://urpass.space/paid-event-registration-platform",
    locale: "en_IN",
    type: "website",
  },
};

export default function PaidEventRegistrationPlatformPage() {
  return (
    <SEOPage
      config={{
        badge: "PAID REGISTRATION",
        h1: "Paid Event Registration and Ticketing Platform",
        canonicalUrl: "https://urpass.space/paid-event-registration-platform",
        description:
          "Create paid ticket categories, collect attendee registrations, issue digital QR passes and run venue check-in from one UrPass workflow.",
        ctaLabel: "Create Paid Event",
        ctaHref: "/signup",
        secondaryCtaLabel: "Compare Pricing",
        secondaryCtaHref: "/pricing",
        directAnswer: {
          title: "What is a paid event registration platform?",
          summary:
            "A paid event registration platform lets organizers sell tickets or collect registration fees while keeping attendee records connected to admission credentials. UrPass supports paid event workflows by combining ticket setup, attendee registration, digital QR pass issuance, check-in scanning and reporting in one event dashboard.",
          keyPoints: [
            "Create paid ticket categories and capacity limits",
            "Collect attendee details during checkout or registration",
            "Issue digital QR passes to valid attendees",
            "Scan tickets at the venue and monitor live attendance",
          ],
        },
        features: [
          { icon: Ticket, title: "Paid Ticket Types", desc: "Create ticket categories such as General, VIP, Early Bird, Workshop or Delegate." },
          { icon: CreditCard, title: "Payment-Ready Workflow", desc: "Connect registration and payment workflows so paid attendees become valid ticket holders." },
          { icon: QrCode, title: "QR Pass Delivery", desc: "Issue secure digital passes that attendees can present at entry." },
          { icon: ScanLine, title: "Ticket Check-In", desc: "Scan paid attendee passes at the venue using phone-based QR scanning." },
          { icon: ShieldCheck, title: "Duplicate Protection", desc: "Flag already used passes and reduce sharing of screenshots or forwarded tickets." },
          { icon: BarChart3, title: "Sales and Attendance Reports", desc: "Track ticket registrations, attendee records and check-in outcomes together." },
        ],
        steps: [
          { n: "01", title: "Set paid tickets", desc: "Create ticket names, prices, capacities and sale rules." },
          { n: "02", title: "Publish the event", desc: "Share your public registration and ticketing page." },
          { n: "03", title: "Confirm attendees", desc: "Collect attendee details and mark valid ticket holders." },
          { n: "04", title: "Send QR passes", desc: "Give each valid attendee a digital admission pass." },
          { n: "05", title: "Scan at the gate", desc: "Verify paid tickets at entry and monitor attendance." },
        ],
        relatedLinks: [
          { title: "Paid Event Registration Software", href: "/paid-event-registration-software", category: "Product" },
          { title: "Online Event Ticketing Software", href: "/online-event-ticketing-software", category: "Product" },
          { title: "Event Ticket Booking System", href: "/event-ticket-booking-system", category: "Product" },
          { title: "Event Ticketing with UPI", href: "/event-ticketing-with-upi", category: "Product" },
        ],
        faqs: [
          { q: "Can UrPass be used for paid events?", a: "Yes. UrPass supports paid registration and ticketing workflows for events that need attendee records and scannable admission passes." },
          { q: "Can different ticket categories have different capacities?", a: "Yes. Organizers can configure ticket categories with capacity limits and labels." },
          { q: "Can paid tickets be scanned at the venue?", a: "Yes. Valid attendees receive QR passes that staff scan at entry." },
          { q: "Can I see who attended after selling tickets?", a: "Yes. Registration and check-in records stay connected for reporting." },
        ],
        ctaTitle: "Sell tickets and manage entry with UrPass",
        ctaDescription: "Create a paid event workflow that stays connected from checkout to check-in.",
      }}
    />
  );
}
