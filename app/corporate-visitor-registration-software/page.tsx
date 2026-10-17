import type { Metadata } from "next";
import { Building2, FileSpreadsheet, QrCode, ShieldCheck, Smartphone, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Corporate Visitor Registration Software | UrPass",
  description: "Invite corporate guests, approve registrations and issue QR entry passes. Use UrPass to monitor arrivals and manage corporate event check-in.",
  keywords: [
    "corporate visitor registration software",
    "simplify corporate event visitor registration",
    "urpass qr ticketing",
    "event check in software",
    "qr ticket scanner",
    "event registration platform"
  ],
  alternates: { canonical: "https://urpass.space/corporate-visitor-registration-software" },
  openGraph: {
    title: "Corporate Visitor Registration Software | UrPass",
    description: "Invite corporate guests, approve registrations and issue QR entry passes. Use UrPass to monitor arrivals and manage corporate event check-in.",
    url: "https://urpass.space/corporate-visitor-registration-software",
    locale: "en_US",
    type: "website",
  },
  other: {
    "geo.region": "GLOBAL",
    "geo.placename": "Global",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "ENTERPRISE VISITOR ACCESS",
        h1: "Simplify Corporate Event Visitor Registration",
        canonicalUrl: "https://urpass.space/corporate-visitor-registration-software",
        description: "Invite corporate guests, approve registrations and issue QR entry passes. Use UrPass to monitor arrivals and manage corporate event check-in.",
        ctaLabel: "Create Corporate Event Free",
        directAnswer: {
          title: "How Does Corporate Visitor Registration Work on UrPass?",
          summary: "UrPass streamlines enterprise visitor management for corporate summits, shareholder meetings, and executive roundtables. Guests register through custom branded forms, complete visitor confidentiality agreements, and receive instant digital QR passes on their smartphones. Gate and lobby receptionists scan passes in <0.3s with live dashboard telemetry.",
          keyPoints: ["Custom branded registration with company email verification and NDA acknowledgment", "Instant smartphone QR pass dispatch via WhatsApp and email with zero paper badges", "Sub-second (<0.3s) camera check-in on lobby tablets or receptionist smartphones", "Live arrival notifications and real-time attendance telemetry for executive hosts"],
        },
        keyFactsTable: {
          title: "UrPass vs Traditional Front Desk Guest Logging",
          subtitle: "Comparison of corporate visitor registration workflows.",
          headers: ["Visitor Management Capability", "UrPass Digital Pass System", "Paper Sign-in Books & Legacy Desks"],
          rows: [
            {
                        "col1": "Check-In Speed",
                        "col2": "<0.3s instant QR camera verification",
                        "col3": "2 to 4 minutes per visitor manual form"
            },
            {
                        "col1": "Data Privacy & Security",
                        "col2": "Encrypted digital records with audit logs",
                        "col3": "Exposed paper registers visible to other guests"
            },
            {
                        "col1": "Executive Arrival Alerts",
                        "col2": "Instant WhatsApp and webhook notification",
                        "col3": "Manual phone calls to host assistants"
            },
            {
                        "col1": "Hardware Requirements",
                        "col2": "Any smartphone, iPad, or lobby tablet",
                        "col3": "Dedicated badge printers and sign-in kiosks"
            },
            {
                        "col1": "Platform Fees",
                        "col2": "Flat subscription / 0% ticket commission",
                        "col3": "Costly per-terminal annual licenses"
            }
],
        },
        features: [
          { icon: Building2, title: "Executive Guest Registration", desc: "Capture attendee company name, job designation, dietary preferences, and executive assistant contacts." },
          { icon: ShieldCheck, title: "Confidentiality & NDA Signing", desc: "Require corporate visitors to acknowledge visitor agreements and digital NDAs before pass release." },
          { icon: QrCode, title: "Cryptographic QR Badges", desc: "Generate high-contrast, non-duplicable digital entry tokens delivered directly to mobile wallets." },
          { icon: Smartphone, title: "Receptionist Phone Scanning", desc: "Front desk staff scan visitor passes using standard company smartphones or reception iPads." },
          { icon: Users, title: "Host Arrival Alerts", desc: "Notify meeting organizers automatically the instant their VIP clients or board members arrive." },
          { icon: FileSpreadsheet, title: "Compliance Audit Logs", desc: "Export timestamped visitor registers in CSV/Excel for building compliance and ISO audits." }
        ],
        steps: [
          { n: "01", title: "Setup Event Form", desc: "Configure your corporate summit name, venue, guest capacity, and visitor NDA requirements." },
          { n: "02", title: "Send Invites", desc: "Import VIP guest lists or share private registration links restricted to your domain." },
          { n: "03", title: "Issue Digital Passes", desc: "Approved visitors receive encrypted digital QR passes on WhatsApp and email." },
          { n: "04", title: "Scan at Reception", desc: "Door security or reception staff verify guest passes in under 300ms using camera scans." },
          { n: "05", title: "Monitor Live Flow", desc: "Track real-time arrival counts and department guest tallies from your live dashboard." }
        ],
        callout: {
          badge: "ENTERPRISE SECURITY",
          title: "Replace insecure paper visitor books with tamper-proof digital access.",
          description: "Enterprise security teams cannot afford handwritten paper logs where sensitive client names are exposed. UrPass encrypts every registration and provides sub-second verification.",
          bullets: ["Strict privacy compliance protecting executive and client identity", "Instant verification preventing unauthorized building or boardroom access", "Zero expensive proprietary kiosk hardware to purchase or maintain", "Instant CSV export for facility safety and compliance audits"],
        },
        faqs: [
          { q: "Can we require guests to sign an NDA before getting their pass?", a: "Yes. UrPass allows custom consent fields and terms agreements. Passes are only released once the guest completes required acknowledgments." },
          { q: "Does reception need dedicated barcode scanners?", a: "No. Receptionists or security guards can scan guest QR passes on any smartphone, iPad, or computer webcam with zero software installation." },
          { q: "Can corporate hosts receive notifications when their guests arrive?", a: "Yes. UrPass provides automated webhooks and real-time dashboard updates so event coordinators know precisely when VIPs arrive at the venue." },
          { q: "Is visitor data kept private and secure?", a: "Absolutely. Data is encrypted in transit and at rest with row-level security, ensuring full compliance with corporate enterprise privacy requirements." }
        ],
        relatedLinks: [
          { title: "VIP Invitation Check-In", href: "/vip-invitation-check-in-software", category: "Product" },
          { title: "Employee Event Registration", href: "/employee-event-registration-software", category: "Product" },
          { title: "Event Capacity Management", href: "/event-capacity-management-software", category: "Product" },
          { title: "Multi-Gate QR Check-In", href: "/multi-gate-event-check-in", category: "Product" }
        ],
      }}
    />
  );
}
