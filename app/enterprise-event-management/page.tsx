import type { Metadata } from "next";
import { Building2, Users2, ShieldAlert, BarChart3, Lock, Globe2, CheckCircle2, Layers, KeyRound } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Enterprise Event Management Platform | URPASS",
  description: "Manage enterprise events with registration, attendee management, QR check-in, access control and centralized reporting.",
  keywords: [
    "enterprise event management",
    "enterprise event software",
    "enterprise events",
    "organization event management",
    "multi-department event software",
    "corporate event platform",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/enterprise-event-management" },
  openGraph: {
    title: "Enterprise Event Management Platform | URPASS",
    description: "Manage enterprise events with registration, attendee management, QR check-in, access control and centralized reporting.",
    url: "https://urpass.space/enterprise-event-management",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "ENTERPRISE EVENT PLATFORM",
        h1: "Event Management Built for Enterprise Teams",
        canonicalUrl: "https://urpass.space/enterprise-event-management",
        description: "Run events across departments, teams and locations while managing attendees and event operations from one platform.",
        ctaLabel: "Explore Enterprise",
        features: [
          { icon: Building2, title: "Multi-Department Workspaces", desc: "Create dedicated workspaces for Marketing, HR, Engineering, and Regional Offices with centralized billing and oversight." },
          { icon: Users2, title: "Role-Based Access Control", desc: "Assign fine-grained permissions — Organization Owner, Workspace Admin, Event Manager, Gate Scanner — to protect sensitive business data." },
          { icon: ShieldAlert, title: "Tenant Isolation & Security", desc: "Row-level database security guarantees that department attendee databases and confidential rosters remain strictly segregated." },
          { icon: KeyRound, title: "Single Sign-On & Centralized Auth", desc: "Streamline employee access with Google Workspace and enterprise identity providers while keeping accounts secure." },
          { icon: Lock, title: "Cryptographic Gate Access", desc: "Prevent badge sharing and unapproved admissions across high-security executive briefings, AGMs, and confidential product reveals." },
          { icon: BarChart3, title: "Cross-Event Governance Analytics", desc: "Track aggregate attendance, regional event ROI, gate velocities, and feedback trends across your entire organization." },
        ],
        steps: [
          { n: "01", title: "Create Organization", desc: "Establish your enterprise umbrella account and configure organization-wide settings." },
          { n: "02", title: "Provision Workspaces", desc: "Set up departmental workspaces for regional teams, divisions, and subsidiaries." },
          { n: "03", title: "Assign Team Roles", desc: "Invite organizers, event coordinators, and door security with tailored access controls." },
          { n: "04", title: "Standardize Registration", desc: "Deploy branded event registration templates, custom approval rules, and ticket tiers." },
          { n: "05", title: "Coordinate Check-In", desc: "Deploy browser-based mobile scanners across gates with real-time cloud sync." },
        ],
        callout: {
          badge: "ENTERPRISE GOVERNANCE",
          title: "Enterprise control without bureaucratic operational complexity.",
          description: "Large enterprises suffer from tool fragmentation: marketing uses one ticketing site, HR collects training signups on spreadsheets, and regional teams rent external barcode guns. URPASS consolidates your entire company's event infrastructure into a secure, unified cloud platform.",
          bullets: [
            "Complete tenant isolation with organization-level audit trails",
            "Zero per-ticket platform fees — predictable flat enterprise billing",
            "Instant browser-based mobile scanning with no hardware rentals",
            "Comprehensive CSV and API export pipelines for corporate CRM integration",
          ],
        },
        deepDiveSections: [
          {
            badge: "ORGANIZATIONAL ARCHITECTURE",
            title: "Managing Multi-Department Events at Enterprise Scale",
            paragraphs: [
              "As enterprises grow, event operations naturally decentralize. Internal communications hosts quarterly all-hands; developer relations organizes hackathons and tech symposiums; human resources coordinates employee onboarding and leadership retreats; and commercial teams manage partner summits.",
              "Without centralized software, this leads to 'rogue event IT' — unvetted software subscriptions, conflicting attendee lists, leaked customer emails, and inconsistent branding. IT and compliance departments lose visibility into who enters corporate venues and how employee data is handled.",
              "URPASS provides a structured multi-tenant model. An enterprise establishes a top-level Organization with global governance, then delegates Workspaces to specific departments or regional offices. Each workspace operates independently, yet leadership maintains holistic reporting, security compliance, and unified billing."
            ],
            bullets: [
              "Departmental isolation prevents unauthorized data leakage between teams",
              "Standardized brand templates maintain corporate identity across all events",
              "Consolidated invoicing reduces enterprise administrative overhead",
              "Global attendee deduplication across concurrent corporate programs"
            ],
            takeaway: "Empower departmental teams to launch events quickly while maintaining strict corporate governance, data privacy, and security controls."
          },
          {
            badge: "SECURITY & COMPLIANCE",
            title: "Tenant Isolation, Role Permissions, and Audit-Ready Gates",
            paragraphs: [
              "Enterprise events frequently involve confidential business discussions, VIP clients, and high-security campuses. Standard public ticketing tools treat every event as an open marketplace, exposing attendee directories to unauthenticated third parties.",
              "URPASS is architected with enterprise security fundamentals. Role-based access control ensures volunteers assigned to door scanning only see the check-in camera and immediate guest name — financial summaries, corporate email rosters, and administrative settings are completely hidden.",
              "Every gate scan, registration approval, and attendee status change is timestamped and recorded in immutable logs, providing complete traceability for security and compliance audits."
            ],
            bullets: [
              "Granular permissions prevent staff from viewing unauthorized attendee data",
              "Restricted scanner links ensure gate staff only access door verification",
              "Single-use cryptographic QR passes prevent credential forwarding",
              "Exportable audit logs providing precise arrival timestamps for compliance"
            ],
            takeaway: "Maintain military-grade access control and compliance at every corporate entrance without slowing down executive and guest arrival."
          }
        ],
        useCases: [
          "Annual General Meetings (AGMs)",
          "Global Townhalls & All-Hands",
          "Customer User Conferences",
          "Executive Leadership Retreats",
          "Multi-City Product Roadshows",
          "Internal Technical Hackathons",
          "Partner Summits & Dealer Meets",
        ],
        relatedLinks: [
          { title: "Enterprise Event Registration", href: "/enterprise-event-registration", category: "Product" },
          { title: "Corporate Event Management", href: "/corporate-event-management", category: "Product" },
          { title: "Multi-Location Event Management", href: "/multi-location-event-management", category: "Product" },
          { title: "White Label Event Platform", href: "/white-label-event-platform", category: "Product" },
          { title: "Zoho Backstage Alternative", href: "/compare/zoho-backstage-alternative", category: "Comparison" },
          { title: "Corporate Events Hub", href: "/corporate-events", category: "Use Case" },
        ],
        faqs: [
          { q: "What is enterprise event management software?", a: "Enterprise event management software is a centralized platform designed for corporations and large organizations to coordinate events across multiple departments, locations, and teams with role-based permissions, tenant isolation, and centralized reporting." },
          { q: "How does URPASS handle multi-department event operations?", a: "URPASS provides an Organization hierarchy where you can create isolated Workspaces for different business units (e.g. HR, Engineering, Sales, Marketing). Each workspace manages its own events while administrators maintain organization-wide governance and billing." },
          { q: "Can we restrict what gate staff and volunteers can see?", a: "Yes. URPASS uses role-based access control (RBAC). Gate staff receive restricted mobile scanner links that only display pass verification screens, keeping attendee personal details, financial reports, and administrative controls completely secure." },
          { q: "Does URPASS require renting specialized barcode scanners for large summits?", a: "No. URPASS runs directly inside standard mobile web browsers (Safari, Chrome). Gate staff can verify up to 30 attendees per minute per device using standard smartphones with sub-0.3s camera recognition." },
          { q: "Is attendee data isolated between different workspaces?", a: "Yes. Using PostgreSQL Row Level Security (RLS), attendee records and registration data are strictly isolated between organizations and workspaces, ensuring zero cross-department data leakage." },
          { q: "Can we migrate existing attendee lists from spreadsheets or legacy platforms?", a: "Yes. URPASS includes a structured bulk import engine allowing you to import thousands of attendee records from CSV or Excel files with automated field mapping and instant QR pass generation." },
        ],
        ctaTitle: "Scale your enterprise events with URPASS",
        ctaDescription: "Centralized governance · Role-based permissions · Sub-second gate check-in",
      }}
    />
  );
}
