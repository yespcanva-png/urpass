import type { Metadata } from "next";
import { QrCode, ShieldCheck, Zap, ScanLine, Bot, Smartphone } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "MCP QR Code Pass Scanner & Ticket Verification | URPASS",
  description:
    "Verify dynamic QR event passes, check ticket validity, and prevent counterfeit entries using AI agents and Model Context Protocol (MCP). Sub-0.3s gate verification tools.",
  keywords: [
    "MCP QR code scanner",
    "QR pass scanner MCP",
    "ticket verification MCP tool",
    "cryptographic pass validation",
    "AI QR code verification",
    "prevent ticket fraud AI",
    "URPASS QR scanner",
  ],
  alternates: { canonical: "https://urpass.space/mcp-qr-code-scanner" },
  openGraph: {
    title: "MCP QR Code Pass Scanner & Ticket Verification | URPASS",
    description: "Scan, verify, and redeem digital event passes using Model Context Protocol (MCP) tools for AI agents and automated kiosks.",
    url: "https://urpass.space/mcp-qr-code-scanner",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "CRYPTOGRAPHIC VERIFICATION",
        h1: "MCP QR Code Pass Scanner & Ticket Verification",
        canonicalUrl: "https://urpass.space/mcp-qr-code-scanner",
        description:
          "Integrate cryptographic QR pass validation into your AI agents, automated check-in kiosks, and gate inspection devices. The URPASS MCP verify_pass and check_in_attendee tools ensure 100% counterfeit-proof entry operations with sub-0.3 second response times.",
        ctaLabel: "Deploy QR Verification Tools",
        features: [
          { icon: QrCode, title: "Dynamic QR Validation", desc: "Validate 256-bit cryptographic tokens embedded inside URPASS digital passes with instant status feedback." },
          { icon: ShieldCheck, title: "Anti-Counterfeit Protection", desc: "Passes cannot be faked, guessed, or reproduced. Re-scanned passes immediately trigger duplicate entry warnings." },
          { icon: Zap, title: "Sub-0.3s Verification Speed", desc: "Direct database lookups execute in under 30 milliseconds, allowing over 1,000 attendee check-ins per minute." },
          { icon: ScanLine, title: "Inspection Without Redemption", desc: "Use verify_pass to inspect attendee details, ticket tier, and validity before committing the check-in mutation." },
          { icon: Bot, title: "Autonomous Kiosk Integration", desc: "Power self-service check-in kiosks where AI agents scan participant screens and print physical conference badges." },
          { icon: Smartphone, title: "Browser Scanner Fallback", desc: "Gate staff can also use our native browser camera scanner at /scan alongside autonomous AI agents." },
        ],
        steps: [
          { n: "01", title: "Capture Pass Token", desc: "Camera scanner or AI agent extracts the cryptographic pass token from the attendee's QR code." },
          { n: "02", title: "Call verify_pass", desc: "Agent invokes the verify_pass MCP tool to inspect attendee name, ticket tier, status, and event association." },
          { n: "03", title: "Inspect Access Permissions", desc: "Agent verifies that the attendee's tier grants entry to the specific gate, lounge, or workshop." },
          { n: "04", title: "Call check_in_attendee", desc: "Agent confirms redemption by calling check_in_attendee, atomically marking the pass as used." },
          { n: "05", title: "Emit Entry Signal", desc: "Gate turnstile opens, badge printer triggers, or visual green confirmation chime is sounded." },
        ],
        callout: {
          badge: "ZERO FRAUD TOLERANCE",
          title: "Stop gate disputes and counterfeit passes before they enter your venue.",
          description: "At high-demand events, screenshot sharing and fake ticket PDFs cost organizers revenue and compromise venue safety. URPASS MCP verification tools bind every attendee to a unique cryptographic token that cannot be duplicated or redeemed twice.",
          bullets: [
            "Cryptographic hashing prevents brute-force token generation",
            "Multi-gate coordination ensures synchronized check-in state across all entrances",
            "Full audit logs record scanning device, gate name, and exact timestamp",
            "Instant downgrade or invalidation of refunded or canceled passes",
          ],
        },
        deepDiveSections: [
          {
            badge: "TWO-STEP VERIFICATION",
            title: "Why two-step verification (verify then check-in) matters",
            paragraphs: [
              "In VIP lounges, catering zones, and technical workshops, organizers need to inspect an attendee's credentials without immediately invalidating their general admission pass. URPASS MCP separates this into two distinct tools: verify_pass (read-only inspection) and check_in_attendee (state mutation).",
              "An autonomous AI concierge can verify an attendee's dietary preferences or speaker status multiple times throughout the day, while gate turnstiles execute the check-in tool to mark venue entry.",
            ],
            takeaway: "Maximum operational flexibility across complex multi-zone venues.",
          },
          {
            badge: "OFFLINE RESILIENCE",
            title: "Handling high-density venue network dropouts",
            paragraphs: [
              "When 5,000 attendees enter an arena, cellular networks often degrade. URPASS scanner architecture supports client-side pre-fetching and cryptographic checksum validation, ensuring passes continue to scan smoothly even during brief network interruptions.",
              "Queued check-ins sync seamlessly back to the cloud database the moment connection is restored, reconciling all records with zero duplicate entries.",
            ],
            takeaway: "Unshakable reliability at the most crowded event entrances.",
          },
        ],
        faqs: [
          { q: "Can I use external QR laser barcode scanners?", a: "Yes. Any USB or Bluetooth HID barcode scanner that inputs the token string into your device can invoke the MCP tool." },
          { q: "Does the scanner display attendee custom fields?", a: "Yes. verify_pass returns all custom registration questions, including t-shirt size, company, and team name." },
          { q: "How fast is the verification roundtrip?", a: "Average API execution time is under 40 milliseconds, enabling smooth, uninterrupted gate throughput." },
        ],
        relatedLinks: [
          { title: "AI-Powered Event Check-In", href: "/ai-event-check-in", category: "Use Case" },
          { title: "Autonomous Event Check-In", href: "/autonomous-event-check-in", category: "Use Case" },
          { title: "Mobile QR Code Scanner", href: "/qr-code-scanner", category: "Product" },
          { title: "Developer API Reference", href: "/docs", category: "Guide" },
        ],
      }}
    />
  );
}
