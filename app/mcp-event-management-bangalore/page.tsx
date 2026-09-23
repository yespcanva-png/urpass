import type { Metadata } from "next";
import { MapPin, Bot, Terminal, QrCode, ShieldCheck, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "MCP Event Management Platform Bangalore | AI Ticketing URPASS",
  description:
    "Model Context Protocol (MCP) event ticketing and QR check-in platform for Bangalore tech summits, Koramangala hackathons, and AI meetups. Manage passes in Claude and Cursor.",
  keywords: [
    "MCP event management Bangalore",
    "Bangalore tech event AI ticketing",
    "Model Context Protocol Bangalore",
    "Koramangala hackathon check-in",
    "Indiranagar AI meetup ticketing",
    "URPASS Bangalore MCP",
  ],
  alternates: { canonical: "https://urpass.space/mcp-event-management-bangalore" },
  openGraph: {
    title: "MCP Event Management Platform Bangalore | AI Ticketing URPASS",
    description: "Manage Bangalore tech conferences, hackathons, and developer meetups with AI agents via Model Context Protocol.",
    url: "https://urpass.space/mcp-event-management-bangalore",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bangalore, India",
    "geo.position": "12.9716;77.5946",
    ICBM: "12.9716, 77.5946",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "BANGALORE TECH HUB & AI AGENTS",
        h1: "MCP Event Management Platform for Bangalore",
        canonicalUrl: "https://urpass.space/mcp-event-management-bangalore",
        geo: {
          region: "KA",
          placename: "Bangalore",
          position: "12.9716;77.5946",
          latitude: 12.9716,
          longitude: 77.5946,
        },
        description:
          "India's Silicon Valley runs on AI agents. URPASS brings official Model Context Protocol (MCP) support to Bangalore organizers—letting tech teams manage hackathons, developer meetups, and summits in Koramangala, Indiranagar, and Whitefield directly from Claude Desktop and Cursor.",
        ctaLabel: "Launch Bangalore MCP Event",
        features: [
          { icon: MapPin, title: "Built for Bangalore Tech Ecosystem", desc: "Designed for Koramangala demo days, Indiranagar AI meetups, Whitefield tech summits, and Electronic City hackathons." },
          { icon: Bot, title: "AI Agent Pass Management", desc: "Command Claude Desktop or Cursor to screen developer applications, approve hacker teams, and issue dynamic QR passes." },
          { icon: Terminal, title: "Native Cursor & Claude Stdio", desc: "Bangalore engineering teams run 'npx urpass-mcp' directly inside their codebases and daily developer workflows." },
          { icon: QrCode, title: "Sub-0.3s Gate Check-in", desc: "Clear 1,000+ attendee morning rushes at Bangalore tech park auditoriums and campus venues with zero queue delays." },
          { icon: Zap, title: "Razorpay UPI Ticketing", desc: "Accept INR payments via Google Pay, PhonePe, Paytm, and cards with zero per-ticket commission fees." },
          { icon: ShieldCheck, title: "Cryptographic Gate Security", desc: "Atomic database verification prevents pass screenshot fraud, duplicate entries, and unauthorized venue access." },
        ],
        steps: [
          { n: "01", title: "Create Bangalore Event", desc: "Set up your meetup, fest, or summit on URPASS with custom ticket tiers and INR pricing." },
          { n: "02", title: "Mount MCP Configuration", desc: "Add urpass-mcp to your team's Claude Desktop or .cursor/mcp.json file using your developer API key." },
          { n: "03", title: "Automate Registrations", desc: "Let AI agents evaluate tech stack questions, screen candidates, and issue VIP passes automatically." },
          { n: "04", title: "Deploy Gate Scanners", desc: "Gate volunteers open /scan on their mobile phones at venue entrances—no app downloads or hardware rentals." },
          { n: "05", title: "Live Real-Time Telemetry", desc: "Track attendance velocity live, watching check-in metrics stream into your organizer dashboard." },
        ],
        callout: {
          badge: "BANGALORE STARTUP SPEED",
          title: "The ticketing and entry stack built for India's AI capital.",
          description: "Bangalore hosts hundreds of high-density AI hackathons, founder mixers, and developer conferences every month. Traditional ticketing platforms with manual spreadsheets and slow check-in apps slow you down. URPASS MCP gives Bangalore organizers autonomous AI superpowers to operate events with engineering velocity.",
          bullets: [
            "Trusted across Bangalore tech communities, universities, and coworking hubs",
            "Zero per-ticket fees — keep 100% of your paid ticket revenue",
            "Local Razorpay UPI integration for instant checkout on mobile phones",
            "Full stdio and remote JSON-RPC 2.0 MCP server compatibility",
          ],
        },
        deepDiveSections: [
          {
            badge: "HACKATHONS & SUMMITS",
            title: "Operating massive tech hackathons across Bangalore venues",
            paragraphs: [
              "From 24-hour hackathons in HSR Layout to flagship multi-track conferences at KTPO Whitefield and Palace Grounds, organizers face intense morning check-in spikes.",
              "With URPASS MCP, volunteer teams can query attendee records conversationally, verify multi-meal tickets, and monitor entrance throughput across all gates in real time.",
            ],
            takeaway: "Deliver an effortless, futuristic entry experience for Bangalore's top tech talent.",
          },
          {
            badge: "COMMUNITY INTEGRATION",
            title: "Connecting developer meetups with automated Discord & Slack bots",
            paragraphs: [
              "Bangalore's developer communities coordinate across Discord, Telegram, and Slack. By connecting URPASS MCP to your community bot, attendees can RSVP directly within chat channels.",
              "The bot invokes issue_pass, returning dynamic pass URLs with instant calendar reminders and venue directions.",
            ],
            takeaway: "Maximize attendance conversion and eliminate no-shows for free tech meetups.",
          },
        ],
        faqs: [
          { q: "Is URPASS suitable for college fests in Bangalore?", a: "Yes! Top Bangalore colleges use URPASS for inter-collegiate fests, tech symposiums, and cultural events." },
          { q: "Can we scan passes at venues with spotty mobile networks?", a: "Yes. The scanner caches verification tokens client-side, allowing continuous entry verification even during network dips." },
          { q: "How much does URPASS cost for Bangalore organizers?", a: "Free tier offers 2 events/month at ₹0 forever. Paid plans start at ₹499/mo with a 30-day free trial." },
        ],
        relatedLinks: [
          { title: "Bangalore Event Software Guide", href: "/event-registration-software-bangalore", category: "Location" },
          { title: "MCP Server for Events", href: "/mcp-server-for-events", category: "Product" },
          { title: "MCP Hackathon Management", href: "/mcp-hackathon-management", category: "Use Case" },
          { title: "Developer API Documentation", href: "/docs", category: "Guide" },
        ],
      }}
    />
  );
}
