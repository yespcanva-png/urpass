import type { Metadata } from "next";
import { CreditCard, Factory, FileSpreadsheet, ScanLine, Sliders, UploadCloud } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Peenya Event Registration | UrPass",
  description: "Streamline Peenya industrial seminars, supplier meets and business events with visitor registration and QR-based entry tracking.",
  keywords: ["peenya industrial event registration","peenya trade expo passes","bangalore industrial exhibition ticketing","peenya vendor summit check in","biec trade show visitor badges"],
  alternates: {
    canonical: "https://urpass.space/peenya-industrial-event-registration",
  },
  openGraph: {
    title: "Peenya Event Registration | UrPass",
    description: "Streamline Peenya industrial seminars, supplier meets and business events with visitor registration and QR-based entry tracking.",
    url: "https://urpass.space/peenya-industrial-event-registration",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Peenya Event Registration | UrPass",
    description: "Streamline Peenya industrial seminars, supplier meets and business events with visitor registration and QR-based entry tracking.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function PeenyaIndustrialEventRegistrationPage() {
  return (
    <SEOPage
      config={{
        badge: "PEENYA INDUSTRIAL TICKETING",
        h1: "Industrial Event and Business Meetup Registration in Peenya",
        canonicalUrl: "https://urpass.space/peenya-industrial-event-registration",
        description: "Visitor and exhibitor registration for industrial expos, trade meets, and vendor summits in Peenya, Bangalore. Bulk badges, QR entry, and fast gate validation.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=peenya-industrial-event-registration",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Power Industrial Trade Events in Peenya",
        ctaDescription: "Generate bulk visitor badges, collect B2B registration fees with 0% commission, and scan trade visitors in <0.3s across Peenya Industrial Estate.",
        directAnswer: {
        "title": "What is Industrial Event Registration for Peenya?",
        "summary": "Industrial and trade event registration in Peenya provides manufacturing associations, machinery expos, and B2B vendor summits in Peenya Industrial Area and near the BIEC corridor with bulk credentialing, digital QR badges, and rapid gate validation. UrPass eliminates paper badge printing queues, charges 0% ticket commission, and validates passes in under 0.3s.",
        "keyPoints": [
                "Tailored for Peenya Industrial Area, manufacturing associations, and North-West Bangalore expo hubs",
                "Bulk CSV attendee import automatically generates and dispatches unique digital QR badges",
                "Direct Razorpay integration for paid trade visitor passes and exhibitor booth credentials",
                "Heavy-duty mobile camera scanning validates high-density trade visitors in sub-0.3s"
        ]
},
        whatIs: {
        "title": "Why Industrial Trade Organizers in Peenya Choose UrPass",
        "definition": "Peenya is one of South Asia's largest industrial estates, hosting regular manufacturing trade meets, buyer-seller conclaves, and equipment expos. UrPass provides trade organizers with a rugged, scalable digital badge system.",
        "details": [
                "Eliminate expensive badge printing and plastic lanyards with instant digital QR passes",
                "Upload hundreds of exhibitor and vendor representatives via bulk CSV in seconds",
                "Capture essential B2B intake fields: company name, GSTIN, and manufacturing vertical",
                "Sub-0.3s mobile camera scanning moves thousands of trade visitors through gates rapidly"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Plastic Badge Desks in Peenya",
        "subtitle": "Why industrial trade expo organizers in Peenya upgrade to UrPass.",
        "headers": [
                "Operational Feature",
                "Traditional Plastic Badging Desks",
                "UrPass Digital Trade Engine"
        ],
        "rows": [
                {
                        "col1": "Platform Commission",
                        "col2": "5% to 8% cut on delegate and visitor passes",
                        "col3": "0% ticket commission; plans from ₹29/month"
                },
                {
                        "col1": "Exhibitor Roster Upload",
                        "col2": "Manual typing of exhibitor badges one by one",
                        "col3": "Bulk CSV upload with instant pass generation"
                },
                {
                        "col1": "Gate Entrance Speed",
                        "col2": "Physical searching through pre-printed badges",
                        "col3": "Sub-0.3s camera scan on volunteer smartphones"
                },
                {
                        "col1": "Badge Distribution",
                        "col2": "Plastic pouches and printed cards prone to waste",
                        "col3": "Instant WhatsApp & Apple Wallet digital passes"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "BULK CREDENTIALING",
                "title": "Bulk Exhibitor and Trade Visitor Badge Generation",
                "paragraphs": [
                        "Industrial expos and vendor summits in Peenya involve hundreds of exhibiting companies, each needing distinct booth staff badges, contractor passes, and VIP buyer passes.",
                        "UrPass allows organizers to upload exhibitor spreadsheets via CSV. The platform instantly generates personalized digital QR badges for each company representative and delivers them directly via WhatsApp and email."
                ],
                "bullets": [
                        "Import hundreds of exhibitor staff credentials with a single CSV upload",
                        "Distinguish Exhibitor, Buyer, Speaker, and General Visitor tiers clearly",
                        "Automated GST invoice generation for paid B2B delegate passes",
                        "Real-time portal for exhibitors to view and manage their registered booth staff"
                ],
                "takeaway": "Bulk badge generation saves weeks of manual trade show administration."
        },
        {
                "badge": "HEAVY-DUTY GATES",
                "title": "High-Throughput Mobile Camera Scanning at Industrial Expo Gates",
                "paragraphs": [
                        "When morning trade show gates open in Peenya or near the BIEC corridor, thousands of factory owners, procurement engineers, and trade visitors arrive at once. Slow entrance gates create hazardous perimeter congestion.",
                        "UrPass turns any security guard or volunteer's smartphone into a high-speed QR barcode scanner. Validating passes in under 300 milliseconds per person, gate teams clear high-density trade queues effortlessly."
                ],
                "bullets": [
                        "No expensive laser scanner hardware rentals or complex cabling required",
                        "Atomic cryptographic locking prevents duplicate pass reuse across gates",
                        "Offline ticket caching ensures continuous operation during network congestion",
                        "Live entry telemetry tracks visitor footfall and peak arrival hours"
                ],
                "takeaway": "Sub-0.3s camera scanning moves heavy trade footfall through gates without delay."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed and zero ticket fees.",
        features: [
          {
            icon: Factory,
            title: "Industrial Badge Tiers",
            desc: "Configure Exhibitor, Trade Buyer, Supplier, and General Visitor passes easily.",
          },
          {
            icon: CreditCard,
            title: "0% Commission via Razorpay",
            desc: "Collect B2B trade visitor fees directly into your Razorpay account with zero platform cuts.",
          },
          {
            icon: UploadCloud,
            title: "Bulk CSV Badge Import",
            desc: "Upload exhibitor lists via CSV to generate and dispatch hundreds of digital passes instantly.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Gate Validation",
            desc: "Scan and validate visitor badges in <0.3s using standard phone cameras on mobile browsers.",
          },
          {
            icon: Sliders,
            title: "Custom B2B Intake Logic",
            desc: "Capture company name, GSTIN, business vertical, and procurement designation easily.",
          },
          {
            icon: FileSpreadsheet,
            title: "Compliance-Ready CSV Logs",
            desc: "Export verified visitor attendance logs with company names and scan timestamps to CSV.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Set Up Peenya Expo Page",
                "desc": "Define trade show sectors, exhibitor pass categories, visitor tiers, and B2B intake fields."
        },
        {
                "n": "02",
                "title": "Import Exhibitor Lists",
                "desc": "Upload vendor and exhibitor rosters via bulk CSV to generate digital credentials automatically."
        },
        {
                "n": "03",
                "title": "Publish Registration Link",
                "desc": "Share your high-converting trade registration portal across industry associations and email lists."
        },
        {
                "n": "04",
                "title": "Issue Digital Passes",
                "desc": "Visitors receive personalized digital QR passes via WhatsApp, email, and Apple Wallet."
        },
        {
                "n": "05",
                "title": "Scan at Expo Gates",
                "desc": "Gate security validate passes in <0.3s with smartphone cameras to keep visitor traffic moving."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Peenya Industrial Events?",
        "subtitle": "Manufacturing associations and trade show producers across North-West Bangalore.",
        "personas": [
                {
                        "badge": "TRADE EXPOS",
                        "title": "Manufacturing & Machinery Expos",
                        "desc": "Host industrial machinery exhibitions, tooling expos, and automation trade shows."
                },
                {
                        "badge": "SUPPLIER MEETS",
                        "title": "Vendor & Supplier Summits",
                        "desc": "Coordinate automotive OEM supplier conclaves, B2B vendor days, and buyer-seller meets."
                },
                {
                        "badge": "INDUSTRY BODIES",
                        "title": "Industrial Trade Associations",
                        "desc": "Manage annual general meetings, export trade seminars, and MSME conclaves in Peenya."
                },
                {
                        "badge": "TRAINING MEETS",
                        "title": "Technical Safety & Skill Conclaves",
                        "desc": "Run industrial safety training seminars, technical certification days, and skill expos."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Gate Check-In Works at Peenya Industrial Expos",
        "subtitle": "Rugged, rapid entrance management that moves heavy trade foot traffic.",
        "description": "Trade visitors and exhibitors display their digital pass on their smartphone screen or Apple Wallet. Gate staff point their mobile camera at the pass. UrPass validates credentials in under 300 milliseconds, displays the visitor's name, company, and tier, and marks them admitted.",
        "points": [
                "Eliminates slow manual searching through printed exhibitor rosters and plastic badge boxes.",
                "Displays real-time pass validity with visitor name, company, and pass category.",
                "Prevents duplicate entry attempts across multiple entrance gates automatically.",
                "Supports manual name and email lookup for fast backup check-in."
        ]
},
        faqs: [
        {
                "q": "How does UrPass streamline industrial trade visitor entry in Peenya?",
                "a": "UrPass digitizes visitor credentials. Attendees register online, receive a dynamic QR pass on WhatsApp and email, and are scanned at the entry gates in under 500ms using any smartphone camera."
        },
        {
                "q": "Can we upload pre-registered exhibitor and vendor rosters in bulk?",
                "a": "Yes. Organizers can upload existing exhibitor lists via CSV. UrPass automatically creates unique passes and dispatches them directly via WhatsApp or email."
        },
        {
                "q": "Do we need to rent expensive barcode scanners for our trade expo?",
                "a": "No. Any smartphone or tablet with a working camera functions as a secure UrPass barcode scanner via the web browser, eliminating equipment rental costs."
        },
        {
                "q": "Can we collect company names, GST numbers, and designation during registration?",
                "a": "Yes. UrPass custom registration forms allow you to capture company name, GSTIN, business vertical, and job title for thorough B2B lead generation."
        },
        {
                "q": "Can attendees save their trade expo pass to Apple Wallet?",
                "a": "Yes. UrPass digital passes feature native Apple Wallet (.pkpass) support. Attendees can add their pass with one tap and retrieve it from their iPhone lockscreen upon arriving at the venue."
        }
],
      }}
    />
  );
}
