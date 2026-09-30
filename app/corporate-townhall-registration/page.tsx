import type { Metadata } from "next";
import { Building2, ShieldCheck, Users, Lock, Key, BarChart3, QrCode, Smartphone } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Corporate Townhall Registration & Employee Check-In | URPASS",
  description:
    "Enterprise event registration, workspaces, and QR check-in platform for internal corporate townhalls, all-hands summits, and departmental workshops.",
  keywords: [
    "corporate townhall registration",
    "internal summit check in",
    "enterprise all hands registration",
    "corporate event management software",
    "employee event check in",
    "departmental event workspaces",
  ],
  alternates: { canonical: "https://urpass.space/corporate-townhall-registration" },
  openGraph: {
    title: "Corporate Townhall Registration & Employee Check-In | URPASS",
    description: "Enterprise event registration, workspaces, and QR check-in platform for corporate townhalls.",
    url: "https://urpass.space/corporate-townhall-registration",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "ENTERPRISE EVENT GOVERNANCE",
        h1: "Corporate Townhall Registration & Employee Check-In System",
        canonicalUrl: "https://urpass.space/corporate-townhall-registration",
        description:
          "Organize internal all-hands meetings, leadership summits, and company-wide townhalls with departmental workspaces, Single Sign-On, and sub-0.3s QR badge entry.",
        ctaLabel: "Launch Corporate Portal",
        directAnswer: {
          title: "How Does URPASS Power Corporate Townhalls and All-Hands?",
          summary:
            "URPASS provides multi-tenant organizational consoles tailored for enterprise event governance. Corporate event teams can organize employees by departmental workspaces (Engineering, Sales, Marketing), manage physical auditorium terminals, enforce SAML 2.0 and OIDC Single Sign-On, and deploy sub-0.3s mobile QR check-ins at auditorium entrances to verify attendance compliance without paper sign-in sheets.",
          keyPoints: [
            "Departmental workspaces for segregating internal townhalls, regional summits, and trainings",
            "Enterprise Single Sign-On (SSO via Okta, Microsoft Entra ID, Google Workspace) and SCIM v2",
            "Sub-0.3s employee badge scanning using standard smartphone cameras with zero app downloads",
            "Real-time attendance compliance tracking with automated CSV export for corporate HR and facilities",
          ],
        },
        keyFactsTable: {
          title: "Corporate Event Governance Specifications",
          subtitle: "Enterprise security and identity parameters for corporate deployments.",
          headers: ["Enterprise Requirement", "URPASS Corporate Architecture", "Generic Consumer Event Tools"],
          rows: [
            { col1: "SSO & Identity Federation", col2: "SAML 2.0 & OIDC integration (Okta, Entra, Google)", col3: "Individual consumer passwords & personal emails" },
            { col1: "Directory Provisioning", col2: "Automated SCIM v2 user synchronization", col3: "Manual employee account invites" },
            { col1: "Access Control (RBAC)", col2: "5-Tier RBAC (Owner, Admin, Event Manager, Staff, Viewer)", col3: "All-or-nothing admin account sharing" },
            { col1: "Auditorium Gate Entry", col2: "< 0.3s camera scan on volunteer phones via PIN URL", col3: "Slow paper sign-in sheets causing lobby traffic" },
            { col1: "Attendance Audit Trails", col2: "Timestamped logs with employee ID & device record", col3: "Unverified self-reported attendance" },
          ],
        },
        features: [
          { icon: Building2, title: "Multi-Tenant Workspaces", desc: "Segregate events across departments (HR, Engineering, Product) with centralized oversight from an organization console." },
          { icon: Lock, title: "Enterprise SSO & SCIM", desc: "Enforce employee login via Okta, Microsoft Entra ID, or Google Workspace with automated directory user provisioning." },
          { icon: QrCode, title: "Digital Employee Event Passes", desc: "Generate branded corporate passes embedding employee IDs, department names, and single-use QR tokens." },
          { icon: Smartphone, title: "Sub-0.3s Lobby Check-In", desc: "Facilities staff scan employee passes in under 0.3s using smartphone cameras, eliminating entrance queues." },
          { icon: ShieldCheck, title: "Role-Based Permissions", desc: "Assign least-privilege roles ensuring gate staff cannot access internal employee salary data or administrative settings." },
          { icon: BarChart3, title: "Compliance & Headcount Analytics", desc: "Track live auditorium capacity, remote vs in-person attendance ratios, and export audit-ready CSV reports." },
        ],
        steps: [
          { n: "01", title: "Create Organization Portal", desc: "Set up your corporate organization console and invite departmental administrators." },
          { n: "02", title: "Schedule Townhall Event", desc: "Configure event agenda, auditorium capacity limits, and department attendance tiers." },
          { n: "03", title: "Automated Pass Dispatch", desc: "Employees receive personalized digital passes via internal email and corporate calendar invites." },
          { n: "04", title: "Deploy Lobby Check-In", desc: "Security and reception teams use PIN-secured smartphone scanners to admit employees in <0.3s." },
          { n: "05", title: "Export Attendance Reports", desc: "Download timestamped attendance rosters for internal compliance and executive reporting." },
        ],
        callout: {
          badge: "ENTERPRISE GRADE",
          title: "Eliminate paper sign-in sheets and security risks at internal corporate gatherings.",
          description: "Manual sign-in sheets are slow, illegible, and represent a security vulnerability. URPASS modernizes internal corporate event logistics with fast, encrypted, and audit-compliant digital check-ins.",
          bullets: [
            "Seamless integration with corporate Single Sign-On (SAML / OIDC)",
            "Instant sub-0.3s QR verification keeps thousands of employees moving smoothly",
            "Departmental workspaces ensure clean data isolation between business units",
            "Zero per-ticket percentage cuts with predictable flat corporate software pricing",
          ],
        },
        faqs: [
          { q: "Can we restrict townhall registration to internal company email domains?", a: "Yes. You can restrict registrations strictly to verified corporate email domains (e.g., `@company.com`) or enforce Single Sign-On (SSO)." },
          { q: "How do reception and security staff check in employees?", a: "Reception staff receive a secure 6-digit scanner PIN. They open the scanner URL in mobile Safari or Chrome and scan employee passes in under 0.3 seconds." },
          { q: "Can different departments manage their own internal events independently?", a: "Yes. The URPASS organization console allows you to create separate workspaces for different business units, each with their own event managers and budgets." },
          { q: "Is attendee data exportable for HR attendance tracking?", a: "Yes. Organizers can export full timestamped CSV reports showing exactly which employees checked in and at what time." },
        ],
        relatedLinks: [
          { title: "Corporate Event Management", href: "/corporate-event-management", category: "Use Case" },
          { title: "Enterprise Event Management", href: "/enterprise-event-management", category: "Use Case" },
          { title: "Enterprise SSO Event Ticketing", href: "/enterprise-sso-event-ticketing", category: "Product" },
          { title: "Browser QR Code Scanner", href: "/qr-code-scanner", category: "Product" },
        ],
      }}
    />
  );
}
