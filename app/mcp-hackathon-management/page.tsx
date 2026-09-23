import type { Metadata } from "next";
import { Terminal, Users, Code, Trophy, ShieldCheck, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "MCP Hackathon Management & Team Registration | URPASS",
  description:
    "Manage hackathon applications, team passes, hacker badges, and mentor check-ins using AI agents and Model Context Protocol (MCP) in Cursor and Claude Desktop.",
  keywords: [
    "MCP hackathon management",
    "hackathon registration MCP",
    "hacker badge generator AI",
    "hackathon team check-in",
    "AI hackathon coordinator",
    "hackathon event ticketing MCP",
    "URPASS hackathons",
  ],
  alternates: { canonical: "https://urpass.space/mcp-hackathon-management" },
  openGraph: {
    title: "MCP Hackathon Management & Team Registration | URPASS",
    description: "Run 24-hour hackathons, approve team registrations, and verify hacker badges effortlessly with AI assistants via MCP.",
    url: "https://urpass.space/mcp-hackathon-management",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "BUILT FOR BUILDERS & HACKATHONS",
        h1: "MCP Hackathon Management & Team Registration",
        canonicalUrl: "https://urpass.space/mcp-hackathon-management",
        description:
          "Hackathons move fast. Manage team applications, hacker credentials, meal passes, and judging check-ins directly inside Cursor IDE or Claude Desktop using URPASS Model Context Protocol (MCP) tools.",
        ctaLabel: "Run Your Hackathon with MCP",
        features: [
          { icon: Terminal, title: "Cursor & Claude Native", desc: "Co-ordinate your entire hackathon operations directly inside the same IDE you and your hackers use to build." },
          { icon: Users, title: "Team Registration & Pass Grouping", desc: "Issue linked digital passes for teams of 2 to 5 builders with unified team badges and shared project identifiers." },
          { icon: Trophy, title: "Mentor & Judge Pass Tiers", desc: "Create specialized passes for mentors, sponsors, and judges with custom venue access permissions and credentials." },
          { icon: ShieldCheck, title: "Cryptographic Meal Passes", desc: "Prevent duplicate meal line redemptions using multi-session QR verification across breakfast, lunch, and midnight snacks." },
          { icon: Zap, title: "Sub-Second Hacker Check-In", desc: "Scan 500+ arriving hackers in under 15 minutes at the venue door with zero paper rosters or queue delays." },
          { icon: Code, title: "GitHub & Resume Screening", desc: "Instruct AI agents to screen hacker application links, GitHub repositories, and tech stacks for competitive hackathons." },
        ],
        steps: [
          { n: "01", title: "Launch Hackathon Portal", desc: "Create your hackathon event on URPASS with custom team registration questions and tiered ticket categories." },
          { n: "02", title: "Add MCP to Cursor", desc: "Add urpass-mcp to your hackathon repository's .cursor/mcp.json file for seamless developer operations." },
          { n: "03", title: "Auto-Screen & Approve Teams", desc: "Prompt your agent: 'Review all pending applications and approve teams with complete GitHub portfolios.'" },
          { n: "04", title: "Midnight Check-In & Meal Scanning", desc: "Use URPASS mobile browser scanner or AI gate tools to check in hackers at door gates and food stations." },
          { n: "05", title: "Live Attendance Telemetry", desc: "Query check-in stats anytime to confirm which teams have arrived and are active in the hacking hall." },
        ],
        callout: {
          badge: "DEVELOPER EVENT VELOCITY",
          title: "The operating system for 24-to-48 hour hackathons.",
          description: "Organizing a hackathon involves non-stop chaos: midnight arrivals, team reshuffling, dietary requirements, and mentor routing. URPASS MCP puts the entire operational command center in your terminal and AI chat, letting you focus on the hackathon experience.",
          bullets: [
            "Tested at premier university and company hackathons with 1,000+ participants",
            "Differentiate hacker, mentor, volunteer, and judge badges with custom colors",
            "Multi-gate scanning ensures hackers cannot claim multiple swag bags or meals",
            "Direct webhook triggers to Discord or Slack channels when hackers check in",
          ],
        },
        deepDiveSections: [
          {
            badge: "MULTI-USE CHECK-IN",
            title: "Handling door admission, swag distribution, and meals",
            paragraphs: [
              "Hackathons require multiple verification touchpoints: initial venue entry, hardware desk checkout, swag pickup, and multiple meal distributions. Traditional paper wristbands tear or get lost.",
              "URPASS dynamic passes allow verified multi-point check-in. Organizers can designate gates such as 'Hardware Lab', 'Lunch Station', and 'Midnight Pizza', logging each redemption against the attendee's record.",
            ],
            takeaway: "Eliminate food wastage and track hacker flow across the entire 48-hour event.",
          },
          {
            badge: "IDE AUTOMATION",
            title: "Why running hackathon ops in Cursor IDE is a game-changer",
            paragraphs: [
              "Hackathon organizers are almost always developers. Switching between terminal, Discord, Google Sheets, and ticketing portals is distracting.",
              "With URPASS MCP in Cursor, you can write Discord bot listeners in one tab, while instructing Cursor Composer in another tab to issue 10 VIP judge passes and print the arrival report.",
            ],
            takeaway: "Maintain complete focus and build custom hackathon integrations in minutes.",
          },
        ],
        faqs: [
          { q: "Can team members share a single registration?", a: "Each hacker receives their own personalized cryptographic QR pass, linked under a common team identifier." },
          { q: "Can we check in hackers without Wi-Fi if the venue network drops?", a: "Yes. The browser scanner maintains offline validation caches to ensure check-ins proceed uninterrupted." },
          { q: "Does URPASS charge per-ticket fees for free student hackathons?", a: "No! URPASS charges zero per-ticket commission fees, making it completely budget-friendly for student events." },
        ],
        relatedLinks: [
          { title: "Hackathons & Buildathons Guide", href: "/hackathons", category: "Use Case" },
          { title: "Cursor MCP Event Ticketing", href: "/cursor-mcp-event-ticketing", category: "Product" },
          { title: "AI Agent Event Registration", href: "/ai-agent-event-registration", category: "Product" },
          { title: "Organize Registration for a Hackathon", href: "/guides/how-to-organize-registration-for-a-hackathon", category: "Guide" },
        ],
      }}
    />
  );
}
