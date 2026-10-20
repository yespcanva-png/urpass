import type { Metadata } from "next";
import { CreditCard, Crown, Palette, QrCode, ScanLine, Sparkles } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Branded Event Ticket Design Bengaluru | UrPass",
  description: "Design branded event tickets and digital QR passes for Bengaluru conferences, seminars and corporate events using UrPass.",
  keywords: ["custom branded event tickets bengaluru","branded qr pass design bangalore","event ticket designer bengaluru","digital badge design bangalore","white label event passes"],
  alternates: {
    canonical: "https://urpass.space/bengaluru-branded-event-ticket-design",
  },
  openGraph: {
    title: "Branded Event Ticket Design Bengaluru | UrPass",
    description: "Design branded event tickets and digital QR passes for Bengaluru conferences, seminars and corporate events using UrPass.",
    url: "https://urpass.space/bengaluru-branded-event-ticket-design",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Branded Event Ticket Design Bengaluru | UrPass",
    description: "Design branded event tickets and digital QR passes for Bengaluru conferences, seminars and corporate events using UrPass.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BengaluruBrandedEventTicketDesignPage() {
  return (
    <SEOPage
      config={{
        badge: "CUSTOM-BRANDED QR TICKETS",
        h1: "Create Custom-Branded QR Tickets for Bengaluru Events",
        canonicalUrl: "https://urpass.space/bengaluru-branded-event-ticket-design",
        description: "Design branded event tickets and digital QR passes for Bengaluru conferences, seminars and corporate events using UrPass.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bengaluru-branded-event-ticket-design",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Design Stunning Branded Event Passes",
        ctaDescription: "Customize digital QR passes with your brand colors, sponsor logos, Apple Wallet artwork, and dynamic attendee credentials without design software.",
        directAnswer: {
        "title": "What is Branded Event Ticket Design for Bengaluru Events?",
        "summary": "Branded event ticket design in Bengaluru allows organizers of corporate conferences, luxury galas, and tech summits to create customized digital QR tickets and Apple Wallet passes matching their visual brand identity. UrPass provides custom colors, sponsor logos, attendee name badging, and WhatsApp pass distribution with 0% ticket fees.",
        "keyPoints": [
                "Customize pass colors, brand typography, event banners, and sponsor logos",
                "Native Apple Wallet (.pkpass) design with lockscreen notification badges",
                "Dynamic personalization displays attendee name, job title, company, and ticket tier",
                "100% paperless distribution via instant WhatsApp messages, Apple Wallet, and email"
        ]
},
        whatIs: {
        "title": "Why Bengaluru Event Brands Prioritize Custom Passes",
        "definition": "Generic, black-and-white ticketing receipts undermine the prestige of high-end tech summits and brand launches in Bengaluru. Your ticket is the first physical or digital artifact an attendee interacts with.",
        "details": [
                "Elevate brand perception: deliver sleek, executive-grade digital passes that delegates are proud to screenshot",
                "Sponsor monetization: feature primary sponsor logos directly on digital passes and Apple Wallet cards",
                "Dynamic credential badging: display delegate name, company, and VIP tier on the digital pass",
                "Sub-0.3s camera check-in validates branded QR tickets on volunteer smartphones effortlessly"
        ]
},
        keyFactsTable: {
        "title": "UrPass Custom Passes vs Generic Ticketing Receipts",
        "subtitle": "Why design-conscious Bengaluru brands choose UrPass.",
        "headers": [
                "Design Feature",
                "Generic Ticketing Aggregators",
                "UrPass Branded Pass Studio"
        ],
        "rows": [
                {
                        "col1": "Brand Identity",
                        "col2": "Dominant aggregator branding with tiny organizer text",
                        "col3": "100% your brand: custom colors, logos, and banners"
                },
                {
                        "col1": "Apple Wallet Design",
                        "col2": "Not supported or generic plain grey pass cards",
                        "col3": "Custom Apple Wallet (.pkpass) cards with branded artwork"
                },
                {
                        "col1": "Sponsor Visibility",
                        "col2": "Aggregator ads placed on your attendee ticket",
                        "col3": "Dedicated sponsor logo placement on passes & emails"
                },
                {
                        "col1": "Attendee Personalization",
                        "col2": "Standard barcode with minimal attendee details",
                        "col3": "Dynamic badging: Name, Company, Job Title, and Tier"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "APPLE WALLET",
                "title": "Bespoke Apple Wallet Pass Design with Lockscreen Popups",
                "paragraphs": [
                        "Apple Wallet (.pkpass) credentials offer the most prestigious mobile ticket experience available on smartphones. However, developing custom pass packages traditionally required complex iOS cryptographic signing infrastructure.",
                        "UrPass automates Apple Wallet pass design. Upload your brand banner, configure your primary color palette, and UrPass generates cryptographically signed `.pkpass` files automatically that appear on attendees' lockscreens as they arrive at the venue."
                ],
                "bullets": [
                        "Custom header artwork, strip image banner, and brand accent colors",
                        "Lockscreen geofence notifications trigger pass accessibility at venue gates",
                        "Back-of-pass details include schedule highlights, Wi-Fi passwords, and venue maps",
                        "Dynamic updates allow organizers to push auditorium seat or room changes remotely"
                ],
                "takeaway": "Branded Apple Wallet passes deliver a polished, executive attendee experience."
        },
        {
                "badge": "SPONSOR ROI",
                "title": "Monetize Digital Real Estate with Sponsor Logo Placements",
                "paragraphs": [
                        "Conference sponsors in Bengaluru invest heavily to get their brand in front of senior engineers, founders, and executives. Digital passes provide high-visibility real estate that every delegate checks repeatedly.",
                        "UrPass allows organizers to feature title sponsor logos directly on digital tickets, confirmation emails, and Apple Wallet passes. Offer premium sponsor logo positioning as part of your sponsorship tier packages."
                ],
                "bullets": [
                        "Place headline and partner logos prominently across digital QR passes",
                        "Feature sponsor messaging on post-registration confirmation pages",
                        "Track delegate impressions across digital tickets and WhatsApp notifications",
                        "Automated corporate GST invoices matching sponsor expense requirements"
                ],
                "takeaway": "Branded ticket real estate provides tangible ROI for event sponsors."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed, privacy, and zero ticket fees.",
        features: [
          {
            icon: Palette,
            title: "Custom Brand Studio",
            desc: "Customize pass background colors, brand typography, banners, and logos without coding.",
          },
          {
            icon: QrCode,
            title: "Apple Wallet & WhatsApp",
            desc: "Deliver personalized, branded credentials directly to Apple Wallet and WhatsApp chats.",
          },
          {
            icon: Crown,
            title: "Dynamic Attendee Badging",
            desc: "Display attendee name, company, job title, and VIP tier prominently on each pass.",
          },
          {
            icon: Sparkles,
            title: "Sponsor Logo Placement",
            desc: "Showcase event sponsors on digital tickets, confirmation emails, and pass cards.",
          },
          {
            icon: CreditCard,
            title: "0% Commission via Razorpay",
            desc: "Collect ticket payments directly into your Razorpay account with zero platform fees.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Door Validation",
            desc: "Scan and check in attendees using smartphone cameras with zero hardware rentals.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Upload Brand Assets",
                "desc": "Upload your event logo, banner artwork, and define your brand color palette."
        },
        {
                "n": "02",
                "title": "Configure Ticket Fields",
                "desc": "Choose what delegate details appear on the pass: Name, Company, Tier, or Seat."
        },
        {
                "n": "03",
                "title": "Preview Digital Pass",
                "desc": "Inspect live previews for mobile web, WhatsApp, and Apple Wallet passes."
        },
        {
                "n": "04",
                "title": "Publish & Sell Tickets",
                "desc": "Share your branded portal; attendees receive customized passes upon purchase."
        },
        {
                "n": "05",
                "title": "Scan at Venue Doors",
                "desc": "Door staff scan branded passes in <0.3s with smartphone cameras for rapid entry."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Branded Ticket Design in Bengaluru?",
        "subtitle": "Event producers and marketing directors across Karnataka's design-savvy hub.",
        "personas": [
                {
                        "badge": "TECH CONFERENCES",
                        "title": "Developer & AI Summits",
                        "desc": "Create stylish mobile badges that software engineers love to share on social media."
                },
                {
                        "badge": "LUXURY & GALAS",
                        "title": "Award Shows & Banquets",
                        "desc": "Deliver gold-accented VIP passes for prestigious red-carpet galas and ceremonies."
                },
                {
                        "badge": "PRODUCT LAUNCHES",
                        "title": "Brand & Automobile Reveals",
                        "desc": "Reinforce brand identity with customized pass aesthetics matching your new product."
                },
                {
                        "badge": "FESTIVALS",
                        "title": "Music & Cultural Conclaves",
                        "desc": "Design vibrant, collectible digital passes that showcase festival artwork."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Branded Passes Function at the Door",
        "subtitle": "Flawless aesthetics paired with sub-second validation speed.",
        "description": "Attendees present their custom-branded digital pass on their smartphone screen or Apple Wallet. The gate volunteer points their mobile camera at the pass. UrPass validates the encrypted token in under 300 milliseconds, displays the delegate's name and ticket tier, and logs the check-in immediately.",
        "points": [
                "High-contrast visual design ensures instant camera readability in any lighting.",
                "Displays real-time pass validity with attendee name, organization, and tier.",
                "Prevents duplicate entry attempts across multiple entrance gates automatically.",
                "Supports manual name and email lookup for fast backup check-in."
        ]
},
        faqs: [
        {
                "q": "Do I need graphic design software to create custom tickets on UrPass?",
                "a": "No. UrPass includes an intuitive visual design studio where you simply upload your logo and banner, pick your brand colors, and the system formats web, email, and Apple Wallet passes automatically."
        },
        {
                "q": "Can I add sponsor logos to the digital tickets?",
                "a": "Yes. You can upload sponsor logos to display prominently on digital QR passes, confirmation emails, and registration receipt pages."
        },
        {
                "q": "Does Apple Wallet require special developer accounts to use?",
                "a": "No. UrPass handles all Apple Wallet cryptographic certificate signing and pass generation automatically in the cloud. Your attendees simply tap 'Add to Apple Wallet'."
        },
        {
                "q": "Can I display the attendee's company name and job title on the pass?",
                "a": "Yes. You can configure dynamic pass fields so the pass displays attendee name, company, designation, and ticket tier (e.g. VIP Speaker)."
        },
        {
                "q": "What pricing applies to custom branded ticket design?",
                "a": "Custom pass design is included in UrPass plans starting at an introductory ₹29/month for your first 2 months (then ₹999/month), with 0% platform ticket fees."
        }
],
      }}
    />
  );
}
