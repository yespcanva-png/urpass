import type { Metadata } from "next";
import { Building2, Globe, ShieldCheck, Ticket, Users, BarChart3, Palette, Layers, QrCode, Lock } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Agency Ticketing Platform | White-Label Infrastructure for Event Companies",
  description:
    "White-label event ticketing and registration platform engineered for event management companies and agencies. You manage the client — UrPass powers the technology behind your brand.",
  keywords: [
    "event agency ticketing platform",
    "event management company ticketing software",
    "white label event registration for agencies",
    "multi client event ticketing system",
    "agency event management infrastructure",
    "branded ticket platform for agencies",
  ],
  alternates: { canonical: "https://urpass.space/event-agency-ticketing-platform" },
  openGraph: {
    title: "Event Agency Ticketing Platform | URPASS",
    description: "You manage the client. UrPass powers the registration, passes and event entry behind your brand.",
    url: "https://urpass.space/event-agency-ticketing-platform",
    locale: "en_IN",
    type: "website",
  },
};

export default function EventAgencyTicketingPlatformPage() {
  return (
    <SEOPage
      config={{
        badge: "AGENCY-FIRST INFRASTRUCTURE",
        h1: "Event Agency Ticketing Platform & White-Label Infrastructure",
        canonicalUrl: "https://urpass.space/event-agency-ticketing-platform",
        description:
          "Power ticketing, registration, and QR entrance operations for all your corporate and experiential clients from a unified multi-client console. You manage the client relationship — UrPass powers the registration, digital passes, and event entry behind your brand.",
        ctaLabel: "Book Agency Demo",
        ctaHref: "/contact?type=agency-demo",
        secondaryCtaLabel: "Discuss White-Label Setup",
        secondaryCtaHref: "/contact?type=white-label",
        directAnswer: {
          title: "How Does URPASS Partner with Event Management Companies?",
          summary:
            "URPASS acts as white-label technology infrastructure for event agencies and experiential production houses. Instead of pushing your clients to third-party marketplaces where competing events are advertised, URPASS allows agencies to host fully branded registration portals, route ticket revenues directly into client bank accounts, manage multiple client workspaces, and deploy fast QR check-in gates bearing only the agency and client identity.",
          keyPoints: [
            "White-Label Integrity: You manage the client — UrPass runs quietly behind your brand with zero marketplace distractions",
            "Multi-Client Workspaces: Manage 50+ client accounts with isolated attendee databases, custom domains, and permissions",
            "Direct Client Payouts: Route funds directly to client Stripe/Razorpay accounts with automated GST invoices",
            "Onsite Turnkey Operations: Sub-0.28s mobile gate scanning, badge studio, and real-time live ops dashboard",
          ],
        },
        keyFactsTable: {
          title: "Agency Infrastructure vs Generic Consumer Ticket Portals",
          subtitle: "Why India and global event management agencies build on URPASS.",
          headers: ["Agency Capability", "URPASS Agency Infrastructure", "Consumer Ticket Marketplaces"],
          rows: [
            { col1: "Brand Ownership", col2: "100% Agency & Client branding (custom domain, zero competitor ads)", col3: "Competitor events advertised to your attendees" },
            { col1: "Attendee Data Privacy", col2: "Full agency ownership — data never shared, marketed to, or monetized", col3: "Attendee emails captured into portal's marketing list" },
            { col1: "Multi-Client Management", col2: "Single agency login with segregated client workspaces and RBAC", col3: "Juggling individual user logins for each client" },
            { col1: "Client Billing & GST", col2: "Automated GST compliant B2B invoices emitted in client's legal name", col3: "Generic ticketing invoices with portal branding" },
            { col1: "Revenue Routing", col2: "Direct gateway settlement into client bank accounts (T+1/T+2)", col3: "Platform holds ticket funds for weeks post-event" },
            { col1: "Platform Commission", col2: "Predictable flat SaaS pricing — 0% ticket cut on eligible plans", col3: "High 6% to 10% commission cuts per ticket" },
          ],
        },
        features: [
          { icon: Palette, title: "Client-Branded Registration", desc: "Embed registration forms with client brand guidelines, custom hex colors, typography, and zero third-party badges." },
          { icon: Globe, title: "Custom Domain Portals", desc: "Host registration pages under tickets.youragency.com or events.clientbrand.com with automated SSL certificates." },
          { icon: Layers, title: "Multi-Client Dashboard", desc: "Manage dozens of client brands from one master console with granular team and freelancer permission boundaries." },
          { icon: ShieldCheck, title: "Full Data Ownership", desc: "Your client's attendee list belongs strictly to your agency. We never retarget or market to your delegates." },
          { icon: QrCode, title: "Turnkey Badge Studio", desc: "Generate print-ready event badges, lanyard cards, or mobile Apple/Google Wallet passes in seconds." },
          { icon: BarChart3, title: "Automated Client Reports", desc: "Deliver executive post-event analytics, check-in curves, and gate performance summaries with your agency logo." },
        ],
        deepDiveSections: [
          {
            badge: "AGENCY STRATEGY",
            title: "You Manage the Client. UrPass Powers the Technology Behind Your Brand.",
            paragraphs: [
              "As an event management company, your reputation relies on client trust, exquisite attendee experience, and operational precision. Sending clients to consumer ticketing marketplaces erodes brand equity and exposes their corporate attendees to competing events.",
              "URPASS gives your agency an enterprise technology moat. You deliver custom registration flows, seamless UPI/credit card ticketing, automated GST billing, and military-grade gate access without having to hire an internal software engineering team.",
            ],
            bullets: [
              "Deliver premium event tech as a high-margin value-add in your agency proposals",
              "Segregated roles for event directors, floor managers, and temporary check-in hostesses",
              "Industrial-grade reliability certifying 10,000+ attendee gates with offline failover",
              "Dedicated agency partner support with customized SLA guarantees",
            ],
            takeaway: "Transform your agency from an operations vendor into a full-stack event technology partner.",
          },
        ],
        callout: {
          badge: "AGENCY PARTNERSHIP",
          title: "Scale your agency revenue with turnkey event technology.",
          description: "Whether you produce corporate summits, product launches, consumer festivals, or awards galas, URPASS provides the rock-solid infrastructure to deliver flawless registration and gate operations every time.",
          bullets: [
            "White-label options with custom domain support and custom email sender domains",
            "Zero percentage commission on ticket sales with direct gateway connections",
            "Export raw JSON/CSV reports or connect client CRMs via webhooks and REST APIs",
            "Comprehensive SLA and dedicated account manager for multi-event agency contracts",
          ],
        },
        faqs: [
          { q: "Can we use our own agency domain for registration pages?", a: "Yes. Agency plans support custom domains (e.g., register.youragency.com) with automatic HTTPS provisioning, so attendees never see a third-party URL." },
          { q: "How do ticket payments reach our client?", a: "URPASS connects directly to your agency's or your client's Razorpay or Stripe account. 100% of ticket proceeds deposit straight into their designated bank account." },
          { q: "Can we give our clients access to see their event attendance live?", a: "Yes. Workspaces allow you to invite clients with 'Viewer' permissions, letting them watch live check-in counters and registration numbers without the ability to edit configurations." },
          { q: "Does URPASS send marketing emails to our attendees?", a: "Never. Your attendee lists and client data are strictly isolated and confidential. We provide the technology infrastructure and never monetize or market to your users." },
        ],
        relatedLinks: [
          { title: "Event Agency Registration Software", href: "/event-agency-registration-software", category: "Product" },
          { title: "White-Label Event Registration", href: "/event-agency-white-label-registration", category: "Product" },
          { title: "Multi-Client Event Dashboard", href: "/multi-client-event-management-software", category: "Product" },
          { title: "Corporate Event Check-In Software", href: "/corporate-event-check-in-software", category: "Use Case" },
          { title: "Trade Show Lead Capture Platform", href: "/trade-show-lead-capture-platform", category: "Product" },
        ],
      }}
    />
  );
}
