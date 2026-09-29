import type { Metadata } from "next";
import {
  Percent,
  CreditCard,
  QrCode,
  ShieldCheck,
  Zap,
  BarChart3,
  Building2,
  CheckCircle2,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Zero Commission Event Ticketing Platform India | URPASS",
  description:
    "Zero commission event ticketing platform in India: keep 100% of your ticket revenue with 0% platform cuts, instant UPI payouts, and digital QR passes.",
  alternates: { canonical: "https://urpass.space/zero-commission-event-ticketing-india" },
  openGraph: {
    title: "Zero Commission Event Ticketing Platform India | URPASS",
    description:
      "Zero commission event ticketing platform in India: keep 100% of your ticket revenue with 0% platform cuts, instant UPI payouts, and digital QR passes.",
    url: "https://urpass.space/zero-commission-event-ticketing-india",
  },
};

export default function ZeroCommissionEventTicketingIndiaPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/zero-commission-event-ticketing-india",
        badge: "0% PLATFORM COMMISSION TICKETING",
        h1: "Zero Commission Event Ticketing Platform India",
        description:
          "Keep 100% of your event ticket revenue. The zero commission event ticketing platform in India with 0% platform cuts, direct Razorpay & UPI payouts, automated digital QR passes, and high-speed smartphone check-in.",
        ctaLabel: "Start selling tickets at 0% commission",
        directAnswer: {
          title: "What is zero commission event ticketing in India?",
          summary:
            "Zero commission event ticketing in India allows event organizers to sell tickets and collect registrations without paying a 5% to 15% platform cut per ticket. With URPASS, organizers keep 100% of their ticket sales, paying zero platform commission while accessing full QR pass generation and gate scanning.",
          keyPoints: [
            "Keep 100% of ticket sales revenue: 0% platform fee on all ticket categories",
            "Direct bank settlements via your own Razorpay account with zero middleman hold",
            "Eliminate exorbitant 10% to 15% 'convenience fees' charged to your attendees",
            "Full feature access: branded QR passes, volunteer mobile scanning, and live gate analytics",
          ],
        },
        steps: [
          {
            n: "01",
            title: "Create Event & Tickets",
            desc: "Set ticket tiers, early bird pricing in INR, and custom registration fields in under 3 minutes.",
          },
          {
            n: "02",
            title: "Connect Gateway",
            desc: "Link your verified Razorpay account so 100% of ticket revenue lands directly in your Indian bank account.",
          },
          {
            n: "03",
            title: "Share Branded Link",
            desc: "Publish your customized event ticket page on your own domain or branded URPASS URL.",
          },
          {
            n: "04",
            title: "1-Click UPI Checkout",
            desc: "Attendees pay via GPay, PhonePe, Paytm, or cards with no predatory ticketing convenience surcharges.",
          },
          {
            n: "05",
            title: "Automate QR Passes",
            desc: "Attendees receive instant, tamper-proof digital QR entry passes sent directly to email and mobile web.",
          },
          {
            n: "06",
            title: "Scan & Retain Revenue",
            desc: "Scan attendees at the door with phone cameras and retain 100% of your hard-earned ticket revenues.",
          },
        ],
        features: [
          {
            icon: Percent,
            title: "0% Platform Commission",
            desc: "Never lose 8% to 15% of your event gross revenue. Pay simple flat SaaS pricing or start free, keeping every rupee.",
          },
          {
            icon: CreditCard,
            title: "Direct UPI & Bank Settlements",
            desc: "Ticket money never sits in an aggregator escrow account. Payments settle directly into your bank via Razorpay.",
          },
          {
            icon: QrCode,
            title: "Automated Digital QR Passes",
            desc: "Custom-branded digital passes delivered in seconds to attendee phones with offline viewing capabilities.",
          },
          {
            icon: Zap,
            title: "Zero Buyer Surcharges",
            desc: "Delight attendees by eliminating unnecessary 10% 'internet handling fees' that cause checkout abandonment.",
          },
          {
            icon: Building2,
            title: "100% Attendee Data Ownership",
            desc: "Your attendee database belongs to you. We never market competing events to your attendees or sell your data.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance & Revenue Tracking",
            desc: "Real-time dashboard displaying gross revenue, check-in velocity, and gate capacity across all entrances.",
          },
        ],
        competitorComparison: {
          title: "URPASS Zero Commission vs Traditional Indian Ticketing Portals",
          subtitle:
            "Compare how much money you save on a 1,000-attendee event with ₹500 ticket price (₹5,00,000 gross).",
          competitorName: "Townscript / BookMyShow / AllEvents",
          rows: [
            {
              criteria: "Platform Commission Cut",
              urpass: "0% — you keep all ₹5,00,000",
              competitor: "5% to 10% (organizer loses ₹25,000 to ₹50,000+ per event)",
              urpassAdvantage: true,
            },
            {
              criteria: "Attendee 'Convenience' Surcharge",
              urpass: "₹0 extra fee charged to attendees",
              competitor: "8% to 15% added at checkout, increasing ticket abandonment",
              urpassAdvantage: true,
            },
            {
              criteria: "Payout Timing",
              urpass: "Direct T+2 settlement into your bank account",
              competitor: "Held for weeks until 7–14 days after the event concludes",
              urpassAdvantage: true,
            },
            {
              criteria: "Attendee Data Ownership",
              urpass: "100% private to you — export anytime to CSV",
              competitor: "Platform retains data to advertise rival events to your attendees",
              urpassAdvantage: true,
            },
            {
              criteria: "Gate Scanner Equipment",
              urpass: "Any smartphone camera with instant volunteer links",
              competitor: "Rented hardware or complex proprietary app downloads",
              urpassAdvantage: true,
            },
            {
              criteria: "Branding",
              urpass: "Clean organizer-first branding on passes and checkout",
              competitor: "Heavy portal branding promoting other nearby events",
              urpassAdvantage: true,
            },
          ],
        },
        callout: {
          badge: "REVENUE SAVINGS",
          title: "Stop handing 10% of your box office to ticketing aggregators.",
          description:
            "Traditional ticketing platforms in India take huge cuts of your revenue and hold your money until days after the event. URPASS gives you full ticketing software autonomy with direct gateway settlements and zero commissions.",
          bullets: [
            "Save ₹50,000 to ₹5,00,000+ on every large conference, concert, or festival",
            "Direct Razorpay integration supporting all Indian payment methods",
            "Multi-gate entrance scanning handles thousands of attendees with zero lag",
            "Zero lock-in: export your attendee database, ticket history, and logs anytime",
          ],
        },
        useCases: [
          "Annual College Fests & Cultural Shows",
          "Tech Conferences & Developer Summits",
          "Business & Leadership Expos",
          "Music Concerts & Comedy Shows",
          "Marathons & Sporting Events",
          "Professional Workshops & Masterclasses",
          "Design & Creative Symposiums",
          "Start-Up Pitch Days & Venture Forums",
        ],
        deepDiveSections: [
          {
            badge: "PROFITABILITY",
            title: "The Math: How Much Do Indian Event Organizers Really Lose?",
            paragraphs: [
              "On a typical Indian ticketing portal, an event selling 1,500 tickets at ₹1,000 each collects ₹15,00,000 in gross sales. Between a 7% platform commission (₹1,05,000) and mandatory convenience surcharges, the organizer surrenders well over ₹1,20,000 to the ticketing aggregator.",
              "With URPASS, your platform commission is exactly ₹0. You connect your own payment gateway (like Razorpay with standard 2% processing), meaning over ₹1,00,000 goes straight back into your event budget for better sound, catering, speakers, and venue facilities.",
            ],
            bullets: [
              "Immediate cash flow: ticket sales land directly in your bank account before the event",
              "Higher checkout conversions: buyers don't abandon tickets due to surprise fees",
              "Maintain full direct relationships with your attendees and sponsors",
            ],
            takeaway:
              "Switch to zero commission event ticketing and reinvest your hard-earned profits into your event experience.",
          },
        ],
        faqs: [
          {
            q: "How does zero commission event ticketing work in India?",
            a: "With URPASS, you connect your own Razorpay account. When attendees buy tickets, payments go directly to your bank account. URPASS charges 0% commission on your ticket sales, so you only pay the standard bank payment gateway fee (typically 2% + GST).",
          },
          {
            q: "Are there any hidden convenience fees charged to attendees at checkout?",
            a: "No. Unlike traditional ticketing portals that tack on an extra 8% to 15% 'convenience fee' on the checkout screen, URPASS never charges your buyers surprise markups.",
          },
          {
            q: "When do I receive the ticket money in my bank account?",
            a: "Because payments are processed through your own Razorpay account, funds settle directly to your Indian bank account on standard T+2 business day settlement schedules, rather than being held until after the event.",
          },
          {
            q: "Can I sell both free and paid tickets under the same event?",
            a: "Yes. You can configure multiple ticket tiers including free volunteer passes, standard tickets, student discounted passes, and VIP badges with separate capacity limits.",
          },
          {
            q: "How do we scan tickets at the event entrance without rented hardware?",
            a: "Volunteers and door staff scan attendee digital QR passes directly using any smartphone browser camera. Scanners validate passes in under 0.5 seconds and stop duplicate entries across all gates.",
          },
          {
            q: "Can I collect GST on ticket sales and issue tax invoices?",
            a: "Yes. URPASS supports configuring GST rates and collecting attendee corporate GSTIN numbers to generate automated, compliant tax invoice receipts.",
          },
          {
            q: "Is URPASS completely free for small events?",
            a: "Yes! URPASS offers a free tier supporting up to 100 registrations/month at ₹0 forever, with full access to QR passes, volunteer phone scanning, and real-time attendance dashboards.",
          },
        ],
        relatedLinks: [
          { title: "Zero Commission Event Ticketing", href: "/zero-commission-event-ticketing", category: "Product" },
          { title: "Event Registration with UPI Payment", href: "/event-registration-with-upi-payment", category: "Product" },
          { title: "Events in India Hub", href: "/in", category: "Location" },
          { title: "Razorpay Event Ticketing", href: "/razorpay-event-registration", category: "Product" },
          { title: "Event Ticketing Software India", href: "/event-ticketing-software-india", category: "Guide" },
          { title: "QR Event Check-In Software", href: "/qr-event-check-in", category: "Product" },
        ],
        ctaTitle: "Keep 100% of your event ticket revenue",
        ctaDescription:
          "Zero commission cuts, direct bank settlements, and instant QR entry passes. Start selling tickets today.",
      }}
    />
  );
}
