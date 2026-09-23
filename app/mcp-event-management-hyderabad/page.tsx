import type { Metadata } from "next";
import { MapPin, Bot, Terminal, QrCode, ShieldCheck, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "MCP Event Management Platform Hyderabad | AI Ticketing URPASS",
  description:
    "Model Context Protocol (MCP) event ticketing and QR check-in platform for Hyderabad tech conferences, HITEC City summits, and Gachibowli hackathons. Manage passes in Claude and Cursor.",
  keywords: [
    "MCP event management Hyderabad",
    "Hyderabad tech conference AI ticketing",
    "Model Context Protocol Hyderabad",
    "HITEC City event check in",
    "Gachibowli hackathon ticketing",
    "URPASS Hyderabad MCP",
  ],
  alternates: { canonical: "https://urpass.space/mcp-event-management-hyderabad" },
  openGraph: {
    title: "MCP Event Management Platform Hyderabad | AI Ticketing URPASS",
    description: "Manage Hyderabad tech conferences, pharmaceutical summits, and college fests with AI agents via Model Context Protocol.",
    url: "https://urpass.space/mcp-event-management-hyderabad",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-TG",
    "geo.placename": "Hyderabad, India",
    "geo.position": "17.3850;78.4867",
    ICBM: "17.3850, 78.4867",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "HYDERABAD TECH & HITEC CITY",
        h1: "MCP Event Management Platform for Hyderabad",
        canonicalUrl: "https://urpass.space/mcp-event-management-hyderabad",
        geo: {
          region: "TG",
          placename: "Hyderabad",
          position: "17.3850;78.4867",
          latitude: 17.3850,
          longitude: 78.4867,
        },
        description:
          "From HITEC City enterprise summits and HICC trade expos to Gachibowli AI hackathons and university festivals: URPASS brings Model Context Protocol (MCP) to Hyderabad organizers. Control tickets, verify attendee passes, and query gate analytics conversationally through AI assistants.",
        ctaLabel: "Launch Hyderabad MCP Event",
        features: [
          { icon: MapPin, title: "Optimized for Hyderabad Venues", desc: "Proven at HICC Novotel, HITEX Exhibition Centre, T-Hub summits, and campus auditoriums across Gachibowli." },
          { icon: Bot, title: "Conversational Pass Ops", desc: "Ask Claude or Cursor to issue VIP delegate badges, approve enterprise registrations, or analyze gate throughput." },
          { icon: Terminal, title: "Stdio & Remote JSON-RPC", desc: "Integrate directly into your engineering team's developer workflow with 'npx urpass-mcp' or cloud APIs." },
          { icon: QrCode, title: "Sub-0.3s Door Verification", desc: "Keep gate queues moving rapidly with fast browser-based QR scanning on any mobile phone." },
          { icon: Zap, title: "UPI & Net Banking Ready", desc: "Seamless Razorpay integration with zero per-ticket platform commissions, saving lakhs on enterprise ticket sales." },
          { icon: ShieldCheck, title: "Tamper-Proof Pass Cryptography", desc: "Every pass is protected by 256-bit cryptographic tokens that eliminate screenshot forgery and pass reuse." },
        ],
        steps: [
          { n: "01", title: "Setup Hyderabad Event", desc: "Configure your event details, ticket categories, and custom registration fields on URPASS." },
          { n: "02", title: "Mount MCP Credentials", desc: "Add your organizer API key to claude_desktop_config.json or .cursor/mcp.json." },
          { n: "03", title: "Screen Registrations with AI", desc: "Let AI agents auto-approve delegates, categorize sponsors, and dispatch branded digital passes." },
          { n: "04", title: "Manage Venue Entrances", desc: "Volunteers open the scanner URL on venue Wi-Fi or 5G to verify arriving guests in under 0.3 seconds." },
          { n: "05", title: "Monitor Real-Time Headcounts", desc: "Query attendance stats live to track hall capacity and executive keynote occupancy." },
        ],
        callout: {
          badge: "ENTERPRISE & T-HUB SPEED",
          title: "Scale from startup demo days to 5,000+ delegate international summits.",
          description: "Hyderabad's rapid growth as an AI and enterprise technology capital demands high-velocity event infrastructure. URPASS MCP replaces bulky ticketing kiosks with lean, browser-first QR scanning and autonomous AI management.",
          bullets: [
            "Widely utilized across Hyderabad tech companies, T-Hub startups, and universities",
            "Zero per-ticket fees — save tens of thousands compared to legacy ticketing portals",
            "Fast UPI checkouts via PhonePe, Google Pay, Paytm, and local cards",
            "Real-time sync across multi-gate entrances at massive convention centers",
          ],
        },
        deepDiveSections: [
          {
            badge: "MULTI-GATE CONVENTIONS",
            title: "Operating multi-gate entrances at HICC and HITEX Hyderabad",
            paragraphs: [
              "Venues like Hyderabad International Convention Centre (HICC) require distributed check-in across multiple gates, VIP lanes, and exhibition hall entrances. Traditional scanners often suffer synchronization lag.",
              "URPASS MCP synchronizes all gate check-ins atomically through Supabase PostgreSQL, ensuring a pass scanned at Gate 1 cannot be reused at Gate 4 a moment later.",
            ],
            takeaway: "Bulletproof gate security for high-profile business and government summits.",
          },
          {
            badge: "STUDENT & HACKATHON FESTS",
            title: "Supporting Hyderabad engineering colleges and hackathon leagues",
            paragraphs: [
              "Colleges in Hyderabad, IIIT-H, and university fests frequently deal with huge student turnouts and tight event budgets. Traditional ticketing platforms take heavy cuts of ticket sales.",
              "URPASS offers a permanent free tier and flat monthly plans with zero per-ticket commission, making enterprise-grade AI check-in accessible to student organizers.",
            ],
            takeaway: "Empower student tech leaders with industry-grade event technology.",
          },
        ],
        faqs: [
          { q: "Can we use URPASS for closed corporate townhalls in HITEC City?", a: "Yes. Private events can be password-protected or restricted to domain-whitelisted email addresses." },
          { q: "Does the scanner require specialized hardware?", a: "No. Any volunteer's smartphone or tablet browser acts as a high-speed scanner at /scan." },
          { q: "Can URPASS handle spot registrations on event day?", a: "Yes. Attendees can scan an on-site QR code, fill out the form, and get their pass issued instantly." },
        ],
        relatedLinks: [
          { title: "Hyderabad Event Software Guide", href: "/event-registration-software-hyderabad", category: "Location" },
          { title: "AI Conference Management", href: "/ai-conference-management", category: "Use Case" },
          { title: "MCP Server for Events", href: "/mcp-server-for-events", category: "Product" },
          { title: "Developer API Reference", href: "/docs", category: "Guide" },
        ],
      }}
    />
  );
}
