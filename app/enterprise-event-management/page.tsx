import type { Metadata } from "next";
import { Building2, Users2, ShieldAlert, BarChart3, Lock, Globe2, CheckCircle2, Layers, KeyRound, ArrowRight } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Enterprise Event Management Platform | URPASS",
  description: "Enterprise event management software with SSO, custom domains, multi-department workspaces, sub-second QR check-in, audit logs, and dedicated SLA support.",
  keywords: [
    "enterprise event management",
    "enterprise event software",
    "enterprise event platform",
    "corporate event management platform",
    "multi department event software",
    "enterprise ticketing software",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/enterprise-event-management" },
  openGraph: {
    title: "Enterprise Event Management Platform | URPASS",
    description: "Enterprise event management software with SSO, custom domains, multi-department workspaces, and sub-second QR check-in.",
    url: "https://urpass.space/enterprise-event-management",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "ENTERPRISE GRADE",
        h1: "Event Management Software for Enterprise Teams",
        canonicalUrl: "https://urpass.space/enterprise-event-management",
        description:
          "Enterprise event management software delivers high-capacity attendee registration, multi-department workspaces, role-based access control, cryptographic QR check-in, and centralized financial auditing. URPASS scales effortlessly to thousands of concurrent attendees across multi-city summits, user conferences, and internal corporate roadshows.",
        ctaLabel: "Contact Enterprise Sales",
        features: [
          { icon: Building2, title: "Multi-Department Workspaces", desc: "Isolate regional chapters, subsidiaries, and marketing divisions into separate secure workspaces under one corporate umbrella." },
          { icon: Lock, title: "Enterprise Security & Compliance", desc: "Bank-grade encryption, SOC-2 compliant database architecture, role-based permissions, and complete audit logging." },
          { icon: Globe2, title: "Custom Branded Domains", desc: "Host attendee registration forms and digital pass portals on your company's official domain (e.g. events.company.com)." },
          { icon: KeyRound, title: "SSO & SAML Authentication", desc: "Integrate with Okta, Azure AD, Google Workspace, and enterprise identity providers for streamlined employee logins." },
          { icon: BarChart3, title: "Consolidated Financial Telemetry", desc: "Centralize ticket revenue, automated GST invoices, corporate billing, and custom payment gateway integrations." },
          { icon: ShieldAlert, title: "Dedicated SLA & Support", desc: "24/7 priority emergency support, dedicated account managers, and custom on-site check-in logistics assistance." },
        ],
        steps: [
          { n: "01", title: "Provision Enterprise Org", desc: "Set up corporate workspaces with custom subdomains, legal entities, and SSO integrations." },
          { n: "02", title: "Delegate Regional Teams", desc: "Assign department coordinators and event managers with granular role-based permissions." },
          { n: "03", title: "Deploy Branded Registrations", desc: "Launch high-converting registration forms white-labeled with your corporate identity." },
          { n: "04", title: "Sub-0.3s Gate Operations", desc: "Check in thousands of delegates across dozens of entrances simultaneously with zero line delays." },
          { n: "05", title: "Enterprise Analytics Rollup", desc: "Review cross-event attendance trends, revenue settlements, and compliance reports centrally." },
        ],
        callout: {
          badge: "SCALE WITHOUT LIMITS",
          title: "Engineered for 50,000+ attendee summits and global roadshows.",
          description: "Legacy enterprise event software is notoriously slow, bloated, and expensive, charging massive per-ticket commissions and taking months to deploy. URPASS delivers modern cloud performance, sub-second scanning speed, and transparent SaaS pricing without hidden fees.",
          bullets: [
            "Sub-300ms QR code scanning speed prevents morning foyer bottlenecks",
            "Zero per-ticket commission fees — keep 100% of your conference ticket revenue",
            "Custom contracts, enterprise security reviews, and dedicated invoicing available",
            "Direct REST API and webhooks connect to Salesforce, HubSpot, and internal ERPs",
          ],
        },
        deepDiveSections: [
          {
            badge: "INFRASTRUCTURE",
            title: "How does URPASS maintain high availability during enterprise ticket drops?",
            paragraphs: [
              "When an enterprise summit announces registrations, traffic surges can overwhelm traditional web servers. URPASS is architected on distributed edge compute, Next.js, and high-concurrency database clusters.",
              "Database transactions utilize optimistic concurrency controls, ensuring that thousands of simultaneous ticket purchases are validated and processed without database deadlocks or overselling venue capacities.",
            ],
            takeaway: "Distributed edge infrastructure guarantees zero downtime during high-visibility corporate launches.",
          },
          {
            badge: "DATA PRIVACY",
            title: "How does enterprise role-based access protect sensitive attendee data?",
            paragraphs: [
              "Large corporations must adhere to strict data privacy standards (such as GDPR and local privacy mandates). URPASS ensures that volunteer gate staff only see attendee name and ticket tier on scanner displays, with email addresses, phone numbers, and payment details hidden from view.",
              "Administrative actions (such as exports and role changes) are recorded in tamper-proof audit trails for internal compliance reviews.",
            ],
            takeaway: "Granular access controls guarantee enterprise data governance and privacy compliance.",
          },
        ],
        faqs: [
          {
            q: "Can enterprise clients pay via invoice and bank transfer rather than credit card?",
            a: "Yes. Enterprise plans support annual invoicing, purchase orders (PO), and direct NEFT/RTGS bank wire transfers with GST compliance.",
          },
          {
            q: "Does URPASS provide custom service level agreements (SLAs)?",
            a: "Yes. Enterprise contracts include 99.9% uptime SLAs and guaranteed response times from our technical operations team.",
          },
          {
            q: "Can we use our own custom payment gateway merchant account?",
            a: "Yes. Enterprise accounts can connect their direct corporate Razorpay, Stripe, or bank merchant accounts for immediate funds settlement.",
          },
        ],
        relatedLinks: [
          { title: "Multi-Event Management", href: "/multi-event-management", category: "Product" },
          { title: "Event Team Management", href: "/event-team-management", category: "Product" },
          { title: "White Label Event Platform", href: "/white-label-event-platform", category: "Product" },
          { title: "Event Registration API", href: "/event-registration-api", category: "Product" },
        ],
      }}
    />
  );
}
