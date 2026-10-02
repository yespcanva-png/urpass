import type { Metadata } from "next";
import { Store, Building2, Users, LayoutGrid, Compass, ShieldCheck, CheckCircle2, Award } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Exhibitor Management Software & Trade Show Booth Portal | URPASS",
  description:
    "Streamline trade show exhibitor onboarding, booth allocation, staff credentials, and digital directories. Empower vendors with self-service exhibitor portals.",
  keywords: [
    "exhibitor management software",
    "trade show exhibitor portal",
    "booth management software",
    "expo exhibitor management",
    "digital exhibitor directory",
    "exhibitor onboarding software",
    "trade show floor management",
    "conference exhibitor registration",
  ],
  alternates: { canonical: "https://urpass.space/exhibitor-management-software" },
  openGraph: {
    title: "Exhibitor Management Software & Trade Show Booth Portal | URPASS",
    description:
      "All-in-one trade show exhibitor software: self-service company profiles, booth mapping, staff pass management, and digital attendee exhibitor directories.",
    url: "https://urpass.space/exhibitor-management-software",
    siteName: "URPASS by Yesp Corporation",
    type: "website",
  },
};

export default function ExhibitorManagementPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/exhibitor-management-software",
        badge: "TRADE SHOW EXPO OPERATIONS",
        h1: "Exhibitor Management Software & Trade Show Booth Portal",
        description:
          "Ditch messy spreadsheets and manual email threads. Centralize exhibitor registration, booth allocation, staff badge credentialing, and live digital exhibitor directories in one unified platform.",
        ctaLabel: "Manage Exhibitors Free",
        directAnswer: {
          title: "How does URPASS streamline trade show exhibitor management?",
          summary:
            "URPASS provides trade show organizers with an automated command center and dedicated self-service exhibitor portals. Organizers configure exhibition halls and assign booth numbers, sizes, and categories. Exhibiting companies receive private portal access to upload branding assets, describe product lines, allocate exhibitor staff passes, and track onsite booth check-in status. Delegates explore a responsive digital exhibitor directory to discover vendors and schedule 1-on-1 meetings.",
          keyPoints: [
            "Self-service exhibitor portal for independent profile, asset, and staff pass management",
            "Dynamic hall and booth allocation system tracking dimensions, power specs, and status",
            "Instant exhibitor staff pass generation with automated QR credentials for gate entry",
            "Searchable digital exhibitor directory with category filtering for attendees",
            "Seamless integration with in-booth lead capture and B2B matchmaking workflows",
          ],
        },
        keyFactsTable: {
          title: "URPASS Exhibitor Portal vs Manual Spreadsheet Expo Management",
          subtitle: "Compare automated vendor self-service against legacy email-and-spreadsheet chaos.",
          headers: ["Operational Workflow", "URPASS Exhibitor Management", "Manual Spreadsheets & Email Chains"],
          rows: [
            { col1: "Vendor Onboarding", col2: "Self-service portal where exhibitors upload logos, descriptions & staff lists", col3: "Dozens of back-and-forth emails chasing logos and rosters" },
            { col1: "Booth & Hall Allocation", col2: "Centralized booth registry mapped by hall, zone, size, and assignment", col3: "Scattered Excel files prone to duplicate booth double-bookings" },
            { col1: "Staff Pass Credentialing", col2: "Exhibitors issue official QR staff passes directly within portal quotas", col3: "Manual printing of temporary badges on morning of show" },
            { col1: "Attendee Directory", col2: "Live searchable digital directory with real-time profile updates", col3: "Static printed paper show guides that become outdated immediately" },
            { col1: "Lead Capture Integration", col2: "Integrated mobile QR badge scanning built directly into exhibitor accounts", col3: "Separate expensive third-party vendor scanners with isolated data" },
            { col1: "Booth Onsite Arrival", col2: "Automated booth check-in timestamps to verify vendor show readiness", col3: "Floor marshals walking rows with clipboards checking off booths" },
          ],
        },
        features: [
          {
            icon: Store,
            title: "Dedicated Exhibitor Self-Service Portal",
            desc: "Provide each exhibiting organization with a branded login to manage their company bio, upload logos, configure marketing tags, and view booth assignments.",
          },
          {
            icon: LayoutGrid,
            title: "Comprehensive Booth & Hall Management",
            desc: "Assign booth numbers, square meterage, hall zones, and setup statuses (Reserved, Confirmed, Setup Complete) with real-time floor oversight.",
          },
          {
            icon: Users,
            title: "Staff Pass & Credential Allocation",
            desc: "Set staff quota limits per booth package. Exhibitors independently register team members, generating verified QR credentials for early hall access.",
          },
          {
            icon: Compass,
            title: "Interactive Digital Exhibitor Directory",
            desc: "Attendees search and filter exhibitors by industry category, hall location, and product offerings on any mobile device or event touchscreen kiosk.",
          },
          {
            icon: ShieldCheck,
            title: "Live Booth Arrival & Check-In Tracking",
            desc: "Monitor exhibitor arrival timestamps on opening morning to identify vacant booths and ensure all exhibitors are operational before doors open.",
          },
          {
            icon: Award,
            title: "Seamless Lead Retrieval & B2B Matchmaking",
            desc: "Natively connects with URPASS lead retrieval scanning and 1-on-1 meeting schedulers, giving vendors maximum commercial return on their exhibition investment.",
          },
        ],
        steps: [
          {
            n: "01",
            title: "Configure Booths & Expo Halls",
            desc: "Define your floor plan zones, create booth numbers with size specifications, and set staff pass allowances per package.",
          },
          {
            n: "02",
            title: "Invite Exhibitors to Portal",
            desc: "Send automated invitations. Exhibitors log in, complete company profiles, upload promotional collateral, and register booth staff.",
          },
          {
            n: "03",
            title: "Publish Directory & Track Onsite",
            desc: "Launch the digital exhibitor directory for attendee discovery and monitor live booth setup readiness and staff check-ins on show day.",
          },
        ],
        useCases: [
          "B2B Industrial & Manufacturing Trade Expos",
          "Medical, Biotech & Healthcare Congresses",
          "Consumer Electronics & Emerging Tech Conventions",
          "Renewable Energy & Sustainability Summits",
          "University Campus Recruitment & Career Fairs",
          "Franchise, Real Estate & Investment Pavilions",
        ],
        faqs: [
          {
            q: "How do exhibitors log into their dedicated portal?",
            a: "When an organizer registers an exhibiting company, an invitation email with a secure authentication link is dispatched. Exhibitors can log in without complex software installations to manage their profiles and booth team.",
          },
          {
            q: "Can exhibitors manage their own booth staff passes?",
            a: "Yes. Organizers define a staff pass quota per booth size or sponsorship tier (e.g., 4 passes for 9sqm, 8 passes for 36sqm). Exhibitors input their staff names and emails directly, issuing official QR credentials automatically.",
          },
          {
            q: "Does the digital exhibitor directory update in real time?",
            a: "Yes. Any changes made by exhibitors—such as updated product descriptions, logos, or booth phone contacts—reflect instantly on the public attendee-facing directory without requiring republishing.",
          },
          {
            q: "Can exhibitors also capture leads from the same platform?",
            a: "Absolutely. URPASS natively integrates exhibitor portal management with mobile QR lead retrieval, allowing booth staff to scan attendee badges with zero additional software licenses.",
          },
          {
            q: "How does booth check-in work on show day?",
            a: "When exhibitor staff scan their passes at the gate or booth marshals verify setup completion, the system logs a live booth arrival timestamp, providing organizers with real-time hall occupancy visibility.",
          },
          {
            q: "What are the pricing terms for exhibitor management?",
            a: "URPASS includes exhibitor management features in its Free Forever tier (up to 50 attendees and 2 events/month) so organizers can test full expo workflows, with scalable tiers available for large multi-hall expos.",
          },
        ],
        relatedLinks: [
          { title: "Event Lead Retrieval Software", href: "/event-lead-retrieval-software", category: "Product" },
          { title: "Event Sponsorship Management", href: "/event-sponsorship-management-software", category: "Product" },
          { title: "B2B Event Matchmaking Software", href: "/b2b-event-matchmaking-software", category: "Product" },
          { title: "Event Badge Printing Software", href: "/event-badge-printing-software", category: "Product" },
          { title: "Event Zone Access Control", href: "/event-zone-access-control-software", category: "Product" },
        ],
        ctaTitle: "Modernize your trade show exhibitor experience",
        ctaDescription: "Self-service vendor portal · Digital live directory · Integrated lead capture",
      }}
    />
  );
}
