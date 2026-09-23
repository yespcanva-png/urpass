import type { Metadata } from "next";
import { MessageSquare, Bot, Sparkles, Send, ShieldCheck, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "AI Event Ticketing Bot & Conversational RSVP Agent | URPASS",
  description:
    "Build conversational event ticketing bots and RSVP assistants for WhatsApp, Telegram, and Slack. Issue dynamic QR passes conversationally via Model Context Protocol (MCP).",
  keywords: [
    "AI event ticketing bot",
    "conversational RSVP agent",
    "WhatsApp event ticketing bot",
    "Telegram event registration bot",
    "MCP ticketing bot",
    "Slack event check in bot",
    "URPASS AI ticketing bot",
  ],
  alternates: { canonical: "https://urpass.space/ai-event-ticketing-bot" },
  openGraph: {
    title: "AI Event Ticketing Bot & Conversational RSVP Agent | URPASS",
    description: "Issue event passes, manage RSVPs, and check attendees in through conversational chat bots powered by URPASS MCP.",
    url: "https://urpass.space/ai-event-ticketing-bot",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "CONVERSATIONAL RSVP & TICKETING",
        h1: "AI Event Ticketing Bot & Conversational RSVP Agent",
        canonicalUrl: "https://urpass.space/ai-event-ticketing-bot",
        description:
          "Allow attendees to register, get questions answered, and receive digital entry passes directly inside WhatsApp, Telegram, Slack, or website chat. Powered by URPASS MCP, your conversational AI bot issues cryptographic QR passes with zero human intervention.",
        ctaLabel: "Deploy Your Ticketing Bot",
        features: [
          { icon: MessageSquare, title: "Omnichannel Messaging", desc: "Deploy your ticketing assistant across WhatsApp Business, Telegram, Slack, Discord, or embedded web chat widgets." },
          { icon: Bot, title: "Natural RSVP Dialogues", desc: "Attendees RSVP conversationally: 'I'd like 2 tickets for the AI summit on Saturday'—bot collects details and issues passes." },
          { icon: Sparkles, title: "Instant Dynamic Pass Delivery", desc: "The bot invokes issue_pass and delivers high-resolution cryptographic QR pass cards directly into the chat thread." },
          { icon: Send, title: "Automated WhatsApp Reminders", desc: "Send automated day-of reminders with one-click pass retrieval links to maximize event show-up velocity." },
          { icon: Zap, title: "FAQ & Event Knowledge", desc: "The bot answers venue directions, parking availability, speaker schedules, and dress code inquiries 24/7." },
          { icon: ShieldCheck, title: "Secure Payment Collection", desc: "Integrates with Razorpay payment links for paid tickets, releasing pass tokens only upon verified payment webhook." },
        ],
        steps: [
          { n: "01", title: "Connect Chat Platform", desc: "Link your WhatsApp Business API, Telegram bot token, or Slack app to your agent runtime." },
          { n: "02", title: "Mount URPASS MCP Tools", desc: "Equip your bot with list_events, issue_pass, and verify_pass using the remote /api/mcp endpoint." },
          { n: "03", title: "Attendee Initiates Chat", desc: "The user sends a message: 'Hi! Can I register for the developer meetup this evening?'" },
          { n: "04", title: "Bot Collects Details & Issues Pass", desc: "Bot validates name and email, calls issue_pass, and receives the tamper-proof pass token URL." },
          { n: "05", title: "Attendee Checks In", desc: "Attendee displays the QR image sent in the chat thread to venue staff for under 0.3s camera check-in." },
        ],
        callout: {
          badge: "HIGHER ENGAGEMENT & CONVERSION",
          title: "Meet attendees where they spend their time: chat apps.",
          description: "Traditional web registration forms have high drop-off rates, especially on mobile devices. Conversational RSVP bots simplify registration into a 30-second dialogue inside WhatsApp or Telegram, leading to 3x higher RSVP completion rates and lower no-shows.",
          bullets: [
            "Delivers passes directly as image media or clickable pass links in chat",
            "Eliminates lost tickets: attendees always have their QR code in their chat history",
            "Handles schedule changes: broadcast updates to all registered attendees instantly",
            "Zero per-ticket fees: only flat monthly URPASS subscription applies",
          ],
        },
        deepDiveSections: [
          {
            badge: "CONVERSATIONAL FLOW",
            title: "Designing frictionless conversational registration flows",
            paragraphs: [
              "When an attendee chats with your bot, the bot prompts for essential fields: full name, email, company, and ticket tier. Using URPASS MCP, the bot checks remaining tier capacity using get_event_stats before confirming the registration.",
              "If the tier is sold out, the bot politely suggests alternative tiers or places the attendee on a waitlist, managing ticket inventory with zero human intervention.",
            ],
            takeaway: "Deliver delightful, conversational hospitality while protecting capacity limits.",
          },
          {
            badge: "ORGANIZER SLACK BOT",
            title: "Internal Slack bots for organizer event operations",
            paragraphs: [
              "Ticketing bots aren't just for attendees; organizers can deploy internal Slack bots for their event team. In your #event-ops channel, team members can type: '@passbot check in John Doe' or '@passbot stats'.",
              "The bot executes MCP tools in real time and posts live attendance updates to keep the entire coordination team aligned during hectic event mornings.",
            ],
            takeaway: "Empower your volunteer and organizing staff with conversational superpowers.",
          },
        ],
        faqs: [
          { q: "Can the bot send passes as PDF attachments?", a: "Yes. Attendees can download passes as images, PDFs, or add them directly to Apple Wallet." },
          { q: "How do paid tickets work with WhatsApp bots?", a: "The bot generates a Razorpay payment link. When the attendee pays, a webhook confirms the transaction and triggers pass delivery." },
          { q: "What LLMs work best for ticketing bots?", a: "Claude 3.5 Sonnet, GPT-4o, and Llama 3 models excel at structured tool invocation with URPASS MCP." },
        ],
        relatedLinks: [
          { title: "MCP Event API Guide", href: "/mcp-event-api", category: "Guide" },
          { title: "AI Agent Event Registration", href: "/ai-agent-event-registration", category: "Product" },
          { title: "Event RSVP Software", href: "/event-rsvp-software", category: "Product" },
          { title: "Developer API Reference", href: "/docs", category: "Guide" },
        ],
      }}
    />
  );
}
