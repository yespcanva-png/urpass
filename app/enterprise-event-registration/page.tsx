import type { Metadata } from "next";
import { ClipboardCheck, ShieldCheck, MailCheck, Users, Building, Lock, FileSpreadsheet, ArrowRight, UserCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Enterprise Event Registration Software | URPASS",
  description: "Centralize enterprise event registration, attendee approvals, digital passes and QR check-in with URPASS.",
  keywords: [
    "enterprise event registration",
    "enterprise registration software",
    "corporate event registration",
    "business event registration",
    "centralized event registration",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/enterprise-event-registration" },
  openGraph: {
    title: "Enterprise Event Registration Software | URPASS",
    description: "Centralize enterprise event registration, attendee approvals, digital passes and QR check-in with URPASS.",
    url: "https://urpass.space/enterprise-event-registration",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "ENTERPRISE REGISTRATION",
        h1: "Enterprise Event Registration Without the Complexity",
        canonicalUrl: "https://urpass.space/enterprise-event-registration",
        description: "Give every event a professional registration experience while keeping attendee information organized across your organization.",
        ctaLabel: "Talk to URPASS",
        features: [
          { icon: Building, title: "Centralized Registration Directory", desc: "Consolidate event signups across all corporate divisions into a unified, searchable attendee database." },
          { icon: UserCheck, title: "Executive Approval Workflows", desc: "Implement structured approval queues where department managers or organizers evaluate and authorize applicant admittance." },
          { icon: MailCheck, title: "Domain & Identity Whitelisting", desc: "Restrict internal event registrations strictly to employees with approved corporate email domains (@yourcompany.com)." },
          { icon: ShieldCheck, title: "Automated Digital Pass Delivery", desc: "Approved registrants automatically receive dynamic digital passes containing high-contrast, encrypted QR credentials." },
          { icon: Users, title: "Tiered Capacity & Allocation Caps", desc: "Allocate specific seat quotas to regional branches, business units, or customer tiers to ensure balanced participation." },
          { icon: FileSpreadsheet, title: "Enterprise Roster Export & Sync", desc: "Export clean, standardized attendee data to CSV or Excel for internal HRMS, CRM, and marketing automation pipelines." },
        ],
        steps: [
          { n: "01", title: "Standardize Policy", desc: "Define corporate registration fields, brand guidelines, and mandatory disclaimers." },
          { n: "02", title: "Launch Portal", desc: "Publish responsive registration landing pages with customized questionnaires." },
          { n: "03", title: "Process Approvals", desc: "Approve delegates individually or in automated batches based on internal rules." },
          { n: "04", title: "Dispatch Credentials", desc: "Registrants receive verified mobile web passes with Apple Wallet compatibility." },
          { n: "05", title: "Validate at Entrances", desc: "Event staff verify passes in sub-0.3s at venue gates with zero paper checklists." },
        ],
        callout: {
          badge: "STREAMLINED ENTERPRISE SIGNUPS",
          title: "Eliminate corporate registration friction and data fragmentation.",
          description: "Internal and customer-facing corporate events require polished signups, strict data governance, and prompt credential delivery. URPASS removes administrative gridlock by providing standardized forms, automated pass generation, and real-time gate synchronization.",
          bullets: [
            "Consistent corporate branding across every internal and external event",
            "Customizable data collection fields compliant with corporate privacy standards",
            "Automated waitlist management preventing venue overcrowding",
            "Zero per-ticket percentage cuts — flat, predictable enterprise subscriptions",
          ],
        },
        deepDiveSections: [
          {
            badge: "ORGANIZATIONAL ALIGNMENT",
            title: "Centralizing Enterprise Registration Across Dispersed Business Units",
            paragraphs: [
              "In multi-national companies and large enterprises, different business units frequently host events for overlapping audiences. Sales invites key enterprise accounts to roadshows; customer success hosts quarterly product summits; and executive leadership organizes invite-only roundtables.",
              "When teams operate on disjointed event registration tools, customers receive conflicting invitations, customer records are duplicated in disparate spreadsheets, and marketing teams lack a centralized historical record of client touchpoints.",
              "URPASS provides enterprise-wide visibility. All event registrations flow into an organized, central database categorized by workspace. Executives and marketing operations can analyze corporate event participation across departments while maintaining strict access controls."
            ],
            bullets: [
              "A single unified attendee repository across all organizational events",
              "Consistent brand aesthetics and professional presentation for high-value clients",
              "Prevents duplicate invites and conflicting communications to VIP accounts",
              "Standardized data fields for effortless integration into Salesforce or HubSpot"
            ],
            takeaway: "Deliver an executive-level registration experience to customers and partners while maintaining centralized corporate data integrity."
          },
          {
            badge: "GATEKEEPER SECURITY",
            title: "Executive Approvals, Domain Whitelisting, and Data Privacy",
            paragraphs: [
              "Confidential internal programs — such as sales kickoffs, strategy retreats, and product previews — must remain strictly private. Public ticketing marketplaces are unsuitable for these gatherings because they expose event listings to search engines and allow anyone to submit a registration.",
              "URPASS gives enterprise organizers granular gatekeeper controls. Organizers can configure email domain restrictions so only verified internal staff can register. Furthermore, mandatory approval workflows ensure every registration is reviewed by an organizer before an admission pass is issued.",
              "Because attendee data is stored in tenant-isolated database environments with cryptographic token hashing, employee personal information is protected from unauthorized external access."
            ],
            bullets: [
              "Domain whitelisting enforces internal-only employee signups",
              "Manual or automated multi-tier approval pipelines for selective summits",
              "Encrypted single-use QR credentials that cannot be forwarded to outsiders",
              "Real-time attendance dashboards alerting organizers when VIP guests arrive"
            ],
            takeaway: "Safeguard proprietary corporate gatherings with domain validation and rigorous attendee screening before entrance passes are ever dispatched."
          }
        ],
        useCases: [
          "Annual Customer User Summits",
          "Global Sales Kickoffs (SKO)",
          "Corporate Training & Certification Seminars",
          "Leadership & Executive Strategy Retreats",
          "Partner Ecosystem Conferences",
          "Vendor & Supplier Compliance Days",
          "Confidential Product Launch Briefings",
        ],
        relatedLinks: [
          { title: "Enterprise Event Management", href: "/enterprise-event-management", category: "Product" },
          { title: "Corporate Event Management", href: "/corporate-event-management", category: "Product" },
          { title: "Event Registration Platform", href: "/event-registration-platform", category: "Product" },
          { title: "White Label Event Platform", href: "/white-label-event-platform", category: "Product" },
          { title: "Event Data Migration", href: "/event-data-migration", category: "Product" },
          { title: "Conference Management Guide", href: "/guides/how-to-manage-conference-attendees", category: "Guide" },
        ],
        faqs: [
          { q: "What is enterprise event registration software?", a: "Enterprise event registration software is an advanced registration platform that allows large organizations to create standardized signup portals, manage attendee approvals, enforce corporate domain security, and issue verifiable digital passes across multiple departments." },
          { q: "Can we restrict event registration to employees with corporate email addresses?", a: "Yes. You can enforce email domain restrictions (e.g. only allowing signups from @yourcompany.com) to prevent external or unauthorized users from registering for private internal events." },
          { q: "How does the registration approval process work?", a: "Organizers can choose between automated instant confirmations or manual review. In manual review mode, registrants submit their details into an approval queue; once an organizer approves them, their digital QR pass is generated and dispatched automatically." },
          { q: "Can we import existing employee lists or corporate blocks in bulk?", a: "Yes. URPASS features a bulk attendee import engine allowing you to upload CSV or Excel rosters of hundreds or thousands of attendees with automatic credential generation in seconds." },
          { q: "Is attendee personal data secure and isolated?", a: "Yes. URPASS utilizes PostgreSQL Row Level Security (RLS) ensuring strict tenant and workspace isolation. Attendee records cannot be viewed or accessed across different organizations." },
          { q: "Can we collect payments for ticketed customer summits?", a: "Yes. If your enterprise hosts paid customer conferences or certification programs, you can collect fees natively via Razorpay (UPI, cards, net banking) with zero platform commissions." },
        ],
        ctaTitle: "Elevate your enterprise event registration",
        ctaDescription: "Centralized governance · Corporate domain control · Sub-second gate check-in",
      }}
    />
  );
}
