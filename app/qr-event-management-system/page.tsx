import type { Metadata } from "next";
import { QrCode, ScanLine, ShieldCheck, Zap, Smartphone, Users, CheckCircle2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "QR Event Management System | URPASS by Yesp Corporation",
  description: "End-to-end QR event management system developed by Yesp Corporation. Generate unique QR passes, scan tickets at the door, and prevent fraud in real time.",
  keywords: [
    "QR event management system",
    "QR code event management",
    "QR event ticketing system",
    "event QR scanner software",
    "URPASS QR event system"
  ],
  alternates: { canonical: "https://urpass.space/qr-event-management-system" },
  openGraph: {
    title: "QR Event Management System | URPASS by Yesp Corporation",
    description: "End-to-end QR event management system developed by Yesp Corporation. Generate unique QR passes, scan tickets at the door, and prevent fraud.",
    url: "https://urpass.space/qr-event-management-system",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "QR EVENT MANAGEMENT SYSTEM",
        h1: "Fast, Reliable QR Event Management System",
        canonicalUrl: "https://urpass.space/qr-event-management-system",
        description: "URPASS by Yesp Corporation turns QR codes into high-performance event access infrastructure. Generate unique digital passes, scan attendees with smartphone cameras, and monitor live check-ins.",
        ctaLabel: "Launch QR System",
        directAnswer: {
          title: "How does a QR event management system work?",
          summary: "A QR event management system uses dynamically generated 2D barcodes to securely identify and validate event attendees. Each pass contains a cryptographic token tied to an approved registration record. At the event entrance, gate staff use smartphone browsers to scan the QR code, instantly verifying authenticity and recording the check-in in under 0.3 seconds.",
          keyPoints: [
            "Encrypted, non-guessable QR payload prevents counterfeit tickets",
            "Single-use validation logic stops pass sharing and duplicate entries",
            "Works on any smartphone browser without software downloads or hardware rentals",
            "Real-time database sync updates all entrance gates instantaneously"
          ]
        },
        features: [
          { icon: QrCode, title: "Dynamic QR Generation", desc: "Instantly create high-contrast, error-tolerant QR codes embedded directly onto beautiful digital pass cards." },
          { icon: ScanLine, title: "Zero Hardware Needed", desc: "Turn any volunteer's smartphone camera into an enterprise scanner with instant green/red visual and audio feedback." },
          { icon: ShieldCheck, title: "Anti-Passback Protection", desc: "Once scanned, a pass cannot be scanned again. Repeated attempts immediately show the original check-in timestamp." },
          { icon: Zap, title: "Sub-Second Response Time", desc: "Cloud-optimized validation confirms attendee identity in under 300 milliseconds for fast-moving venue queues." },
          { icon: Users, title: "Multi-Gate Synchronization", desc: "Run 10+ entrance lines simultaneously without risk of simultaneous duplicate entries across doors." },
          { icon: Smartphone, title: "No App Required", desc: "Both attendee pass viewing and gate scanner interfaces function entirely inside modern mobile web browsers." }
        ],
        faqs: [
          { q: "Can someone take a screenshot of a QR pass and share it with friends?", a: "They can share the screenshot, but only the first person to arrive at the door will be admitted. When subsequent people present the same pass, the scanner immediately alerts 'Already Checked In'." },
          { q: "What if the attendee's phone battery dies?", a: "Gate staff can use the integrated manual search tool to look up the attendee by name or email and check them in manually with one tap." },
          { q: "Who built this QR event system?", a: "URPASS is engineered and maintained by Yesp Corporation, a technology software company." }
        ]
      }}
    />
  );
}
