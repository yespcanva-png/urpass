import type { Metadata } from "next";
import {
  Users,
  RefreshCw,
  ShieldCheck,
  Zap,
  Lock,
  Layers,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "SCIM 2.0 Directory Sync & Automated User Deprovisioning for Events — URPASS",
  description:
    "RFC 7643 & RFC 7644 compliant SCIM 2.0 directory synchronization for enterprise events. Automatically provision attendees and immediately revoke access when employees leave Okta or Microsoft Entra ID.",
  keywords: [
    "SCIM 2.0 event ticketing",
    "automated event user provisioning",
    "Okta SCIM directory sync",
    "Microsoft Entra ID SCIM provisioning",
    "RFC 7644 user deprovisioning",
    "enterprise attendee directory sync",
    "automated offboarding event passes",
    "URPASS SCIM 2.0",
  ],
  alternates: { canonical: "https://urpass.space/scim-event-user-provisioning" },
  openGraph: {
    title: "SCIM 2.0 Directory Sync & Automated Deprovisioning | URPASS",
    description:
      "Automate attendee provisioning and instant offboarding for corporate summits and campus passes via RFC 7643 / RFC 7644 SCIM 2.0 endpoints.",
    url: "https://urpass.space/scim-event-user-provisioning",
    type: "website",
  },
};

export default function ScimEventProvisioningPage() {
  return (
    <SEOPage
      config={{
        badge: "DIRECTORY SYNC · SCIM 2.0",
        h1: "Automated SCIM 2.0 Directory Sync & User Deprovisioning for Events",
        canonicalUrl: "https://urpass.space/scim-event-user-provisioning",
        description:
          "Keep your event attendees, organizer team, and door scanning staff synchronized with your enterprise directory. Built on standard RFC 7643 and RFC 7644 SCIM 2.0 protocols for Okta, Microsoft Entra ID (Azure AD), and OneLogin.",
        ctaLabel: "Connect SCIM Directory",

        directAnswer: {
          title: "Why Is SCIM 2.0 Essential for Enterprise Event Management?",
          summary:
            "SCIM (System for Cross-domain Identity Management) 2.0 automates the entire employee lifecycle across your event infrastructure. When an employee is assigned to an event in Okta or Microsoft Entra ID, their registration pass is generated automatically. Crucially, when an employee is offboarded or reassigned, a single SCIM PATCH command instantly deactivates their account and invalidates all QR door passes and active check-in sessions.",
          keyPoints: [
            "Conforms strictly to IETF RFC 7643 (Core Schema) and RFC 7644 (Protocol Specification)",
            "Instant deprovisioning ensures departed employees cannot enter confidential corporate summits",
            "Automatic synchronization of full names, departmental titles, email addresses, and roles",
            "SHA-256 hashed 256-bit bearer token authentication for secure enterprise API communication",
          ],
        },

        keyFactsTable: {
          title: "SCIM 2.0 Protocol Specifications",
          subtitle: "Standardized REST API endpoints supported by URPASS directory servers.",
          headers: ["SCIM 2.0 Feature", "Specification Standard", "URPASS Implementation"],
          rows: [
            {
              col1: "Service Provider Config",
              col2: "RFC 7643 §5",
              col3: "GET /api/scim/v2/{orgId}/ServiceProviderConfig with OAuth Bearer scheme",
            },
            {
              col1: "Schema Discovery",
              col2: "RFC 7643 §7",
              col3: "GET /api/scim/v2/{orgId}/Schemas returning Core User resource definitions",
            },
            {
              col1: "User Search & Filter",
              col2: "RFC 7644 §3.4.2",
              col3: "GET /api/scim/v2/{orgId}/Users?filter=userName eq \"...\" pagination supported",
            },
            {
              col1: "User Provisioning",
              col2: "RFC 7644 §3.3",
              col3: "POST /api/scim/v2/{orgId}/Users with automatic workspace member mapping",
            },
            {
              col1: "User Deprovisioning",
              col2: "RFC 7644 §3.5.2",
              col3: "PATCH /api/scim/v2/{orgId}/Users/{id} with active: false & session purge",
            },
          ],
        },

        features: [
          {
            icon: RefreshCw,
            title: "Automated Onboarding & Sync",
            desc: "Provision hundreds of employee conference passes automatically based on Okta security group memberships.",
          },
          {
            icon: Zap,
            title: "Zero-Latency Deprovisioning",
            desc: "Offboarding in HR systems triggers instant revocation of digital QR wallet passes and physical gate access.",
          },
          {
            icon: Lock,
            title: "256-Bit Bearer Auth",
            desc: "Cryptographically generated SCIM provisioning secrets stored using one-way SHA-256 hashes.",
          },
          {
            icon: Users,
            title: "Attribute Mapping",
            desc: "Sync first names, last names, corporate email addresses, and team roles without manual spreadsheet imports.",
          },
          {
            icon: ShieldCheck,
            title: "Session Purge Engine",
            desc: "Deprovisioning terminates live browser cookies and gate scanner authorizations within milliseconds.",
          },
          {
            icon: Cpu,
            title: "Standard RFC Compliance",
            desc: "Built to pass Okta SCIM Test Suite and Microsoft Entra ID automated validation workflows.",
          },
        ],

        callout: {
          badge: "IDP COMPATIBILITY",
          title: "Engineered for Okta & Microsoft Entra ID (Azure AD).",
          description:
            "URPASS acts as a native SCIM 2.0 downstream target application. Copy your tenant base URL and Bearer token into your IdP admin console to start automated syncing.",
          bullets: [
            "Okta SCIM 2.0 Provisioning (Push Users & Push Groups)",
            "Microsoft Entra ID (Automatic Provisioning mode)",
            "OneLogin SCIM 2.0 Directory Connector",
            "Custom enterprise HRIS SCIM clients",
          ],
        },

        useCases: [
          "Annual corporate sales kickoffs (SKO) with high employee turnover",
          "All-hands town halls requiring strict confidentiality and no unauthorized access",
          "Multi-location tech summits where attendee badges must mirror active HR rosters",
          "University convocation ceremonies synced directly with Student Information Systems (SIS)",
          "Large vendor expos with changing contractor and temporary staff lists",
        ],

        relatedLinks: [
          {
            title: "Enterprise SSO (SAML & OIDC)",
            href: "/enterprise-sso-event-ticketing",
            category: "Product",
          },
          {
            title: "Event Security & Compliance",
            href: "/event-security-compliance",
            category: "Product",
          },
          {
            title: "Custom CNAME Domains",
            href: "/custom-domain-event-ticketing",
            category: "Product",
          },
          {
            title: "Enterprise Event Management",
            href: "/enterprise-event-management",
            category: "Use Case",
          },
          {
            title: "Developer Documentation: SCIM 2.0",
            href: "/docs#enterprise-identity",
            category: "Guide",
          },
        ],

        faqs: [
          {
            q: "What is SCIM 2.0 and why does our event platform need it?",
            a: "SCIM 2.0 is an open standard that allows identity providers (like Okta and Microsoft Entra ID) to automatically create, update, and deactivate user accounts in external software like URPASS. It ensures your event attendee lists and organizer team stay in sync with HR records without manual spreadsheet uploads.",
          },
          {
            q: "How does URPASS handle employee offboarding via SCIM?",
            a: "When an employee is deactivated or removed from an event group in Okta, Okta sends a SCIM PATCH request setting active: false. URPASS immediately marks the member as suspended, revokes all their active sessions across web and scanner apps, and invalidates their digital QR passes.",
          },
          {
            q: "Where do I find my organization's SCIM Base URL and Token?",
            a: "In your organization settings, navigate to Security > Directory Sync (SCIM). You will find your unique SCIM 2.0 Base URL (e.g., https://urpass.space/api/scim/v2/{orgId}) and a button to generate a secure Bearer token.",
          },
          {
            q: "Does URPASS SCIM work with Microsoft Entra ID (Azure AD)?",
            a: "Yes. Microsoft Entra ID Enterprise Applications supports URPASS natively in 'Automatic' provisioning mode using our /ServiceProviderConfig, /Schemas, and /Users endpoints.",
          },
        ],

        ctaTitle: "Automate your event user lifecycle with SCIM 2.0",
        ctaDescription: "Compatible with Okta & Entra ID · Instant session revocation · Enterprise tier",
      }}
    />
  );
}
