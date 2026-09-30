import type { Metadata } from "next";
import { Code2, Zap, ShieldCheck, Users, Smartphone, BarChart3, Ticket, CheckCircle2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Hackathon Check-In System & Hacker Pass Platform | URPASS",
  description:
    "Fast check-in and hacker badge verification for 24-48 hour hackathons. Team screening, swag/meal tracking, sub-0.3s camera scanning, and zero app downloads.",
  keywords: [
    "hackathon check in system",
    "hackathon badge check in",
    "hackathon registration software",
    "hacker pass generator",
    "hackathon entry management",
    "hackathon team screening",
  ],
  alternates: { canonical: "https://urpass.space/hackathon-check-in-system" },
  openGraph: {
    title: "Hackathon Check-In System & Hacker Pass Platform | URPASS",
    description: "Fast check-in and hacker badge verification for 24-48 hour hackathons.",
    url: "https://urpass.space/hackathon-check-in-system",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "HACKATHON INFRASTRUCTURE",
        h1: "High-Velocity Hackathon Check-In & Hacker Pass System",
        canonicalUrl: "https://urpass.space/hackathon-check-in-system",
        description:
          "Screen applicants, verify GitHub profiles, issue cryptographic hacker passes, and check in hundreds of developers at midnight in under 0.3s per scan without paper lists.",
        ctaLabel: "Set Up Hackathon Free",
        directAnswer: {
          title: "How Does URPASS Streamline Hackathon Check-In?",
          summary:
            "URPASS is designed for fast-paced 24-48 hour hackathons. Organizers can screen hacker applications, collect GitHub and team information, approve candidates with 1 click, and issue single-use digital passes with QR codes. At venue check-in, volunteers scan hacker passes on their smartphones in under 0.3 seconds with audible chimes, eliminating late-night entrance delays.",
          keyPoints: [
            "Hacker application screening with GitHub profile, team name, and dietary requirement capture",
            "Sub-0.3s camera check-in on volunteer smartphones in mobile Safari/Chrome with zero app downloads",
            "Single-use cryptographic tokens prevent pass sharing and unauthorized venue access",
            "Native Model Context Protocol (MCP) server integration for automated AI screening and check-ins",
          ],
        },
        keyFactsTable: {
          title: "Hackathon Operations Matrix",
          subtitle: "Engineered for 24-48 hour hacker logistics and venue security.",
          headers: ["Operation", "URPASS Solution", "Manual Sheets / Google Forms"],
          rows: [
            { col1: "Hacker Screening & Approval", col2: "1-Click acceptance queues with automatic pass email", col3: "Manual spreadsheet email merges" },
            { col1: "Midnight Check-In Speed", col2: "< 0.3s per hacker on volunteer phones", col3: "Long lines in cold lobbies searching names" },
            { col1: "Team & Dietary Tracking", col2: "Custom form fields for team name, T-shirt size, meals", col3: "Scattered form columns prone to error" },
            { col1: "Badge Format Options", col2: "Lanyard badge (440x640) or mobile wallet pass", col3: "Handwritten paper name tags" },
            { col1: "AI Agent Automation", col2: "Native Model Context Protocol (MCP) tool support", col3: "No AI agent integration possible" },
          ],
        },
        features: [
          { icon: Code2, title: "Hacker Application Screening", desc: "Review developer applications, portfolio links, and GitHub handles with streamlined acceptance and rejection queues." },
          { icon: Zap, title: "Sub-0.3s Midnight Gate Entry", desc: "Volunteers scan incoming hackers on personal phone cameras in under 0.3s with clear audio chimes and haptics." },
          { icon: ShieldCheck, title: "Anti-Pass Sharing Guard", desc: "Cryptographic single-use tokens ensure non-participants cannot gain entry using forwarded pass screenshots." },
          { icon: Users, title: "Team & Swag Coordination", desc: "Collect T-shirt sizes, dietary preferences, and team names during registration for easy logistics prep." },
          { icon: Ticket, title: "Hacker Badge & Pass Design", desc: "Create high-contrast digital passes, printable tickets, or conference lanyard badges in Ticket Studio." },
          { icon: BarChart3, title: "Real-Time Turnout Analytics", desc: "Track verified hacker arrival numbers, no-show rates, and capacity limits live from any device." },
        ],
        steps: [
          { n: "01", title: "Configure Hackathon", desc: "Set hackathon dates, venue, application deadlines, and custom questions." },
          { n: "02", title: "Collect Hacker Applications", desc: "Developers apply with GitHub handles, project tracks, and team details." },
          { n: "03", title: "Approve & Dispatch Passes", desc: "1-click approvals automatically trigger unique digital QR passes to accepted hackers." },
          { n: "04", title: "Deploy Volunteer Scanners", desc: "Organizers share a PIN link with staff to activate smartphone camera scanning." },
          { n: "05", title: "Rapid Night Check-In", desc: "Admit hundreds of hackers in minutes without entrance chaos or queue slowdowns." },
        ],
        callout: {
          badge: "DEVELOPER READY",
          title: "The only event platform with native Model Context Protocol (MCP) for AI hackathons.",
          description: "Organizers can hook Claude Desktop or Cursor directly to URPASS via MCP to inspect hacker rosters, query team counts, and approve registrations via natural language.",
          bullets: [
            "Native Model Context Protocol (MCP) server with 10 production tools",
            "Zero platform fee: 100% free tier for community hackathons up to 100 hackers",
            "Offline check-in resilience in case venue Wi-Fi drops during arrival rush",
            "Instant CSV roster exports for sponsor reporting and prize distribution",
          ],
        },
        faqs: [
          { q: "Can we collect GitHub links and team names during registration?", a: "Yes. Custom form fields can collect GitHub profiles, LinkedIn URLs, team names, T-shirt sizes, and dietary restrictions." },
          { q: "Can we approve hackers manually before sending passes?", a: "Yes. URPASS has built-in approval workflows. Applications remain in pending status until you approve them individually or in bulk, which immediately dispatches their QR pass." },
          { q: "Does the scanner work in dark or dim venue lighting?", a: "Yes. The scanner uses high-contrast QR decoding algorithms and screen backlighting from the attendee's phone to recognize passes in under 0.3s even in dim auditoriums." },
          { q: "Can we use AI agents to manage our hackathon via MCP?", a: "Yes. Connect Claude Desktop or Cursor to `https://urpass.space/api/mcp` or run `npx urpass-mcp` to approve hackers and inspect stats using conversational AI." },
        ],
        relatedLinks: [
          { title: "Hackathon Registration Platform", href: "/hackathon-registration-platform", category: "Use Case" },
          { title: "Model Context Protocol Hub", href: "/mcp-event-management", category: "Product" },
          { title: "How to Organize a Hackathon Guide", href: "/guides/how-to-organize-registration-for-a-hackathon", category: "Guide" },
          { title: "Browser QR Code Scanner", href: "/qr-code-scanner", category: "Product" },
        ],
      }}
    />
  );
}
