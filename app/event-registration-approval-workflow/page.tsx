import type { Metadata } from "next";
import { Users, CheckCircle2, XCircle, ShieldCheck, Mail, Zap, BarChart3, Filter } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Approval Workflow & Attendee Screening | URPASS",
  description:
    "Review and approve event attendees before issuing passes. Custom screening questions, 1-click approval queues, and automated digital pass dispatch.",
  keywords: [
    "event registration approval workflow",
    "attendee screening software",
    "event application review queue",
    "gated event registration",
    "event approval system",
    "curated attendee management",
  ],
  alternates: { canonical: "https://urpass.space/event-registration-approval-workflow" },
  openGraph: {
    title: "Event Registration Approval Workflow & Attendee Screening | URPASS",
    description: "Review and approve event attendees before issuing passes with custom screening queues.",
    url: "https://urpass.space/event-registration-approval-workflow",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "CURATED ATTENDEE SCREENING",
        h1: "Event Registration Approval Workflow & Screening Queues",
        canonicalUrl: "https://urpass.space/event-registration-approval-workflow",
        description:
          "Screen applications, verify professional credentials, and curate high-quality attendee rosters. 1-click approvals with automated cryptographic pass delivery.",
        ctaLabel: "Set Up Approval Queue Free",
        directAnswer: {
          title: "How Does the URPASS Registration Approval Workflow Work?",
          summary:
            "URPASS allows organizers to gate ticket issuance behind an approval workflow. Registrants submit custom application questions (such as portfolio links, company titles, or student credentials). Organizers review candidate submissions in a centralized queue and approve or reject with 1 click. Upon approval, URPASS automatically generates and dispatches a unique digital QR pass to the attendee via email.",
          keyPoints: [
            "Enable approval mode on any event to prevent automated public pass issuance",
            "Screen custom responses including LinkedIn URLs, student roll numbers, and project portfolios",
            "1-click individual or bulk approval with instantaneous automated pass dispatch via email",
            "Audit reason logging for rejected applications with customizable notification templates",
          ],
        },
        keyFactsTable: {
          title: "Approval Workflow vs Instant Ticketing",
          subtitle: "Comparison of registration management modes on URPASS.",
          headers: ["Capability", "Approval Workflow Mode", "Instant Registration Mode"],
          rows: [
            { col1: "Pass Issuance Trigger", col2: "Explicit organizer approval in dashboard", col3: "Instantaneous upon form submit / payment" },
            { col1: "Ideal Event Types", col2: "VIP summits, hackathons, investor dinners", col3: "Public concerts, campus fests, open meetups" },
            { col1: "Custom Screening Fields", col2: "Required URLs, portfolios, custom questions", col3: "Standard name, email, phone" },
            { col1: "Automated Rejection Handling", col2: "Clean audit logging with customizable notice", col3: "N/A" },
            { col1: "AI Agent Approval Support", col2: "Native MCP tools (`approve_attendee`)", col3: "Automated database triggers" },
          ],
        },
        features: [
          { icon: Filter, title: "Custom Screening Questions", desc: "Collect GitHub profiles, LinkedIn URLs, company names, or student roll numbers to evaluate candidate fit." },
          { icon: CheckCircle2, title: "1-Click Approval Queue", desc: "Review applications in an intuitive table and approve qualified attendees with a single click." },
          { icon: Mail, title: "Instant Pass Dispatch", desc: "The exact moment an applicant is approved, a personalized digital QR pass is generated and emailed automatically." },
          { icon: XCircle, title: "Graceful Rejections", desc: "Reject or waitlist candidates cleanly with internal audit notes while keeping the attendee database organized." },
          { icon: ShieldCheck, title: "Tamper-Proof Single-Use Passes", desc: "Approved passes embed cryptographically signed UUID tokens that prevent sharing or duplication." },
          { icon: BarChart3, title: "Pipeline Analytics", desc: "Track total applications, pending review counts, approval rates, and capacity limits in real time." },
        ],
        steps: [
          { n: "01", title: "Enable Approval Mode", desc: "Toggle 'Require Approval' in your event registration settings." },
          { n: "02", title: "Define Screening Form", desc: "Add custom questions to evaluate attendee background, experience, or role." },
          { n: "03", title: "Collect Applications", desc: "Applicants receive immediate confirmation that their registration is under review." },
          { n: "04", title: "Review & Approve", desc: "Organizers approve candidates individually or in bulk from the dashboard." },
          { n: "05", title: "Passes Dispatched Automatically", desc: "Approved guests receive their verified QR pass ready for sub-0.3s gate check-in." },
        ],
        callout: {
          badge: "CURATED EXPERIENCES",
          title: "Ensure the right people are in the room for high-stakes events.",
          description: "Investor dinners, exclusive hackathons, executive roundtables, and VIP summits require strict curation. URPASS gives organizers complete control over who receives a pass.",
          bullets: [
            "Prevent open registration flooding from unqualified applicants",
            "Eliminate manual email mail-merges to notify accepted attendees",
            "Integrates natively with Model Context Protocol (MCP) for automated AI candidate screening",
            "Zero per-ticket percentage cuts on any approved paid or free passes",
          ],
        },
        faqs: [
          { q: "Can attendees see why their registration is pending?", a: "Yes. When an attendee submits their registration, they see an immediate on-screen confirmation and receive an email stating that their application is under review by the organizer." },
          { q: "Can I approve attendees in bulk?", a: "Yes. You can filter the applicant list and approve multiple qualified attendees simultaneously, triggering pass generation for all of them." },
          { q: "Can AI assistants approve attendees automatically?", a: "Yes. Using the URPASS Model Context Protocol (MCP) server, autonomous agents or Claude Desktop can screen candidate responses against criteria and call `approve_attendee` via natural language." },
          { q: "Does the approval workflow cost extra?", a: "No. The approval workflow is included in all URPASS plans, including the permanent Free Tier." },
        ],
        relatedLinks: [
          { title: "Event Registration Approval System", href: "/event-registration-approval-system", category: "Product" },
          { title: "Hackathon Registration Platform", href: "/hackathon-registration-platform", category: "Use Case" },
          { title: "Model Context Protocol Hub", href: "/mcp-event-management", category: "Product" },
          { title: "Attendee Management Software", href: "/attendee-management", category: "Product" },
        ],
      }}
    />
  );
}
