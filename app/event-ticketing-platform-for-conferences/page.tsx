import type { Metadata } from "next";
import {
  Briefcase,
  Users,
  QrCode,
  ScanLine,
  Receipt,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  Palette,
  BadgeCheck,
  BarChart3,
  CreditCard,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Ticketing Platform for Conferences & Summits — URPASS",
  description:
    "Enterprise-grade event ticketing platform for tech conferences and summits. Custom delegate badge generation (440x640), multi-tier VIP/Speaker passes, automated GST invoices, and 0% ticket commission.",
  keywords: [
    "event ticketing platform for conferences",
    "conference ticketing software",
    "conference registration platform",
    "tech summit ticketing",
    "conference badge generator",
    "conference check-in software",
    "b2b event ticketing india",
  ],
  alternates: { canonical: "https://urpass.space/event-ticketing-platform-for-conferences" },
  openGraph: {
    title: "Event Ticketing Platform for Conferences & Summits | URPASS",
    description:
      "Sell conference delegate passes with 0% commission, design printable lanyard badges, automate GST tax invoices, and check in attendees in <0.3s.",
    url: "https://urpass.space/event-ticketing-platform-for-conferences",
    locale: "en_IN",
    type: "website",
  },
};

export default function ConferenceTicketingPlatformPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/event-ticketing-platform-for-conferences",
        badge: "CONFERENCES & SUMMITS",
        h1: "Event Ticketing Platform for Tech Conferences & Summits",
        description:
          "Launch branded conference landing pages, sell delegate tiers with 0% platform commission, design printable lanyard badges in Ticket Studio, generate compliant GST invoices, and check in attendees in under 0.3 seconds.",
        ctaLabel: "Start conference ticketing",

        // 10-Point Standard: Direct Answer at the Top (40-80 words)
        directAnswer: {
          title: "What is an Event Ticketing Platform for Conferences?",
          summary:
            "An event ticketing platform for conferences is a specialized software solution designed to manage complex attendee categories—such as VIP delegates, keynote speakers, media, and corporate sponsors—while providing professional credentialing, B2B tax compliance, and seamless on-site badge scanning. URPASS modernizes conference ticketing by offering zero-commission ticket sales, automated GST invoicing with corporate GSTIN validation, and visual lanyard badge design (440x640px) with smartphone gate check-ins.",
          keyPoints: [
            "Multi-tier delegate passes: General, VIP, Speaker, Sponsor, and Student tiers",
            "Ticket Studio badge generator: 440x640px printable lanyard badges with QR codes",
            "B2B GST tax invoices automatically generated with corporate GSTIN and SAC codes",
            "Sub-second smartphone gate check-in (<0.3s) with zone and track access controls",
          ],
        },

        // 10-Point Standard: Key Facts & Specifications Table
        keyFactsTable: {
          title: "Conference Ticketing & Credential Specifications",
          subtitle: "How URPASS supports professional conference requirements compared to general ticketing tools.",
          headers: ["Conference Feature", "URPASS Conference Platform", "Standard Ticketing Platforms"],
          rows: [
            {
              col1: "Platform Commission on Sales",
              col2: "0% Commission (Fixed monthly plan starting at ₹499)",
              col3: "4% to 8% commission per delegate ticket sold",
            },
            {
              col1: "Lanyard Badge Format",
              col2: "Standard 440x640px badge format with QR and attendee tokens",
              col3: "Generic 8.5x11 inch paper PDF ticket receipts",
            },
            {
              col1: "B2B GST Tax Compliance",
              col2: "Automated GSTIN collection, tax breakup (CGST/SGST/IGST), and PDF invoices",
              col3: "Manual invoice creation or non-compliant foreign receipts",
            },
            {
              col1: "Multi-Track & Zone Access",
              col2: "Tag-based zone access control (VIP Lounge, Main Stage, Workshops)",
              col3: "Single-door entry; no secondary track access validation",
            },
            {
              col1: "Gate Check-In Hardware",
              col2: "Any iOS or Android smartphone browser via secure PIN URL",
              col3: "Expensive dedicated barcode guns or bulky badge kiosks",
            },
            {
              col1: "Attendee Data Ownership",
              col2: "100% full ownership with instant CSV/Excel export",
              col3: "Restricted data access or platform retargeting delegates",
            },
            {
              col1: "Offline Badge Validation",
              col2: "IndexedDB local check-in queue with automatic conflict reconciliation",
              col3: "Entrance halts entirely if convention center WiFi drops",
            },
          ],
        },

        // Core Features
        features: [
          {
            icon: BadgeCheck,
            title: "Printable Lanyard Badges",
            desc: "Generate professional 440x640px conference badges in Ticket Studio. Include attendee names, companies, job titles, and gate tier tags.",
          },
          {
            icon: CreditCard,
            title: "0% Commission Ticketing",
            desc: "Retain 100% of high-value conference ticket revenue. Collect payments directly through your linked Razorpay merchant account.",
          },
          {
            icon: Receipt,
            title: "Automated GST Tax Invoices",
            desc: "Capture company name and corporate GSTIN at checkout. Automatically issue compliant tax invoices with proper SAC codes for ITC claims.",
          },
          {
            icon: ScanLine,
            title: "Sub-Second Gate Scanner",
            desc: "Check in delegates in under 0.3 seconds using standard phone cameras. Volunteers receive distinct high-chime audio and haptic cues.",
          },
          {
            icon: ShieldCheck,
            title: "Zone & Track Access Control",
            desc: "Prevent unauthorized access to VIP lounges, executive roundtables, or closed masterclasses using attendee tier tags.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance Analytics",
            desc: "Track real-time hall occupancy, peak arrival curves, delegate turnouts, and sponsor booth footfall directly from your dashboard.",
          },
        ],

        // 10-Point Standard: Real Product Proof
        productProof: {
          badge: "REAL PRODUCT PROOF",
          title: "Built for Professional Summits & Multi-Day Conferences",
          description:
            "From keynote hall registration to VIP dinner access, URPASS ensures your conference operations run with military precision.",
          type: "ticket-studio",
        },

        // 10-Point Standard: India-Specific Details
        indiaHighlights: {
          title: "Optimized for Indian Business Summits & Tech Conferences",
          subtitle: "Complete B2B tax compliance, corporate UPI/card billing, and pan-India convention support.",
          items: [
            {
              title: "Corporate GSTIN Input Tax Credit",
              description:
                "B2B delegates require valid tax invoices to claim 18% GST input credit. URPASS generates compliant tax receipts automatically.",
              badge: "GSTIN",
            },
            {
              title: "Instant Corporate Card & UPI",
              description:
                "Accept corporate credit cards, net banking across 50+ Indian banks, and UPI with zero platform commission deductions.",
              badge: "Payments",
            },
            {
              title: "Convention Center Network Resilience",
              description:
                "Five-star hotel ballrooms and convention centers often have dead zones. Offline scanner sync ensures uninterrupted check-in.",
              badge: "Offline Ready",
            },
            {
              title: "WhatsApp Badge & Pass Delivery",
              description:
                "Deliver mobile entry passes directly to delegates' WhatsApp numbers, ensuring they have their QR ready upon arrival.",
              badge: "WhatsApp",
            },
            {
              title: "Speaker & Sponsor Pass Quotas",
              description:
                "Issue complimentary passes with custom access tiers for speakers, media partners, and headline sponsors without paying extra fees.",
              badge: "Quotas",
            },
            {
              title: "Multi-City Conference Tours",
              description:
                "Host multi-city conference editions in Bengaluru, Mumbai, Delhi NCR, and Hyderabad from a single consolidated dashboard.",
              badge: "Multi-City",
            },
          ],
        },

        // 10-Point Standard: Deep Useful Content
        deepDiveSections: [
          {
            badge: "CREDENTIALING EXCELLENCE",
            title: "Why Printable Lanyard Badges Still Matter for B2B Conferences",
            paragraphs: [
              "While consumer events rely exclusively on mobile screens, professional B2B conferences require physical visibility. Badges allow delegates to read names, job titles, and company affiliations across the room during networking coffee breaks, while signaling access permissions (VIP, Speaker, Press) to security personnel.",
              "URPASS Ticket Studio includes a native Badge format engineered to standard 440x640px lanyard dimensions. Organizers can customize fonts, embed sponsor brand logos, and dynamically pull attendee names and companies from registration records. Delegates can be sent their badge PDF in advance for self-printing, or staff can batch-print badges before the event begins.",
            ],
            bullets: [
              "Standard 440x640px dimensions fit all standard convention plastic pouches and lanyards",
              "Dynamic tokens: {{attendee.name}}, {{attendee.company}}, and {{ticket.tier}}",
              "High-contrast QR code placement ensures rapid scanning even inside reflective sleeves",
              "Visual color banding distinguishes VIPs, Speakers, Press, and General Attendees",
            ],
            takeaway:
              "Professional lanyard badges elevate the networking caliber of your conference and give security staff instant visual confirmation of attendee access privileges.",
          },
          {
            badge: "TAX & REVENUE RECOVERY",
            title: "How Automated GST Invoicing Accelerates Corporate Delegate Sales",
            paragraphs: [
              "When companies send employees to industry conferences, corporate purchase departments require a formal GST tax invoice displaying their 15-digit GSTIN number to claim 18% Input Tax Credit (ITC). Ticketing platforms that do not support automated GSTIN capture force organizers to spend days manually generating Word and Excel invoices after the conference.",
              "URPASS embeds GSTIN validation directly into checkout. When a corporate buyer checks the 'Company GST' box, the system captures their company name, GSTIN, and billing address. Upon payment completion, a compliant B2B tax invoice featuring proper SAC codes (998596), your organization's GSTIN, and clear CGST/SGST/IGST tax splits is generated automatically.",
            ],
            bullets: [
              "Seamless corporate checkout with automated GSTIN validation",
              "Compliant B2B tax PDF receipts sent immediately upon payment",
              "0% platform commission on high-value corporate delegate tickets",
              "Direct T+2 settlement to your bank account keeps conference cash flow liquid",
            ],
            takeaway:
              "Offering automated GST invoices removes purchase approval friction for enterprise companies, resulting in higher corporate group delegate sales.",
          },
        ],

        // 10-Point Standard: Competitor Comparison Table
        competitorComparison: {
          title: "URPASS vs. Traditional Conference Ticketing Tools",
          subtitle: "Compare delegate pass customization, B2B tax invoicing, and gate scan speed.",
          competitorName: "Legacy Event Platforms (Zoho Backstage / Eventbrite)",
          sourceCitations: [
            "Official competitor commercial schedules",
            "URPASS benchmark metrics & Ticket Studio specifications",
          ],
          rows: [
            {
              criteria: "Ticket Sales Commission",
              urpass: "0% Commission (Fixed monthly software fee)",
              competitor: "3.75% to 6% per delegate pass sold",
              urpassAdvantage: true,
            },
            {
              criteria: "Printable Lanyard Badge Studio",
              urpass: "Ticket Studio (440x640px badge format with dynamic tokens)",
              competitor: "Requires external badge printing plugins or PDF workarounds",
              urpassAdvantage: true,
            },
            {
              criteria: "B2B GST Tax Invoicing",
              urpass: "Automated GSTIN capture and compliant PDF tax receipts",
              competitor: "Manual invoice creation or non-compliant receipts",
              urpassAdvantage: true,
            },
            {
              criteria: "Door Check-In Hardware",
              urpass: "Any smartphone browser (no app download required)",
              competitor: "Mandatory app store downloads or expensive kiosks",
              urpassAdvantage: true,
            },
            {
              criteria: "Multi-Track / VIP Zone Control",
              urpass: "Included natively via tier tags and gate routing",
              competitor: "Enterprise add-on pricing tier required",
              urpassAdvantage: true,
            },
            {
              criteria: "Attendee Data Privacy",
              urpass: "100% private attendee database with no retargeting",
              competitor: "Attendee data often used for competitor event recommendations",
              urpassAdvantage: true,
            },
          ],
        },

        // Event-Specific Use Cases
        useCases: [
          "Annual Technology & Developer Conferences",
          "Founder & Venture Capital Summits",
          "Healthcare & Medical Conventions",
          "AI & Cloud Computing Expos",
          "Corporate Leadership Townhalls",
          "Marketing & Growth Masterclasses",
          "FinTech & Banking Summits",
          "Industry Trade Conferences & Partner Days",
        ],

        // Topic Cluster Internal Links
        relatedLinks: [
          {
            title: "Event Ticketing Software India",
            href: "/event-ticketing-software-india",
            category: "Product",
          },
          {
            title: "QR Ticketing System & Check-In",
            href: "/qr-ticketing-system",
            category: "Product",
          },
          {
            title: "QR Ticket Scanner (Phone App)",
            href: "/qr-ticket-scanner",
            category: "Product",
          },
          {
            title: "Event Registration Software",
            href: "/event-registration-software",
            category: "Product",
          },
          {
            title: "Event Ticket Payment Gateway (Razorpay)",
            href: "/event-ticket-payment-gateway",
            category: "Guide",
          },
          {
            title: "Compare: Zoho Backstage Alternative India",
            href: "/compare/zoho-backstage-alternative-india",
            category: "Comparison",
          },
          {
            title: "Compare: Eventbrite Alternative India",
            href: "/compare/eventbrite-alternative-india",
            category: "Comparison",
          },
          {
            title: "Guide: How to Manage Conference Attendees",
            href: "/guides/how-to-manage-conference-attendees",
            category: "Guide",
          },
        ],

        // Comprehensive FAQs
        faqs: [
          {
            q: "Can I design physical lanyard badges for my conference?",
            a: "Yes! In URPASS Ticket Studio, select the 'Badge' format (440x640px). You can add conference branding, sponsor logos, attendee names, company names, and ticket tier badges. These badges can be batch-printed for physical lanyards or delivered digitally to delegates.",
          },
          {
            q: "How does 0% commission benefit high-ticket conference registrations?",
            a: "Conference delegate passes often cost ₹5,000 to ₹25,000 each. Traditional ticketing portals that deduct 5% to 8% in commissions will take ₹250 to ₹2,000 from every single ticket you sell. URPASS charges a flat monthly software subscription (from ₹499/mo), allowing you to keep 100% of your delegate revenue.",
          },
          {
            q: "How does corporate GSTIN billing work for enterprise delegates?",
            a: "During checkout, corporate buyers enter their company name and 15-digit GSTIN. URPASS calculates appropriate GST (CGST/SGST for intra-state, IGST for inter-state) and automatically generates a compliant B2B tax invoice featuring your SAC code 998596 and business credentials.",
          },
          {
            q: "Can I restrict certain conference tracks or VIP lounges to specific ticket holders?",
            a: "Yes. In the scanner configuration, you can assign check-in gates to specific ticket tiers (e.g., 'VIP Lounge', 'Speaker Green Room', 'Workshop Track B'). The scanner will instantly alert staff if an attendee with a general pass attempts to enter an exclusive zone.",
          },
          {
            q: "Do conference gate staff need dedicated laser scanners?",
            a: "No. Staff simply open a secure PIN scanner URL in Safari or Chrome on their smartphones. Camera scanning decodes passes in under 0.3 seconds with distinct confirmation audio and vibration cues.",
          },
          {
            q: "Can I issue complimentary passes to speakers and sponsors?",
            a: "Yes. From your attendee dashboard, you can issue 100% discounted or complimentary passes for speakers, media partners, and headline sponsors without paying any per-pass platform fees.",
          },
        ],

        ctaTitle: "Elevate your conference ticketing with URPASS",
        ctaDescription:
          "0% ticket commission · Printable lanyard badges · Automated GST invoices · Sub-second phone scanning",
      }}
    />
  );
}
