import type { Metadata } from "next";
import { BarChart3, CreditCard, FileSpreadsheet, Layers, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Ticket Sales Reporting Software | UrPass",
  description: "Real-time sales analytics, payment reconciliation, attendee breakdowns and exportable financial reports for event organizers.",
  keywords: [
    "event ticket sales reporting",
    "track your event registrations and ticket revenue",
    "urpass qr ticketing",
    "event check in software",
    "qr ticket scanner",
    "event registration platform"
  ],
  alternates: { canonical: "https://urpass.space/event-ticket-sales-reporting" },
  openGraph: {
    title: "Event Ticket Sales Reporting Software | UrPass",
    description: "Real-time sales analytics, payment reconciliation, attendee breakdowns and exportable financial reports for event organizers.",
    url: "https://urpass.space/event-ticket-sales-reporting",
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
        badge: "FINANCIAL & REVENUE ANALYTICS",
        h1: "Track Your Event Registrations and Ticket Revenue",
        canonicalUrl: "https://urpass.space/event-ticket-sales-reporting",
        description: "Real-time sales analytics, payment reconciliation, attendee breakdowns and exportable financial reports for event organizers.",
        ctaLabel: "View Reporting Tools",
        directAnswer: {
          title: "What Event Ticket Sales Reporting Capabilities Does UrPass Provide?",
          summary: "UrPass provides real-time financial reporting and registration analytics for event organizers, agencies, and finance teams. Track Gross Merchandise Value (GMV), ticket tier sales velocity, promo code attribution, payment gateway reconciliation, and export comprehensive CSV/Excel reports for accounting.",
          keyPoints: ["Real-time revenue telemetry showing live gross ticket sales and net earnings", "Ticket tier performance tracking (Early Bird vs VIP vs General Admission)", "Discount code attribution measuring marketing channel ROI", "One-click CSV/Excel export for financial audits and GST reconciliation"],
        },
        keyFactsTable: {
          title: "Sales Reporting: UrPass vs Legacy Ticketing Platforms",
          subtitle: "Financial clarity and data ownership for event directors.",
          headers: ["Reporting Metric", "UrPass Real-Time Reporting", "Legacy Ticketing Portals"],
          rows: [
            {
                        "col1": "Revenue Telemetry Latency",
                        "col2": "Instant live updates upon every transaction",
                        "col3": "24 to 48-hour batch reporting delays"
            },
            {
                        "col1": "Platform Commission Deductions",
                        "col2": "0% platform commission \u2014 100% revenue retention",
                        "col3": "Hidden line-item deductions taking 5%\u201310%"
            },
            {
                        "col1": "Tax & GST Breakdowns",
                        "col2": "Clear itemized tax reporting with organizer GSTIN",
                        "col3": "Opaque aggregate payouts difficult to reconcile"
            },
            {
                        "col1": "Attendee Attribute Export",
                        "col2": "Complete export of custom registration form fields",
                        "col3": "Restricted data exports keeping attendee data locked"
            },
            {
                        "col1": "AI Agent Query Support",
                        "col2": "Natural language queries via MCP server tools",
                        "col3": "Static PDF downloads with zero programmable access"
            }
],
        },
        features: [
          { icon: BarChart3, title: "Live Revenue Dashboard", desc: "Watch ticket sales, gross merchandise value (GMV), and transaction counts update in real time." },
          { icon: Layers, title: "Tier Velocity Analytics", desc: "Identify which ticket categories are selling fastest to adjust inventory quotas dynamically." },
          { icon: Zap, title: "Promo Code Attribution", desc: "Measure conversion rates, discount volumes, and ROI across influencer and sponsor coupon codes." },
          { icon: FileSpreadsheet, title: "One-Click Accounting Exports", desc: "Download complete financial ledgers in CSV and Excel formatted for quick accounting import." },
          { icon: CreditCard, title: "Gateway Reconciliation", desc: "Match payment gateway transaction IDs against attendee ticket tokens for audit compliance." },
          { icon: Users, title: "Attendee Demographics", desc: "Analyze registration trends across job titles, organization types, and geographic locations." }
        ],
        steps: [
          { n: "01", title: "Publish Ticket Page", desc: "Set your ticket tiers, pricing, and optional promotional discount codes." },
          { n: "02", title: "Monitor Live Sales", desc: "View instant sales updates on your dashboard as registrations occur." },
          { n: "03", title: "Track Marketing ROI", desc: "Analyze promo code usage to see which marketing channels drive the highest revenue." },
          { n: "04", title: "Reconcile Gateways", desc: "Verify direct bank payouts against order IDs with zero platform commission deductions." },
          { n: "05", title: "Export Financial Reports", desc: "Generate complete tax and accounting reports in CSV format with a single click." }
        ],
        callout: {
          badge: "FINANCIAL TRANSPARENCY",
          title: "Complete financial visibility with zero hidden platform deductions.",
          description: "Event organizers often struggle to reconcile confusing statements from ticketing aggregators that combine processing cuts, service fees, and delayed payouts. UrPass offers 100% transparency.",
          bullets: ["Zero platform cuts \u2014 keep 100% of your ticket price", "Reconcile orders directly against your connected payment gateway", "Automated GST invoice logs for seamless tax compliance", "Export complete attendee demographic data without platform restrictions"],
        },
        faqs: [
          { q: "Can I see which promo code generated the most ticket sales?", a: "Yes. UrPass tracks promo code usage with detailed breakdowns showing discount totals, redemption counts, and gross sales per code." },
          { q: "How quickly do sales appear on the dashboard after an attendee pays?", a: "Instantly. As soon as the payment gateway confirms the transaction, the revenue, ticket count, and attendee record update in real time." },
          { q: "Can I export data for our company's accounting software?", a: "Yes. You can export complete transaction ledgers in CSV or Excel containing order IDs, gateway reference codes, timestamps, and amounts." },
          { q: "Can AI tools like Claude query my sales reports automatically?", a: "Yes! UrPass includes native Model Context Protocol (MCP) server endpoints so AI agents can generate sales summaries via natural language." }
        ],
        relatedLinks: [
          { title: "Event Registration with Payment Gateway", href: "/event-registration-with-payment-gateway", category: "Product" },
          { title: "Zero Commission Event Ticketing", href: "/zero-commission-event-ticketing", category: "Product" },
          { title: "Event Ticket Types Management", href: "/event-ticket-types-management", category: "Product" },
          { title: "Bulk Attendee CSV Import", href: "/event-attendee-csv-import", category: "Product" }
        ],
      }}
    />
  );
}
