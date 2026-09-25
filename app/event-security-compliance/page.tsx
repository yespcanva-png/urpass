import type { Metadata } from "next";
import {
  ShieldCheck,
  Network,
  HardDriveDownload,
  Lock,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Users,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Enterprise Event Security, IP Allowlisting & SOC 2 Compliance — URPASS",
  description:
    "Enterprise-grade event security with IP/CIDR network allowlisting, immutable audit logging, Splunk/Datadog SIEM export, and automated GDPR Article 17 PII retention schedules.",
  keywords: [
    "enterprise event security",
    "event IP allowlisting software",
    "SOC 2 event ticketing compliance",
    "SIEM audit logs event software",
    "GDPR attendee data retention",
    "Splunk CIM event logs",
    "event access control compliance",
    "URPASS security",
  ],
  alternates: { canonical: "https://urpass.space/event-security-compliance" },
  openGraph: {
    title: "Enterprise Event Security & Compliance | URPASS",
    description:
      "IP/CIDR allowlisting, immutable audit trails, Splunk/Datadog SIEM export, and automated GDPR data minimization for corporate event organizers.",
    url: "https://urpass.space/event-security-compliance",
    type: "website",
  },
};

export default function EventSecurityCompliancePage() {
  return (
    <SEOPage
      config={{
        badge: "SECURITY & COMPLIANCE",
        h1: "Enterprise Event Security: IP Allowlisting, SOC 2 & GDPR Compliance",
        canonicalUrl: "https://urpass.space/event-security-compliance",
        description:
          "Safeguard your corporate summits, attendee personal data, and administrative dashboards with enterprise-grade network isolation, tamper-evident audit trails, and automated privacy compliance schedules.",
        ctaLabel: "Review Security Capabilities",

        directAnswer: {
          title: "How Does URPASS Protect Enterprise Event Data & Operations?",
          summary:
            "URPASS delivers defense-in-depth security for high-profile corporate summits and institutional events. Corporate network administrators can restrict organizer dashboards and door scanner operations strictly to company VPNs or campus IP blocks using bitwise IP/CIDR allowlisting. All authentication events and role modifications are captured in an immutable audit log exportable to Splunk and Datadog, while attendee PII is automatically anonymized according to configurable GDPR data retention policies.",
          keyPoints: [
            "Network-level access control via IPv4/IPv6 CIDR subnet matching (blocks unauthorized IPs with HTTP 403)",
            "Immutable audit logs with Splunk Common Information Model (CIM) and Datadog JSON exports",
            "Configurable GDPR Article 17 attendee PII retention schedules (30, 90, 180, 365 days)",
            "Enforced Two-Factor Authentication (2FA) and cryptographic pass signatures preventing badge counterfeiting",
          ],
        },

        keyFactsTable: {
          title: "Security & Compliance Technical Controls",
          subtitle: "Enterprise security architecture vetted for corporate IT and CISO compliance reviews.",
          headers: ["Security Control", "URPASS Capability", "Compliance Standard"],
          rows: [
            {
              col1: "Network Isolation",
              col2: "Bitwise IPv4 & IPv6 CIDR allowlisting with proxy header extraction",
              col3: "SOC 2 Type II Network Security",
            },
            {
              col1: "Audit Trail & SIEM",
              col2: "Append-only event log with Splunk CIM JSON and RFC 4180 CSV export",
              col3: "ISO 27001 / SOC 2 CC7.2",
            },
            {
              col1: "Data Privacy & Erasure",
              col2: "Automated PII anonymization retention jobs post-event",
              col3: "GDPR Art. 17 (Right to Erasure)",
            },
            {
              col1: "Identity Protection",
              col2: "SAML 2.0 / OIDC SSO with SCIM 2.0 instant deprovisioning",
              col3: "NIST SP 800-63B Identity Assurance",
            },
            {
              col1: "Pass Anti-Counterfeiting",
              col2: "Dynamic cryptographic QR tokens with single-use replay protection",
              col3: "Physical Access Control Standard",
            },
          ],
        },

        features: [
          {
            icon: Network,
            title: "IP / CIDR Network Allowlisting",
            desc: "Restrict dashboard management and door scanning strictly to corporate VPNs or authorized campus IP ranges.",
          },
          {
            icon: HardDriveDownload,
            title: "SIEM Export (Splunk & Datadog)",
            desc: "Stream and download security audit events in Common Information Model (CIM) format for central log analysis.",
          },
          {
            icon: FileText,
            title: "GDPR Retention Schedules",
            desc: "Automate attendee data minimization by scrubbing phone numbers and identity records after 30 to 365 days.",
          },
          {
            icon: Lock,
            title: "Enforced Multi-Factor Auth (2FA)",
            desc: "Mandate TOTP two-factor authentication for event organizers and entrance door scanner staff.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Passback Protection",
            desc: "Prevents attendees from sharing QR screenshots; duplicate entry scans are flagged and rejected in under 0.3s.",
          },
          {
            icon: Users,
            title: "Role-Based Access Control (RBAC)",
            desc: "Granular permissions across Owner, Admin, Event Manager, Check-in Staff, and Viewer roles.",
          },
        ],

        callout: {
          badge: "AUDIT LOG DETAILS",
          title: "Immutable audit logging for every critical event action.",
          description:
            "URPASS tracks actor identity, IP provenance, timestamp, and target resource for every significant operation:",
          bullets: [
            "SSO logins, failed authentication attempts, and session revocations",
            "Security policy changes and IP allowlist modifications",
            "Door check-in scans, pass re-issues, and capacity override events",
            "Attendee registration export downloads and member role promotions",
          ],
        },

        useCases: [
          "Financial services conferences and FinTech summits with strict regulatory oversight",
          "Healthcare and life sciences symposiums handling sensitive delegate data",
          "Government, defense, and public sector symposiums requiring network allowlisting",
          "Multinational corporate summits governed by SOC 2 and ISO 27001 mandates",
          "High-capacity public conferences mitigating pass counterfeiting and gate fraud",
        ],

        relatedLinks: [
          {
            title: "Enterprise SSO Integration",
            href: "/enterprise-sso-event-ticketing",
            category: "Product",
          },
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
            title: "Event Data Migration & Security",
            href: "/event-data-migration",
            category: "Guide",
          },
          {
            title: "Developer Documentation: Security Center",
            href: "/docs#enterprise-identity",
            category: "Guide",
          },
        ],

        faqs: [
          {
            q: "How does IP allowlisting protect our event?",
            a: "When IP allowlisting is enabled, only users connecting from approved IP addresses or corporate CIDR subnets can access your event dashboard, attendee rosters, and check-in tools. Anyone attempting access from an unapproved IP receives an immediate HTTP 403 Forbidden error.",
          },
          {
            q: "Can we export audit logs into our enterprise SIEM?",
            a: "Yes. In your Security settings, you can export audit logs in Splunk CIM / Datadog compatible JSON or standard RFC 4180 CSV with actor emails, timestamps, actions, and client IP addresses.",
          },
          {
            q: "How does URPASS comply with GDPR Article 17 (Right to Erasure)?",
            a: "Organizers can configure automated data retention periods (e.g. 90 days). Once the retention threshold is reached after an event finishes, attendee PII (phone numbers, full addresses) is automatically scrubbed while maintaining anonymous aggregate check-in statistics.",
          },
          {
            q: "Can door scanners operate if corporate VPN is required?",
            a: "Yes. You can add the venue's dedicated Wi-Fi IP address or cellular proxy subnet to your organization's allowed CIDR list to ensure door staff can check in guests without interruption.",
          },
        ],

        ctaTitle: "Protect your corporate events with enterprise security",
        ctaDescription: "IP allowlisting · SOC 2 audit logs · GDPR compliance · Enterprise tier",
      }}
    />
  );
}
