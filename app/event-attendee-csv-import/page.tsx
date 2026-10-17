import type { Metadata } from "next";
import { BarChart3, FileSpreadsheet, QrCode, Send, ShieldCheck, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Bulk Event Attendee CSV Import | UrPass",
  description: "Upload guest lists via CSV, map attendee attributes, and automatically issue personalized digital QR passes via email and WhatsApp.",
  keywords: [
    "event attendee csv import",
    "import event attendees and generate qr passes",
    "urpass qr ticketing",
    "event check in software",
    "qr ticket scanner",
    "event registration platform"
  ],
  alternates: { canonical: "https://urpass.space/event-attendee-csv-import" },
  openGraph: {
    title: "Bulk Event Attendee CSV Import | UrPass",
    description: "Upload guest lists via CSV, map attendee attributes, and automatically issue personalized digital QR passes via email and WhatsApp.",
    url: "https://urpass.space/event-attendee-csv-import",
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
        badge: "BULK IMPORT & AUTOMATED ISSUANCE",
        h1: "Import Event Attendees and Generate QR Passes",
        canonicalUrl: "https://urpass.space/event-attendee-csv-import",
        description: "Upload guest lists via CSV, map attendee attributes, and automatically issue personalized digital QR passes via email and WhatsApp.",
        ctaLabel: "Import Attendee CSV",
        directAnswer: {
          title: "How Does Bulk Event Attendee CSV Import Work on UrPass?",
          summary: "UrPass enables organizers to upload spreadsheets (.csv or .xlsx) with thousands of guest records in seconds. The importer automatically detects columns for Name, Email, Phone, Company, Ticket Tier, and Entry Limits, validates data integrity, generates unique QR codes, and dispatches passes via WhatsApp or email.",
          keyPoints: ["One-click CSV & Excel spreadsheet upload with intelligent column mapping", "Custom attribute support including company, job title, table number, and entry quotas", "Automated data validation detecting missing emails and duplicate phone numbers", "Instant mass dispatch of personalized digital QR passes via WhatsApp and email"],
        },
        keyFactsTable: {
          title: "CSV Import: UrPass vs Manual Entry",
          subtitle: "Processing large guest rosters and member directories.",
          headers: ["Import & Issuance Feature", "UrPass Bulk CSV Importer", "Manual Data Entry & Mail Merges"],
          rows: [
            {
                        "col1": "Processing Time (1,000 Guests)",
                        "col2": "<15 seconds to import and generate passes",
                        "col3": "3 to 5 hours of manual data entry and spreadsheet formatting"
            },
            {
                        "col1": "Automated WhatsApp Delivery",
                        "col2": "Direct batch dispatch with individual QR passes",
                        "col3": "Third-party mail-merge plugins prone to spam filters"
            },
            {
                        "col1": "Duplicate Record Cleaning",
                        "col2": "Auto-detection of duplicate emails and phone numbers",
                        "col3": "Duplicate invites sent to the same attendee multiple times"
            },
            {
                        "col1": "Group Limit Configuration",
                        "col2": "Map entry quotas (e.g. 1, 2, 5 scans) directly from CSV",
                        "col3": "Impossible; all attendees treated as single entries"
            },
            {
                        "col1": "Custom Attribute Mapping",
                        "col2": "Flexible mapping for VIP notes, seating, and dietary info",
                        "col3": "Rigid fixed schema rejecting non-standard columns"
            }
],
        },
        features: [
          { icon: FileSpreadsheet, title: "Intelligent Column Auto-Mapping", desc: "Importer recognizes headers like 'Full Name', 'Mobile Number', 'Email Address', and 'Pass Limit'." },
          { icon: ShieldCheck, title: "Data Hygiene & Validation", desc: "Flags invalid email formats, missing country codes, and duplicate records before importing." },
          { icon: QrCode, title: "Bulk QR Token Generation", desc: "Generates unique, cryptographically secure digital passes for every imported row instantly." },
          { icon: Send, title: "One-Click WhatsApp Dispatch", desc: "Send personalized digital passes directly to attendees' WhatsApp in bulk with high deliverability." },
          { icon: Users, title: "Group Quota Mapping", desc: "Set individual entry allowances (e.g., admitting 1, 2, or 5 guests) directly via a CSV column." },
          { icon: BarChart3, title: "Import Status Auditing", desc: "View real-time progress bars and download error logs for any failed or invalid rows." }
        ],
        steps: [
          { n: "01", title: "Prepare Spreadsheet", desc: "Create a CSV or Excel file with columns for Name, Email, Phone, and optional Entry Quota." },
          { n: "02", title: "Upload to UrPass", desc: "Drag and drop your spreadsheet into the UrPass attendee import modal." },
          { n: "03", title: "Confirm Column Mapping", desc: "Review detected columns and map custom fields (e.g. VIP status, company title)." },
          { n: "04", title: "Generate QR Passes", desc: "UrPass validates records and generates secure QR passes for every guest in seconds." },
          { n: "05", title: "Batch WhatsApp Dispatch", desc: "Send personalized invitations and passes to all recipients with a single click." }
        ],
        callout: {
          badge: "MASS IMPORT EFFICIENCY",
          title: "Import 1,000+ guest records and issue passes in under 3 minutes.",
          description: "Whether you are hosting an NGO anniversary gala, an association AGM, or an internal corporate town hall, manually typing guest names is a recipe for errors. UrPass automates everything from CSV to phone.",
          bullets: ["Zero manual copy-pasting or complex mail-merge plugins required", "Automatically issue personalized digital passes directly to WhatsApp and email", "Map custom fields like VIP status, table seating, and group entry limits", "Live delivery status tracking ensures no guest is left without an entry pass"],
        },
        faqs: [
          { q: "What spreadsheet formats are supported for import?", a: "UrPass supports standard .csv files as well as Microsoft Excel (.xlsx) files." },
          { q: "Can I import custom entry limits for each person (e.g. 1 for singles, 5 for families)?", a: "Yes! You can include an 'Entry Limit' or 'Max Scans' column in your spreadsheet, and UrPass will assign that exact quota to each recipient's QR pass." },
          { q: "Can we send passes to imported attendees via WhatsApp in bulk?", a: "Yes! UrPass integrates directly with the WhatsApp Cloud API to deliver personalized digital passes with QR codes in bulk." },
          { q: "What happens if my CSV contains duplicate phone numbers or invalid emails?", a: "The importer validates all data before committing, flags any duplicates or format errors, and lets you resolve them with one click." }
        ],
        relatedLinks: [
          { title: "WhatsApp Event Tickets", href: "/whatsapp-event-tickets", category: "Product" },
          { title: "Group QR Ticket Check-In", href: "/group-qr-ticket-check-in", category: "Product" },
          { title: "Event Capacity Management", href: "/event-capacity-management-software", category: "Product" },
          { title: "Duplicate QR Ticket Detection", href: "/duplicate-qr-ticket-detection", category: "Product" }
        ],
      }}
    />
  );
}
