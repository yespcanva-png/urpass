import type { Metadata } from "next";
import { QrCode, Smartphone, Users, Download, ShieldCheck, BarChart3, Tag, Sparkles } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Lead Retrieval Software & Trade Show Lead Capture App | URPASS",
  description:
    "Empower exhibitors to scan attendee badge QR codes, qualify leads with hot/warm ratings, add booth notes, and export CSVs instantly without expensive rental hardware.",
  keywords: [
    "event lead retrieval software",
    "trade show lead capture app",
    "exhibitor lead retrieval",
    "badge scanner for exhibitors",
    "conference lead capture system",
    "qr badge lead retrieval",
    "booth lead scanner app",
    "offline lead capture software",
  ],
  alternates: { canonical: "https://urpass.space/event-lead-retrieval-software" },
  openGraph: {
    title: "Event Lead Retrieval Software & Trade Show Lead Capture | URPASS",
    description:
      "Turn any smartphone into an enterprise trade show lead retrieval scanner. Instant QR badge scans, custom qualification tags, notes, and zero hardware rental fees.",
    url: "https://urpass.space/event-lead-retrieval-software",
    siteName: "URPASS by Yesp Corporation",
    type: "website",
  },
};

export default function EventLeadRetrievalPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/event-lead-retrieval-software",
        badge: "TRADE SHOW & EXPO LEAD CAPTURE",
        h1: "Event Lead Retrieval Software & Trade Show Lead Capture App",
        description:
          "Turn any exhibitor smartphone or tablet into a lightning-fast badge scanner. Qualify leads instantly with hot/warm ratings, custom notes, offline resilience, and live CSV export.",
        ctaLabel: "Start Capturing Leads Free",
        directAnswer: {
          title: "How does URPASS trade show lead retrieval work?",
          summary:
            "URPASS eliminates costly dedicated badge scanning hardware rentals by enabling exhibitors to scan delegate QR passes directly using their own mobile browsers or UrPass One scanner. When an attendee visits a booth, exhibitor reps scan their badge QR code to instantly capture verified registration details with explicit consent. Reps tag the lead as Hot, Warm, or Cold, append product interest notes, and access synchronized lead rosters with one-click CSV export.",
          keyPoints: [
            "Zero hardware rental fees: booth staff use existing iOS, Android, or desktop devices",
            "Instant sub-second badge QR scanning with cryptographic attendee verification",
            "Multi-criteria qualification: Hot/Warm/Cold ratings, custom tags, and rich conversation notes",
            "Offline-first lead capture that automatically syncs when expo hall Wi-Fi reconnects",
            "Real-time team analytics tracking total scans, lead quality breakdown, and rep performance",
          ],
        },
        keyFactsTable: {
          title: "URPASS Mobile Lead Capture vs Traditional Hardware Scanner Rentals",
          subtitle: "Why exhibitors and organizers are replacing legacy $400/unit badge scanner guns.",
          headers: ["Feature / Capability", "URPASS Lead Retrieval Engine", "Legacy Hardware Scanner Rentals"],
          rows: [
            { col1: "Hardware Costs", col2: "Free Forever tier (up to 50 attendees/event); unlimited rep logins", col3: "$300 to $600 per scanner rental fee" },
            { col1: "Device Setup", col2: "Instant browser login via mobile URL or UrPass One camera scanner", col3: "Long queues at tech desk for bulky proprietary devices" },
            { col1: "Lead Qualification", col2: "Custom tags, hot/warm ratings, and instant voice/text notes", col3: "Limited numeric codes or separate manual paper sheets" },
            { col1: "Data Delivery Speed", col2: "Real-time live dashboard sync + immediate CSV download", col3: "Batch USB stick export 24–48 hours after event close" },
            { col1: "Offline Reliability", col2: "Full local cache storage with automatic background synchronization", col3: "Frequent terminal freezes in crowded expo halls" },
            { col1: "GDPR & Privacy Consent", col2: "Digital consent timestamp recorded upon each badge scan", col3: "Ambiguous paper consent records with legal risk" },
          ],
        },
        features: [
          {
            icon: Smartphone,
            title: "Zero Hardware Rentals Required",
            desc: "Booth representatives simply log into their exhibitor portal on any smartphone or tablet to immediately start scanning attendee badges with camera precision.",
          },
          {
            icon: QrCode,
            title: "Sub-Second QR Badge Scanning",
            desc: "High-contrast QR decoder scans physical lanyards, phone screens, or paper credentials in under 300ms, even in low-light exhibition halls.",
          },
          {
            icon: Tag,
            title: "Hot, Warm & Cold Lead Qualification",
            desc: "Quick-toggle lead temperature ratings and multi-select product tags ensure sales teams prioritize high-value commercial prospects immediately after the show.",
          },
          {
            icon: Users,
            title: "Multi-Staff Concurrent Scanning",
            desc: "Equip your entire booth squad. All team members scan simultaneously under a unified exhibitor account with individual rep attribution.",
          },
          {
            icon: Download,
            title: "Instant Live CSV & CRM Export",
            desc: "Download clean, enriched CSV files anytime during or after the exhibition, ready for immediate import into HubSpot, Salesforce, Zoho, or Marketo.",
          },
          {
            icon: ShieldCheck,
            title: "Attendee Consent & Privacy Compliance",
            desc: "Cryptographically records attendee opt-in timestamps during scan handshakes, maintaining full GDPR, CCPA, and DPDP regulatory adherence.",
          },
        ],
        steps: [
          {
            n: "01",
            title: "Issue Exhibitor Rep Credentials",
            desc: "Event organizers invite exhibiting companies. Booth managers create secure logins for their onsite booth representatives in seconds.",
          },
          {
            n: "02",
            title: "Scan Visitor Badges at the Booth",
            desc: "When attendees visit your booth, scan their badge QR code to pull verified contact details, title, and organization instantly.",
          },
          {
            n: "03",
            title: "Add Notes & Export Leads",
            desc: "Tag prospects by interest area, note follow-up deadlines, and export enriched contact spreadsheets at any time.",
          },
        ],
        useCases: [
          "B2B Industrial Trade Expos & Machinery Fairs",
          "Technology Summits & Developer Conferences",
          "Healthcare, Pharma & Medical Equipment Congresses",
          "University Campus Career & Recruitment Fairs",
          "Startup Demo Days & Venture Capital Showcases",
          "Franchise, Retail & Commercial Business Expos",
        ],
        faqs: [
          {
            q: "Do exhibitors need to rent special hardware scanners?",
            a: "No. URPASS operates entirely via modern mobile web browsers and the UrPass One scanning interface. Exhibitors can use their personal or corporate iPhones, iPads, and Android devices without paying expensive equipment rental deposits.",
          },
          {
            q: "What happens if the expo center Wi-Fi goes down?",
            a: "URPASS lead capture is engineered with offline-first local caching. Scanned badge data and notes are securely stored directly on the device and automatically sync to the cloud once connectivity is restored.",
          },
          {
            q: "Can multiple booth staff members capture leads simultaneously?",
            a: "Yes. Exhibitors can invite unlimited booth representatives. All scanned leads aggregate into a single unified booth dashboard with individual rep attribution for performance tracking.",
          },
          {
            q: "How are attendee data privacy and GDPR consent handled?",
            a: "Every scan records an explicit consent timestamp between the delegate and the exhibiting entity, ensuring compliance with global data protection laws (GDPR, CCPA, DPDP). Delegates maintain transparency over data sharing.",
          },
          {
            q: "How quickly can lead data be exported?",
            a: "Instantly. Exhibitors can download filtered CSV exports at any moment during the exhibition, eliminating the legacy delay of waiting days for organizers to email batch spreadsheets.",
          },
          {
            q: "Is lead retrieval available on the URPASS free tier?",
            a: "Yes. Organizers can host events on the Free Forever plan (2 events/month, up to 50 attendees per event) with full access to exhibitor lead capture capabilities.",
          },
        ],
        relatedLinks: [
          { title: "Exhibitor Management Software", href: "/exhibitor-management-software", category: "Product" },
          { title: "Event Badge Printing Software", href: "/event-badge-printing-software", category: "Product" },
          { title: "B2B Event Matchmaking Software", href: "/b2b-event-matchmaking-software", category: "Product" },
          { title: "Event Sponsorship Management", href: "/event-sponsorship-management-software", category: "Product" },
          { title: "Conference Management Software", href: "/conference-management-software", category: "Product" },
        ],
        ctaTitle: "Equip your exhibitors with modern lead capture",
        ctaDescription: "Zero hardware rentals · Sub-second QR scanning · Instant CSV export",
      }}
    />
  );
}
