import type { Metadata } from "next";
import { DoorOpen, ScanLine, Users, Zap, CheckCircle2, TrendingUp, Smartphone } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Entry Management System | URPASS by Yesp Corporation",
  description: "Fast, reliable event entry management system built by Yesp Corporation. Eliminate door bottlenecks, speed up check-ins, and monitor gate arrival velocity in real time.",
  keywords: [
    "event entry management system",
    "event entry management",
    "event entrance software",
    "door check-in system",
    "venue gate management"
  ],
  alternates: { canonical: "https://urpass.space/event-entry-management-system" },
  openGraph: {
    title: "Event Entry Management System | URPASS by Yesp Corporation",
    description: "Fast, reliable event entry management system built by Yesp Corporation. Eliminate door bottlenecks and speed up check-ins.",
    url: "https://urpass.space/event-entry-management-system",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "EVENT ENTRY MANAGEMENT",
        h1: "High-Throughput Event Entry Management System",
        canonicalUrl: "https://urpass.space/event-entry-management-system",
        description: "URPASS by Yesp Corporation ensures frictionless event entry. Eliminate long venue queues, eliminate paper guestlists, and scan attendee passes in under 0.3 seconds.",
        ctaLabel: "Optimize Event Entry",
        directAnswer: {
          title: "How does an event entry management system work?",
          summary: "An event entry management system coordinates the physical arrival of guests at an event venue. By combining digital QR passes with browser-based smartphone scanners and cloud-synchronized attendee records, URPASS validates credentials in under 0.3s, eliminating entrance lines and providing organizers with real-time arrival analytics.",
          keyPoints: [
            "Process up to 1,800 attendees per hour across multiple smartphone scanners",
            "Eliminate paper lists, clipboards, and slow manual name searches",
            "Real-time velocity curves highlight peak rush-hour arrival times",
            "Instant multi-counter sync prevents double entries across gates"
          ]
        },
        features: [
          { icon: DoorOpen, title: "Zero Queue Drag", desc: "Keep venue doors moving smoothly with ultra-responsive 0.3s QR verification on any phone or tablet." },
          { icon: TrendingUp, title: "Live Gate Velocity Curves", desc: "Visualize door arrival spikes and rush periods as they happen, allowing you to redeploy staff to busy entrances." },
          { icon: Users, title: "Multi-Entrance Scalability", desc: "Deploy volunteers across 1, 5, or 20 different entrance points with automatic cloud synchronization." },
          { icon: Smartphone, title: "Zero Hardware Costs", desc: "No need to rent expensive laser scanner hardware; volunteers simply open the scanner URL on their own phones." },
          { icon: Zap, title: "Offline Resilience", desc: "Handles intermittent network drops gracefully so gate staff can continue validating passes without delays." },
          { icon: CheckCircle2, title: "Instant Visual Confirmation", desc: "Clear green/red indicators show guest name, pass tier, and check-in confirmation in bold, readable typography." }
        ],
        faqs: [
          { q: "How many attendees can one volunteer scan per minute?", a: "With URPASS, experienced staff routinely scan 25 to 30 attendees per minute, or up to 1,500 to 1,800 guests per hour per scanning device." },
          { q: "Can volunteers see private attendee phone numbers or addresses?", a: "No. The scanning interface displays only necessary verification information: attendee name, ticket tier, and validation status." },
          { q: "Who provides the URPASS entry management system?", a: "The platform is engineered, hosted, and maintained by Yesp Corporation." }
        ]
      }}
    />
  );
}
