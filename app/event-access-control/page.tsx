import type { Metadata } from "next";
import { Lock, ShieldCheck, ScanLine, AlertCircle, Users, Zap, ShieldAlert, CheckCircle2, UserCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Access Control & QR Validation | URPASS",
  description: "Validate digital passes, control attendee entry and maintain accurate event attendance records using URPASS.",
  keywords: [
    "event access control",
    "event entry system",
    "QR access control",
    "venue access control",
    "gate security software",
    "attendee admission control",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-access-control" },
  openGraph: {
    title: "Event Access Control & QR Validation | URPASS",
    description: "Validate digital passes, control attendee entry and maintain accurate event attendance records using URPASS.",
    url: "https://urpass.space/event-access-control",
    locale: "en_IN",
    type: "website",
  },
};

export default function EventAccessControlPage() {
  return (
    <SEOPage
      config={{
        badge: "EVENT ACCESS CONTROL",
        h1: "Know Who Is Entering Your Event",
        canonicalUrl: "https://urpass.space/event-access-control",
        description: "Use digital passes and QR validation to create a structured, trackable attendee entry process.",
        ctaLabel: "Set Up Event Access",
        features: [
          { icon: Lock, title: "Pre-Approved Admission Only", desc: "Only participants with confirmed registrations and valid cryptographic QR credentials can pass through entrance checkpoints." },
          { icon: ShieldCheck, title: "Single-Use Pass Verification", desc: "Every QR code is single-use. The moment a pass is scanned, it is invalidated for re-entry, preventing ticket forwarding and badge passing." },
          { icon: AlertCircle, title: "Instant Forgery & Counterfeit Alerts", desc: "Forged screenshots, fabricated QR codes, and expired credentials trigger high-contrast visual alerts that stop gate crashers immediately." },
          { icon: ScanLine, title: "Hardware-Free Mobile Scanning", desc: "Turn any volunteer or security guard's smartphone into a high-speed verification terminal using browser-based camera scanning." },
          { icon: Users, title: "Multi-Checkpoint Coordination", desc: "Synchronize multiple venue gates, main auditorium doors, and VIP lounges in real time with zero risk of concurrent entry conflicts." },
          { icon: Zap, title: "Sub-0.3s Verification Speed", desc: "High-velocity scanning clears attendee queues rapidly, preventing entrance congestion while maintaining strict security standards." },
        ],
        steps: [
          { n: "01", title: "Configure Access Policy", desc: "Set event entry quotas, approval modes, and ticket tier permissions." },
          { n: "02", title: "Issue Encrypted Passes", desc: "Approved registrants receive encrypted digital passes with unique QR tokens." },
          { n: "03", title: "Equip Gate Staff", desc: "Share secure scanner links with security volunteers and gate supervisors." },
          { n: "04", title: "Scan at Entrances", desc: "Guards scan passes in under 0.3s, receiving green (valid) or red (denied) signals." },
          { n: "05", title: "Monitor Real-Time Capacity", desc: "Track exact headcount, arrival velocity, and gate security logs on your dashboard." },
        ],
        callout: {
          badge: "REAL-TIME SECURITY",
          title: "Gate-crashers, forwarded screenshots, and duplicate passes don't get in.",
          description: "Visual inspection of paper tickets or email receipts fails because door staff cannot detect whether a pass was already used by someone else 10 minutes prior. URPASS provides an unforgeable digital barrier that verifies every attendee against your live database.",
          bullets: [
            "Atomic single-use token invalidation stops ticket sharing across gates",
            "Timestamped audit logs record the exact minute and device for every scan",
            "Clear high-contrast green/red visual cues eliminate security guard hesitation",
            "PIN-protected scanner URLs protect sensitive attendee and financial records",
          ],
        },
        deepDiveSections: [
          {
            badge: "VULNERABILITY ASSESSMENT",
            title: "Why Visual Inspection Fails at Venue Gates",
            paragraphs: [
              "At high-demand events like college cultural festivals, tech hackathons, and sold-out conferences, manual verification creates massive security loopholes. Security guards glancing at a smartphone screen cannot verify whether an email confirmation is authentic, whether a PDF was forwarded to ten friends, or whether the registrant was canceled.",
              "Attendees routinely exploit this gap by taking screenshots of a friend's ticket and flashing it quickly to distracted door staff. By the time the event begins, the venue is dangerously overcrowded, fire codes are breached, and paying attendees are left without seats.",
              "URPASS replaces subjective visual checks with cryptographic verification. When an attendee presents their pass, the camera scans a hashed token that queries your database atomically. If that token was already scanned at any gate, entry is denied instantly."
            ],
            bullets: [
              "Eliminates reliance on easily falsified printed receipts and screenshots",
              "Prevents dangerous venue overcrowding and fire safety violations",
              "Provides an undeniable digital paper trail for every individual entry",
              "Protects event revenue by ensuring every person inside paid or was approved"
            ],
            takeaway: "Cryptographic QR validation provides 100% certainty that every individual inside your venue has a verified, unique registration."
          },
          {
            badge: "TIERED ACCESS",
            title: "Managing Zone Permissions, VIP Access, and Multi-Gate Venues",
            paragraphs: [
              "Large events rarely have a single entrance policy. A conference may have general attendee doors, a VIP speaker lounge, a sponsor exhibition floor, and backstage production areas. Ensuring that only authorized personnel enter specific zones is critical to event integrity.",
              "URPASS supports differentiated ticket tiers and zone permissions. When a badge or pass is scanned, the mobile terminal immediately displays the attendee's ticket category (e.g. VIP, Speaker, General Admission, Volunteer).",
              "Gate staff positioned at restricted checkpoints can instantly identify whether a pass holder is authorized for that specific room, keeping backstage and VIP areas secure without expensive physical keycards."
            ],
            bullets: [
              "Instant role and tier visibility on volunteer scanner screens",
              "Seamless coordination between main entrance doors and restricted workshop rooms",
              "Audit logging of entries into specific session halls and VIP zones",
              "Live headcount tracking per zone to prevent room overcrowding"
            ],
            takeaway: "Deploy role-based zone control across multiple venue entrances using standard mobile phones, without renting specialized RFID access hardware."
          }
        ],
        useCases: [
          "Paid Conferences & Summits",
          "College Fest Campus Main Gates",
          "Exclusive Workshops & Masterclasses",
          "Hackathon Late-Night Entry Gates",
          "VIP Backstage & Speaker Lounges",
          "Product Launch Media Checkpoints",
          "Trade Show Exhibition Hall Turnstiles",
        ],
        relatedLinks: [
          { title: "Event Management Software", href: "/event-management-software", category: "Product" },
          { title: "Event Check-In Software", href: "/event-check-in-software", category: "Product" },
          { title: "Event Badge Generator", href: "/event-badge-generator", category: "Product" },
          { title: "Multi-Gate Event Check-In", href: "/multi-gate-event-check-in", category: "Product" },
          { title: "Prevent Duplicate Event Entry Guide", href: "/guides/prevent-duplicate-event-entry", category: "Guide" },
          { title: "Event Access Control Kolkata", href: "/in/kolkata", category: "Location" },
        ],
        faqs: [
          { q: "What is event access control?", a: "Event access control is the process of regulating and verifying attendee entry into an event venue or specific zones using digital credentials, QR scanning, and real-time database validation." },
          { q: "Can someone share a screenshot of their QR code with a friend?", a: "No. Each QR pass contains a single-use token. Once scanned and admitted at the door, subsequent scan attempts trigger an immediate red 'Already Checked In' warning with the original check-in timestamp." },
          { q: "Do security guards need to install an app on their phones?", a: "No. URPASS runs completely within standard mobile browsers (Safari, Chrome, Firefox). Guards simply open a secure link, allow camera access, and begin scanning immediately." },
          { q: "How fast is the access control scanning per person?", a: "Passes scan and validate in under 0.3 seconds. Door staff can easily check in up to 30 attendees per minute per scanner line without creating entrance bottlenecks." },
          { q: "Can we control access to VIP areas or speaker lounges separately?", a: "Yes. The scanner displays the attendee's ticket category (e.g. VIP, Speaker, Delegate) prominently upon scanning, allowing staff to enforce zone permissions at specific doors." },
          { q: "How many scanning devices can we run at the same time?", a: "You can run unlimited scanning devices simultaneously. All scans synchronize instantaneously across the cloud database to prevent multi-gate duplicate entries." },
        ],
        ctaTitle: "Secure your event access today",
        ctaDescription: "Set up in 5 minutes · Permanent free tier · 30-day free trial on paid plans",
      }}
    />
  );
}
