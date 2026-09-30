import type { Metadata } from "next";
import { Building2, Users, Ticket, QrCode, ShieldCheck, Smartphone, Zap, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Campus Event Management Platform for Universities & Colleges | URPASS",
  description:
    "Centralized campus event management platform. Manage multi-department workspaces, student clubs, campus venues, and QR check-in gates from one console.",
  keywords: [
    "campus event management platform",
    "college event management system",
    "university event ticketing software",
    "campus venue management",
    "student club event software",
    "multi department campus events",
  ],
  alternates: { canonical: "https://urpass.space/campus-event-management-platform" },
  openGraph: {
    title: "Campus Event Management Platform for Universities & Colleges | URPASS",
    description: "Centralized campus event management platform for universities, colleges, and student unions.",
    url: "https://urpass.space/campus-event-management-platform",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "CAMPUS-WIDE INFRASTRUCTURE",
        h1: "Campus Event Management Platform for Universities & Colleges",
        canonicalUrl: "https://urpass.space/campus-event-management-platform",
        description:
          "Centralize university events across student clubs, academic departments, and campus venues. Multi-tenant workspaces, 5-tier RBAC, and sub-0.3s gate check-in.",
        ctaLabel: "Launch Campus Console",
        directAnswer: {
          title: "How Does the URPASS Campus Event Management Platform Work?",
          summary:
            "URPASS provides a unified enterprise organizational console engineered for universities and collegiate institutions. Campus administrators can create segregated workspaces for academic departments and student societies, manage physical campus venues (auditoriums, sports grounds, seminar halls), assign role-based access permissions, and deploy sub-0.3s smartphone camera check-in at campus gates.",
          keyPoints: [
            "Centralized organization console with independent workspaces for student clubs and academic departments",
            "Campus venue & location management across auditoriums, indoor arenas, and seminar complexes",
            "5-tier Role-Based Access Control (RBAC): Owner, Admin, Event Manager, Check-in Staff, Viewer",
            "Instant UPI payments (PhonePe, GPay, Paytm) with 0% platform commission and direct bank deposits",
          ],
        },
        keyFactsTable: {
          title: "Campus Governance & Multi-Department Architecture",
          subtitle: "Institutional capabilities for college administrations and student councils.",
          headers: ["Campus Requirement", "URPASS Campus Infrastructure", "Siloed Consumer Event Tools"],
          rows: [
            { col1: "Department & Club Isolation", col2: "Multi-tenant workspaces under centralized university console", col3: "Dozens of scattered individual accounts & passwords" },
            { col1: "Campus Venue Terminals", col2: "Manage physical venues (Main Auditorium, Ground, Seminar Hall)", col3: "No physical location or terminal awareness" },
            { col1: "Student Volunteer RBAC", col2: "PIN-based scanner access (no admin access exposed)", col3: "Sharing master credentials with student volunteers" },
            { col1: "Platform Commission", col2: "0% ticket commission on all campus fests and workshops", col3: "5% to 8% cut taken from student council budgets" },
            { col1: "Institutional Reporting", col2: "Aggregated university-wide attendance and revenue exports", col3: "Manual collation across fragmented spreadsheets" },
          ],
        },
        features: [
          { icon: Building2, title: "Multi-Department Workspaces", desc: "Segregate events across Engineering, Management, Arts, and Student Union clubs while maintaining executive oversight." },
          { icon: Users, title: "Campus Venue Management", desc: "Manage physical campus locations (Auditorium, Open-Air Theatre, Sports Complex) with assigned gate scanners." },
          { icon: ShieldCheck, title: "5-Tier RBAC Governance", desc: "Assign least-privilege permissions ensuring student volunteers can only scan tickets, while faculty heads manage budgets." },
          { icon: QrCode, title: "Custom Student Pass Studio", desc: "Design campus passes with college logos, student roll numbers, and cryptographically verified single-use QR codes." },
          { icon: Smartphone, title: "Sub-0.3s Volunteer Gate Scanner", desc: "Student gate volunteers open a secure PIN link in Safari or Chrome to scan tickets in under 0.3s with loud audio chimes." },
          { icon: BarChart3, title: "Campus-Wide Analytics", desc: "Track total event registrations, auditorium occupancy rates, and student turnout metrics across all campus programs." },
        ],
        steps: [
          { n: "01", title: "Create University Console", desc: "Set up your university organization and define departmental workspaces." },
          { n: "02", title: "Assign Faculty & Club Roles", desc: "Invite faculty coordinators as Admins and student club heads as Event Managers." },
          { n: "03", title: "Schedule Campus Events", desc: "Departments publish academic seminars, hackathons, and cultural fests independently." },
          { n: "04", title: "Deploy Gate Scanners", desc: "Student volunteers scan passes at campus auditorium gates using smartphone cameras." },
          { n: "05", title: "Review Institutional Logs", desc: "Export campus-wide attendance rosters for university administration and accreditation records." },
        ],
        callout: {
          badge: "ACCREDITATION READY",
          title: "Provide verified attendance documentation for university accreditation.",
          description: "Accreditation committees (such as NAAC and NBA in India, or QAA in the UK) require documented proof of student seminar and symposium participation. URPASS delivers timestamped, tamper-proof audit trails for every event on campus.",
          bullets: [
            "Permanent Free Tier available for departmental clubs and community student meetups",
            "Zero per-ticket percentage cuts keeping student union budgets intact",
            "Works completely offline if campus Wi-Fi drops during large cultural fests",
            "Centralized audit logs with 1-click CSV exports for university authorities",
          ],
        },
        faqs: [
          { q: "Can different student clubs manage their events without seeing each other's data?", a: "Yes. Workspaces provide complete operational isolation. The Robotics Club cannot modify or view private registrations for the Cultural Fest, while campus administrators retain executive oversight." },
          { q: "How do student volunteers scan passes at the auditorium gates?", a: "Volunteers open a secure web link in mobile Safari or Chrome and enter a 6-digit scanner PIN. They do not need to download an app or create an account." },
          { q: "Can we sell tickets for inter-college events via UPI?", a: "Yes. Connect your university or student council Razorpay account to collect UPI payments directly with 0% platform commission." },
          { q: "Can we track which students attended which specific workshops?", a: "Yes. Every scan records the exact attendee, workshop session, entrance gate, and millisecond timestamp, exportable as an audit-ready CSV roster." },
        ],
        relatedLinks: [
          { title: "University Fest Ticketing Platform", href: "/university-fest-ticketing-platform", category: "Use Case" },
          { title: "Campus Events Platform", href: "/campus-events", category: "Use Case" },
          { title: "College Fest Management Software", href: "/college-fest-management-software", category: "Use Case" },
          { title: "Browser QR Code Scanner", href: "/qr-code-scanner", category: "Product" },
        ],
      }}
    />
  );
}
