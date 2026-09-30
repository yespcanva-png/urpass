import type { Metadata } from "next";
import { ShieldCheck, CreditCard, BarChart3, Users, Building2, Ticket, Zap, CheckCircle2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "GST Compliant Event Ticketing Software India | URPASS",
  description:
    "Automated B2B GST tax invoices, HSN/SAC code compliance, and GSTIN capture for Indian conferences and workshops. 0% ticket commission and instant UPI checkout.",
  keywords: [
    "gst compliant event ticketing",
    "event tickets with gst invoice",
    "b2b event ticketing india",
    "gstin event registration",
    "event tax invoice software",
    "sac code event ticketing",
  ],
  alternates: { canonical: "https://urpass.space/gst-compliant-event-ticketing" },
  openGraph: {
    title: "GST Compliant Event Ticketing Software India | URPASS",
    description: "Automated B2B GST tax invoices, HSN/SAC code compliance, and GSTIN capture for Indian events.",
    url: "https://urpass.space/gst-compliant-event-ticketing",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "INDIAN TAX & COMPLIANCE",
        h1: "GST Compliant Event Ticketing & B2B Invoicing Software",
        canonicalUrl: "https://urpass.space/gst-compliant-event-ticketing",
        description:
          "Capture buyer GSTINs, apply 18% GST with SAC code 998596, and generate compliant B2B tax invoices automatically for Indian conferences, corporate workshops, and summits.",
        ctaLabel: "Set Up GST Invoicing Free",
        directAnswer: {
          title: "How Does GST Invoicing Work on URPASS?",
          summary:
            "URPASS automates Indian Goods and Services Tax (GST) compliance for event organizers. During registration checkout, delegates can enter their organization name and 15-digit GSTIN. URPASS captures the tax breakdown (CGST + SGST or IGST based on state codes) and issues an automated, downloadable B2B tax invoice containing your organizer GSTIN, SAC service code (998596), and invoice serial numbers ready for Input Tax Credit (ITC).",
          keyPoints: [
            "Automatic buyer GSTIN validation and corporate billing address capture at ticket checkout",
            "State-wise tax determination (intra-state CGST + SGST vs inter-state IGST calculation)",
            "Automated PDF tax invoice generation delivered directly to delegates upon payment",
            "0% ticketing platform commission with direct T+2 bank deposits via Razorpay",
          ],
        },
        keyFactsTable: {
          title: "GST Compliance & Tax Invoicing Matrix",
          subtitle: "Technical and tax parameters for Indian corporate and commercial events.",
          headers: ["Tax Feature", "URPASS Indian Architecture", "Foreign Aggregators (Eventbrite / etc.)"],
          rows: [
            { col1: "Buyer GSTIN Collection", col2: "Native checkout field with formatting checks", col3: "Unsupported or buried in unformatted text fields" },
            { col1: "Tax Invoice Generation", col2: "Automated GST-compliant PDF invoice with serial numbers", col3: "Generic receipt without Indian GST details" },
            { col1: "Input Tax Credit (ITC)", col2: "Eligible for B2B delegates claiming corporate ITC", col3: "Ineligible; foreign billing entity cannot pass ITC" },
            { col1: "Applicable SAC Code", col2: "SAC 998596 (Event Organization & Support Services)", col3: "No SAC classification provided" },
            { col1: "Platform Commission", col2: "0% commission on ticket volume", col3: "3.7% to 8% cut plus tax surcharges" },
          ],
        },
        features: [
          { icon: ShieldCheck, title: "Automated GST Tax Invoices", desc: "Instantly generate compliant PDF tax invoices formatted for Indian tax regulations, complete with invoice number series." },
          { icon: Building2, title: "Corporate GSTIN Capture", desc: "Allow corporate delegates and sponsor companies to input their company name, GSTIN, and state billing address at checkout." },
          { icon: CreditCard, title: "Intra vs Inter-State Tax Splits", desc: "Automatically calculates CGST (9%) + SGST (9%) for intra-state attendees or IGST (18%) for out-of-state delegates." },
          { icon: Zap, title: "Instant UPI & Card Payments", desc: "Collect payments via PhonePe, GPay, Paytm, Net Banking, and corporate credit cards with direct T+2 settlements." },
          { icon: BarChart3, title: "Monthly GST Export Reports", desc: "Download monthly GSTR-1 ready spreadsheets detailing gross ticket sales, taxable turnover, and collected tax breakdowns." },
          { icon: Ticket, title: "Digital QR Passes Included", desc: "Delegates receive their official tax invoice along with a cryptographically signed QR pass for sub-0.3s gate entry." },
        ],
        steps: [
          { n: "01", title: "Add Organizer GSTIN", desc: "Enter your company or firm's legal name, GSTIN, and registered state in organization settings." },
          { n: "02", title: "Enable GST on Tickets", desc: "Toggle GST calculation on ticket tiers (either tax-inclusive or tax-exclusive pricing)." },
          { n: "03", title: "Corporate Delegates Register", desc: "Attendees enter their organization GSTIN during registration to claim Input Tax Credit." },
          { n: "04", title: "Automated Invoice Issued", desc: "Compliant tax invoice PDF is emailed directly to the delegate along with their entry pass." },
          { n: "05", title: "Export Tax Roster", desc: "Download monthly sales summaries formatted for easy filing with your chartered accountant." },
        ],
        callout: {
          badge: "B2B EVENT READY",
          title: "Stop manually creating hundreds of tax invoices for conference delegates.",
          description: "Corporate attendees require proper GST invoices to process corporate expense reimbursements and claim Input Tax Credit. URPASS eliminates manual accounting work by automating compliant invoice generation.",
          bullets: [
            "Validates 15-digit GSTIN formats to prevent accounting errors",
            "Includes standardized SAC 998596 service codes required for event services",
            "Keeps 100% of your ticket price with zero ticketing platform commissions",
            "Provides sub-0.3s smartphone gate scanning for rapid conference check-in",
          ],
        },
        faqs: [
          { q: "Can B2B attendees claim Input Tax Credit (ITC) with URPASS invoices?", a: "Yes. Invoices issued through your connected Indian Razorpay account include your registered GSTIN, the buyer's GSTIN, and the SAC code, allowing delegates to claim ITC." },
          { q: "Can I set ticket prices as tax-inclusive?", a: "Yes. You can configure whether ticket prices already include 18% GST or if GST should be calculated on top of the base ticket amount." },
          { q: "What SAC code is used for event ticketing?", a: "The standard SAC code for event organization and ticketing services is SAC 998596, which is printed on all generated URPASS tax invoices." },
          { q: "Does URPASS charge a commission on the GST collected?", a: "No. URPASS charges 0% platform commission on ticket sales and tax collections. All funds settle directly to your bank account." },
        ],
        relatedLinks: [
          { title: "Event Ticketing Software India", href: "/event-ticketing-software-india", category: "Location" },
          { title: "Conference Registration Software", href: "/conference-registration-software", category: "Use Case" },
          { title: "Zero Commission Event Ticketing", href: "/zero-commission-event-ticketing", category: "Product" },
          { title: "Corporate Event Management", href: "/corporate-event-management", category: "Use Case" },
        ],
      }}
    />
  );
}
