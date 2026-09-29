import type { Metadata } from "next";
import { ShieldCheck, Lock, ScanLine, Users, CheckCircle2, AlertTriangle, Key } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Access Control Software | URPASS by Yesp Corporation",
  description: "Secure, real-time event access control software by Yesp Corporation. Validate attendee credentials, manage multi-tier zone permissions, and prevent unauthorized entry.",
  keywords: [
    "event access control software",
    "event access control",
    "event security check-in",
    "VIP access control",
    "venue gate access software"
  ],
  alternates: { canonical: "https://urpass.space/event-access-control-software" },
  openGraph: {
    title: "Event Access Control Software | URPASS by Yesp Corporation",
    description: "Secure, real-time event access control software by Yesp Corporation. Validate attendee credentials and manage venue gate permissions.",
    url: "https://urpass.space/event-access-control-software",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "EVENT ACCESS CONTROL",
        h1: "Secure Event Access Control Software for Venues and Summits",
        canonicalUrl: "https://urpass.space/event-access-control-software",
        description: "URPASS by Yesp Corporation delivers military-grade event access control. Verify attendee identity, enforce single-entry rules, and safeguard VIP lounges and auditoriums from unauthorized entry.",
        ctaLabel: "Secure Your Event",
        directAnswer: {
          title: "What is event access control software?",
          summary: "Event access control software governs who enters an event venue, which specific zones they can access (General Admission, VIP, Speakers, Staff), and validates credentials in real-time. URPASS utilizes single-use cryptographic QR passes and smartphone camera scanning to verify permissions in under 0.3s without expensive turnstiles or rented barcode guns.",
          keyPoints: [
            "Zone-based credential enforcement (VIP, Speaker, Delegate, General)",
            "Instant anti-passback and duplicate scan rejection",
            "Zero physical server setup: cloud-backed synchronization across all entrance gates",
            "Comprehensive audit logs with exact timestamps and gate identifiers for every scan"
          ]
        },
        features: [
          { icon: ShieldCheck, title: "Cryptographic Pass Security", desc: "Each pass is generated with unique non-reproducible tokens that prevent ticket tampering and forged passes." },
          { icon: Key, title: "Multi-Tier Zone Management", desc: "Clearly distinguish attendee tiers (VIP, Participant, Press, Exhibitor) with color-coded scanner confirmations." },
          { icon: AlertTriangle, title: "Instant Fraud Alerts", desc: "Attempts to scan counterfeit passes or re-use existing passes trigger prominent visual and audio warning screens." },
          { icon: ScanLine, title: "Rapid Gate Verification", desc: "High-throughput validation allows staff to process up to 30 attendees per minute per scanner line." },
          { icon: Users, title: "Restricted Staff Permissions", desc: "Volunteers and bouncers receive dedicated scanning links without administrative access to sensitive attendee database records." },
          { icon: Lock, title: "Secure Cloud Synchronization", desc: "Multi-entrance data synchronization ensures that a pass scanned at Gate A is instantly invalidated at Gate B." }
        ],
        faqs: [
          { q: "How does URPASS prevent pass sharing among attendees?", a: "The moment a pass is verified at any entrance, its status is permanently marked as 'Checked in'. Any subsequent attempt at any door triggers an immediate duplicate warning." },
          { q: "Does the access control system require specialized hardware?", a: "No. Staff can use any iOS or Android phone or tablet equipped with a standard camera." },
          { q: "Can we download access logs after the event?", a: "Yes. Organizers can export a comprehensive audit CSV containing attendee names, exact timestamps, and check-in methods." }
        ]
      }}
    />
  );
}
