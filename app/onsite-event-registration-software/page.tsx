import type { Metadata } from "next";
import { UserPlus, Search, CreditCard, Printer, CheckCircle2, ShieldCheck, Zap, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Onsite Event Registration Software & Walk-In Box Office | URPASS",
  description:
    "Fast onsite walk-in registration desk, delegate lookup, box office payment collection (UPI, Cash, Card), instant pass generation, and on-demand badge printing in under 15 seconds.",
  keywords: [
    "onsite event registration software",
    "walk-in event registration desk",
    "event box office software",
    "onsite attendee check-in and payment",
    "conference registration desk software",
    "instant badge printing at check-in",
    "onsite ticket sales software",
    "walk-in ticketing system",
  ],
  alternates: { canonical: "https://urpass.space/onsite-event-registration-software" },
  openGraph: {
    title: "Onsite Event Registration Software & Walk-In Box Office | URPASS",
    description:
      "Handle walk-in delegates in under 15 seconds. Instant attendee search, multi-payment collection, digital pass generation, and on-demand badge printing.",
    url: "https://urpass.space/onsite-event-registration-software",
    siteName: "URPASS by Yesp Corporation",
    type: "website",
  },
};

export default function OnsiteEventRegistrationPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/onsite-event-registration-software",
        badge: "ONSITE BOX OFFICE & WALK-IN DESK",
        h1: "Onsite Event Registration Software & Walk-In Box Office",
        description:
          "Eliminate long registration desk queues on event morning. Search pre-registered delegates, register new walk-in attendees in seconds, collect payments (Cash, UPI, Card), and print physical credentials with zero lag.",
        ctaLabel: "Set Up Onsite Registration Free",
        directAnswer: {
          title: "How does URPASS power onsite walk-in registration desks?",
          summary:
            "URPASS equips event registration desks with an ultra-responsive browser interface built for rapid attendee lookup and high-speed walk-in intake. Pre-registered attendees are retrieved instantly by typing their name, phone number, email, or scanning an existing barcode. For walk-in visitors, desk volunteers input essential details in under 15 seconds, select ticket tiers, log payment across Cash, UPI, Card, or Complimentary waivers, issue a digital QR pass, print a physical badge immediately, and mark the attendee as checked in simultaneously.",
          keyPoints: [
            "Sub-15-second walk-in attendee registration workflow with automated credential creation",
            "Instant global attendee search across thousands of pre-registered records with typo tolerance",
            "Flexible box office payment collection supporting Cash, UPI QR, Credit Card, and Comp waivers",
            "Automated one-click badge print trigger upon walk-in creation or pre-registered check-in",
            "Multi-terminal real-time synchronization preventing duplicate registrations across desk lanes",
          ],
        },
        keyFactsTable: {
          title: "URPASS Onsite Registration Desk vs Legacy Paper & Box Office Systems",
          subtitle: "Why conferences, symposiums, and sports arenas replace manual desks with URPASS.",
          headers: ["Desk Capability", "URPASS Onsite Registration Desk", "Legacy Paper Rosters & Manual Desks"],
          rows: [
            { col1: "Walk-In Throughput Speed", col2: "Under 15 seconds per walk-in delegate", col3: "3 to 5 minutes filling out paper slips and manual receipt books" },
            { col1: "Attendee Roster Lookup", col2: "Instant indexed search by partial name, email, or phone", col3: "Flipping through hundreds of printed alphabetical binder pages" },
            { col1: "Payment Logging", col2: "Integrated multi-mode tracking: Cash, UPI, Card, Complimentary", col3: "Loose cash boxes and untracked handwritten receipts" },
            { col1: "Credential Issuance", col2: "Instant thermal badge print + automatic digital QR pass", col3: "Handwritten stick-on badges that smudge and peel off" },
            { col1: "Multi-Desk Sync", col2: "Real-time edge sync across all registration terminals and lanes", col3: "Zero synchronization; high risk of duplicate free entries" },
            { col1: "Onsite Audit Trail", col2: "Every desk action, payment log, and reprint recorded cryptographically", col3: "No record of who checked in which delegate or received payments" },
          ],
        },
        features: [
          {
            icon: UserPlus,
            title: "Ultra-Fast Walk-In Registration",
            desc: "Collect essential attendee details, assign ticket categories, and issue credentials in under 15 seconds without slowing down entrance queues.",
          },
          {
            icon: Search,
            title: "Lightning-Fast Attendee Search",
            desc: "Find pre-registered delegates in milliseconds by searching first name, last name, phone digits, or company name with smart typo tolerance.",
          },
          {
            icon: CreditCard,
            title: "Multi-Mode Payment Collection",
            desc: "Accept payments right at the desk: Dynamic UPI QR generation for instant phone scans, cash drawer reconciliation, card terminal logs, or comp passes.",
          },
          {
            icon: Printer,
            title: "Direct-to-Printer Badge Triggering",
            desc: "Checking in an attendee or finishing a walk-in registration automatically fires a print job to connected Zebra, Brother, or Epson thermal printers.",
          },
          {
            icon: Users,
            title: "Multi-Terminal Lane Synchronization",
            desc: "Deploy 2, 5, or 20 registration desk lanes concurrently on iPads, laptops, or tablets. Roster updates reflect across all terminals in real time.",
          },
          {
            icon: ShieldCheck,
            title: "Complete Onsite Financial Audit Trail",
            desc: "Track every payment collected, complimentary waiver granted, and ticket tier switch with desk volunteer attribution and timestamped audit logs.",
          },
        ],
        steps: [
          {
            n: "01",
            title: "Launch Desk on Any Tablet or Laptop",
            desc: "Open your event desk link on registration desk iPads, laptops, or touchscreen terminals without installing proprietary software.",
          },
          {
            n: "02",
            title: "Search Attendee or Add Walk-In",
            desc: "Retrieve pre-registered delegates to hand out badges, or enter walk-in attendee information with rapid keyboard shortcuts.",
          },
          {
            n: "03",
            title: "Collect Payment & Print Badge",
            desc: "Record payment with one click; the system prints the attendee badge and marks them checked in automatically in one motion.",
          },
        ],
        useCases: [
          "College Technical Symposiums & Cultural Fests",
          "Technology Summits & Developer Hackathons",
          "Medical, Scientific & Academic Congresses",
          "B2B Industrial Trade Shows & Expo Pavilions",
          "Marathons, Sports Tournaments & Charity Runs",
          "Corporate Annual General Meetings (AGM) & Townhalls",
        ],
        faqs: [
          {
            q: "Can desk staff handle both pre-registered and walk-in attendees?",
            a: "Yes. The unified desk interface enables volunteers to search pre-registered delegates to print badges or check them in, as well as register new walk-in attendees from the exact same screen without switching modes.",
          },
          {
            q: "How are cash and UPI payments tracked for walk-ins?",
            a: "Staff select payment method (Cash, UPI, Card, Invoice, Complimentary). For UPI payments, the screen displays a dynamic QR code for the attendee to scan and pay on their phone, logging the transaction ID directly into the event financial report.",
          },
          {
            q: "What hardware is required to run the registration desk?",
            a: "URPASS operates in any modern web browser. You can run registration desks on standard laptops (Mac, Windows, Chromebooks), tablets (iPads, Android tablets), or mobile phones connected to standard thermal badge printers.",
          },
          {
            q: "What happens if the registration desk loses internet connection?",
            a: "URPASS features offline-first local caching. Desks continue searching local attendee lists, recording walk-ins, and printing badges. As soon as internet connectivity is restored, all records synchronize automatically.",
          },
          {
            q: "Can we ask custom questions during walk-in registration?",
            a: "Yes. Organizers can configure mandatory or optional intake fields—such as Meal Preference, College/Company Name, Designation, or T-Shirt Size—to collect during onsite registration.",
          },
          {
            q: "Is onsite registration desk software included in the free tier?",
            a: "Yes! URPASS includes full onsite desk functionality on the Free Forever plan (2 events/month, up to 50 attendees per event), giving organizers complete enterprise-level box office capabilities with zero software licensing costs.",
          },
        ],
        relatedLinks: [
          { title: "Event Badge Printing Software", href: "/event-badge-printing-software", category: "Product" },
          { title: "Event Zone Access Control", href: "/event-zone-access-control-software", category: "Product" },
          { title: "Event Lead Retrieval Software", href: "/event-lead-retrieval-software", category: "Product" },
          { title: "Multi-Gate QR Scanner", href: "/multi-gate-qr-scanner", category: "Product" },
          { title: "Offline Event Check-In System", href: "/offline-event-check-in-system", category: "Product" },
        ],
        ctaTitle: "Streamline your morning event check-in rush",
        ctaDescription: "Sub-15-second walk-in intake · Multi-mode payment collection · Instant badge printing",
      }}
    />
  );
}
