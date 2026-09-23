import type { Metadata } from "next";
import { Briefcase, Building, Layers, Sparkles, ShieldCheck, BarChart3, ArrowRight, CheckCircle2, QrCode } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Management Software for Agencies | URPASS",
  description: "Event registration and check-in software for event management agencies. Manage multiple client workspaces, white-label passes, and multi-gate scanning.",
  keywords: [
    "event registration software for agencies",
    "event management software for agencies",
    "event agency software",
    "white label event ticketing agency",
    "multi client event software",
    "experiential agency check in platform",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-registration-software-for-agencies" },
  openGraph: {
    title: "Event Management Software for Agencies | URPASS",
    description: "Event registration and check-in software for event management agencies.",
    url: "https://urpass.space/event-registration-software-for-agencies",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "AGENCY PLATFORM",
        h1: "Event Registration Software for Event Agencies",
        canonicalUrl: "https://urpass.space/event-registration-software-for-agencies",
        description:
          "Event registration software for agencies enables experiential marketing firms, event production companies, and PR agencies to manage multiple client accounts, custom brand portals, and physical entrance check-in under one roof. URPASS offers white-label passes, sub-0.3s volunteer scanning, dedicated client workspaces, and zero per-ticket commission fees.",
        ctaLabel: "Agency Solutions",
        features: [
          { icon: Building, title: "Multi-Client Workspaces", desc: "Isolate client brands, attendee rosters, and ticket revenue into separate secure workspaces with custom permissions." },
          { icon: Sparkles, title: "White-Label Pass Customization", desc: "Present 100% client branding on digital tickets, registration pages, and confirmation emails with zero URPASS badges." },
          { icon: QrCode, title: "Frictionless On-Site Scanning", desc: "Equip temporary event-day temp staff and bouncers with browser-based scanners in seconds using temporary token links." },
          { icon: BarChart3, title: "Executive Client Reporting", desc: "Generate polished attendance reports, check-in velocity charts, and demographic breakdowns for client post-mortems." },
          { icon: Layers, title: "Predictable Agency Margins", desc: "Keep 100% of ticket sales and markup event software services to clients without sacrificing margins to ticketing cut fees." },
          { icon: ShieldCheck, title: "Enterprise-Grade Reliability", desc: "Proven sub-300ms verification speed eliminates entrance bottlenecks even for 10,000+ guest festivals and corporate galas." },
        ],
        steps: [
          { n: "01", title: "Create Client Workspace", desc: "Set up a branded workspace with the client's logo, primary brand colors, and custom subdomain." },
          { n: "02", title: "Build Registration Experience", desc: "Configure custom registration questions, VIP tiers, and instant or approved pass delivery." },
          { n: "03", title: "Embed or Share Live URL", desc: "Integrate with the client's official campaign landing page or share direct responsive links." },
          { n: "04", title: "Deploy On-Site Gate Crew", desc: "Give gate coordinators and usher staff mobile scanner URLs — no hardware rentals or training needed." },
          { n: "05", title: "Deliver Client Post-Mortem", desc: "Export unmasked attendee data, exact check-in times, and visual attendance summaries for the client." },
        ],
        callout: {
          badge: "PROTECT YOUR AGENCY MARGINS",
          title: "Stop letting ticketing platforms take a cut of your event budget.",
          description: "When an agency produces a high-profile corporate launch or festival, giving away 5% to 8% in platform ticketing commissions erodes agency profitability. URPASS's flat SaaS pricing preserves your margins and lets you offer premium white-label ticketing as an agency service.",
          bullets: [
            "White-label client presentation: your agency delivers the complete software solution",
            "Zero equipment rentals: turn any usher or volunteer's smartphone into a high-speed scanner",
            "Manage 20+ clients and 50+ concurrent events across the calendar without confusion",
            "Exportable post-event analytics ready to drop into client presentation decks",
          ],
        },
        deepDiveSections: [
          {
            badge: "CLIENT ISOLATION",
            title: "How do client workspaces ensure data privacy between different agency clients?",
            paragraphs: [
              "Event agencies frequently execute events for competing brands in the same industry. Maintaining strict separation of attendee contact information, VIP guest lists, and financial records is paramount.",
              "URPASS provides isolated organizational workspaces. Team members assigned to Client A cannot view or access attendee rosters or data belonging to Client B, ensuring total confidentiality and compliance with agency client contracts.",
            ],
            takeaway: "Independent workspaces protect client confidentiality while allowing centralized agency administration.",
          },
          {
            badge: "ON-SITE LOGISTICS",
            title: "How does URPASS simplify gate operations for agency on-site crews?",
            paragraphs: [
              "On-site event production is high-stress. Between lighting checks and VIP arrivals, agency production managers do not have time to configure proprietary barcode scanners or troubleshoot WiFi networks.",
              "URPASS scanners run in any mobile web browser on staff smartphones. They require zero app installation and read dynamic QR codes in under 300 milliseconds even over standard 4G mobile data.",
            ],
            takeaway: "Browser-based mobile scanning eliminates expensive hardware rentals and complex on-site setup.",
          },
        ],
        faqs: [
          {
            q: "Can we bill our clients directly for ticketing technology?",
            a: "Yes. With URPASS's flat pricing and white-label capabilities, agencies can package digital ticketing and guest management into their client retainer or production fee.",
          },
          {
            q: "Can we add custom CSS or custom domains for each client?",
            a: "Yes. Business and Enterprise plans allow configuring custom subdomains (e.g. event.clientbrand.com) and custom brand styling.",
          },
          {
            q: "Can clients have read-only access to view live registration numbers?",
            a: "Yes. You can invite client stakeholders with restricted 'Viewer' access so they can monitor registration counts without altering settings.",
          },
        ],
        relatedLinks: [
          { title: "White Label Event Platform", href: "/white-label-event-platform", category: "Product" },
          { title: "Multi-Event Management", href: "/multi-event-management", category: "Product" },
          { title: "Event Team Management", href: "/event-team-management", category: "Product" },
          { title: "Corporate Event Registration", href: "/event-registration-software-for-corporates", category: "Use Case" },
        ],
      }}
    />
  );
}
