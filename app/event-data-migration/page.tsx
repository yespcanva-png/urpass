import type { Metadata } from "next";
import { ArrowRightLeft, UploadCloud, Database, ShieldCheck, FileCheck, RefreshCw, CheckCircle2, Zap, Layers } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Data Migration to URPASS | URPASS",
  description: "Move attendee and registration data from spreadsheets or existing systems into URPASS through a structured migration workflow.",
  keywords: [
    "event data migration",
    "attendee migration",
    "event platform migration",
    "import event data",
    "switch event platforms",
    "CSV attendee migration",
    "migrate from eventbrite",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-data-migration" },
  openGraph: {
    title: "Event Data Migration to URPASS | URPASS",
    description: "Move attendee and registration data from spreadsheets or existing systems into URPASS through a structured migration workflow.",
    url: "https://urpass.space/event-data-migration",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "EVENT DATA MIGRATION",
        h1: "Move Your Events to URPASS",
        canonicalUrl: "https://urpass.space/event-data-migration",
        description: "Bring existing attendee and registration data into URPASS and continue managing your events from one organized platform.",
        ctaLabel: "Start Your Migration",
        features: [
          { icon: ArrowRightLeft, title: "Universal Data Ingestion", desc: "Easily import attendee records exported from Eventbrite, Google Forms, Zoho Backstage, Townscript, or custom spreadsheets." },
          { icon: Database, title: "Custom Field Preservation", desc: "Map and preserve unique attendee attributes — student roll numbers, VIP tier, company affiliation, or dietary choices." },
          { icon: ShieldCheck, title: "Automated Deduplication", desc: "Detect and resolve duplicate email addresses and redundant entries before committing data to your live event roster." },
          { icon: FileCheck, title: "Bulk QR Pass Generation", desc: "Instantly create unique cryptographic QR passes for every migrated attendee with zero manual data entry." },
          { icon: RefreshCw, title: "Zero Operational Downtime", desc: "Transition your active event to URPASS even midway through a registration campaign without losing a single attendee." },
          { icon: Zap, title: "Immediate Gate Readiness", desc: "Migrated attendees are indexed immediately across all active mobile camera scanners, ready for door verification." },
        ],
        steps: [
          { n: "01", title: "Export Data", desc: "Download your attendee CSV from your current ticketing tool or spreadsheet." },
          { n: "02", title: "Review Schema", desc: "Verify essential columns (name, email, ticket tier, custom fields)." },
          { n: "03", title: "Upload to URPASS", desc: "Use our intelligent column mapper to match your fields to URPASS attributes." },
          { n: "04", title: "Generate Passes", desc: "URPASS automatically issues unique cryptographic digital QR credentials." },
          { n: "05", title: "Scan at Entrances", desc: "Gate staff scan passes on mobile phones with sub-0.3s camera verification." },
        ],
        callout: {
          badge: "PAINLESS MIGRATION",
          title: "Switching event platforms shouldn't mean starting from scratch.",
          description: "Many organizers stay trapped with clunky, expensive legacy platforms because they fear losing existing registrations or confusing attendees. URPASS provides a structured, fail-safe migration pipeline that imports your historical data, generates verified passes, and maintains continuous operations.",
          bullets: [
            "Seamless compatibility with standard CSV and Excel exports from all major platforms",
            "Automatic cryptographic QR code generation for every imported participant",
            "Zero disruption to attendees — no account creation or password resets required",
            "Full data validation preventing duplicate entries and broken records",
          ],
        },
        deepDiveSections: [
          {
            badge: "SEAMLESS TRANSITION",
            title: "Switching from Legacy Ticketing Platforms Without Disrupting Attendees",
            paragraphs: [
              "Event organizers often discover late in their campaign that their existing ticketing software is inadequate: high per-ticket commission fees are draining their budget, their gate check-in app requires expensive rental hardware, or the platform lacks fast UPI payment support.",
              "Switching platforms midway through an active registration drive sounds intimidating. Organizers worry about duplicate tickets, confused attendees, and broken check-in lists at the door.",
              "URPASS is architected for frictionless migration. Simply export your attendee roster from your current platform (Eventbrite, Townscript, Google Forms, or Zoho Backstage) as a standard CSV file and import it directly into URPASS. Within 60 seconds, your entire database is securely staged, passes are generated, and your gate scanners are ready to verify incoming guests."
            ],
            bullets: [
              "Preserve existing ticket numbers and registration timestamps",
              "Maintain continuity with attendees by distributing clean web passes",
              "Eliminate per-ticket platform commissions on all remaining ticket sales",
              "Upgrade immediately to sub-0.3s browser-based gate check-in"
            ],
            takeaway: "Migrate active or upcoming events to URPASS in minutes without confusing attendees or risking gate check-in chaos."
          },
          {
            badge: "DATA INTEGRITY",
            title: "Handling Custom Fields, Duplicate Records, and Historical Roster Audits",
            paragraphs: [
              "Data cleanliness is the primary challenge in any database migration. Legacy systems often export messy spreadsheets with mixed column headers, missing phone numbers, or duplicate registrations from users who submitted multiple times.",
              "URPASS's migration workflow includes an intelligent data validation layer. When you upload your spreadsheet, the system parses each column, suggests intelligent mappings for standard attributes (Name, Email, Phone, Ticket Type), and allows you to map custom questions to custom attendee fields.",
              "Before committing the import, URPASS runs an automated deduplication check against your existing event records, giving you the choice to update existing records or append new attendees safely."
            ],
            bullets: [
              "Visual field mapper adapts to custom spreadsheet column names",
              "Pre-import conflict preview highlights invalid email formats or missing fields",
              "Safe rollback support ensures no data corruption occurs during import",
              "Comprehensive post-import audit logs ready for compliance review"
            ],
            takeaway: "Import complex attendee datasets with complete confidence that your data is cleaned, deduplicated, and accurately mapped."
          }
        ],
        useCases: [
          "Mid-Campaign Platform Migrations",
          "Google Forms to Professional Event System Switch",
          "Legacy Eventbrite Platform Replacements",
          "Campus-Wide College Fest Consolidation",
          "Corporate Annual Summit Tool Modernization",
          "Offline Registration Desk Data Consolidation",
          "Multi-Year Attendee Database Upgrades",
        ],
        relatedLinks: [
          { title: "Bulk Event Registration", href: "/bulk-event-registration", category: "Product" },
          { title: "Event Management Software", href: "/event-management-software", category: "Product" },
          { title: "Enterprise Event Management", href: "/enterprise-event-management", category: "Product" },
          { title: "Google Forms vs URPASS", href: "/compare/google-forms-vs-urpass", category: "Comparison" },
          { title: "Eventbrite Alternative for India", href: "/compare/eventbrite-alternative", category: "Comparison" },
          { title: "Zoho Backstage Alternative", href: "/compare/zoho-backstage-alternative", category: "Comparison" },
        ],
        faqs: [
          { q: "What is event data migration?", a: "Event data migration is the process of transferring attendee records, registration forms, and ticket data from an existing ticketing platform or spreadsheet into URPASS so you can manage the event without starting from scratch." },
          { q: "Which platforms can I migrate data from?", a: "You can migrate attendee data from any platform that allows CSV or Excel exports, including Eventbrite, Google Forms, Zoho Backstage, Townscript, AllEvents, Microsoft Forms, and custom internal databases." },
          { q: "Can I migrate an event that is already in progress?", a: "Yes. You can import all attendees who have registered so far, generate their URPASS digital QR passes, and continue collecting new registrations on URPASS seamlessly." },
          { q: "Do migrated attendees need to re-register or create an account?", a: "No. Migrated attendees do not need to re-register. Their passes are created automatically from your uploaded spreadsheet, and they can access their digital pass via a direct link without creating an account." },
          { q: "How does URPASS handle duplicate attendees during migration?", a: "The migration tool automatically detects duplicate email addresses and lets you choose whether to update existing records, overwrite them, or skip duplicates to keep your roster clean." },
          { q: "How quickly are migrated passes ready for entrance scanning?", a: "Instantly. As soon as the CSV import finishes, all attendee QR codes are activated in the cloud database and ready to scan on volunteer mobile phones." },
        ],
        ctaTitle: "Migrate your event data to URPASS today",
        ctaDescription: "Fast CSV import · Automated pass generation · Zero downtime",
      }}
    />
  );
}
