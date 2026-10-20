import type { Metadata } from "next";
import { Clock, CreditCard, FileSpreadsheet, QrCode, ScanLine, Tags } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Early Bird Event Ticketing Bengaluru | UrPass",
  description: "Create early bird, general and VIP ticket categories for Bengaluru events. Manage registrations, payments and digital entry passes.",
  keywords: ["early bird event ticketing bengaluru","vip event tickets bangalore","tiered ticket pricing bengaluru","razorpay early bird tickets","event ticketing tiers bangalore"],
  alternates: {
    canonical: "https://urpass.space/bengaluru-early-bird-event-ticketing",
  },
  openGraph: {
    title: "Early Bird Event Ticketing Bengaluru | UrPass",
    description: "Create early bird, general and VIP ticket categories for Bengaluru events. Manage registrations, payments and digital entry passes.",
    url: "https://urpass.space/bengaluru-early-bird-event-ticketing",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Early Bird Event Ticketing Bengaluru | UrPass",
    description: "Create early bird, general and VIP ticket categories for Bengaluru events. Manage registrations, payments and digital entry passes.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BengaluruEarlyBirdEventTicketingPage() {
  return (
    <SEOPage
      config={{
        badge: "TIERED EVENT TICKETING",
        h1: "Early Bird and VIP Event Tickets in Bengaluru",
        canonicalUrl: "https://urpass.space/bengaluru-early-bird-event-ticketing",
        description: "Create early bird, general and VIP ticket categories for Bengaluru events. Manage registrations, payments and digital entry passes.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bengaluru-early-bird-event-ticketing",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Maximize Ticket Revenue with Tiered Pricing",
        ctaDescription: "Set up Early Bird, General Admission, and VIP ticket categories with automated price shifts, Razorpay payments, and 0% platform commission.",
        directAnswer: {
        "title": "What is Early Bird and VIP Event Ticketing for Bengaluru?",
        "summary": "Early bird and VIP event ticketing in Bengaluru enables organizers to maximize event revenue through time-limited and capacity-limited ticket tiers (e.g. Super Early Bird, Early Bird, General Admission, VIP Pass). UrPass provides automated tier expiration, direct Razorpay UPI settlement, and 0% platform ticket commission.",
        "keyPoints": [
                "Automated tier expiration based on date/time schedules or seat inventory caps",
                "Direct UPI and card settlement via Razorpay with 0% platform ticket commission",
                "Visual tier distinction on mobile scanner screens to enforce VIP access controls",
                "Digital QR pass delivery on WhatsApp and Apple Wallet with sub-0.3s gate validation"
        ]
},
        whatIs: {
        "title": "Why Bengaluru Event Producers Use UrPass for Tiered Tickets",
        "definition": "Tiered ticketing drives early cash flow and creates conversion urgency. However, traditional ticketing platforms penalize your success by extracting 5% to 8% commissions from every early bird and high-value VIP ticket sold.",
        "details": [
                "0% ticket commission—keep 100% of your delegate revenue across all ticket categories",
                "Automated tier transitions: when Early Bird sells out, General Admission opens automatically",
                "Private hidden tiers accessible only via bespoke discount or VIP access codes",
                "Automated corporate GST tax invoices delivered directly to delegate inboxes"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Traditional Ticketing Brokers in Bengaluru",
        "subtitle": "Why Bengaluru conference and concert organizers choose UrPass.",
        "headers": [
                "Ticketing Feature",
                "Traditional Ticketing Brokers",
                "UrPass Tiered Ticketing Engine"
        ],
        "rows": [
                {
                        "col1": "Platform Commission",
                        "col2": "5% to 8% cut on every early bird and VIP pass",
                        "col3": "0% ticket commission; plans from ₹29/month"
                },
                {
                        "col1": "Tier Automation",
                        "col2": "Manual tier price adjustments or complex setups",
                        "col3": "Automated schedule & seat inventory-based transitions"
                },
                {
                        "col1": "Payment Settlement",
                        "col2": "Payouts delayed 7 to 14 days after event concludes",
                        "col3": "Direct settlement into your Razorpay account"
                },
                {
                        "col1": "Door Check-In Latency",
                        "col2": "Bulky rental scanners or slow manual lookups",
                        "col3": "Sub-0.3s camera scan on volunteer smartphones"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "CONVERSION URGENCY",
                "title": "Automated Tier Transitions That Maximize Early Cash Flow",
                "paragraphs": [
                        "Launching an event with a limited Early Bird tier creates psychological urgency that converts prospective attendees quickly, providing organizers with early operating capital.",
                        "UrPass allows you to set precise rules for each ticket tier. Configure an Early Bird tier with a maximum cap of 100 tickets or an expiration deadline. Once reached, the tier closes automatically and seamlessly unlocks General Admission."
                ],
                "bullets": [
                        "Configure Super Early Bird, Early Bird, General Admission, and VIP tiers",
                        "Automate tier closures by exact date/time or total sold count",
                        "Live ticket counter displays remaining seats to create natural purchase urgency",
                        "Real-time revenue telemetry tracks sales velocity across each pricing tier"
                ],
                "takeaway": "Automated tier transitions drive early registrations without manual intervention."
        },
        {
                "badge": "0% COMMISSION",
                "title": "Direct Razorpay UPI Settlement with 0% Platform Fees",
                "paragraphs": [
                        "When selling premium ₹5,000 or ₹10,000 VIP conference tickets in Bengaluru, surrendering 8% to an aggregator means losing hundreds of rupees per delegate.",
                        "UrPass charges 0% commission on ticket sales. Link your verified Razorpay merchant account, and attendee payments from Google Pay, PhonePe, credit cards, and net banking settle straight into your organization's bank account."
                ],
                "bullets": [
                        "Retain 100% of ticket sales across all early bird and VIP tiers",
                        "Automated GST invoice generation matching corporate expense requirements",
                        "Support student payment options: UPI, debit cards, credit cards, and net banking",
                        "Transparent software pricing with introductory plans starting at ₹29/month"
                ],
                "takeaway": "Zero commission protects your margins on high-value VIP ticket tiers."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed, privacy, and zero ticket fees.",
        features: [
          {
            icon: Tags,
            title: "Unlimited Ticket Tiers",
            desc: "Create Early Bird, VIP, Student, Speaker, and Group Pass categories with custom rules.",
          },
          {
            icon: CreditCard,
            title: "0% Commission via Razorpay",
            desc: "Receive ticket revenue directly into your account with zero platform percentage cuts.",
          },
          {
            icon: Clock,
            title: "Automated Expiration",
            desc: "Set automatic tier cutoffs based on calendar deadlines or inventory caps.",
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
            desc: "Export sales and check-in reports broken down by ticket tier with one click.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Set Up Ticket Tiers",
                "desc": "Define Early Bird, General Admission, and VIP tiers with pricing and inventory limits."
        },
        {
                "n": "02",
                "title": "Connect Razorpay",
                "desc": "Link your verified Razorpay merchant account to collect registration fees directly via UPI."
        },
        {
                "n": "03",
                "title": "Publish & Share Link",
                "desc": "Promote your responsive event booking page across WhatsApp, LinkedIn, and email."
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
        "title": "Who Uses UrPass for Tiered Tickets in Bengaluru?",
        "subtitle": "Event leads and promoters across Bengaluru's vibrant event scene.",
        "personas": [
                {
                        "badge": "CONFERENCES",
                        "title": "Tech & Business Summits",
                        "desc": "Manage Early Bird, Standard Delegate, and VIP Executive conference tiers."
                },
                {
                        "badge": "FESTIVALS",
                        "title": "Music & Cultural Festivals",
                        "desc": "Sell Phase 1, Phase 2, and VIP backstage access tickets with automatic price shifts."
                },
                {
                        "badge": "WORKSHOPS",
                        "title": "Professional Masterclasses",
                        "desc": "Offer discounted Early Bird seats to fill workshop batches weeks ahead of time."
                },
                {
                        "badge": "CAMPUS",
                        "title": "College & Student Fests",
                        "desc": "Provide discounted student passes alongside general admission tickets."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Tier Verification Works at Venue Doors",
        "subtitle": "Instant visual confirmation that distinguishes VIPs from general guests.",
        "description": "Attendees present their digital pass on their smartphone screen or Apple Wallet. Gate staff point their mobile camera at the pass. UrPass verifies the ticket in under 300 milliseconds, displays the attendee's name and tier (e.g., Gold VIP), and marks them checked in immediately.",
        "points": [
                "Color-coded scanner screen highlights VIP, Speaker, and General Admission tiers instantly.",
                "Prevents general admission ticket holders from entering restricted VIP areas.",
                "Detects and rejects duplicate scans across all entrances automatically.",
                "Supports manual search by attendee name or email for quick backup entry."
        ]
},
        faqs: [
        {
                "q": "How do Early Bird price shifts work on UrPass?",
                "a": "You can configure Early Bird tiers to close automatically at a specific date and time, or as soon as a set number of tickets sell out. Once closed, the next tier opens automatically."
        },
        {
                "q": "Does UrPass charge commission on high-value VIP tickets?",
                "a": "No. UrPass charges 0% commission on ticket sales. You pay a transparent monthly subscription (introductory offer ₹29/mo, then ₹999/mo) and connect your own Razorpay account."
        },
        {
                "q": "Can I create secret or hidden ticket tiers for VIP guests?",
                "a": "Yes. You can create hidden ticket tiers that are only revealed when an attendee enters a specific promo or access code on your registration page."
        },
        {
                "q": "Can attendees add their tiered tickets to Apple Wallet?",
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
