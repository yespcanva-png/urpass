import type { Metadata } from "next";
import { Users, Ticket, QrCode, ShieldCheck, Palette, FileText, Globe, Smartphone } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Agency Registration Software | Client Branded Registration Pages",
  description:
    "Custom event registration software for event management companies. Build bespoke branded forms, collect attendee custom fields, and issue branded digital passes.",
  keywords: [
    "event agency registration software",
    "event company registration tool",
    "custom event registration for agencies",
    "client branded event registration",
    "white label registration forms for events",
  ],
  alternates: { canonical: "https://urpass.space/event-agency-registration-software" },
  openGraph: {
    title: "Event Agency Registration Software | URPASS",
    description: "Build client-branded event registration portals with custom data capture and zero marketplace lock-in.",
    url: "https://urpass.space/event-agency-registration-software",
    locale: "en_IN",
    type: "website",
  },
};

export default function EventAgencyRegistrationSoftwarePage() {
  return (
    <SEOPage
      config={{
        badge: "BESPOKE AGENCY WORKFLOWS",
        h1: "Event Agency Registration Software",
        canonicalUrl: "https://urpass.space/event-agency-registration-software",
        description:
          "Build elegant, client-branded registration journeys for conferences, galas, brand activations, and private summits. Custom forms, conditional questions, multi-tier ticketing, and zero external branding.",
        ctaLabel: "Book Agency Demo",
        ctaHref: "/contact?type=agency-demo",
        secondaryCtaLabel: "Explore Agency Hub",
        secondaryCtaHref: "/event-agency-ticketing-platform",
        directAnswer: {
          title: "Why Event Agencies Choose URPASS for Client Registrations",
          summary:
            "Standard registration builders either lack enterprise gate check-in or slap their own logo and advertisements all over your client's page. URPASS gives event companies an agency-first registration engine featuring custom CSS styling, deep registration question logic, instant UPI/card checkout, automated GST receipts, and seamless sync with gate scanners.",
          keyPoints: [
            "100% Client Branding: Clean, elegant registration portals styled to client brand books",
            "Complex Field Logic: Collect dietary preferences, company designations, workshops, and GSTIN numbers",
            "Multi-Tier Badging: Map VIP, Speaker, Sponsor, and Delegate tickets to custom pass designs automatically",
            "Integrated Gateway: Funds settle directly into client merchant accounts without intermediary holding",
          ],
        },
        features: [
          { icon: Palette, title: "Bespoke Styling", desc: "Customize accent colors, cover banners, hero typography, and button layouts to match client marketing assets." },
          { icon: FileText, title: "Dynamic Custom Fields", desc: "Build multi-step forms capturing designations, dietary needs, session selections, and company tax IDs." },
          { icon: QrCode, title: "Automated Pass Dispatch", desc: "Attendees receive personalized digital passes with QR codes via email and WhatsApp upon approval or payment." },
          { icon: ShieldCheck, title: "Approval & Vetting Flow", desc: "Hold applications for manual review before issuing tickets for private client summits and VIP galas." },
          { icon: Globe, title: "Custom Domain Mapping", desc: "Publish portals on client subdomains like register.clientannualmeet.com with automated SSL." },
          { icon: Smartphone, title: "Connected Gate Check-In", desc: "Registrations sync live to on-ground scanner terminals for 0.28s guest admittance." },
        ],
        faqs: [
          { q: "Can we collect corporate GSTIN details during checkout?", a: "Yes. B2B ticketing flows collect company legal name, GSTIN, and state code, generating automated GST tax invoices with reverse charge details." },
          { q: "Can we embed the registration widget into our client's existing website?", a: "Yes. Use our lightweight embed code or iframe to host the registration form seamlessly on WordPress, Webflow, or custom client landing pages." },
          { q: "Can we manage approval-only guest lists?", a: "Yes. Enable application mode so delegates submit registration requests, which your team or client can approve or decline before passes are issued." },
        ],
        relatedLinks: [
          { title: "Event Agency Ticketing Platform", href: "/event-agency-ticketing-platform", category: "Product" },
          { title: "White-Label Event Registration", href: "/event-agency-white-label-registration", category: "Product" },
          { title: "Multi-Client Event Dashboard", href: "/multi-client-event-management-software", category: "Product" },
          { title: "Corporate Event Check-In Software", href: "/corporate-event-check-in-software", category: "Use Case" },
        ],
      }}
    />
  );
}
