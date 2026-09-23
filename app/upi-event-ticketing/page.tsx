import type { Metadata } from "next";
import { Smartphone, Zap, ShieldCheck, QrCode, ArrowRight, IndianRupee, Layers, CheckCircle2, TrendingUp } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "UPI Event Ticketing & QR Passes in India | URPASS",
  description: "Sell event tickets via Google Pay, PhonePe, Paytm and BHIM UPI with instant digital QR pass issuance. Optimized for college fests, hackathons, and conferences in India.",
  keywords: [
    "UPI event ticketing",
    "UPI event tickets India",
    "Google Pay event ticket booking",
    "PhonePe event ticketing",
    "QR event pass UPI payment",
    "college fest ticketing UPI",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/upi-event-ticketing" },
  openGraph: {
    title: "UPI Event Ticketing & QR Passes in India | URPASS",
    description: "Sell event tickets via Google Pay, PhonePe, Paytm and BHIM UPI with instant QR pass issuance.",
    url: "https://urpass.space/upi-event-ticketing",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "INDIA UPI TICKETING",
        h1: "UPI Event Ticketing for Indian Events",
        canonicalUrl: "https://urpass.space/upi-event-ticketing",
        description:
          "UPI event ticketing enables organizers across India to accept ticket payments via Google Pay, PhonePe, Paytm, and BHIM with instant cryptographic QR pass delivery upon transaction settlement. URPASS eliminates manual UPI screenshot verification and per-ticket booking fees, delivering sub-second checkout on mobile devices.",
        ctaLabel: "Start UPI Ticketing",
        features: [
          { icon: Smartphone, title: "Native UPI App Intent", desc: "Mobile attendees can pay directly through Google Pay, PhonePe, Paytm, or CRED with one tap, avoiding clunky payment forms." },
          { icon: Zap, title: "Sub-Second Ticket Delivery", desc: "Digital QR passes are created and emailed immediately after bank authorization, ready for mobile wallet storage." },
          { icon: IndianRupee, title: "Zero Commission Ticketing", desc: "Never lose 5% to 10% on ticketing fees. Keep all ticket revenue with URPASS's flat monthly subscription model." },
          { icon: QrCode, title: "Dynamic Desktop QR Codes", desc: "Desktop users scan an on-screen dynamic UPI QR code with any mobile payment app for quick checkout." },
          { icon: ShieldCheck, title: "Instant Fraud Protection", desc: "Automatic bank webhooks confirm payments before passes are generated, completely ending fake payment receipt scams." },
          { icon: TrendingUp, title: "Higher Mobile Conversion", desc: "UPI intent drives checkout completion rates above 88%, drastically outperforming card entry forms." },
        ],
        steps: [
          { n: "01", title: "Select Tickets", desc: "Attendee enters details and chooses desired pass tier on your branded registration link." },
          { n: "02", title: "UPI Payment Intent", desc: "On mobile, attendee taps their preferred UPI app (GPay/PhonePe/Paytm); on desktop, they scan the UPI QR code." },
          { n: "03", title: "Instant Bank Verification", desc: "Razorpay webhooks confirm payment authorization within milliseconds without manual reference check." },
          { n: "04", title: "Digital Pass Generation", desc: "Pass with unique encrypted QR code is displayed instantly on-screen and emailed with calendar invite." },
          { n: "05", title: "Fast Entrance Scan", desc: "Gate volunteers scan attendees in under 0.3 seconds using any mobile phone camera." },
        ],
        callout: {
          badge: "SOLVING COLLEGE & FEST ISSUES",
          title: "The end of 'Upload your payment screenshot' forms.",
          description: "College fests and community events often rely on Google Forms asking attendees to attach a UPI transaction screenshot. Organizers then waste sleepless nights cross-referencing bank statements, while bad actors submit edited images. URPASS completely replaces this with automated UPI checkout and real-time pass generation.",
          bullets: [
            "No more manual verification of UTR or transaction reference numbers",
            "Eliminates forged UPI payment screenshot fraud completely",
            "Instant digital ticket with attendee name, ticket category, and tamper-proof QR",
            "Automated attendee receipt and GST invoice delivery",
          ],
        },
        deepDiveSections: [
          {
            badge: "UPI MECHANICS",
            title: "How does UPI event ticketing work on mobile and desktop?",
            paragraphs: [
              "When an attendee registers on a mobile browser, URPASS invokes the UPI intent protocol through Razorpay. The system displays installed UPI applications including Google Pay, PhonePe, Paytm, BHIM, and CRED. Tapping any app opens the payment screen with the exact payable amount pre-filled, requiring only the attendee's UPI PIN to authorize.",
              "For attendees browsing on laptop or desktop computers, the checkout modal renders a dynamic UPI QR code. The user simply opens their phone's camera or UPI app, scans the QR code, and completes payment. The desktop screen updates automatically in real-time as soon as the bank clears the transaction.",
            ],
            takeaway: "Providing both UPI app intent and desktop dynamic QR ensures zero friction regardless of the device your attendee is using.",
          },
          {
            badge: "FRAUD DEFENSE",
            title: "How does automated UPI verification prevent payment fraud?",
            paragraphs: [
              "In manual registration setups, attendees often upload fake or recycled screenshots generated using image editors or mobile simulator apps. Overworked organizers rarely have time to cross-check thousands of entries against live bank statements before the gates open.",
              "URPASS communicates directly with banking gateways via cryptographic server-to-server webhooks. Digital passes are only created and added to the entry scanner database once the issuing bank returns an authenticated HTTP 200 payment success payload.",
            ],
            takeaway: "Gate staff never need to verify bank statements on event day because only paid attendees possess an active, scannable QR pass.",
          },
        ],
        faqs: [
          {
            q: "Can attendees use any UPI app to purchase tickets?",
            a: "Yes. All major UPI applications are supported including Google Pay, PhonePe, Paytm, BHIM, CRED, Amazon Pay, and official banking UPI apps.",
          },
          {
            q: "How fast is ticket delivery after completing UPI payment?",
            a: "Tickets are issued in under 1 second. The confirmation screen displays the pass immediately, and a backup pass email is sent simultaneously.",
          },
          {
            q: "Is UPI ticketing suitable for high-volume campus events and fests?",
            a: "Absolutely. URPASS handles spikes during campus fest registration drops, ensuring inventory is reserved accurately during concurrent checkouts.",
          },
        ],
        relatedLinks: [
          { title: "Event Registration with Payment", href: "/event-registration-with-payment", category: "Product" },
          { title: "Razorpay Event Registration", href: "/razorpay-event-registration", category: "Product" },
          { title: "College Events Check-in", href: "/college-events", category: "Use Case" },
          { title: "Eventbrite Alternative India", href: "/eventbrite-alternative-india", category: "Comparison" },
        ],
      }}
    />
  );
}
