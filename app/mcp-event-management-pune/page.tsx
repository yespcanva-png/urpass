import type { Metadata } from "next";
import { MapPin, Bot, Terminal, QrCode, ShieldCheck, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "MCP Event Management Platform Pune | AI Ticketing URPASS",
  description:
    "Model Context Protocol (MCP) event ticketing and QR check-in platform for Pune tech summits, Hinjawadi developer meetups, and university hackathons. Manage passes in Claude and Cursor.",
  keywords: [
    "MCP event management Pune",
    "Pune tech summit AI ticketing",
    "Model Context Protocol Pune",
    "Hinjawadi IT event check-in",
    "Pune university hackathon ticketing",
    "URPASS Pune MCP",
  ],
  alternates: { canonical: "https://urpass.space/mcp-event-management-pune" },
  openGraph: {
    title: "MCP Event Management Platform Pune | AI Ticketing URPASS",
    description: "Manage Pune tech conferences, manufacturing expos, and university events with AI agents via Model Context Protocol.",
    url: "https://urpass.space/mcp-event-management-pune",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN-MH",
    "geo.placename": "Pune, India",
    "geo.position": "18.5204;73.8567",
    ICBM: "18.5204, 73.8567",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "PUNE IT HUBS & UNIVERSITIES",
        h1: "MCP Event Management Platform for Pune",
        canonicalUrl: "https://urpass.space/mcp-event-management-pune",
        geo: {
          region: "MH",
          placename: "Pune",
          position: "18.5204;73.8567",
          latitude: 18.5204,
          longitude: 73.8567,
        },
        description:
          "Known as the Oxford of the East and Maharashtra's IT nexus, Pune hosts vibrant developer communities and premier educational fests. URPASS Model Context Protocol (MCP) enables Pune organizers in Hinjawadi, Magarpatta, Baner, and university campuses to run AI-assisted ticketing and sub-second QR check-in.",
        ctaLabel: "Launch Pune MCP Event",
        features: [
          { icon: MapPin, title: "Optimized for Pune Ecosystem", desc: "Designed for tech conferences in Hinjawadi, startup mixers in Baner, and student hackathons across Pune universities." },
          { icon: Bot, title: "Conversational Pass Management", desc: "Use Claude Desktop or Cursor to inspect registration rosters, issue VIP passes, and check gate stats conversationally." },
          { icon: Terminal, title: "Developer-First Stdio Support", desc: "Integrate 'npx urpass-mcp' directly into developer workflows, IDE configurations, and automated CI/CD scripts." },
          { icon: QrCode, title: "Sub-0.3s Mobile Check-in", desc: "Turn any volunteer's smartphone camera into an enterprise-grade badge scanner without installing dedicated apps." },
          { icon: Zap, title: "Zero Ticket Commission", desc: "Collect INR payments through Razorpay UPI and net banking with zero per-ticket commission cuts." },
          { icon: ShieldCheck, title: "Fraud-Proof Verification", desc: "Cryptographic QR pass tokens prevent ticket forwarding, screenshot abuse, and gate disputes." },
        ],
        steps: [
          { n: "01", title: "Create Pune Event", desc: "Set up your meetup, conference, or fest on URPASS with custom branding and registration forms." },
          { n: "02", title: "Mount MCP Integration", desc: "Add urpass-mcp to your Claude Desktop or Cursor IDE settings with your organizer developer API key." },
          { n: "03", title: "Automate Registrations", desc: "Let AI agents screen applicants, approve attendees, and trigger dynamic pass distribution automatically." },
          { n: "04", title: "Scan at Entrance", desc: "Gate staff verify digital QR passes on any smartphone browser in under 0.3 seconds per attendee." },
          { n: "05", title: "Real-Time Telemetry", desc: "Query attendance analytics and export compliance CSV rosters with a single conversational prompt." },
        ],
        callout: {
          badge: "IT CLUSTERS & ACADEMIA",
          title: "The high-velocity entry system for Pune's fastest growing tech events.",
          description: "Whether coordinating corporate summits in Hinjawadi or massive multi-day college cultural festivals, Pune organizers require reliable, friction-free entry infrastructure. URPASS MCP eliminates expensive scanner rentals and manual guest lists with browser-based AI check-in.",
          bullets: [
            "Active across Pune software engineering firms, startup incubators, and college fests",
            "Zero per-ticket fees — save tens of thousands on paid registration revenue",
            "Rapid UPI payment flows via Google Pay, PhonePe, and Paytm",
            "Comprehensive Model Context Protocol implementation for AI desktop agents",
          ],
        },
        deepDiveSections: [
          {
            badge: "HINJAWADI CONFERENCES",
            title: "Operating enterprise tech conferences and developer summits in Hinjawadi",
            paragraphs: [
              "IT summits in Hinjawadi and Magarpatta require rapid delegate check-in to ensure morning keynotes start promptly. Traditional barcode scanners create friction when badges fail to print.",
              "URPASS dynamic digital passes can be added to Apple Wallet or opened in any browser, while gate volunteers scan QR codes in under 0.3 seconds, keeping corporate delegates moving seamlessly.",
            ],
            takeaway: "Deliver an executive-grade entry experience for Pune's tech professionals.",
          },
          {
            badge: "UNIVERSITY HACKATHONS",
            title: "Handling high-volume student arrivals at Pune university fests",
            paragraphs: [
              "Pune's engineering colleges attract participants from across western India for annual hackathons and technical competitions. Managing food coupons and team badges manually causes endless delays.",
              "URPASS MCP enables multi-session gate scanning: hackers scan once for main entry, again at the cafeteria for meals, and once more for judging rounds, all recorded in the central database.",
            ],
            takeaway: "Eliminate food waste and run smoother 24-hour hackathons.",
          },
        ],
        faqs: [
          { q: "Is URPASS free for student college fests in Pune?", a: "Yes! The free tier supports 2 events/month and 100 registrations with zero costs forever." },
          { q: "Can we scan passes without internet access?", a: "Yes. The scanner retains local cryptographic caches to continue verifying passes during venue Wi-Fi drops." },
          { q: "How quickly can we set up an event in Pune?", a: "Most organizers publish an event registration page and design a branded pass in under 5 minutes." },
        ],
        relatedLinks: [
          { title: "Pune Event Software Guide", href: "/event-registration-software-pune", category: "Location" },
          { title: "MCP Hackathon Management", href: "/mcp-hackathon-management", category: "Use Case" },
          { title: "AI Event Check-In", href: "/ai-event-check-in", category: "Product" },
          { title: "Developer API Documentation", href: "/docs", category: "Guide" },
        ],
      }}
    />
  );
}
