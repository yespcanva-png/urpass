import type { Metadata } from "next";
import { Building2, Layers, QrCode, ScanLine, ShieldCheck, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Employee Event Registration Software | UrPass",
  description: "Manage town halls, annual day celebrations, offsites and internal corporate gatherings with employee email verification and fast QR check-in.",
  keywords: [
    "employee event registration software",
    "make employee event registration easier",
    "urpass qr ticketing",
    "event check in software",
    "qr ticket scanner",
    "event registration platform"
  ],
  alternates: { canonical: "https://urpass.space/employee-event-registration-software" },
  openGraph: {
    title: "Employee Event Registration Software | UrPass",
    description: "Manage town halls, annual day celebrations, offsites and internal corporate gatherings with employee email verification and fast QR check-in.",
    url: "https://urpass.space/employee-event-registration-software",
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
        badge: "INTERNAL WORKPLACE EXPERIENCES",
        h1: "Make Employee Event Registration Easier",
        canonicalUrl: "https://urpass.space/employee-event-registration-software",
        description: "Manage town halls, annual day celebrations, offsites and internal corporate gatherings with employee email verification and fast QR check-in.",
        ctaLabel: "Set Up Employee Event",
        directAnswer: {
          title: "How Does UrPass Streamline Employee Event Registration?",
          summary: "UrPass simplifies company gatherings, annual days, retreats, and all-hands town halls. Employees register with company email validation, claim plus-one passes for family members, and receive digital QR passes. Gate staff scan 500+ employees in minutes without line congestion or paper badges.",
          keyPoints: ["Domain-restricted registration ensuring only verified employees (@company.com) register", "Integrated plus-one and family quota handling for corporate annual celebrations", "Sub-300ms mobile camera scanning preventing security gate congestion", "Departmental check-in telemetry and live company-wide attendance tracking"],
        },
        keyFactsTable: {
          title: "UrPass vs Internal Google Forms & Intranet Spreadsheets",
          subtitle: "Efficiency and gate control for internal corporate events.",
          headers: ["Event Capability", "UrPass Corporate System", "Google Forms & Printed Lists"],
          rows: [
            {
                        "col1": "Entrance Processing Speed",
                        "col2": "<0.3s instant camera pass validation",
                        "col3": "25 to 40 seconds searching names on paper rosters"
            },
            {
                        "col1": "Plus-One / Family Allotment",
                        "col2": "Automated group limit linked to single QR pass",
                        "col3": "Uncontrolled plus-one additions causing catering shortages"
            },
            {
                        "col1": "Duplicate Entry Prevention",
                        "col2": "Instant atomic lock; pass cannot be shared",
                        "col3": "No duplicate protection; anyone can state a colleague's ID"
            },
            {
                        "col1": "Catering & Dietary Data",
                        "col2": "Real-time live count of meal preferences",
                        "col3": "Static Google Sheet with outdated headcounts"
            },
            {
                        "col1": "Security Gate Deployment",
                        "col2": "Security staff scan via standard mobile browser",
                        "col3": "Expensive badge printing terminals or manual sign-offs"
            }
],
        },
        features: [
          { icon: Building2, title: "Corporate Domain Verification", desc: "Restrict registration to authorized work emails (e.g. name@acme.corp) to prevent outside signups." },
          { icon: Users, title: "Family & Plus-One Allotments", desc: "Allocate controlled 1, 2, or 4-person family quotas for company annual days and family picnics." },
          { icon: QrCode, title: "Mobile Wallet QR Passes", desc: "Deliver secure digital passes to employee inboxes and smartphones with custom corporate branding." },
          { icon: ScanLine, title: "Lightning Gate Scanning", desc: "Process hundreds of arriving staff members per minute through campus turnstiles and security booths." },
          { icon: Layers, title: "Departmental Telemetry", desc: "Monitor check-in ratios by department (Engineering, Sales, HR, Finance) in real time." },
          { icon: ShieldCheck, title: "Tamper-Proof Employee Pass", desc: "Cryptographic tokens prevent employees from forwarding passes to non-eligible acquaintances." }
        ],
        steps: [
          { n: "01", title: "Define Corporate Event", desc: "Set date, venue, total employee capacity, and authorized corporate email domains." },
          { n: "02", title: "Employees Register", desc: "Staff input their employee ID, select dietary requirements, and indicate family attendance." },
          { n: "03", title: "Pass Generation", desc: "UrPass generates an encrypted QR ticket with employee credentials and entry limits." },
          { n: "04", title: "Security Check-In", desc: "Volunteers or security guards scan employee passes on their phones in under 0.3s." },
          { n: "05", title: "Live Headcount Telemetry", desc: "HR and facilities teams view real-time headcount to coordinate catering and seating." }
        ],
        callout: {
          badge: "CAMPUS & RESORT READY",
          title: "Eliminate morning security gridlocks at your company annual day.",
          description: "When 1,000 employees and their families arrive at an offsite resort or convention center, manual sign-in tables cause chaotic lines. UrPass provides frictionless gate flow.",
          bullets: ["Process massive arrival waves smoothly with multiple volunteer smartphones", "Accurate headcount data for caterers, bus transport, and safety officers", "Ensure only active employees and registered family members gain admission", "Zero waste: eliminate thousands of plastic lanyard badges and paper tickets"],
        },
        faqs: [
          { q: "Can we restrict registrations to our company email domain?", a: "Yes. UrPass can enforce email domain validation (e.g., only @company.com) so external parties cannot access the registration form." },
          { q: "How does the system handle employee family members arriving together?", a: "You can configure a group entry limit (e.g., admitting up to 4 family members). The single QR code tracks used vs remaining family admissions seamlessly." },
          { q: "Can staff scan passes without downloading an app?", a: "Yes. The UrPass scanner runs directly in any modern mobile web browser (Chrome, Safari) with zero app installation needed." },
          { q: "Can we capture dietary preferences for event catering?", a: "Yes. Custom form fields capture vegetarian, vegan, and allergy notes with real-time aggregated totals for caterers." }
        ],
        relatedLinks: [
          { title: "Corporate Visitor Registration", href: "/corporate-visitor-registration-software", category: "Product" },
          { title: "Group QR Ticket Check-In", href: "/group-qr-ticket-check-in", category: "Product" },
          { title: "Event Capacity Management", href: "/event-capacity-management-software", category: "Product" },
          { title: "Duplicate QR Ticket Detection", href: "/duplicate-qr-ticket-detection", category: "Product" }
        ],
      }}
    />
  );
}
