import type { Metadata } from "next";
import { Globe, ShieldCheck, Palette, Layers, Ticket, CheckCircle2, Lock, Sparkles } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "White-Label Event Registration for Agencies | URPASS",
  description:
    "Complete white-label event registration and digital ticketing platform for agencies. Custom domains, custom email sender identities, client branding, and zero platform footprint.",
  keywords: [
    "white label event registration for agencies",
    "white label event ticketing",
    "unbranded event registration software",
    "custom domain event registration",
    "agency white label event platform",
  ],
  alternates: { canonical: "https://urpass.space/event-agency-white-label-registration" },
  openGraph: {
    title: "White-Label Event Registration for Agencies | URPASS",
    description: "Launch unbranded, custom-domain event registration and ticketing portals under your agency's name.",
    url: "https://urpass.space/event-agency-white-label-registration",
    locale: "en_IN",
    type: "website",
  },
};

export default function EventAgencyWhiteLabelRegistrationPage() {
  return (
    <SEOPage
      config={{
        badge: "100% UNBRANDED INFRASTRUCTURE",
        h1: "White-Label Event Registration for Agencies",
        canonicalUrl: "https://urpass.space/event-agency-white-label-registration",
        description:
          "Offer enterprise event ticketing and check-in as your own product. Custom client domains, custom transactional email sender addresses, zero platform watermarks, and client data sovereignty.",
        ctaLabel: "Discuss White-Label Setup",
        ctaHref: "/contact?type=white-label",
        secondaryCtaLabel: "Book Agency Demo",
        secondaryCtaHref: "/contact?type=agency-demo",
        directAnswer: {
          title: "How Does White-Label Event Registration Work on URPASS?",
          summary:
            "URPASS allows event management agencies to deliver fully unbranded event technology to their corporate clients. Your registration pages resolve under your custom domain (e.g. events.youragency.com), confirmation emails and digital QR passes dispatch from your company email domain, invoices feature your client's legal entity, and there are zero consumer marketplace promotions.",
          keyPoints: [
            "Custom Domain Support: Map any subdomain with automated SSL security certificates",
            "Custom Email Identity: Send passes from notifications@youragency.com or events@client.com",
            "Zero Platform Footprint: Remove all external platform branding and footer links on eligible plans",
            "Client Data Isolation: Your client's attendee database is strictly confidential and never aggregated",
          ],
        },
        features: [
          { icon: Globe, title: "Custom Root & Subdomains", desc: "Map portals to your agency or client domain with automated HTTPS certificates." },
          { icon: Palette, title: "Total Theme Customization", desc: "Match precise client hex colors, typography, header banners, and favicon branding." },
          { icon: ShieldCheck, title: "Custom Sender Email", desc: "Send confirmation emails and digital tickets from your verified agency domain via custom SMTP or Resend." },
          { icon: Layers, title: "Isolated Client Environments", desc: "Keep each client's attendees, discount codes, financials, and staff permissions completely segregated." },
          { icon: Ticket, title: "Bespoke Pass & Badge Studio", desc: "Generate client-branded digital wallet passes, printable PDF badges, and thermal wristbands." },
          { icon: Lock, title: "Enterprise Security & SLA", desc: "SOC2-aligned cloud infrastructure with role-based access control and dedicated uptime guarantees." },
        ],
        faqs: [
          { q: "Is the UrPass name visible on white-label tickets or emails?", a: "No. On White-Label Agency plans, all platform badges, footer logos, and URLs are removed or replaced with your agency and client branding." },
          { q: "Can we connect multiple payment gateways for different clients?", a: "Yes. Each workspace can link to a distinct Razorpay or Stripe account, guaranteeing that ticket proceeds deposit directly into that specific client's bank account." },
          { q: "Can we resell this event technology to our clients?", a: "Absolutely. Many agency partners package our registration, badge printing, and gate scanning as a turnkey digital service within their master event production contracts." },
        ],
        relatedLinks: [
          { title: "Event Agency Ticketing Platform", href: "/event-agency-ticketing-platform", category: "Product" },
          { title: "Event Agency Registration Software", href: "/event-agency-registration-software", category: "Product" },
          { title: "Multi-Client Event Dashboard", href: "/multi-client-event-management-software", category: "Product" },
          { title: "Corporate Event Check-In Software", href: "/corporate-event-check-in-software", category: "Use Case" },
        ],
      }}
    />
  );
}
