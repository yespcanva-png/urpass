import type { Metadata } from "next";
import { CreditCard, FileSpreadsheet, QrCode, ScanLine, Sliders, Sparkles } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Indiranagar Event Ticketing | UrPass",
  description: "Sell tickets for Indiranagar community events with flexible ticket categories, digital QR passes and smartphone entrance scanning.",
  keywords: ["community event ticketing indiranagar","indiranagar creative workshop registration","100 feet road event passes","indiranagar music gig tickets","indie mixer check-in bangalore"],
  alternates: {
    canonical: "https://urpass.space/indiranagar-community-event-ticketing",
  },
  openGraph: {
    title: "Indiranagar Event Ticketing | UrPass",
    description: "Sell tickets for Indiranagar community events with flexible ticket categories, digital QR passes and smartphone entrance scanning.",
    url: "https://urpass.space/indiranagar-community-event-ticketing",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Indiranagar Event Ticketing | UrPass",
    description: "Sell tickets for Indiranagar community events with flexible ticket categories, digital QR passes and smartphone entrance scanning.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function IndiranagarCommunityEventTicketingPage() {
  return (
    <SEOPage
      config={{
        badge: "INDIRANAGAR COMMUNITY TICKETING",
        h1: "Community Event Ticketing and QR Entry in Indiranagar",
        canonicalUrl: "https://urpass.space/indiranagar-community-event-ticketing",
        description: "Ticketing and registration for Indiranagar community events, creative workshops, and mixers. Sell tickets via UPI, send passes on WhatsApp, keep 100% revenue.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=indiranagar-community-event-ticketing",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Elevate Your Indiranagar Community Event",
        ctaDescription: "Sell tickets via UPI with 0% platform commission, dispatch passes on WhatsApp, and welcome guests with sub-second QR check-in on 100 Feet Road.",
        directAnswer: {
        "title": "What is Community Event Ticketing for Indiranagar?",
        "summary": "Community event ticketing in Indiranagar powers indie workshops, cultural showcases, acoustic music gigs, and creative mixers around 100 Feet Road and 12th Main. UrPass provides creator-first ticketing with instant UPI checkout via Razorpay, 0% platform commission, WhatsApp QR tickets, and sub-0.3s camera check-in.",
        "keyPoints": [
                "Tailored for creative studios, intimate cafe venues, and cultural spaces in Indiranagar",
                "Keep 100% of your ticket revenue—0% commission deductions on paid tickets",
                "Direct UPI checkout via Google Pay, PhonePe, and Paytm with instant confirmations",
                "Personalized digital QR passes delivered to attendee WhatsApp and Apple Wallet"
        ]
},
        whatIs: {
        "title": "Why Indiranagar Creators and Organizers Choose UrPass",
        "definition": "Indiranagar is Bangalore's cultural heartbeat, teeming with indie art galleries, rooftop gig spaces, and creator salons. UrPass gives community hosts an intuitive ticketing tool that doesn't eat away their margins.",
        "details": [
                "Zero ticketing commissions—stop surrendering 5% to 10% of every ticket sold to ticketing brokers",
                "Instant WhatsApp pass delivery ensures guests arrive with their tickets ready on their phones",
                "Fast smartphone camera scanning validates attendees at intimate cafe doors in under 0.3s",
                "Complete attendee data ownership: your guest list belongs to you, not an advertising network"
        ]
},
        keyFactsTable: {
        "title": "UrPass vs Legacy Ticketing Apps in Indiranagar",
        "subtitle": "Why creative community hosts in Indiranagar choose UrPass.",
        "headers": [
                "Community Feature",
                "Legacy Ticketing Apps",
                "UrPass Indiranagar Solution"
        ],
        "rows": [
                {
                        "col1": "Platform Commission",
                        "col2": "5% to 10% fee deducted per ticket sold",
                        "col3": "0% ticket commission; plans from ₹499/month"
                },
                {
                        "col1": "Audience Marketing",
                        "col2": "Markets competing events to your attendees",
                        "col3": "100% private attendee data, strictly yours"
                },
                {
                        "col1": "Pass Delivery",
                        "col2": "Forces attendees to download proprietary apps",
                        "col3": "Delivered directly to WhatsApp & Apple Wallet"
                },
                {
                        "col1": "Door Check-In",
                        "col2": "Slow manual name checks on paper or spreadsheets",
                        "col3": "Sub-0.3s camera scan on volunteer smartphones"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "0% COMMISSION",
                "title": "Keep 100% of Ticket Revenue with Direct Razorpay UPI Settlement",
                "paragraphs": [
                        "Indie organizers, artists, and creative workshop hosts in Indiranagar operate on tight margins. Traditional ticketing portals deduct 5% to 10% from every ticket sold and hold funds for weeks after the event concludes.",
                        "UrPass charges 0% commission on ticket sales. Connect your Razorpay account, and payments from Google Pay, PhonePe, and credit cards settle straight into your account with zero platform cuts."
                ],
                "bullets": [
                        "Save thousands of rupees on every workshop, mixer, and showcase",
                        "Collect payments directly via UPI, cards, and net banking with instant confirmation",
                        "Transparent, predictable monthly subscription (plans from ₹499/month)",
                        "Automated financial reconciliation with instant CSV sales reporting"
                ],
                "takeaway": "Zero commission means creative communities keep the revenue they earn."
        },
        {
                "badge": "DOOR EXPERIENCE",
                "title": "Instant WhatsApp Ticket Delivery and Sub-0.3s Camera Check-In",
                "paragraphs": [
                        "Intimate cafe venues and rooftop art studios on 100 Feet Road and 12th Main have narrow entryways. Clunky manual guest lists create door congestion and frustrate arriving guests.",
                        "UrPass automatically dispatches dynamic QR passes directly into attendees' WhatsApp inboxes and Apple Wallets. Venue hosts scan passes with standard smartphone cameras in under 300 milliseconds, welcoming guests smoothly."
                ],
                "bullets": [
                        "No app installation required for organizers or arriving attendees",
                        "Passes include Google Maps venue links, show timings, and dress codes",
                        "Prevents ticket sharing and unverified drop-ins with atomic token locking",
                        "Manual search by guest name or email provides instant backup check-in"
                ],
                "takeaway": "WhatsApp passes and sub-0.3s camera check-in eliminate doorway friction."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed and zero ticket fees.",
        features: [
          {
            icon: Sparkles,
            title: "Community Tiering",
            desc: "Configure Early Bird, General Entry, and VIP Supporter passes with custom perks.",
          },
          {
            icon: CreditCard,
            title: "0% Commission via Razorpay",
            desc: "Keep 100% of your ticket revenue. Receive direct UPI payments into your account.",
          },
          {
            icon: QrCode,
            title: "WhatsApp & Wallet Tickets",
            desc: "Deliver personalized QR tickets directly to attendee WhatsApp chats and Apple Wallet.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Camera Check-In",
            desc: "Scan and check in guests instantly using volunteer phone cameras with zero app downloads.",
          },
          {
            icon: Sliders,
            title: "Capacity & Intake Logic",
            desc: "Set strict seat caps to prevent overbooking intimate Indiranagar cafe venues.",
          },
          {
            icon: FileSpreadsheet,
            title: "Instant Roster Export",
            desc: "Export verified attendee lists with full contact details and arrival timestamps to CSV.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Set Up Community Event",
                "desc": "Define your Indiranagar gig or workshop details, ticket tiers, and capacity limits."
        },
        {
                "n": "02",
                "title": "Connect Razorpay",
                "desc": "Link your verified Razorpay merchant account to collect ticket revenue directly via UPI."
        },
        {
                "n": "03",
                "title": "Publish & Share Link",
                "desc": "Promote your responsive event booking page across Instagram, WhatsApp, and Twitter."
        },
        {
                "n": "04",
                "title": "Issue Digital Passes",
                "desc": "Ticket buyers receive dynamic QR tickets via WhatsApp, email, and Apple Wallet."
        },
        {
                "n": "05",
                "title": "Scan at Venue Door",
                "desc": "Hosts scan passes in <0.3s with smartphone cameras to welcome guests without delay."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Indiranagar Community Events?",
        "subtitle": "Creative producers and venue hosts across Indiranagar, Bengaluru.",
        "personas": [
                {
                        "badge": "INDIE CREATORS",
                        "title": "Acoustic & Comedy Shows",
                        "desc": "Host intimate standup comedy sets, acoustic music gigs, and poetry showcases."
                },
                {
                        "badge": "ART STUDIOS",
                        "title": "Art & Pottery Masterclasses",
                        "desc": "Manage weekend watercolor bootcamps, ceramic workshops, and design salons."
                },
                {
                        "badge": "COMMUNITY MIXERS",
                        "title": "Creator & Social Clubs",
                        "desc": "Organize book club discussions, language exchange mixers, and creative coffee meets."
                },
                {
                        "badge": "POP-UPS",
                        "title": "Pop-Up Markets & Exhibitions",
                        "desc": "Sell entry passes and verify attendees for weekend fashion pop-ups and artisan markets."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Guest Check-In Works at Indiranagar Venues",
        "subtitle": "Friendly, smooth arrival that preserves your intimate venue vibe.",
        "description": "Guests display their digital pass on their smartphone screen or Apple Wallet. The venue host points their mobile camera at the pass. UrPass validates the ticket in under 300 milliseconds, displays the guest's name and tier, and marks them checked in immediately.",
        "points": [
                "Eliminates slow manual searching through printed spreadsheets at cozy studio doors.",
                "Displays real-time pass validity with guest name, tier, and ticket details.",
                "Prevents duplicate entry attempts automatically with cryptographic token locks.",
                "Supports manual name and email lookup for fast backup check-in."
        ]
},
        faqs: [
        {
                "q": "Why should Indiranagar event organizers switch to UrPass?",
                "a": "Traditional ticketing services take 5–10% of every ticket sold. UrPass charges 0% commission, saving creative communities thousands of rupees on every workshop and mixer."
        },
        {
                "q": "How do attendees receive tickets on WhatsApp?",
                "a": "Once payment completes, UrPass automatically dispatches a verified WhatsApp message containing the attendee’s dynamic QR pass, event details, and Google Maps pin."
        },
        {
                "q": "Can I sell tickets with limited batch caps for intimate venues?",
                "a": "Yes. You can establish strict inventory limits per ticket tier (e.g., Early Bird, General Admission) to prevent overbooking cozy Indiranagar venues."
        },
        {
                "q": "Do gate volunteers need to download special software?",
                "a": "No. Check-in staff simply open a secure web link on any phone camera to scan and validate tickets in real time."
        },
        {
                "q": "Can attendees save their community pass to Apple Wallet?",
                "a": "Yes. UrPass digital passes feature native Apple Wallet (.pkpass) support. Attendees can add their pass with one tap and retrieve it from their iPhone lockscreen upon arriving at the venue."
        }
],
      }}
    />
  );
}
