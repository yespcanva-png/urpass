import type { Metadata } from "next";
import { Download, FileSpreadsheet, Filter, CheckCircle2, ShieldCheck, Database, ArrowRight, BarChart3, Lock } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Attendee CSV Export & Reporting | URPASS",
  description: "Export event attendee data to CSV and Excel in one click. Download complete registration answers, payment records, and entrance check-in timestamps.",
  keywords: [
    "export event attendee data",
    "event attendee CSV export",
    "download event guest list",
    "event registration spreadsheet export",
    "event check in reporting CSV",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-attendee-data-export" },
  openGraph: {
    title: "Event Attendee CSV Export & Reporting | URPASS",
    description: "Export event attendee data to CSV and Excel in one click.",
    url: "https://urpass.space/event-attendee-data-export",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "DATA OWNERSHIP & REPORTING",
        h1: "Export Event Attendee Data to CSV",
        canonicalUrl: "https://urpass.space/event-attendee-data-export",
        description:
          "Exporting event attendee data gives organizers immediate access to clean CSV and Excel files containing full registration profiles, custom questionnaire answers, payment verification references, and exact entrance check-in timestamps. URPASS guarantees 100% data ownership with 1-click exports, custom column selection, and seamless CRM integrations.",
        ctaLabel: "Export Attendee Data",
        features: [
          { icon: Download, title: "1-Click Full CSV Export", desc: "Download complete attendee rosters with one click, formatted cleanly for Microsoft Excel, Google Sheets, or Apple Numbers." },
          { icon: FileSpreadsheet, title: "Custom Questionnaire Columns", desc: "Every custom question from your registration form (e.g. dietary choice, company size, college roll number) appears in dedicated columns." },
          { icon: Filter, title: "Segmented Data Filtering", desc: "Export subsets of your attendee database by ticket tier, payment status, approval state, or attendance check-in status." },
          { icon: CheckCircle2, title: "Exact Check-In Timestamps", desc: "Include gate entry audit records: know which entrance gate each attendee passed through and the exact second they were scanned." },
          { icon: Lock, title: "Zero Data Hostage", desc: "Unlike legacy portals that restrict your access to attendee emails, URPASS gives you full, unredacted ownership of your audience." },
          { icon: Database, title: "Automated Webhooks & API", desc: "Sync attendee records automatically with your CRM, email marketing tool, or internal databases via webhooks." },
        ],
        steps: [
          { n: "01", title: "Select Event", desc: "Navigate to your event overview on the URPASS organizer dashboard." },
          { n: "02", title: "Filter Attendee List", desc: "Apply filters for specific ticket tiers, verified check-ins, or date ranges if needed." },
          { n: "03", title: "Choose Export Columns", desc: "Select default contact info or include all custom form answers and gate logs." },
          { n: "04", title: "Download Clean CSV", desc: "Click 'Export to CSV'; file compiles and downloads instantly to your computer." },
          { n: "05", title: "Import into CRM or Sheets", desc: "Load directly into HubSpot, Salesforce, Mailchimp, or sponsor reporting decks." },
        ],
        callout: {
          badge: "YOUR AUDIENCE, YOUR DATA",
          title: "Stop letting ticketing platforms hide your attendee email list.",
          description: "Many legacy ticketing platforms hide full attendee emails, mask phone numbers, or spam your registrants with competitor event advertisements. With URPASS, you own 100% of your attendee data, with clean instant exports whenever you need them.",
          bullets: [
            "Full unmasked emails and phone numbers for post-event marketing and surveys",
            "Separate attended vs no-show records for targeted follow-up communication",
            "Standardized UTF-8 encoding ensures names and regional characters export properly",
            "Secure, role-based export permissions prevent unauthorized staff data extraction",
          ],
        },
        deepDiveSections: [
          {
            badge: "DATA STRUCTURE",
            title: "What fields are included in the URPASS attendee CSV export?",
            paragraphs: [
              "Every exported CSV is structured logically for immediate analysis. Core fields include Full Name, Email, Phone, Ticket Tier Name, Ticket Price, Payment Status, Payment Gateway Reference ID, and Registration Timestamp.",
              "Following the core columns, all custom registration fields (such as Organization, Designation, T-Shirt Size, or LinkedIn URL) are cleanly mapped into distinct columns. Finally, attendance columns specify 'Checked In' (TRUE/FALSE), Check-in Timestamp, Scanner Device ID, and Entry Gate Name.",
            ],
            takeaway: "Clean column mapping eliminates hours of spreadsheet cleanup and manual text splitting.",
          },
          {
            badge: "POST-EVENT WORKFLOWS",
            title: "How do event organizers use exported attendee data?",
            paragraphs: [
              "Post-event attendee data is crucial for sponsor deliverables (sharing anonymized or permitted demographic breakdowns), sending personalized thank-you emails and certificates of attendance, issuing follow-up feedback surveys, and syncing qualified leads with sales CRM systems.",
              "By filtering the export to only attendees who physically checked in, marketing teams can segment communications accurately without annoying individuals who were unable to attend.",
            ],
            takeaway: "Segmenting exports by physical check-in status ensures your post-event follow-ups reach the right audience.",
          },
        ],
        faqs: [
          {
            q: "Can I export attendee data during the event while registrations and scans are active?",
            a: "Yes. You can export live CSV snapshots at any moment without disrupting active registrations or entrance scanners.",
          },
          {
            q: "Are custom form questions and answers included in the CSV?",
            a: "Yes. Every custom question you configure in the form builder is exported as its own column in the CSV file.",
          },
          {
            q: "Can I automate the export into Google Sheets or Airtable?",
            a: "Yes. You can use URPASS webhooks or our REST API to sync newly registered or checked-in attendees directly into external databases.",
          },
        ],
        relatedLinks: [
          { title: "Event Registration Analytics", href: "/event-registration-analytics", category: "Product" },
          { title: "Live Event Check-in Dashboard", href: "/event-check-in-dashboard", category: "Product" },
          { title: "Event Registration API", href: "/event-registration-api", category: "Product" },
          { title: "Event Webhooks", href: "/event-webhooks", category: "Product" },
        ],
      }}
    />
  );
}
