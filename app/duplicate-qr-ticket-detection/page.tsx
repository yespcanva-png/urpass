import type { Metadata } from "next";
import { AlertTriangle, Clock, FileSpreadsheet, Lock, Radio, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Duplicate QR Ticket Detection | UrPass",
  description: "Block screenshot sharing, duplicate pass use, and ticket fraud with instant single-use QR invalidation and multi-device sync.",
  keywords: [
    "duplicate qr ticket detection",
    "prevent duplicate event entries with qr verification",
    "urpass qr ticketing",
    "event check in software",
    "qr ticket scanner",
    "event registration platform"
  ],
  alternates: { canonical: "https://urpass.space/duplicate-qr-ticket-detection" },
  openGraph: {
    title: "Duplicate QR Ticket Detection | UrPass",
    description: "Block screenshot sharing, duplicate pass use, and ticket fraud with instant single-use QR invalidation and multi-device sync.",
    url: "https://urpass.space/duplicate-qr-ticket-detection",
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
        badge: "FRAUD & DUPLICATION PREVENTION",
        h1: "Prevent Duplicate Event Entries with QR Verification",
        canonicalUrl: "https://urpass.space/duplicate-qr-ticket-detection",
        description: "Block screenshot sharing, duplicate pass use, and ticket fraud with instant single-use QR invalidation and multi-device sync.",
        ctaLabel: "Prevent Duplicate Scans",
        directAnswer: {
          title: "How Does Duplicate QR Ticket Detection Work on UrPass?",
          summary: "UrPass eliminates ticket fraud, pass sharing, and duplicate entries using atomic database validation and cryptographic tokens. The exact millisecond a QR pass is scanned, its token is locked and invalidated. Any subsequent scan attempt—even seconds later at a different gate—triggers a loud audible error and displays the initial scan timestamp.",
          keyPoints: ["Single-use cryptographic tokens ensuring each pass admits exactly one person", "Atomic row-level database locks preventing race-condition multi-gate scans", "Instant visual and audio alert displaying exact initial scan time and gate name", "Complete protection against screenshot forwarding, photocopying, and pass scalping"],
        },
        keyFactsTable: {
          title: "Fraud Prevention: UrPass vs Generic QR Codes",
          subtitle: "Stopping ticket pass-backs and screenshot sharing.",
          headers: ["Security Factor", "UrPass Duplicate Detection Engine", "Static QR Codes & Google Sheets"],
          rows: [
            {
                        "col1": "Duplicate Detection Speed",
                        "col2": "Instant atomic invalidation (<150ms)",
                        "col3": "Lagged batch syncs allowing multi-person entry"
            },
            {
                        "col1": "Concurrent Multi-Gate Attack",
                        "col2": "Database row lock blocks simultaneous scans at different doors",
                        "col3": "Both gates admit the same screenshot simultaneously"
            },
            {
                        "col1": "Duplicate Audit Information",
                        "col2": "Displays exact initial scan timestamp, gate, and scanner ID",
                        "col3": "Generic error with zero diagnostic context"
            },
            {
                        "col1": "Offline Attack Protection",
                        "col2": "Client-side signed token timestamps with reconciliation",
                        "col3": "Offline lists easily tricked by duplicated codes"
            },
            {
                        "col1": "Staff Dispute Resolution",
                        "col2": "Definitive proof on screen resolves gate arguments quickly",
                        "col3": "Embarrassing arguments between security and attendees"
            }
],
        },
        features: [
          { icon: ShieldCheck, title: "Atomic Database Validation", desc: "Uses ACID database transactions with row-level locks so a ticket can never be checked in twice." },
          { icon: AlertTriangle, title: "Bold Visual Crimson Alert", desc: "Scanner screen turns bright red with a high-pitched error tone when a duplicate pass is detected." },
          { icon: Clock, title: "Timestamped Audit Trail", desc: "Screen displays the exact time (down to the second) and gate location where the pass was first scanned." },
          { icon: Radio, title: "Sub-150ms Multi-Gate Sync", desc: "If a guest tries to scan a pass at Gate 1 and their friend scans a copy at Gate 2, the second is blocked instantly." },
          { icon: Lock, title: "Cryptographically Signed UUIDs", desc: "Unguessable, high-entropy tokens prevent counterfeit QR codes from being synthesized by scalpers." },
          { icon: FileSpreadsheet, title: "Fraud Attempt Reporting", desc: "View logs of all rejected duplicate attempts to identify ticket scalping operations or pass-sharing rings." }
        ],
        steps: [
          { n: "01", title: "Generate Secure Pass", desc: "UrPass generates an encrypted, single-use QR pass linked to a unique cryptographic database record." },
          { n: "02", title: "First Legitimate Scan", desc: "Attendee arrives at gate; scanner verifies token, admits guest, and atomically marks pass as used." },
          { n: "03", title: "Fraudulent Copy Presented", desc: "Someone else attempts to use a screenshot or forwarded copy of the same QR code at any gate." },
          { n: "04", title: "Instant Duplicate Rejection", desc: "Scanner flashes bright crimson and sounds an audible alarm: 'Already Scanned at Gate 1 at 18:42:15'." },
          { n: "05", title: "Dispute Resolved in Seconds", desc: "Door security shows the timestamp to the attendee, eliminating confrontation and fraud." }
        ],
        callout: {
          badge: "ZERO TOLERANCE FOR FRAUD",
          title: "Stop ticket scalpers and screenshot sharing from stealing your revenue.",
          description: "At popular college fests, concerts, and tech conferences, attendees frequently screenshot their QR pass and WhatsApp it to multiple friends. UrPass completely shuts down this loophole.",
          bullets: ["Atomic database locks make it physically impossible to scan a ticket twice", "Door security sees exact initial scan details to shut down gate arguments", "Protects event revenue and ensures venue capacity limits are never breached", "Works seamlessly across 20+ simultaneous smartphone gate scanners"],
        },
        faqs: [
          { q: "What happens if an attendee screenshots their QR code and sends it to 3 friends?", a: "The first friend to scan the QR code will be admitted. When the other friends attempt to scan, the screen immediately flashes red, showing 'Already Scanned' and denying entry." },
          { q: "What information does the scanner show when a duplicate is scanned?", a: "The scanner displays the attendee name, ticket tier, and the exact timestamp and gate where the pass was first checked in." },
          { q: "What if two people scan the same pass at two different gates at the exact same second?", a: "UrPass uses atomic database transactions with row-level locks. Only one transaction can commit; the other is rejected instantly." },
          { q: "Can attendees scan out and scan back in later?", a: "Yes, if bi-directional tracking is enabled. The pass will only permit re-entry if it was legitimately scanned out through an exit lane." }
        ],
        relatedLinks: [
          { title: "Multi-Gate QR Check-In", href: "/multi-gate-event-check-in", category: "Product" },
          { title: "Smartphone QR Ticket Scanner", href: "/smartphone-qr-ticket-scanner", category: "Product" },
          { title: "Event Capacity Management", href: "/event-capacity-management-software", category: "Product" },
          { title: "Group QR Ticket Check-In", href: "/group-qr-ticket-check-in", category: "Product" }
        ],
      }}
    />
  );
}
