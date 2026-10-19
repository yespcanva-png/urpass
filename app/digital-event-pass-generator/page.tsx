import type { Metadata } from "next";
import { BarChart3, QrCode, ScanLine, ShieldCheck, Smartphone, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Digital Event Pass Generator | UrPass",
  description: "Design branded digital event passes with QR codes for conferences, workshops, festivals and corporate events. Create passes with UrPass.",
  keywords: ["digital event pass generator","create branded digital event passes with qr codes","digital event badge generator","qr pass generator for events","apple wallet event pass generator","mobile event pass creator"],
  alternates: {
    canonical: "https://urpass.space/digital-event-pass-generator",
  },
  openGraph: {
    title: "Digital Event Pass Generator | UrPass",
    description: "Design branded digital event passes with QR codes for conferences, workshops, festivals and corporate events. Create passes with UrPass.",
    url: "https://urpass.space/digital-event-pass-generator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Event Pass Generator | UrPass",
    description: "Design branded digital event passes with QR codes for conferences, workshops, festivals and corporate events. Create passes with UrPass.",
  },
};

export default function DigitalEventPassGeneratorPage() {
  return (
    <SEOPage
      config={{
        badge: "DIGITAL EVENT PASSES",
        h1: "Create Branded Digital Event Passes with QR Codes",
        canonicalUrl: "https://urpass.space/digital-event-pass-generator",
        description: "Design branded digital event passes with QR codes for conferences, workshops, festivals and corporate events. Create passes with UrPass.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=digital-event-pass-generator",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Design and Issue Branded Digital Event Passes in Minutes",
        ctaDescription: "Replace wasteful paper tickets with secure, scannable digital passes featuring your brand colors, sponsor logos, and Apple Wallet support.",
        directAnswer: {
        "title": "What is a Digital Event Pass Generator?",
        "summary": "A digital event pass generator is software that designs and issues secure, branded electronic credentials with embedded dynamic QR codes. Passes feature customizable visual themes, attendee details, role badges (VIP, Speaker, Delegate), Apple Wallet compatibility, and sub-second entrance verification.",
        "keyPoints": [
                "Custom visual pass styling with 12 designer templates, brand colors, and logos",
                "Native Apple Wallet (.pkpass) support for lockscreen notifications and one-tap access",
                "Cryptographically signed dynamic QR codes that block screenshot sharing and fraud",
                "Sub-0.3 second camera check-in on volunteer smartphones with zero hardware rentals"
        ]
},
        whatIs: {
        "title": "How UrPass Replaces Paper Tickets with Digital Event Passes",
        "definition": "UrPass Ticket Studio is a visual digital pass designer that turns event credentials into interactive mobile assets. Instead of printing hundreds of wasteful paper tickets or rigid plastic badges, organizers generate dynamic, high-contrast passes that live on attendees' smartphones.",
        "details": [
                "Delivered instantly via WhatsApp, Apple Wallet, and responsive web links",
                "Includes live event schedule updates, venue directions, and personalized WiFi credentials",
                "Features role-based visual badging for VIPs, speakers, delegates, media, and crew",
                "Backed by database-level atomic locking to prevent duplicate door entries"
        ]
},
        keyFactsTable: {
        "title": "Digital QR Passes vs Traditional Printed Paper Badges",
        "subtitle": "Why sustainable digital event passes are replacing expensive physical printouts.",
        "headers": [
                "Operational Factor",
                "Traditional Printed Lanyards & Badges",
                "UrPass Digital QR Passes"
        ],
        "rows": [
                {
                        "col1": "Production Cost",
                        "col2": "₹150 - ₹400 / £2 - £5 per badge, lanyard, and plastic sleeve",
                        "col3": "₹0 per pass; included in your flat software subscription"
                },
                {
                        "col1": "Environmental Waste",
                        "col2": "Hundreds of plastic sleeves and paper badges discarded post-event",
                        "col3": "100% paperless and zero carbon footprint"
                },
                {
                        "col1": "Last-Minute Changes",
                        "col2": "Impossible; requires costly rush reprinting or ugly sticker corrections",
                        "col3": "Instant cloud updates reflected on attendee mobile passes in real time"
                },
                {
                        "col1": "Fraud & Duplication",
                        "col2": "Physical passes are easily photocopied or handed off between friends",
                        "col3": "Atomic database locking catches duplicate scans across all doors"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "VISUAL DESIGN",
                "title": "Customize Pass Themes with UrPass Ticket Studio",
                "paragraphs": [
                        "Your event pass is the first tangible artifact attendees interact with on event day. A generic black-and-white QR code looks unpolished and diminishes your brand perception.",
                        "UrPass Ticket Studio provides 12 customizable visual layouts designed for conferences, sports tournaments, college festivals, and VIP galas. Organizers can upload custom event banners, integrate sponsor logos, configure hex brand palettes, and display attendee credentials such as company affiliation and seating tier."
                ],
                "bullets": [
                        "12 customizable badge and pass design templates for diverse event aesthetics",
                        "Upload high-resolution event logos, sponsor banners, and venue maps",
                        "Role-based color banners to quickly differentiate VIPs, Speakers, and General attendees",
                        "Custom data fields displaying table assignments, track selections, or meal preferences"
                ],
                "takeaway": "Premium visual badging elevates your event aesthetic and delights attendees."
        },
        {
                "badge": "MOBILE WALLET INTEGRATION",
                "title": "Apple Wallet (.pkpass) Support for Effortless Venue Access",
                "paragraphs": [
                        "Attendees love the convenience of adding their event ticket to their native phone wallet. With Apple Wallet integration, attendees tap 'Add to Apple Wallet' directly from their confirmation email or pass web page.",
                        "The pass resides natively on their iPhone lockscreen. As attendees approach the venue, geofenced notifications surface the pass automatically, allowing them to breeze through security checkpoints without searching their email inbox."
                ],
                "bullets": [
                        "One-tap 'Add to Apple Wallet' integration for iPhone users",
                        "Location-based lockscreen push notifications when approaching the venue",
                        "High-contrast QR rendering guarantees instant reading even on dimmed screens",
                        "Accessible offline without requiring an active cellular connection at crowded venues"
                ],
                "takeaway": "Native mobile wallet integration provides frictionless lockscreen access on event morning."
        }
],
        featuresTitle: "Core Capabilities Built for Event Organizers",
        featuresSubtitle: "Engineered for speed, reliability, and zero ticketing commission.",
        features: [
          {
            icon: QrCode,
            title: "12 Designer Pass Templates",
            desc: "Choose from modern, corporate, minimalist, and festival pass layouts in Ticket Studio.",
          },
          {
            icon: Smartphone,
            title: "Apple Wallet Compatibility",
            desc: "One-tap addition to Apple Wallet with lockscreen venue proximity alerts.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Counterfeit QR Tokens",
            desc: "Cryptographically signed tokens prevent ticket tampering and URL manipulation.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Gate Validation",
            desc: "Scan and verify passes at venue doors in milliseconds using smartphone cameras.",
          },
          {
            icon: Zap,
            title: "Instant Multi-Channel Delivery",
            desc: "Dispatch passes automatically via WhatsApp, transactional email, and SMS.",
          },
          {
            icon: BarChart3,
            title: "Live Check-In Tracking",
            desc: "Track pass admissions and monitor remaining expected attendees in real time.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Select Pass Template",
                "desc": "Choose your pass layout and theme in UrPass Ticket Studio."
        },
        {
                "n": "02",
                "title": "Add Event Branding",
                "desc": "Upload your event logo, sponsor graphics, and set your brand color palette."
        },
        {
                "n": "03",
                "title": "Connect Registration Form",
                "desc": "Map attendee names, ticket tiers, and custom fields to the pass display."
        },
        {
                "n": "04",
                "title": "Automated Pass Delivery",
                "desc": "Attendees receive their branded digital passes via WhatsApp and email."
        },
        {
                "n": "05",
                "title": "Scan at the Entrance",
                "desc": "Door staff scan passes with smartphone cameras for instant green entry."
        }
],
        whoShouldUse: {
        "title": "Who Needs Digital Event Passes?",
        "subtitle": "Modern event organizers seeking paperless credentials and fast entry.",
        "personas": [
                {
                        "badge": "CONFERENCES",
                        "title": "B2B Summits & Conventions",
                        "desc": "Issue executive digital badges with company affiliations, VIP lounge access, and sponsor branding."
                },
                {
                        "badge": "FESTIVALS",
                        "title": "Cultural Fests & Concerts",
                        "desc": "Provide attendees with stylish mobile passes that live in their phone wallets and scan in <0.3s."
                },
                {
                        "badge": "WORKSHOPS",
                        "title": "Training Seminars & Bootcamps",
                        "desc": "Deliver personalized participant credentials with session room numbers and timetable details."
                },
                {
                        "badge": "COMMUNITIES",
                        "title": "Private Member Clubs & Galas",
                        "desc": "Issue elegant, secure digital invitations with strict non-transferable admission rules."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Digital Pass Scanning Works at Venue Doors",
        "subtitle": "High-speed entrance validation that eliminates queue friction.",
        "description": "Attendees present their digital pass on their phone screen or Apple Wallet. Gate volunteers point their smartphone camera at the pass. UrPass validates the cryptographic token in under 300 milliseconds, flashes a green approval screen, and sounds an audible confirmation chime.",
        "points": [
                "Scanners run directly in mobile Safari and Chrome with zero app downloads.",
                "Atomic row locking catches duplicate passes across all venue doors immediately.",
                "Audible chimes and haptic vibrations verify admission in noisy environments.",
                "Door volunteers see attendee name, role badge, and entrance confirmation instantly."
        ]
},
        faqs: [
        {
                "q": "Can attendees save digital passes to their Apple Wallet?",
                "a": "Yes. UrPass digital passes feature native Apple Wallet (.pkpass) support. Attendees can tap 'Add to Apple Wallet' to save their pass directly to their iPhone for instant lockscreen access."
        },
        {
                "q": "Can I customize the colors and logo on the digital pass?",
                "a": "Yes. Using UrPass Ticket Studio, you can choose from 12 distinct pass templates, upload your event logo and sponsor banners, and configure your exact brand color scheme."
        },
        {
                "q": "What prevents someone from sharing a pass screenshot with someone else?",
                "a": "UrPass uses cloud-native atomic database row locks. The instant a pass is scanned at any venue entrance, its status is marked as checked in. Any subsequent scan attempt displays an amber duplicate alert showing the exact time and door of the original check-in."
        },
        {
                "q": "Can attendees print out their digital pass if they prefer paper?",
                "a": "Yes. While designed for mobile screens, UrPass digital passes are fully printable and format cleanly on standard paper if an attendee prefers a physical copy."
        },
        {
                "q": "How are digital passes sent to attendees?",
                "a": "Passes are dispatched automatically upon registration or ticket purchase via email and WhatsApp (if enabled), providing attendees with multiple easy ways to access their credentials."
        }
],
      }}
    />
  );
}
