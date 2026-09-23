import type { Metadata } from "next";
import { Users, Bot, Filter, Sparkles, CheckCircle2, UserCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "AI Attendee Management Software & Guest Lists | URPASS",
  description:
    "Supercharge attendee management with AI. Segment guest lists, automate ticket approvals, manage VIPs, and sync attendee databases in real time using Model Context Protocol (MCP).",
  keywords: [
    "AI attendee management",
    "AI guest list software",
    "automated attendee approval",
    "MCP attendee management",
    "event guest list AI",
    "AI event roster synchronization",
    "URPASS attendee management",
  ],
  alternates: { canonical: "https://urpass.space/ai-attendee-management" },
  openGraph: {
    title: "AI Attendee Management Software & Guest Lists | URPASS",
    description: "Manage, segment, and communicate with event attendees using autonomous AI tools and Model Context Protocol.",
    url: "https://urpass.space/ai-attendee-management",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "AI GUEST LIST INTELLIGENCE",
        h1: "AI Attendee Management Software & Guest Lists",
        canonicalUrl: "https://urpass.space/ai-attendee-management",
        description:
          "Ditch cumbersome spreadsheets and manual email chains. URPASS AI Attendee Management leverages Model Context Protocol (MCP) to let AI assistants query, filter, segment, approve, and communicate with event participants conversationally.",
        ctaLabel: "Manage Attendees with AI",
        features: [
          { icon: Bot, title: "Conversational Attendee Querying", desc: "Ask your AI assistant: 'Show all senior engineering leads registered from Bangalore' and get instant formatted rosters." },
          { icon: Filter, title: "Smart Segmentation & Tagging", desc: "Automatically categorize attendees into VIPs, Speakers, Sponsors, Media, or General Admission based on profile attributes." },
          { icon: UserCheck, title: "Automated Approval Pipelines", desc: "Define criteria to approve vetted attendees automatically while routing edge cases to an organizer review queue." },
          { icon: Sparkles, title: "Batch Pass Generation", desc: "Command AI agents to issue branded digital passes to hundreds of participants simultaneously with personalized welcome messages." },
          { icon: Users, title: "Real-Time Roster Synchronization", desc: "Keep attendee statuses updated across registration portals, gate check-in scanners, and your CRM in real time." },
          { icon: CheckCircle2, title: "Post-Event Follow-up Automation", desc: "Trigger automated feedback surveys and certificate distribution based on verified attendee check-in timestamps." },
        ],
        steps: [
          { n: "01", title: "Connect Attendee Roster", desc: "Import attendees via CSV or collect registrations directly via your custom URPASS public link." },
          { n: "02", title: "Mount MCP Tools", desc: "Connect Claude, Cursor, or your autonomous agent with list_attendees, get_attendee, and approve_attendee." },
          { n: "03", title: "Filter & Segment with Prompts", desc: "Prompt your agent: 'Identify all registered attendees who haven't completed their company details.'" },
          { n: "04", title: "Execute Targeted Operations", desc: "Direct the agent to send reminder emails, upgrade VIPs, or approve pending applicants in bulk." },
          { n: "05", title: "Analyze Gate Check-In Velocity", desc: "Track live attendance as guests check in, comparing registered vs actual turnout by category." },
        ],
        callout: {
          badge: "SEAMLESS AUDIENCE MANAGEMENT",
          title: "The modern guest list platform built for high-touch events.",
          description: "Managing thousands of participants across multiple ticket tiers is complex. URPASS unifies attendee communications, approvals, and check-in history into a clean data model accessible by both human organizers and autonomous AI assistants.",
          bullets: [
            "Search across 50,000+ attendee records in under 100 milliseconds",
            "Custom metadata fields for dietary preferences, t-shirt sizes, and job titles",
            "Automatic synchronization with WhatsApp and email delivery channels",
            "Comprehensive audit history for every status change and pass re-issuance",
          ],
        },
        deepDiveSections: [
          {
            badge: "DYNAMIC SEGMENTATION",
            title: "How AI agents segment guest lists for targeted outreach",
            paragraphs: [
              "Organizers frequently need targeted lists on the fly—such as notifying all Python developers about a specialized breakout session, or alerting VIP badge holders about an exclusive breakfast reception.",
              "Using the list_attendees MCP tool with query parameters, AI assistants can filter by job title, organization, registration date, or ticket tier, creating dynamic segments without building complex SQL queries.",
            ],
            takeaway: "Empower your team with instant, personalized communication across attendee cohorts.",
          },
          {
            badge: "DATA PRIVACY & COMPLIANCE",
            title: "Strict data privacy and role-based permissions",
            paragraphs: [
              "Attendee contact data is protected by strict encryption at rest and in transit. The URPASS MCP server enforces scoped authorization: AI agents can only view and mutate attendees associated with events owned by your organizer account.",
              "Exported rosters adhere to data protection regulations, with full masking and anonymization options available for public post-event reporting.",
            ],
            takeaway: "Enterprise-grade compliance meets modern conversational AI speed.",
          },
        ],
        faqs: [
          { q: "Can the AI agent export attendee data to CSV?", a: "Yes. In Claude or Cursor, you can ask the agent to format the list_attendees output into CSV format and save it locally." },
          { q: "Can I undo an accidental approval or rejection?", a: "Yes. Organizers can change an attendee's status at any time from both the web dashboard and MCP tool calls." },
          { q: "Does URPASS deduplicate duplicate registrations?", a: "Yes. URPASS prevents multiple registrations with the same email address for the same event tier." },
        ],
        relatedLinks: [
          { title: "AI Agent Event Registration", href: "/ai-agent-event-registration", category: "Use Case" },
          { title: "AI Event Analytics", href: "/ai-event-analytics", category: "Product" },
          { title: "Attendee Management Platform", href: "/attendee-management", category: "Product" },
          { title: "Developer API Reference", href: "/docs", category: "Guide" },
        ],
      }}
    />
  );
}
