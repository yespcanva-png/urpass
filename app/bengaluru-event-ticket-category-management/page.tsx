import type { Metadata } from "next";
import { CreditCard, FileSpreadsheet, QrCode, ScanLine, Sliders, Tags } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Ticket Category Management Bengaluru | UrPass",
  description: "Set up general, VIP and multi-day ticket categories for Bengaluru events and manage digital ticket registration in one platform.",
  keywords: ["event ticket category management bengaluru","vip and general ticket tiers bangalore","multi-tier event ticketing bengaluru","manage ticket categories bangalore","razorpay ticket tiers bengaluru"],
  alternates: {
    canonical: "https://urpass.space/bengaluru-event-ticket-category-management",
  },
  openGraph: {
    title: "Event Ticket Category Management Bengaluru | UrPass",
    description: "Set up general, VIP and multi-day ticket categories for Bengaluru events and manage digital ticket registration in one platform.",
    url: "https://urpass.space/bengaluru-event-ticket-category-management",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Ticket Category Management Bengaluru | UrPass",
    description: "Set up general, VIP and multi-day ticket categories for Bengaluru events and manage digital ticket registration in one platform.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BengaluruEventTicketCategoryManagementPage() {
  return (
    <SEOPage
      config={{
        badge: "TICKET CATEGORIES & TIERS",
        h1: "Manage General, VIP and Multi-Day Ticket Categories",
        canonicalUrl: "https://urpass.space/bengaluru-event-ticket-category-management",
        description: "Set up general, VIP and multi-day ticket categories for Bengaluru events and manage digital ticket registration in one platform.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bengaluru-event-ticket-category-management",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Configure Multi-Tier Ticketing Easily",
        ctaDescription: "Set up General Admission, VIP Executive, Student, and Multi-Day ticket categories with automated inventory limits, Razorpay payments, and 0% ticket fees.",
        directAnswer: {
        "title": "How to Manage General, VIP, and Multi-Day Ticket Categories in Bengaluru?",
        "summary": "Managing general, VIP, and multi-day ticket categories in Bengaluru enables event organizers to segment attendees, offer tiered pricing, enforce capacity allocations, and grant specific hall access permissions. UrPass provides unlimited ticket tier creation, automated inventory controls, direct Razorpay settlement, and 0% platform ticket commission.",
        "keyPoints": [
                "Configure unlimited ticket tiers: General, VIP, Student, Speaker, and Multi-Day passes",
                "Individual capacity caps and automated price shifts per ticket tier",
                "Visual tier distinction on mobile scanner screens to enforce access privileges",
                "Direct UPI and card settlement via Razorpay with 0% platform ticket commission"
        ]
},
        whatIs: {
        "title": "Why Bengaluru Event Producers Rely on Tiered Ticketing",
        "definition": "Whether hosting a tech conference in Whitefield or a cultural fest in Central Bangalore, different attendee groups require different pricing, perks, and access privileges. Traditional ticketing aggregators take 5% to 8% commissions from every tier.",
        "details": [
                "Keep 100% of your delegate revenue across all general and premium ticket tiers",
                "Automated tier expiration based on schedule deadlines or inventory sellouts",
                "Private hidden tiers accessible only via bespoke invitation or promo access codes",
                "Color-coded scanner feedback allows door staff to verify VIP privileges in sub-0.3s"
        ]
},
        keyFactsTable: {
        "title": "UrPass Ticket Tiers vs Traditional Aggregators",
        "subtitle": "Why Bengaluru organizers configure multi-tier ticketing on UrPass.",
        "headers": [
                "Tier Management Feature",
                "Traditional Ticketing Aggregators",
                "UrPass Ticket Category Engine"
        ],
        "rows": [
                {
                        "col1": "Platform Commission",
                        "col2": "5% to 8% cut on every ticket tier sold",
                        "col3": "0% ticket commission; plans from ₹499/month"
                },
                {
                        "col1": "Tier Flexibility",
                        "col2": "Limited tiers or extra fees for custom categories",
                        "col3": "Unlimited free and paid ticket categories"
                },
                {
                        "col1": "Gate Tier Validation",
                        "col2": "Generic scan; staff must inspect small printed text",
                        "col3": "Color-coded visual tier banner on scanner screen"
                },
                {
                        "col1": "Tier Inventory Limits",
                        "col2": "Prone to overselling during high-traffic rushes",
                        "col3": "Atomic server-level inventory caps per tier"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "TIER SEGMENTATION",
                "title": "Dynamic Ticket Tier Configuration for Diverse Audiences",
                "paragraphs": [
                        "A successful conference or exhibition in Bengaluru caters to multiple audience segments simultaneously: general delegates, student scholars, corporate sponsors, and VIP speakers, each needing tailored pricing and access rules.",
                        "UrPass allows event directors to configure unlimited ticket tiers in minutes. Define individual ticket descriptions, pricing, maximum seat allocations, and optional promo code requirements for each tier."
                ],
                "bullets": [
                        "Configure General, VIP, Early Bird, Student, and Speaker ticket categories",
                        "Set independent inventory caps for each tier to maintain balance",
                        "Create private tiers revealed only with valid invitation access codes",
                        "Automated GST invoice generation matching corporate expense requirements"
                ],
                "takeaway": "Granular ticket tier configuration maximizes delegate revenue and access control."
        },
        {
                "badge": "GATE DISTINCTION",
                "title": "Visual Tier Confirmation on Mobile Scanners",
                "paragraphs": [
                        "Stationing staff outside VIP dining halls, backstage green rooms, or executive breakout lounges requires quick verification of whether an attendee's ticket grants access.",
                        "When a volunteer scans an attendee's QR pass, the UrPass mobile scanner displays a prominent, color-coded tier banner (e.g. Gold for VIP Speaker, Blue for General Delegate). Staff know instantly whether to grant access without squinting at tiny badge text."
                ],
                "bullets": [
                        "Color-coded visual banner displays attendee tier name prominently",
                        "Prevents General Admission pass holders from accessing VIP dining or lounges",
                        "Atomic cryptographic locking prevents duplicate scan attempts across gates",
                        "Sub-0.3s validation keeps foot traffic moving smoothly at all checkpoints"
                ],
                "takeaway": "Color-coded scanner banners enforce tier access rules in under 300 milliseconds."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed, privacy, and zero ticket fees.",
        features: [
          {
            icon: Tags,
            title: "Unlimited Ticket Tiers",
            desc: "Configure General, VIP, Student, Speaker, and Multi-Day categories with custom rules.",
          },
          {
            icon: CreditCard,
            title: "0% Commission via Razorpay",
            desc: "Receive ticket revenue directly into your account with zero platform percentage cuts.",
          },
          {
            icon: Sliders,
            title: "Individual Capacity Limits",
            desc: "Set independent seat caps and automated price shifts for each ticket category.",
          },
          {
            icon: QrCode,
            title: "Tier-Specific QR Passes",
            desc: "Deliver personalized QR tickets directly to attendee WhatsApp chats and Apple Wallet.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Door Validation",
            desc: "Scan and check in attendees with smartphone cameras; visual colors confirm VIP tiers.",
          },
          {
            icon: FileSpreadsheet,
            title: "Tiered Sales Analytics",
            desc: "Export sales and check-in reports broken down by ticket category with one click.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Create Ticket Categories",
                "desc": "Define General, VIP, and Multi-Day tiers with pricing and inventory limits."
        },
        {
                "n": "02",
                "title": "Connect Razorpay",
                "desc": "Link your verified Razorpay merchant account to collect registration fees directly via UPI."
        },
        {
                "n": "03",
                "title": "Publish Registration Portal",
                "desc": "Share your high-converting, mobile-responsive page with prospective attendees."
        },
        {
                "n": "04",
                "title": "Issue Digital Passes",
                "desc": "Attendees receive personalized digital QR passes via email, WhatsApp, and Apple Wallet."
        },
        {
                "n": "05",
                "title": "Scan at Venue Doors",
                "desc": "Door staff scan passes in <0.3s with smartphone cameras to verify tier access."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Ticket Category Management in Bengaluru?",
        "subtitle": "Event leads and promoters across Bengaluru's vibrant event scene.",
        "personas": [
                {
                        "badge": "CONFERENCES",
                        "title": "Tech & Business Summits",
                        "desc": "Manage General Delegate, Speaker, and VIP Executive conference tiers."
                },
                {
                        "badge": "FESTIVALS",
                        "title": "Music & Cultural Festivals",
                        "desc": "Sell General Admission, VIP Lounge, and Backstage access tickets with price shifts."
                },
                {
                        "badge": "WORKSHOPS",
                        "title": "Professional Masterclasses",
                        "desc": "Offer Early Bird, Regular, and 1-on-1 Mentorship workshop tiers."
                },
                {
                        "badge": "CAMPUS",
                        "title": "College & Student Fests",
                        "desc": "Provide discounted internal student passes alongside external college tickets."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Category Verification Operates at the Gate",
        "subtitle": "Instant visual confirmation that distinguishes VIPs from general guests.",
        "description": "Attendees present their digital pass on their smartphone screen or Apple Wallet. Gate staff point their mobile camera at the pass. UrPass verifies the ticket in under 300 milliseconds, displays the attendee's name and tier (e.g. VIP All-Access), and marks them checked in immediately.",
        "points": [
                "Color-coded scanner screen highlights VIP, Speaker, and General Admission tiers instantly.",
                "Prevents general admission ticket holders from entering restricted VIP areas.",
                "Detects and rejects duplicate scans across all entrances automatically.",
                "Supports manual search by attendee name or email for quick backup entry."
        ]
},
        faqs: [
        {
                "q": "How many ticket categories can I create for an event on UrPass?",
                "a": "You can create unlimited ticket categories (e.g. Early Bird, General Admission, VIP Executive, Speaker, Student, Multi-Day Pass) on any UrPass plan."
        },
        {
                "q": "Can I set different capacities for each ticket tier?",
                "a": "Yes. You can assign individual inventory limits to each category (e.g. 50 VIP tickets, 200 General tickets), and each tier closes automatically once sold out."
        },
        {
                "q": "Does UrPass charge commission on expensive VIP ticket tiers?",
                "a": "No. UrPass charges 0% commission on ticket sales. You pay a transparent monthly subscription (plans from ₹499/mo) and connect your own Razorpay account."
        },
        {
                "q": "Can attendees save their tiered tickets to Apple Wallet?",
                "a": "Yes. UrPass digital passes feature native Apple Wallet (.pkpass) support. Attendees can add their pass with one tap and retrieve it from their iPhone lockscreen upon arriving at the venue."
        },
        {
                "q": "How do gate staff know if an attendee has a VIP ticket?",
                "a": "The mobile camera scanner displays a prominent visual banner showing the attendee's tier name (e.g. 'VIP All-Access') and plays a confirmation chime upon successful validation."
        }
],
      }}
    />
  );
}
