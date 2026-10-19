import type { Metadata } from "next";
import { MessageSquare, QrCode, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "WhatsApp Event Ticket Delivery | UrPass",
  description: "Explore WhatsApp event ticket delivery with UrPass. Connect an approved WhatsApp account and send digital pass links using approved templates.",
  keywords: ["whatsapp event ticket delivery","send event tickets on whatsapp","whatsapp qr pass delivery","event ticketing whatsapp integration","whatsapp event passes","whatsapp event communications"],
  alternates: {
    canonical: "https://urpass.space/whatsapp-event-ticket-delivery",
  },
  openGraph: {
    title: "WhatsApp Event Ticket Delivery | UrPass",
    description: "Explore WhatsApp event ticket delivery with UrPass. Connect an approved WhatsApp account and send digital pass links using approved templates.",
    url: "https://urpass.space/whatsapp-event-ticket-delivery",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WhatsApp Event Ticket Delivery | UrPass",
    description: "Explore WhatsApp event ticket delivery with UrPass. Connect an approved WhatsApp account and send digital pass links using approved templates.",
  },
};

export default function WhatsappEventTicketDeliveryPage() {
  return (
    <SEOPage
      config={{
        badge: "WHATSAPP TICKET DISPATCH",
        h1: "Send Event Tickets and QR Passes on WhatsApp",
        canonicalUrl: "https://urpass.space/whatsapp-event-ticket-delivery",
        description: "Explore WhatsApp event ticket delivery with UrPass. Connect an approved WhatsApp account and send digital pass links using approved templates.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=whatsapp-event-ticket-delivery",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Deliver Event Tickets Directly to Attendees' WhatsApp",
        ctaDescription: "Achieve 98% open rates and eliminate spam filter losses. Connect your WhatsApp Business API account or use UrPass Managed WhatsApp.",
        directAnswer: {
        "title": "What is WhatsApp Event Ticket Delivery?",
        "summary": "WhatsApp event ticket delivery is a system that sends digital event tickets and scannable QR passes directly to attendees' WhatsApp chats upon registration or purchase. Leveraging the Meta WhatsApp Cloud API with pre-approved message templates, it achieves 98% open rates and frictionless venue entry.",
        "keyPoints": [
                "98% message open rate compared to standard 20% email open rates",
                "Direct delivery of dynamic scannable QR pass links into attendee WhatsApp chats",
                "Self-Service Meta Cloud API integration or turn-key UrPass Managed WhatsApp",
                "Sub-second gate scanning from the attendee's WhatsApp pass display"
        ]
},
        whatIs: {
        "title": "How WhatsApp Ticket Delivery Functions in UrPass",
        "definition": "UrPass WhatsApp ticket delivery connects your event communication workflow directly to the Meta WhatsApp Business Platform. When an attendee registers or completes checkout, UrPass triggers a WhatsApp message containing their personalized event confirmation and a dynamic link to their digital QR pass.",
        "details": [
                "Eliminates tickets lost in email spam, promotions, or junk folders",
                "Provides attendees with instant access to their ticket without downloading separate apps",
                "Supports dynamic CTA buttons such as 'View My Pass' opening their encrypted mobile ticket",
                "Offers two deployment models: Self-Service (bring your own Meta WABA) and UrPass Managed WhatsApp"
        ]
},
        keyFactsTable: {
        "title": "WhatsApp Ticket Delivery vs Traditional Email Delivery",
        "subtitle": "Why event organizers are switching to WhatsApp for attendee communications.",
        "headers": [
                "Communication Channel",
                "Email Ticket Delivery",
                "UrPass WhatsApp Delivery"
        ],
        "rows": [
                {
                        "col1": "Average Open Rate",
                        "col2": "18% - 22% (frequently caught in spam or promotions tab)",
                        "col3": "95% - 98% (opened within minutes of delivery)"
                },
                {
                        "col1": "Entrance Retrieval Time",
                        "col2": "30-60 seconds spent searching inbox or downloading PDF",
                        "col3": "5 seconds to open WhatsApp chat and display QR pass"
                },
                {
                        "col1": "Delivery Reliability",
                        "col2": "Affected by corporate firewall filters and full mailboxes",
                        "col3": "Direct delivery to attendee verified mobile phone number"
                },
                {
                        "col1": "Gate Queue Speed",
                        "col2": "Slow queues due to attendees struggling to locate emails",
                        "col3": "Rapid entry flow with passes readily accessible on mobile screens"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "ENGAGEMENT & ATTENDANCE",
                "title": "98% Open Rates Eliminate 'I Didn't Receive My Ticket' Complaints",
                "paragraphs": [
                        "Every event organizer dreads the morning entrance bottleneck caused by attendees frantically searching their email inboxes, checking spam folders, or complaining that their ticket was never delivered. Corporate email filters and aggressive spam algorithms routinely misplace transactional ticket emails.",
                        "WhatsApp boasts an unmatched 98% open rate, with the vast majority of messages read within three minutes. Delivering tickets via WhatsApp guarantees that attendees have their pass immediately accessible on their primary messaging app, drastically reducing customer support inquiries and entry delays."
                ],
                "bullets": [
                        "Instant delivery of pass confirmation directly after form submission or payment",
                        "One-tap 'View My Pass' button opens the mobile-responsive digital ticket",
                        "Automated event reminders and venue directions sent before the event",
                        "Drastically cuts registration helpdesk inquiries on event morning"
                ],
                "takeaway": "WhatsApp pass delivery ensures attendees arrive at the venue with tickets ready on their screens."
        },
        {
                "badge": "INTEGRATION MODELS",
                "title": "Flexible Integration: Self-Service Meta WABA or UrPass Managed",
                "paragraphs": [
                        "Different event teams have different operational requirements. UrPass offers two distinct WhatsApp integration pathways to accommodate your organization's technical needs and subscription tier.",
                        "Organizations with their own Meta WhatsApp Business Platform account can utilize Self-Service WhatsApp on our Business plan. Connect your Meta Access Token, WABA ID, and Phone Number ID to dispatch messages through your own verified brand number. Alternatively, opt for UrPass Managed WhatsApp, where our team handles template approval, phone number hosting, and dispatch infrastructure."
                ],
                "bullets": [
                        "Option 1: Self-Service WhatsApp for Business plan subscribers with their own Meta credentials",
                        "Option 2: UrPass Managed WhatsApp for turn-key, zero-setup dispatch",
                        "Pre-approved Meta message templates for registration confirmation and ticket delivery",
                        "Enterprise credential encryption at rest with strict organization data isolation"
                ],
                "takeaway": "Choose between full self-service control or complete hands-off managed delivery."
        }
],
        featuresTitle: "Core Capabilities Built for Event Organizers",
        featuresSubtitle: "Engineered for speed, reliability, and zero ticketing commission.",
        features: [
          {
            icon: MessageSquare,
            title: "Direct WhatsApp Delivery",
            desc: "Send scannable digital passes directly into attendees' personal WhatsApp chats.",
          },
          {
            icon: Zap,
            title: "98% Open Rates",
            desc: "Ensure attendees receive their passes instantly without getting lost in email spam.",
          },
          {
            icon: QrCode,
            title: "Dynamic Pass Buttons",
            desc: "Pre-approved templates with dynamic 'View My Pass' URL buttons linking to digital tickets.",
          },
          {
            icon: ShieldCheck,
            title: "Official Meta Cloud API",
            desc: "Built on official Meta WhatsApp Business Cloud API for maximum delivery compliance.",
          },
          {
            icon: ScanLine,
            title: "Fast Gate Scanning",
            desc: "Attendees display their WhatsApp pass for sub-0.3s validation on volunteer phone cameras.",
          },
          {
            icon: Users,
            title: "Two Integration Pathways",
            desc: "Use Self-Service WhatsApp with your own Meta account or choose UrPass Managed WhatsApp.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Enable WhatsApp Delivery",
                "desc": "Activate WhatsApp communications in your UrPass Communication control panel."
        },
        {
                "n": "02",
                "title": "Choose Integration Model",
                "desc": "Select Self-Service (connect your Meta Cloud API) or UrPass Managed WhatsApp."
        },
        {
                "n": "03",
                "title": "Select Approved Template",
                "desc": "Choose pre-approved ticket delivery templates with dynamic pass link buttons."
        },
        {
                "n": "04",
                "title": "Attendees Register",
                "desc": "Upon registration or ticket purchase, attendees receive their pass in WhatsApp."
        },
        {
                "n": "05",
                "title": "Scan at the Entrance",
                "desc": "Attendees present their WhatsApp pass at the entrance for instant green verification."
        }
],
        whoShouldUse: {
        "title": "Who Benefits from WhatsApp Event Ticket Delivery?",
        "subtitle": "Organizers who want maximum attendee show-up rates and zero entry confusion.",
        "personas": [
                {
                        "badge": "FESTIVALS",
                        "title": "College Fests & Youth Events",
                        "desc": "Students live on WhatsApp; sending passes to their chats eliminates ticket loss entirely."
                },
                {
                        "badge": "CONFERENCES",
                        "title": "B2B Summits & Expos",
                        "desc": "Provide busy delegates with frictionless pass access and instant schedule updates on their phones."
                },
                {
                        "badge": "WORKSHOPS",
                        "title": "Creator Workshops & Meetups",
                        "desc": "Deliver personalized tickets and venue location pins directly to participant chats."
                },
                {
                        "badge": "COMMUNITIES",
                        "title": "Sports & Community Gatherings",
                        "desc": "Send group tickets and reminder announcements with 98% guaranteed visibility."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Gate Scanning Works with WhatsApp Passes",
        "subtitle": "Effortless, rapid entry right from the WhatsApp chat screen.",
        "description": "When an attendee arrives at the venue entrance, they open their WhatsApp chat and tap 'View My Pass'. Their high-contrast digital QR pass opens immediately in their mobile browser. Volunteer door staff point their smartphone camera at the pass, validating entry in under 0.3 seconds.",
        "points": [
                "No searching through buried email folders or logging into third-party accounts.",
                "Pass link is accessible even with low internet connectivity at crowded venues.",
                "Atomic duplicate blocking prevents attendees from forwarding ticket links to friends.",
                "Door volunteers see attendee name, ticket tier, and green admission confirmation instantly."
        ]
},
        faqs: [
        {
                "q": "How does UrPass deliver tickets via WhatsApp?",
                "a": "UrPass connects to the official Meta WhatsApp Business Cloud API. When an attendee registers or purchases a ticket, the system automatically sends a personalized notification containing event details and a dynamic 'View My Pass' button that opens their unique digital QR ticket."
        },
        {
                "q": "What is the difference between Self-Service and UrPass Managed WhatsApp?",
                "a": "Self-Service WhatsApp allows Business plan subscribers to connect their own verified Meta WhatsApp Business Account (WABA) using their own API credentials. UrPass Managed WhatsApp is a turn-key add-on where UrPass manages the Meta phone number, template approvals, and message delivery infrastructure for you."
        },
        {
                "q": "Can attendees forward their WhatsApp ticket to someone else?",
                "a": "While an attendee can forward a WhatsApp message, each pass contains a unique cryptographically signed token. Once the pass is scanned at the venue entrance, UrPass's atomic database locking invalidates it. Any subsequent scan attempt displays an amber duplicate alert, preventing unauthorized entry."
        },
        {
                "q": "Are email notifications still sent if WhatsApp delivery is enabled?",
                "a": "Yes. Email communication remains enabled by default in UrPass. You can send tickets via both email and WhatsApp simultaneously, ensuring attendees have multiple reliable channels to access their tickets."
        },
        {
                "q": "Do I need Meta approval for message templates?",
                "a": "Meta requires all WhatsApp Business messages initiated by businesses to use approved templates. UrPass provides pre-approved, compliant event ticket delivery and reminder templates out of the box."
        }
],
      }}
    />
  );
}
