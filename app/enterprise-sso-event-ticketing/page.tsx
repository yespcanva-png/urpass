import type { Metadata } from "next";
import {
  ShieldCheck,
  Key,
  Users,
  Building2,
  Lock,
  Globe2,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Enterprise SSO Event Ticketing & Pass Registration (SAML 2.0 & OIDC) — URPASS",
  description:
    "Federated Single Sign-On (SSO) event ticketing for enterprise organizations, corporate summits, and universities. Connect Okta, Microsoft Entra ID (Azure AD), Google Workspace, and OneLogin via SAML 2.0 & OpenID Connect.",
  keywords: [
    "enterprise SSO event ticketing",
    "SAML 2.0 event registration",
    "Okta event ticketing",
    "Microsoft Entra ID corporate events",
    "OIDC single sign on events",
    "corporate pass management SSO",
    "university SSO event ticketing",
    "URPASS enterprise SSO",
  ],
  alternates: { canonical: "https://urpass.space/enterprise-sso-event-ticketing" },
  openGraph: {
    title: "Enterprise SSO Event Ticketing & Registration | URPASS",
    description:
      "Enterprise SAML 2.0 & OIDC Single Sign-On for events, conferences, and employee portals. Automated JIT provisioning, domain enforcement, and zero password management.",
    url: "https://urpass.space/enterprise-sso-event-ticketing",
    type: "website",
  },
};

export default function EnterpriseSsoPage() {
  return (
    <SEOPage
      config={{
        badge: "ENTERPRISE IDENTITY & SSO",
        h1: "Enterprise SSO Event Ticketing & Registration (SAML 2.0 & OIDC)",
        canonicalUrl: "https://urpass.space/enterprise-sso-event-ticketing",
        description:
          "Federate event access, internal conferences, and training summits with your corporate identity provider. Support for Okta, Microsoft Entra ID, Google Workspace, OneLogin, and JumpCloud with instant Just-In-Time provisioning and verified corporate domains.",
        ctaLabel: "Configure Enterprise SSO",

        directAnswer: {
          title: "How Does Enterprise SSO Work for Event Ticketing?",
          summary:
            "URPASS Enterprise SSO enables organizations to authenticate employees, students, and invited partners through their existing corporate Identity Provider (IdP) via SAML 2.0 or OpenID Connect (OIDC). Attendees log in using corporate credentials without creating separate passwords. Organizers enforce multi-factor authentication (MFA), verified email domain restrictions, and automatic role mapping directly from Okta or Microsoft Entra ID.",
          keyPoints: [
            "Support for both SAML 2.0 (X.509 signed assertions) and OpenID Connect (OIDC Authorization Code)",
            "Native integrations with Okta, Microsoft Entra ID, Google Workspace, OneLogin, and JumpCloud",
            "Just-In-Time (JIT) provisioning for instant employee attendee account creation",
            "Emergency owner fallback preventing administrative lockouts during IdP certificate rotation",
          ],
        },

        keyFactsTable: {
          title: "Enterprise SSO Technical Specifications",
          subtitle: "Identity federation standards and compliance details for enterprise IT security teams.",
          headers: ["Security Specification", "URPASS Implementation", "Enterprise Benefit"],
          rows: [
            {
              col1: "Supported Protocols",
              col2: "SAML 2.0 Web Browser SSO & OpenID Connect 1.0 (OIDC)",
              col3: "Universal compatibility with Okta, Entra ID, Google, and Ping",
            },
            {
              col1: "Signature & Encryption",
              col2: "SHA-256 with X.509 Certificate Validation",
              col3: "Cryptographic assertion integrity against spoofing",
            },
            {
              col1: "User Provisioning",
              col2: "Just-In-Time (JIT) & SCIM 2.0 automated directory sync",
              col3: "Zero manual account creation or invite token distribution",
            },
            {
              col1: "Domain Verification",
              col2: "DNS TXT record validation (urpass-verification=...)",
              col3: "Guarantees domain ownership before enforcing SSO",
            },
            {
              col1: "Session Management",
              col2: "Real-time session tracker with one-click remote revocation",
              col3: "Instant access termination across web and mobile door scanners",
            },
          ],
        },

        features: [
          {
            icon: Lock,
            title: "SAML 2.0 & OIDC Federation",
            desc: "Standards-compliant SP-Initiated and IdP-Initiated authentication flows configured in minutes.",
          },
          {
            icon: Users,
            title: "Just-In-Time Provisioning",
            desc: "New attendees and staff accounts are dynamically created with preset roles upon first successful corporate login.",
          },
          {
            icon: ShieldCheck,
            title: "Enforced Domain Routing",
            desc: "Require all users matching your corporate email domain (@company.com) to authenticate exclusively via your IdP.",
          },
          {
            icon: Key,
            title: "Emergency Owner Bypass",
            desc: "Failsafe owner access protected against lockout during identity provider outages or expired certificates.",
          },
          {
            icon: Building2,
            title: "Multi-Tenant Isolation",
            desc: "Row-level tenant isolation ensures attendees and registrations remain strictly confidential within your tenant.",
          },
          {
            icon: RefreshCw,
            title: "SCIM 2.0 Directory Sync",
            desc: "Instant deprovisioning when employees depart your organization, immediately revoking door passes.",
          },
        ],

        callout: {
          badge: "IDP INTEGRATIONS",
          title: "Compatible with your existing Identity Provider.",
          description:
            "URPASS integrates directly into your existing enterprise identity ecosystem with downloadable SP metadata XML and standard ACS endpoints.",
          bullets: [
            "Okta Identity Cloud (SAML 2.0 & OIDC)",
            "Microsoft Entra ID / Azure Active Directory",
            "Google Workspace Enterprise SAML",
            "OneLogin, PingIdentity, and JumpCloud",
          ],
        },

        useCases: [
          "Internal corporate summits and town halls",
          "University campus fests and alumni conferences",
          "High-security healthcare and banking symposiums",
          "Partner product launches and vendor conferences",
          "Executive leadership retreats and board meetings",
          "Tech conferences requiring verified corporate identity",
        ],

        relatedLinks: [
          {
            title: "SCIM 2.0 Directory Sync",
            href: "/scim-event-user-provisioning",
            category: "Product",
          },
          {
            title: "Custom CNAME Domains",
            href: "/custom-domain-event-ticketing",
            category: "Product",
          },
          {
            title: "Event Security & Compliance",
            href: "/event-security-compliance",
            category: "Product",
          },
          {
            title: "Enterprise Event Management",
            href: "/enterprise-event-management",
            category: "Use Case",
          },
          {
            title: "White-Label Event Platform",
            href: "/white-label-event-platform",
            category: "Product",
          },
          {
            title: "Developer & Enterprise Documentation",
            href: "/docs#enterprise-identity",
            category: "Guide",
          },
        ],

        faqs: [
          {
            q: "Which Identity Providers (IdPs) does URPASS support?",
            a: "URPASS supports any standards-compliant SAML 2.0 or OpenID Connect (OIDC) identity provider, including Okta, Microsoft Entra ID (Azure AD), Google Workspace, OneLogin, PingIdentity, and JumpCloud.",
          },
          {
            q: "Can attendees log in without creating a password?",
            a: "Yes. When SSO is enabled, attendees click 'Continue with Enterprise SSO' or are automatically redirected to your organization's IdP login screen. No passwords are stored on URPASS.",
          },
          {
            q: "What happens if our IdP certificate expires?",
            a: "URPASS includes an 'Emergency Owner Login Bypass' feature. The primary organization owner can sign in using password or magic link to upload a new certificate, preventing administrative lockout.",
          },
          {
            q: "Does URPASS require domain verification before enforcing SSO?",
            a: "Yes. To ensure security and prevent unauthorized domain hijacking, organizers must verify domain ownership via a DNS TXT record before Enforce SSO can be enabled.",
          },
          {
            q: "Can we restrict check-in door scanners to employees with 2FA?",
            a: "Yes. In the Enterprise Security Center, you can toggle 'Enforce Two-Factor Authentication' and IP allowlisting to ensure door staff have 2FA enabled before accessing scanning tools.",
          },
        ],

        ctaTitle: "Elevate your enterprise event security",
        ctaDescription: "Connect your IdP in minutes · SAML 2.0 & OIDC · Enterprise tier",
      }}
    />
  );
}
