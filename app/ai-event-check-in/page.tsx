import type { Metadata } from "next";
import { ScanLine, ShieldCheck, Zap, Bot, Smartphone, CheckCircle } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "AI-Powered Event Check-in & Gate Verification | URPASS",
  description:
    "Autonomous event gate check-in and pass verification powered by AI agents and Model Context Protocol (MCP). Sub-0.3 second QR scanning, voice check-in, and duplicate entry prevention.",
  keywords: [
    "AI event check in",
    "AI gate verification",
    "autonomous event check in",
    "MCP pass verification",
    "QR code gate check in AI",
    "smart event entry system",
    "URPASS AI check in",
  ],
  alternates: { canonical: "https://urpass.space/ai-event-check-in" },
  openGraph: {
    title: "AI-Powered Event Check-in & Gate Verification | URPASS",
    description: "Accelerate venue gate throughput with AI-assisted QR pass verification and autonomous check-in tools via MCP.",
    url: "https://urpass.space/ai-event-check-in",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "GATE INTELLIGENCE",
        h1: "AI-Powered Event Check-In & Gate Verification",
        canonicalUrl: "https://urpass.space/ai-event-check-in",
        description:
          "Upgrade your event entrances with AI-driven gate verification. Using Model Context Protocol (MCP), autonomous agents verify digital pass tokens, detect duplicate entry attempts, log gate locations, and report real-time arrival velocity with sub-0.3s response times.",
        ctaLabel: "Connect AI Gate Tools",
        features: [
          { icon: ScanLine, title: "Sub-0.3s Verification", desc: "Agents call verify_pass and check_in_attendee to instantly authenticate cryptographic pass tokens." },
          { icon: ShieldCheck, title: "Duplicate Entry Prevention", desc: "Atomic database locking guarantees that a pass scanned at Gate A cannot be simultaneously redeemed at Gate B." },
          { icon: Bot, title: "Conversational Desk Check-in", desc: "Front desk volunteers can speak or type attendee names to let AI agents search rosters and check guests in instantly." },
          { icon: Smartphone, title: "Zero App Download Required", desc: "Works directly in mobile browsers and AI voice assistants without requiring volunteers to install native apps." },
          { icon: Zap, title: "Multi-Gate Load Balancing", desc: "AI monitors queue velocities across all active gates and alerts staff when an entrance needs additional scanning lanes." },
          { icon: CheckCircle, title: "Live Roster Broadcasts", desc: "Successful check-ins propagate in real time across the organizer dashboard and VIP concierge notifications." },
        ],
        steps: [
          { n: "01", title: "Attendee Shows Pass", desc: "Participant presents their dynamic digital pass on their phone or Apple Wallet at the venue door." },
          { n: "02", title: "Scan or Query Token", desc: "Gate device scans the QR code or the check-in assistant receives the attendee's name or token string." },
          { n: "03", title: "MCP Tool Execution", desc: "The AI agent invokes check_in_attendee with the pass_token and gate_name identifier." },
          { n: "04", title: "Cryptographic Validation", desc: "URPASS validates the token, marks the attendee as checked-in, and records the timestamp and gate." },
          { n: "05", title: "Audible & Visual Confirmation", desc: "Gate screen turns green with a success chime; if duplicate, displays red alert with initial entry details." },
        ],
        callout: {
          badge: "ZERO GATE DELAYS",
          title: "Eliminate morning entrance lines with AI-accelerated check-in.",
          description: "When thousands of attendees arrive simultaneously at 8:45 AM, traditional barcode scanners and manual guest lists create massive bottlenecks. URPASS AI check-in tools combine lightning-fast database indexing with conversational AI fallback for VIPs and lost tickets.",
          bullets: [
            "Handles up to 1,500 scans per minute across distributed venue gates",
            "Automatic offline fallback for intermittent venue Wi-Fi networks",
            "Identifies VIPs and sponsors upon check-in to trigger welcome alerts",
            "Real-time analytics dashboard streams check-in velocity and gate occupancy",
          ],
        },
        deepDiveSections: [
          {
            badge: "ATOMIC GATE LOCKING",
            title: "How URPASS prevents pass screenshot fraud",
            paragraphs: [
              "Event organizers frequently suffer from attendees sharing pass screenshots with unregistered friends. URPASS eliminates this using atomic check-in transactions in PostgreSQL.",
              "When check_in_attendee is executed, the record is locked atomically. If an identical pass token is queried a fraction of a second later, the system returns status='already_checked_in' along with the exact minute and gate of the original entry.",
            ],
            takeaway: "100% fraud-proof entry control without adding latency to legitimate attendees.",
          },
          {
            badge: "CONVERSATIONAL LOOKUP",
            title: "Handling lost passes and forgotten confirmations with AI",
            paragraphs: [
              "When an attendee's phone battery dies or they cannot find their confirmation email, entry staff can prompt their AI assistant: 'Check in Priya Sharma from Google, ticket tier VIP'.",
              "The AI agent calls list_attendees with query='Priya Sharma', confirms the attendee's identity, and completes the check-in without requiring manual spreadsheet scrolling.",
            ],
            takeaway: "Reduces VIP check-in dispute times from 3 minutes down to 5 seconds.",
          },
        ],
        faqs: [
          { q: "What happens if venue internet is slow or unstable?", a: "URPASS scanner clients cache verified attendee hashes locally, allowing continuous scanning even during Wi-Fi dropouts." },
          { q: "Can I designate specific gates for VIP or Speaker passes?", a: "Yes. Gate rules can restrict entry so that VIP passes only validate at designated VIP doors or VIP lounges." },
          { q: "Can multiple volunteers scan simultaneously?", a: "Yes. Unlimited gate staff can scan simultaneously on their own phones without conflicting or overwriting data." },
        ],
        relatedLinks: [
          { title: "MCP QR Code Scanner", href: "/mcp-qr-code-scanner", category: "Product" },
          { title: "Autonomous Event Check-In", href: "/autonomous-event-check-in", category: "Use Case" },
          { title: "AI Attendee Management", href: "/ai-attendee-management", category: "Product" },
          { title: "Multi-Gate Event Check-In", href: "/multi-gate-event-check-in", category: "Product" },
        ],
      }}
    />
  );
}
