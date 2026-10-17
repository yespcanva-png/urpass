import type { Metadata } from "next";
import TicketMagicShowcase from "@/components/studio/TicketMagicShowcase";

export const metadata: Metadata = {
  title: "AI Ticket Magic — Instant AI Event Pass & Ticket Designer | UrPass",
  description:
    "Generate branded, high-contrast digital event passes and QR tickets with AI. Pick archetypes or describe your event theme to auto-craft harmonious palettes and gate-ready passes in seconds.",
  keywords: [
    "AI ticket generator",
    "AI event pass designer",
    "AI ticket magic",
    "digital pass designer AI",
    "event pass branding generator",
    "QR ticket generator AI",
    "UrPass ticket magic",
  ],
  alternates: { canonical: "https://urpass.space/ticket-magic" },
  openGraph: {
    title: "AI Ticket Magic — Instant AI Event Pass & Ticket Designer | UrPass",
    description:
      "Generate branded, high-contrast digital event passes and QR tickets with AI. Pick archetypes or describe your event theme to auto-craft harmonious palettes and gate-ready passes in seconds.",
    url: "https://urpass.space/ticket-magic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Ticket Magic — Instant AI Event Pass & Ticket Designer | UrPass",
    description:
      "Generate branded, high-contrast digital event passes and QR tickets with AI. Pick archetypes or describe your event theme to auto-craft harmonious palettes and gate-ready passes in seconds.",
  },
};

export default function TicketMagicPage() {
  return <TicketMagicShowcase />;
}
