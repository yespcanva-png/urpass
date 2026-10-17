import type { Metadata } from "next";
import { FileText, QrCode, ScanLine, Send, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Bulk Event Ticket Booking Software | UrPass",
  description: "Allow corporate teams, institutions and groups to purchase multiple tickets in one order with automated individual QR pass dispatch.",
  keywords: [
    "bulk event ticket booking",
    "simplify group and bulk event ticket purchases",
    "urpass qr ticketing",
    "event check in software",
    "qr ticket scanner",
    "event registration platform"
  ],
  alternates: { canonical: "https://urpass.space/bulk-event-ticket-booking" },
  openGraph: {
    title: "Bulk Event Ticket Booking Software | UrPass",
    description: "Allow corporate teams, institutions and groups to purchase multiple tickets in one order with automated individual QR pass dispatch.",
    url: "https://urpass.space/bulk-event-ticket-booking",
    locale: "en_US",
    type: "website",
  },
  other: {
    "geo.region": "GLOBAL",
    "geo.placename": "Global",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "CORPORATE & GROUP ORDERS",
        h1: "Simplify Group and Bulk Event Ticket Purchases",
        canonicalUrl: "https://urpass.space/bulk-event-ticket-booking",
        description: "Allow corporate teams, institutions and groups to purchase multiple tickets in one order with automated individual QR pass dispatch.",
        ctaLabel: "Enable Bulk Ticketing",
        directAnswer: {
          title: "How Does Bulk Event Ticket Booking Work on UrPass?",
          summary: "UrPass simplifies bulk ticket purchasing for corporate delegations, academic groups, and community organizations. Companies can purchase 5, 10, or 50 tickets in a single transaction with consolidated GST invoicing. The corporate buyer can immediately assign individual attendee names or forward unique QR passes to colleagues.",
          keyPoints: ["Single-checkout bulk purchases for corporate teams and academic groups", "Consolidated B2B tax invoice with company GSTIN and billing address", "Post-purchase team allocation portal allowing buyers to assign tickets anytime", "Unique cryptographically signed QR passes delivered individually to each team member"],
        },
        keyFactsTable: {
          title: "Bulk Ticketing: UrPass vs Consumer Ticketing Portals",
          subtitle: "Streamlining group bookings for corporate delegations.",
          headers: ["Group Booking Feature", "UrPass Bulk Booking System", "Consumer Ticketing Apps"],
          rows: [
            {
                        "col1": "Team Checkout Experience",
                        "col2": "1-click order of 10+ tickets on single invoice",
                        "col3": "Must repeat purchase process multiple times"
            },
            {
                        "col1": "Corporate Invoicing (GST/VAT)",
                        "col2": "Automated single consolidated tax invoice",
                        "col3": "Multiple fragmented receipts without corporate GSTIN"
            },
            {
                        "col1": "Team Member Name Assignment",
                        "col2": "Buyer can assign colleague details post-purchase",
                        "col3": "Must know all names and details at checkout checkout"
            },
            {
                        "col1": "Individual Pass Distribution",
                        "col2": "Unique QR passes emailed/WhatsApped to each guest",
                        "col3": "Single buyer receives a batch PDF requiring printing"
            },
            {
                        "col1": "Platform Surcharges",
                        "col2": "0% platform commission on group bookings",
                        "col3": "Hefty per-ticket booking fees multiplied across all seats"
            }
],
        },
        features: [
          { icon: Users, title: "Single Order Group Checkout", desc: "Corporate managers buy 5 to 100 tickets in one transaction with a corporate card or bank transfer." },
          { icon: FileText, title: "Consolidated B2B Tax Invoice", desc: "Generate a unified GST/VAT invoice containing corporate entity details, GSTIN, and tax breakdown." },
          { icon: Send, title: "Post-Purchase Delegate Roster", desc: "Allow the company coordinator to input colleague names and email addresses whenever their team is finalized." },
          { icon: QrCode, title: "Unique Passes per Delegate", desc: "Each team member receives their own unique digital QR code preventing entry confusion at the gates." },
          { icon: Zap, title: "Volume Discount Pricing", desc: "Configure automatic bulk discounts (e.g., 15% off when purchasing 5 or more tickets)." },
          { icon: ScanLine, title: "Independent Gate Arrival", desc: "Team members can arrive separately at different gates or times with their individual digital passes." }
        ],
        steps: [
          { n: "01", title: "Configure Bulk Tiers", desc: "Set ticket pricing and configure optional group quantity discounts (e.g. 5+ tickets)." },
          { n: "02", title: "Buyer Purchases in Bulk", desc: "Corporate coordinator selects ticket count and completes single checkout with company GSTIN." },
          { n: "03", title: "Instant Tax Invoice", desc: "UrPass issues a consolidated B2B tax invoice directly to the company accounts department." },
          { n: "04", title: "Assign Colleague Details", desc: "Buyer enters attendee names and emails into their self-service team management link." },
          { n: "05", title: "Individual Passes Dispatched", desc: "Every employee receives their personal digital QR pass ready for sub-0.3s gate check-in." }
        ],
        callout: {
          badge: "ENTERPRISE GROUP BOOKING",
          title: "Make it effortless for companies to send delegations to your event.",
          description: "Corporate group bookings represent high-margin ticket revenue. When a booking system forces coordinators to buy tickets one-by-one or withholds proper GST invoices, companies abandon the purchase.",
          bullets: ["Frictionless single checkout for corporate teams and university delegations", "Automated GST-compliant invoices ready for corporate expense approval", "Delegates arrive independently without having to queue together at the gate", "Zero percentage platform fees on your high-value group ticket orders"],
        },
        faqs: [
          { q: "Does the corporate buyer need to enter all attendee names during checkout?", a: "No. The buyer can complete payment first to secure seats, and then assign individual team member names and emails later through a self-serve portal." },
          { q: "Can colleagues arrive at different times and gates?", a: "Yes! Each attendee receives their own unique digital QR pass, allowing them to arrive separately at any gate." },
          { q: "Can we configure automatic discounts for group bookings (e.g. 10% off for 5+ seats)?", a: "Yes. UrPass supports volume-based discount rules that automatically apply when the cart meets specified ticket thresholds." },
          { q: "Is a single consolidated GST tax invoice provided?", a: "Yes. A complete corporate tax invoice with organizer and buyer GSTIN details is automatically emailed upon payment." }
        ],
        relatedLinks: [
          { title: "Event Ticket Types Management", href: "/event-ticket-types-management", category: "Product" },
          { title: "Zero Commission Event Ticketing", href: "/zero-commission-event-ticketing", category: "Product" },
          { title: "Group QR Ticket Check-In", href: "/group-qr-ticket-check-in", category: "Product" },
          { title: "Conference Ticketing Software", href: "/conference-ticketing-platform", category: "Product" }
        ],
      }}
    />
  );
}
