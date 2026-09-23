import type { Metadata } from "next";
import { MapPin, Bot, Terminal, QrCode, ShieldCheck, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "MCP Event Management Platform Mumbai | AI Ticketing URPASS",
  description:
    "Model Context Protocol (MCP) event ticketing and QR check-in platform for Mumbai financial summits, Jio World Centre expos, BKC conferences, and entertainment galas.",
  keywords: [
    "MCP event management Mumbai",
    "Mumbai financial summit AI ticketing",
    "Model Context Protocol Mumbai",
    "Jio World Convention Centre check-in",
    "BKC corporate event ticketing",
    "URPASS Mumbai MCP",
  ],
  alternates: { canonical: "https://urpass.space/mcp-event-management-mumbai" },
  openGraph: {
    title: "MCP Event Management Platform Mumbai | AI Ticketing URPASS",
    description: "Manage Mumbai financial summits, entertainment galas, and trade expos with AI agents via Model Context Protocol.",
    url: "https://urpass.space/mcp-event-management-mumbai",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-MH",
    "geo.placename": "Mumbai, India",
    "geo.position": "19.0760;72.8777",
    ICBM: "19.0760, 72.8777",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "MUMBAI FINANCIAL HUB & ENTERTAINMENT",
        h1: "MCP Event Management Platform for Mumbai",
        canonicalUrl: "https://urpass.space/mcp-event-management-mumbai",
        geo: {
          region: "MH",
          placename: "Mumbai",
          position: "19.0760;72.8777",
          latitude: 19.0760,
          longitude: 72.8777,
        },
        description:
          "India's financial and entertainment capital demands premier event execution. From high-stakes investor summits in BKC and luxury exhibitions at Jio World Convention Centre to creative showcases at Nesco Goregaon: URPASS brings Model Context Protocol (MCP) to Mumbai organizers for AI-driven attendee management and sub-second QR check-in.",
        ctaLabel: "Launch Mumbai MCP Event",
        features: [
          { icon: MapPin, title: "Optimized for Mumbai Premier Venues", desc: "Proven at Jio World Convention Centre BKC, NESCO Goregaon, Nehru Centre Worli, and 5-star hotel ballrooms across Mumbai." },
          { icon: Bot, title: "VIP Concierge & AI Approvals", desc: "Let AI assistants review investor credentials, approve executive passes, and dispatch personalized digital invites." },
          { icon: Terminal, title: "Developer & Enterprise Stdio", desc: "Deploy 'npx urpass-mcp' directly into your workflow or connect enterprise bots to our remote JSON-RPC 2.0 API." },
          { icon: QrCode, title: "Sub-0.3s Red Carpet Check-in", desc: "Deliver an effortless arrival experience for high-profile guests using rapid browser-based QR scanning." },
          { icon: Zap, title: "Zero Ticket Platform Fees", desc: "Keep 100% of high-ticket conference sales with transparent monthly plans and native Razorpay UPI checkout." },
          { icon: ShieldCheck, title: "Cryptographic VIP Protection", desc: "Tamper-proof pass tokens prevent uninvited gatecrashers, screenshot sharing, and duplicate entries." },
        ],
        steps: [
          { n: "01", title: "Create Mumbai Event", desc: "Configure your summit, gala, or exhibition on URPASS with custom executive tiers and INR pricing." },
          { n: "02", title: "Add MCP Server Credentials", desc: "Mount the urpass-mcp server to your team's Claude Desktop or Cursor configuration." },
          { n: "03", title: "Screen & Issue VIP Passes", desc: "AI agents parse corporate registrations, approve delegates, and deliver branded digital passes." },
          { n: "04", title: "Scan at Venue Doors", desc: "Hostesses and security staff scan dynamic QR passes on any mobile phone in under 0.3 seconds." },
          { n: "05", title: "Live Real-Time Telemetry", desc: "Track arrival velocity and check VIP lounge capacity live via conversational AI queries." },
        ],
        callout: {
          badge: "BKC & JIO WORLD CENTRE",
          title: "The high-touch ticketing platform for Mumbai's executive summits.",
          description: "Mumbai's financial summits and luxury expos require flawless presentation and uncompromising security. Traditional ticketing systems with cluttered generic branding and slow paper registration desks fail to impress executive delegates. URPASS pairs elegant, responsive digital passes with autonomous AI operations.",
          bullets: [
            "Trusted across BFSI enterprises, creative agencies, and trade expos",
            "Zero per-ticket fees — save hundreds of thousands on expensive summit passes",
            "Seamless Apple Wallet pass export for executive attendees",
            "Multi-gate synchronization across massive convention venues",
          ],
        },
        deepDiveSections: [
          {
            badge: "VIP ARRIVAL HANDLING",
            title: "Managing VIP delegates and investors at BKC summits",
            paragraphs: [
              "When managing C-suite executives and venture investors at BKC conferences, delays at registration desks are unacceptable. High-profile guests expect instant, dignified admission.",
              "With URPASS, VIP guests show their Apple Wallet pass or web pass, and door staff verify credentials in under 0.3 seconds with verify_pass, triggering instant welcome notifications to host coordinators.",
            ],
            takeaway: "Redefine VIP arrival hospitality with sub-second cryptographic entry.",
          },
          {
            badge: "TRADE EXPOS AT NESCO",
            title: "High-capacity crowd control at Nesco and Bombay Exhibition Centre",
            paragraphs: [
              "Trade exhibitions at Nesco Goregaon frequently experience thousands of morning arrivals across multiple entrance gates. If scanner hardware malfunctions or networks slow down, long outdoor queues form quickly.",
              "URPASS browser scanners require no hardware rentals: staff use standard mobile phones on local 5G or Wi-Fi with client-side token caching, ensuring uninterrupted throughput.",
            ],
            takeaway: "Eliminate entrance lines at Mumbai's largest exhibition centers.",
          },
        ],
        faqs: [
          { q: "Can we customize the pass design with corporate sponsor logos?", a: "Yes! The custom pass designer allows full branding, sponsor logos, custom brand colors, and tier badges." },
          { q: "Can organizers receive WhatsApp alerts when specific VIPs arrive?", a: "Yes. Webhook triggers can notify team members on WhatsApp or Slack the instant a VIP pass is scanned." },
          { q: "Does URPASS support corporate GST invoices for Mumbai businesses?", a: "Yes. Automated GST tax invoices are provided for all subscription and ticketing transactions." },
        ],
        relatedLinks: [
          { title: "Mumbai Event Software Guide", href: "/event-registration-software-mumbai", category: "Location" },
          { title: "AI Conference Management", href: "/ai-conference-management", category: "Use Case" },
          { title: "Award Ceremonies & Galas", href: "/award-ceremonies", category: "Use Case" },
          { title: "Developer API Documentation", href: "/docs", category: "Guide" },
        ],
      }}
    />
  );
}
