import type { Metadata } from "next";
import { BarChart3, FileText, QrCode, ScanLine, ShieldCheck, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Association Meeting Registration Software | UrPass",
  description: "Handle annual general meetings, chapter conventions and member assemblies with member verification, digital passes and quorum tracking.",
  keywords: [
    "association meeting registration",
    "simplify association annual meeting registrations",
    "urpass qr ticketing",
    "event check in software",
    "qr ticket scanner",
    "event registration platform"
  ],
  alternates: { canonical: "https://urpass.space/association-meeting-registration" },
  openGraph: {
    title: "Association Meeting Registration Software | UrPass",
    description: "Handle annual general meetings, chapter conventions and member assemblies with member verification, digital passes and quorum tracking.",
    url: "https://urpass.space/association-meeting-registration",
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
        badge: "GOVERNANCE & MEMBER CONVENTIONS",
        h1: "Simplify Association Annual Meeting Registrations",
        canonicalUrl: "https://urpass.space/association-meeting-registration",
        description: "Handle annual general meetings, chapter conventions and member assemblies with member verification, digital passes and quorum tracking.",
        ctaLabel: "Set Up Association Meeting",
        directAnswer: {
          title: "How Does UrPass Manage Association Meeting Registration?",
          summary: "UrPass provides secure registration and attendance tracking for trade associations, professional bodies (medical, legal, accounting), and society AGMs. Organizers verify member registration numbers, manage proxy voter credentials, issue digital QR passes, and track live quorum counts required for constitutional votes.",
          keyPoints: ["Member ID and chapter validation during registration to ensure voting eligibility", "Proxy delegate assignment and voting quorum tracking in real time", "Instant digital QR passes delivered via WhatsApp and email", "Legally verifiable attendance logs for constitutional AGM compliance"],
        },
        keyFactsTable: {
          title: "Association AGM Operations Comparison",
          subtitle: "Ensuring constitutional quorum and voting compliance.",
          headers: ["AGM Governance Requirement", "UrPass Association System", "Paper Sign-in Books & Roster Lists"],
          rows: [
            {
                        "col1": "Quorum Calculation",
                        "col2": "Instant live tally on dashboard; know when quorum is met",
                        "col3": "Hours spent manually counting signatures while meeting stalls"
            },
            {
                        "col1": "Member Eligibility Check",
                        "col2": "Pre-verified membership numbers; blocks non-members",
                        "col3": "Disputed voting eligibility on the assembly floor"
            },
            {
                        "col1": "Proxy Voter Management",
                        "col2": "Proxy delegates linked directly to voting tokens",
                        "col3": "Lost paper proxy forms causing governance disputes"
            },
            {
                        "col1": "Check-In Speed",
                        "col2": "<0.3s scan per member at auditorium entrance",
                        "col3": "Massive queues delaying start of official proceedings"
            },
            {
                        "col1": "Statutory Audit Records",
                        "col2": "Cryptographic timestamped attendance ledger",
                        "col3": "Vulnerable handwritten sign-in sheets subject to challenge"
            }
],
        },
        features: [
          { icon: Users, title: "Member Number Verification", desc: "Validate membership credentials against your member directory before issuing attendance passes." },
          { icon: BarChart3, title: "Live Quorum Telemetry", desc: "Monitor active in-room member counts in real time to confirm official quorum for statutory motions." },
          { icon: ShieldCheck, title: "Proxy Voter Handling", desc: "Track accredited proxy voters representing absent members with verifiable digital authorization tokens." },
          { icon: QrCode, title: "Tamper-Proof Voting Passes", desc: "Cryptographically signed QR tokens prevent non-members or disqualified individuals from entering." },
          { icon: ScanLine, title: "Multi-Door Auditorium Scanning", desc: "Scan hundreds of delegates per minute across all main auditorium and balcony entrances." },
          { icon: FileText, title: "Constitutional Audit Logs", desc: "Generate legally defensible attendance registers with exact check-in timestamps for AGM minutes." }
        ],
        steps: [
          { n: "01", title: "Configure Annual Meeting", desc: "Set AGM date, constitutionally required quorum threshold, and member ticket categories." },
          { n: "02", title: "Upload Member Master List", desc: "Import member IDs, full names, voting chapters, and contact phone numbers." },
          { n: "03", title: "Dispatch Digital Passes", desc: "Members receive their verified AGM attendance pass with embedded QR code via WhatsApp & email." },
          { n: "04", title: "Scan at Convention Hall", desc: "Door marshals scan passes in under 300ms, immediately logging the member into the quorum count." },
          { n: "05", title: "Certify Quorum & Proceedings", desc: "Meeting chairs view real-time quorum confirmation on the dashboard and commence voting." }
        ],
        callout: {
          badge: "STATUTORY COMPLIANCE",
          title: "Never delay an AGM because staff are struggling to manually verify quorum.",
          description: "Annual general meetings often begin late because volunteers must manually count signatures to certify quorum. UrPass gives the meeting secretary a live, legally compliant count on screen.",
          bullets: ["Real-time quorum certification displayed live to the meeting chair", "Eliminate disputes regarding member eligibility and proxy authorizations", "Ensure only active, dues-paying members receive voting admission", "Generate complete digital audit trails for regulatory compliance"],
        },
        faqs: [
          { q: "Can the software prevent non-members from registering for the AGM?", a: "Yes. You can import your authorized member list and mandate membership number validation, or enable approval mode to verify every registration." },
          { q: "How does UrPass help certify that quorum has been achieved?", a: "The organizer dashboard displays live check-ins against your constitutional quorum threshold, updating in real time as members enter the hall." },
          { q: "Can proxy delegates be tracked separately from primary voting members?", a: "Yes. Custom delegate fields designate whether an attendee is attending as a primary member or accredited proxy holder." },
          { q: "Can we export the official attendance list for our AGM minutes?", a: "Yes. One-click export generates an audit-ready spreadsheet with member names, registration IDs, and check-in timestamps." }
        ],
        relatedLinks: [
          { title: "Event Capacity Management", href: "/event-capacity-management-software", category: "Product" },
          { title: "Bulk Attendee CSV Import", href: "/event-attendee-csv-import", category: "Product" },
          { title: "Multi-Gate QR Check-In", href: "/multi-gate-event-check-in", category: "Product" },
          { title: "Event Registration Approval Workflow", href: "/event-registration-approval-workflow", category: "Product" }
        ],
      }}
    />
  );
}
