import type { Metadata } from "next";
import { BarChart3, Factory, Layers, QrCode, Radio, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Industrial Exhibition Visitor Management | UrPass",
  description: "Streamline visitor pre-registration, gate check-in, and badging for industrial expos, machinery trade fairs and manufacturing summits.",
  keywords: [
    "industrial exhibition visitor management",
    "register and check in industrial exhibition visitors",
    "urpass qr ticketing",
    "event check in software",
    "qr ticket scanner",
    "event registration platform"
  ],
  alternates: { canonical: "https://urpass.space/industrial-exhibition-visitor-management" },
  openGraph: {
    title: "Industrial Exhibition Visitor Management | UrPass",
    description: "Streamline visitor pre-registration, gate check-in, and badging for industrial expos, machinery trade fairs and manufacturing summits.",
    url: "https://urpass.space/industrial-exhibition-visitor-management",
    locale: "en_US",
    type: "website",
  },
  other: {
    "geo.region": "GLOBAL",
    "geo.placename": "Global",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "HEAVY INDUSTRY & TRADE EXPOS",
        h1: "Register and Check In Industrial Exhibition Visitors",
        canonicalUrl: "https://urpass.space/industrial-exhibition-visitor-management",
        description: "Streamline visitor pre-registration, gate check-in, and badging for industrial expos, machinery trade fairs and manufacturing summits.",
        ctaLabel: "Setup Industrial Expo Entry",
        directAnswer: {
          title: "How Does Industrial Exhibition Visitor Management Work on UrPass?",
          summary: "UrPass enables heavy machinery trade fairs, manufacturing summits, and industrial expos to pre-register trade buyers, verify company credentials, and process high volumes of visitors through turnstiles and gates. Organizers capture GSTIN/VAT numbers, enforce safety compliance, and scan visitor QR codes in <0.3s.",
          keyPoints: ["Pre-registration screening capturing business vertical, GSTIN, and purchasing authority", "Instant digital QR badge issuance with offline-capable camera verification", "Multi-hall gate access control managing high-density trade buyer footfall", "Safety guidelines and industrial PPE acknowledgment capture before entry"],
        },
        keyFactsTable: {
          title: "Industrial Expo Gate Operations Comparison",
          subtitle: "Processing high-density trade buyer traffic efficiently.",
          headers: ["Industrial Expo Need", "UrPass Digital Entry", "Traditional Onsite Badging Desks"],
          rows: [
            {
                        "col1": "Peak Gate Throughput",
                        "col2": "1,200+ attendees per hour per smartphone lane",
                        "col3": "120 attendees per hour per registration counter"
            },
            {
                        "col1": "Trade Buyer Screening",
                        "col2": "Mandatory business card / GSTIN verification",
                        "col3": "Unchecked public entry diluting B2B visitor quality"
            },
            {
                        "col1": "Safety Briefing Delivery",
                        "col2": "Digital acknowledgment on pass confirmation",
                        "col3": "Paper flyers that get discarded at the door"
            },
            {
                        "col1": "Multi-Hall Tracking",
                        "col2": "Sub-150ms cloud sync across machinery halls",
                        "col3": "No real-time visibility into hall occupancy"
            },
            {
                        "col1": "Offline Gate Resilience",
                        "col2": "Local browser token caching if expo WiFi fails",
                        "col3": "Total gate freeze if server connection drops"
            }
],
        },
        features: [
          { icon: Factory, title: "B2B Trade Buyer Qualification", desc: "Capture industry sector, purchasing power, company GSTIN, and job title to ensure high visitor quality." },
          { icon: ShieldCheck, title: "Safety & PPE Compliance", desc: "Require industrial visitors to accept plant safety protocols and PPE requirements before entry." },
          { icon: QrCode, title: "Sub-0.3s Gate Verification", desc: "Turn any mobile device into a high-speed scanner capable of clearing hundreds of visitors per minute." },
          { icon: Layers, title: "Machinery Hall Access Control", desc: "Route visitors to specific halls or conference zones based on their registered ticket badge category." },
          { icon: Radio, title: "Offline Scanning Failover", desc: "Scanner continues validating passes even when dense expo hall WiFi drops or stalls." },
          { icon: BarChart3, title: "Live Footfall Telemetry", desc: "View hourly arrival curves and total live visitors inside the exhibition center at any time." }
        ],
        steps: [
          { n: "01", title: "Publish Trade Portal", desc: "Launch an industrial registration portal capturing business credentials and visitor profiles." },
          { n: "02", title: "Automated Pass Release", desc: "Qualified trade visitors instantly receive verified digital QR passes via WhatsApp and email." },
          { n: "03", title: "Equip Gate Teams", desc: "Gate staff open scanner URLs on their smartphones or rugged Android scanning terminals." },
          { n: "04", title: "Scan at Expo Gates", desc: "Scan visitor QR codes in sub-0.3 seconds with instant green screen approval feedback." },
          { n: "05", title: "Review Trade Analytics", desc: "Export complete B2B visitor logs with job roles, company verticals, and arrival timestamps." }
        ],
        callout: {
          badge: "HIGH FOOTFALL PERFORMANCE",
          title: "Built to handle 20,000+ trade visitors across industrial exhibition complexes.",
          description: "Industrial expos cannot tolerate gate logjams that frustrate international buyers and corporate delegates. UrPass delivers reliable sub-second check-in with offline fallback.",
          bullets: ["Process high-volume morning rushes without physical badge printing delays", "Capture clean B2B buyer profiles with verified contact details", "Zero equipment rental costs \u2014 works on any standard smartphone camera", "Full compliance with venue safety capacities and fire codes"],
        },
        faqs: [
          { q: "Can we collect company GSTIN or VAT numbers during registration?", a: "Yes. UrPass allows custom fields including GSTIN, company registration numbers, and industry sector classifications." },
          { q: "What happens if expo hall WiFi becomes congested or disconnects?", a: "UrPass scanner features client-side caching that continues validating encrypted ticket tokens even when internet connectivity drops temporarily." },
          { q: "Can we prevent public consumers from registering for a trade-only expo?", a: "Yes. You can enable the Approval Workflow mode to screen applicant company domains and credentials before issuing entry passes." },
          { q: "Can passes be scanned multiple times across a 3-day exhibition?", a: "Yes. You can configure multi-day pass permissions allowing one check-in per day or re-entry across all show dates." }
        ],
        relatedLinks: [
          { title: "Trade Show Exhibitor Registration", href: "/trade-show-exhibitor-registration", category: "Product" },
          { title: "Factory Visitor Event Registration", href: "/factory-visitor-event-registration", category: "Product" },
          { title: "Multi-Gate QR Check-In", href: "/multi-gate-event-check-in", category: "Product" },
          { title: "Duplicate QR Ticket Detection", href: "/duplicate-qr-ticket-detection", category: "Product" }
        ],
      }}
    />
  );
}
