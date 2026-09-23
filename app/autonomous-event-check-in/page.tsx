import type { Metadata } from "next";
import { Zap, Bot, Smartphone, CheckCircle, ShieldCheck, Cpu } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Autonomous Event Check-in & Self-Service Gate Systems | URPASS",
  description:
    "Deploy autonomous event check-in kiosks and self-service gate systems powered by Model Context Protocol (MCP). Under 0.3s QR pass redemption with zero volunteer overhead.",
  keywords: [
    "autonomous event check in",
    "self service event check in",
    "unattended event kiosk check in",
    "MCP gate automation",
    "AI turnstile integration",
    "automated venue check in",
    "URPASS autonomous check in",
  ],
  alternates: { canonical: "https://urpass.space/autonomous-event-check-in" },
  openGraph: {
    title: "Autonomous Event Check-in & Self-Service Gate Systems | URPASS",
    description: "Eliminate check-in lines with autonomous AI gate kiosks and self-service QR pass verification powered by URPASS MCP.",
    url: "https://urpass.space/autonomous-event-check-in",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "ZERO-OPERATOR GATE AUTOMATION",
        h1: "Autonomous Event Check-In & Self-Service Gate Systems",
        canonicalUrl: "https://urpass.space/autonomous-event-check-in",
        description:
          "Transform event venue entrances into automated, zero-friction entry points. Powered by URPASS Model Context Protocol (MCP) tools, self-service kiosks and automated turnstiles verify cryptographic digital passes, trigger physical gates, and handle guest inquiries autonomously.",
        ctaLabel: "Automate Your Event Gates",
        features: [
          { icon: Zap, title: "Unattended Self-Service", desc: "Attendees present their digital pass to tablet kiosks or optical turnstiles with zero staff intervention required." },
          { icon: Bot, title: "AI Concierge Assistance", desc: "If an attendee has a question or needs badge re-printing, integrated AI agents provide immediate conversational support." },
          { icon: ShieldCheck, title: "Tamper-Proof Verification", desc: "Cryptographic token validation guarantees that screenshots, shared passes, or canceled tickets are rejected instantly." },
          { icon: Smartphone, title: "Instant Tablet Deployment", desc: "Turn any iPad, Android tablet, or existing kiosk hardware into an autonomous scanning station using /scan or MCP APIs." },
          { icon: Cpu, title: "Turnstile & Hardware Triggers", desc: "Connect check_in_attendee tool success events directly to venue relays, turnstiles, optical gates, and badge printers." },
          { icon: CheckCircle, title: "Dynamic Queue Distribution", desc: "Smart kiosk routing directs attendees to underutilized entrance lanes, maintaining consistent sub-minute throughput." },
        ],
        steps: [
          { n: "01", title: "Setup Self-Service Kiosks", desc: "Mount tablets or scanning terminals at venue entrance lanes running the URPASS scanner or MCP agent." },
          { n: "02", title: "Configure Entry Gates", desc: "Label each station (e.g. 'Main Gate Kiosk 1', 'VIP Lane') in the gate parameters for accurate telemetry." },
          { n: "03", title: "Attendee Approaches Terminal", desc: "The participant displays their dynamic QR pass; the optical scanner reads the 256-bit token string." },
          { n: "04", title: "Sub-0.3s Verification", desc: "URPASS backend atomically verifies the pass, marks the attendee checked-in, and sends an entry signal." },
          { n: "05", title: "Instant Gate Clearance", desc: "A cheerful chime sounds, green visual feedback confirms admission, and the attendee enters the venue." },
        ],
        callout: {
          badge: "CUT STAFFING OVERHEAD",
          title: "Reduce entrance staffing requirements by up to 80%.",
          description: "Staffing dozens of volunteers at check-in tables is expensive, requires extensive training, and often leads to human errors. Autonomous check-in kiosks powered by URPASS MCP allow attendees to self-scan in under a second, freeing your staff to focus on high-touch attendee hospitality.",
          bullets: [
            "Processes up to 25 attendees per minute per kiosk station",
            "Zero staff training required — intuitive on-screen prompts guide attendees",
            "Visual and audio feedback confirms check-in status from several paces away",
            "Direct integration with badge printers for instant physical badge printing",
          ],
        },
        deepDiveSections: [
          {
            badge: "TURNSTILE INTEGRATION",
            title: "Connecting URPASS MCP check-in events to physical venue hardware",
            paragraphs: [
              "Modern stadiums, exhibition halls, and corporate auditoriums feature automated turnstiles and speed gates. Integrating ticketing with these physical barriers has historically required proprietary hardware controllers.",
              "Using URPASS MCP or REST webhooks, the check_in_attendee tool returns a structured JSON payload upon validation. Local IoT controllers (Raspberry Pi, ESP32) subscribe to these events and trigger 12V/24V relay closures in under 100 milliseconds.",
            ],
            takeaway: "Unify software event ticketing with physical venue turnstiles effortlessly.",
          },
          {
            badge: "SELF-RECOVERY AGENTS",
            title: "Autonomous handling of forgotten passes and registration lookups",
            paragraphs: [
              "At unmanned kiosks, attendees occasionally arrive without their digital pass. Traditional kiosks fail here, requiring a staff member to intervene.",
              "URPASS autonomous stations integrate an AI concierge fallback: attendees can type their phone number or name, receive a one-time SMS verification or confirmation query, and retrieve their entry pass automatically.",
            ],
            takeaway: "Keep lines moving even when attendees arrive unprepared.",
          },
        ],
        faqs: [
          { q: "What hardware is required for autonomous kiosks?", a: "Any modern iOS or Android tablet with a front or rear camera, or a dedicated Windows kiosk with an optical 2D barcode scanner." },
          { q: "Can the kiosk run in lockdown/kiosk mode?", a: "Yes. The URPASS web application fully supports Guided Access on iOS and Fully Kiosk Browser on Android." },
          { q: "What happens if a guest scans an expired or invalid pass?", a: "The kiosk displays a clear red screen with details on why the pass was rejected, and offers a button to contact support." },
        ],
        relatedLinks: [
          { title: "AI-Powered Event Check-In", href: "/ai-event-check-in", category: "Product" },
          { title: "MCP QR Code Pass Scanner", href: "/mcp-qr-code-scanner", category: "Product" },
          { title: "Multi-Gate Event Check-In", href: "/multi-gate-event-check-in", category: "Product" },
          { title: "Event Check-In App Guide", href: "/event-check-in-app", category: "Product" },
        ],
      }}
    />
  );
}
