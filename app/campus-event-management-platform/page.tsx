import type { Metadata } from "next";
import { Building2, Users, Ticket, QrCode, ShieldCheck, Smartphone, Zap, BarChart3, GraduationCap, Briefcase } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Campus Event Management Platform for Universities & Colleges | URPASS",
  description:
    "Centralized campus event management platform. One institution → multiple departments → multiple clubs → multiple organisers → central administrative control.",
  keywords: [
    "campus event management platform",
    "college event management system",
    "university event ticketing software",
    "campus venue management",
    "student club event software",
    "multi department campus events",
    "college event registration platform",
    "campus qr check-in",
  ],
  alternates: { canonical: "https://urpass.space/campus-event-management-platform" },
  openGraph: {
    title: "Campus Event Management Platform for Universities & Colleges | URPASS",
    description: "Centralized campus event management platform: One institution → multiple departments → multiple clubs → central control.",
    url: "https://urpass.space/campus-event-management-platform",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "CAMPUS-WIDE INSTITUTIONAL PLATFORM",
        h1: "Campus Event Management Platform for Universities & Colleges",
        canonicalUrl: "https://urpass.space/campus-event-management-platform",
        description:
          "Centralize university events across student clubs, academic departments, placement drives, and cultural fests. One institution → multiple departments → multiple clubs → multiple organisers → central administrative control.",
        ctaLabel: "Book Campus Demo",
        ctaHref: "/contact?type=campus-demo",
        secondaryCtaLabel: "Get Institution Pricing",
        secondaryCtaHref: "/pricing#campus",
        directAnswer: {
          title: "How Does the URPASS Campus Event Management Platform Work?",
          summary:
            "URPASS gives colleges, universities, and student unions a single command center to oversee campus-wide events. Academic departments and student societies operate in isolated workspaces with dedicated roles, while the Dean, Registrar, or Principal retains bird's-eye governance over venue capacities, budgets, roll-number verification, and sub-0.3s QR gate check-ins.",
          keyPoints: [
            "Hierarchy Governance: One institution → multiple departments → multiple clubs → central control",
            "Student ID Verification: Automated roll-number, department, and student ID photo validation",
            "Multi-Gate QR Check-In: Student volunteers scan passes using mobile cameras (<0.28s) with PIN-protected access",
            "Financial Sovereignty: Direct UPI (GPay/PhonePe) & netbanking deposits with 0% platform commission",
          ],
        },
        keyFactsTable: {
          title: "Campus Governance & Multi-Department Architecture",
          subtitle: "Institutional capabilities for college administrations and student councils.",
          headers: ["Campus Requirement", "URPASS Campus Infrastructure", "Siloed Consumer Event Tools"],
          rows: [
            { col1: "Department & Club Isolation", col2: "Multi-tenant workspaces under centralized university console", col3: "Dozens of scattered individual accounts & passwords" },
            { col1: "Institutional Governance", col2: "One institution → multiple departments → multiple clubs → central control", col3: "No hierarchical visibility for Deans or Principals" },
            { col1: "Campus Venue Terminals", col2: "Manage physical venues (Main Auditorium, Ground, Seminar Hall)", col3: "No physical location or terminal awareness" },
            { col1: "Student Volunteer RBAC", col2: "PIN-based scanner access (no admin access exposed)", col3: "Sharing master credentials with student volunteers" },
            { col1: "Platform Commission", col2: "0% ticket commission on all campus fests and workshops", col3: "5% to 8% cut taken from student council budgets" },
            { col1: "Accreditation Reporting", col2: "Audit-ready attendance rosters with NAAC/NBA documentation", col3: "Manual collation across fragmented Google Sheets" },
          ],
        },
        features: [
          { icon: Building2, title: "Multi-Department Workspaces", desc: "Segregate events across Engineering, Management, Arts, and Student Union clubs while maintaining executive oversight." },
          { icon: Users, title: "Campus Venue & Gate Control", desc: "Manage physical campus locations (Auditorium, Open-Air Theatre, Sports Complex) with assigned gate scanners and capacity locks." },
          { icon: ShieldCheck, title: "5-Tier RBAC Governance", desc: "Assign least-privilege permissions ensuring student volunteers can only scan tickets, while faculty heads manage budgets." },
          { icon: QrCode, title: "Custom Student Pass Studio", desc: "Design campus passes with college logos, student roll numbers, and cryptographically verified single-use QR codes." },
          { icon: Smartphone, title: "Sub-0.28s Volunteer Gate Scanner", desc: "Student gate volunteers open a secure PIN link in Safari or Chrome to scan tickets in under 0.3s with loud audio chimes." },
          { icon: BarChart3, title: "Campus-Wide Analytics", desc: "Track total event registrations, auditorium occupancy rates, and student turnout metrics across all campus programs." },
        ],
        deepDiveSections: [
          {
            badge: "CAMPUS ARCHITECTURE",
            title: "One Institution → Multiple Departments → Multiple Clubs → Central Control",
            paragraphs: [
              "Universities host hundreds of activities each semester: technical symposiums, hackathons, guest lectures, cultural nights, alumni reunions, and placement drives. When departments use disjointed Google Forms, student councils lose control over attendee safety, double registrations, and ticket revenues.",
              "URPASS models the real organizational hierarchy of higher education. College administrators provision a master campus account, create departmental workspaces (e.g. Computer Science, Mechanical, MBA, Student Affairs), and delegate club permissions to elected student coordinators without surrendering institutional control.",
            ],
            bullets: [
              "HODs review and approve student club event proposals before registrations go live",
              "Placement cells manage recruiter check-ins with multi-round attendance tracking",
              "Institutional single sign-on (SSO) and role separation keep academic records isolated",
              "Campus-wide executive dashboard provides real-time headcounts across all active gates",
            ],
            takeaway: "Eliminate scattered Google Forms with an institutional event operating system built for modern colleges.",
          },
        ],
        callout: {
          badge: "ACCREDITATION READY",
          title: "Provide verified attendance documentation for university accreditation.",
          description: "Accreditation bodies (such as NAAC and NBA in India, or QAA in the UK) require documented proof of student seminar and symposium participation. URPASS delivers timestamped, tamper-proof audit trails for every event on campus.",
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
          { title: "College Event Registration Software", href: "/college-event-registration-software", category: "Product" },
          { title: "Student Club Event Management", href: "/student-club-event-management", category: "Use Case" },
          { title: "College Fest Management Software", href: "/college-fest-registration-software", category: "Use Case" },
          { title: "Technical Fest Registration Software", href: "/tech-fest-registration-software", category: "Use Case" },
          { title: "Placement Drive Registration Software", href: "/placement-drive-registration-software", category: "Use Case" },
          { title: "Campus QR Check-In System", href: "/campus-qr-check-in", category: "Product" },
        ],
      }}
    />
  );
}
