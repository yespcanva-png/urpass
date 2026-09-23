import type { Metadata } from "next";
import { IndianRupee, Smartphone, ShieldCheck, Zap, ArrowRight, CheckCircle2, QrCode, BarChart3, Lock } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Eventbrite Alternative in India | URPASS",
  description: "Best Eventbrite alternative for Indian event organizers. Zero per-ticket commission fees, native UPI and Razorpay integration, automated GST invoices, and instant QR scanning.",
  keywords: [
    "Eventbrite alternative India",
    "Eventbrite alternative for Indian events",
    "replace Eventbrite India",
    "event ticketing without commission India",
    "Eventbrite vs URPASS",
    "event registration platform India",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/eventbrite-alternative-india" },
  openGraph: {
    title: "Eventbrite Alternative in India | URPASS",
    description: "Best Eventbrite alternative for Indian event organizers. Zero commission fees and native UPI checkout.",
    url: "https://urpass.space/eventbrite-alternative-india",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "INDIA OPTIMIZED",
        h1: "Eventbrite Alternative for Indian Event Organizers",
        canonicalUrl: "https://urpass.space/eventbrite-alternative-india",
        description:
          "URPASS is a high-performance alternative to Eventbrite engineered specifically for Indian event organizers. Unlike Eventbrite, which imposes steep per-ticket commission fees, lacks seamless native UPI intent, and delays international payouts, URPASS delivers zero percent per-ticket commission, instant UPI checkout via Google Pay/PhonePe, automated GST tax invoicing, and sub-0.3s QR check-in.",
        ctaLabel: "Switch from Eventbrite",
        features: [
          { icon: IndianRupee, title: "Zero Per-Ticket Commission", desc: "Keep 100% of your ticket sales. Never pay 5% to 8% commissions plus handling fees per ticket sold." },
          { icon: Smartphone, title: "Native UPI & Net Banking", desc: "Mobile attendees pay directly inside Google Pay, PhonePe, Paytm, or CRED with one tap, driving 88%+ payment conversions." },
          { icon: Lock, title: "Automated GST Tax Invoices", desc: "Automatically generate downloadable GST-compliant B2B and B2C tax invoices with your GSTIN and HSN codes." },
          { icon: Zap, title: "Sub-0.3s Mobile Gate Scanning", desc: "Check in attendees in under 300ms using any standard mobile phone browser — no expensive scanning hardware required." },
          { icon: QrCode, title: "Custom Ticket Design & Branding", desc: "White-label your passes with your event logo, sponsor graphics, and custom color palettes instead of Eventbrite's branding." },
          { icon: ShieldCheck, title: "Complete Attendee Data Ownership", desc: "Access full unmasked attendee emails and phone numbers with zero promotional ads sent to your community." },
        ],
        steps: [
          { n: "01", title: "Create Your Event", desc: "Set up your event title, dates, and ticket tiers in Indian Rupees (INR) with custom limits." },
          { n: "02", title: "Enable UPI & Razorpay", desc: "Connect payment processing in minutes; attendees can pay via UPI, cards, and net banking." },
          { n: "03", title: "Share Branded Link", desc: "Publish your fast, clean registration URL across Instagram, WhatsApp, LinkedIn, and email." },
          { n: "04", title: "Instant QR Pass Issuance", desc: "Attendees receive crisp, tamper-proof digital passes immediately on payment settlement." },
          { n: "05", title: "Scan at the Entrance", desc: "Door volunteers scan QR codes on their mobile phones in under 0.3s with zero queue delay." },
        ],
        callout: {
          badge: "SAVINGS IN INR",
          title: "Stop losing tens of thousands of Rupees to ticketing commissions.",
          description: "On Eventbrite, an event selling ₹5,00,000 in tickets loses between ₹35,000 and ₹50,000 in platform service and processing fees. With URPASS, you pay a flat predictable SaaS subscription (starting with a 30-day free trial), keeping all ticket revenue in your bank account.",
          bullets: [
            "Zero percentage ticketing fees — flat subscription that costs a fraction of commissions",
            "Direct Razorpay integration means funds settle directly to your Indian bank account",
            "Native UPI QR and UPI app intent designed for how India actually makes payments",
            "Local support based in India with fast response times",
          ],
        },
        deepDiveSections: [
          {
            badge: "COMMISSION BREAKDOWN",
            title: "Why are Indian organizers switching away from Eventbrite?",
            paragraphs: [
              "Eventbrite was architected primarily for US and European credit card transactions. When used in India, organizers face high percentage deductions on every ticket, complex foreign exchange currency handling, and poor support for India's dominant payment rail: UPI.",
              "Additionally, Eventbrite frequently displays competitor events on your attendee confirmation pages and restricts access to full attendee contact information. URPASS puts you in complete control of your brand, your attendee relationship, and your event revenue.",
            ],
            takeaway: "Local payment rails, zero ticket commission, and full data ownership make URPASS the superior choice for Indian organizers.",
          },
          {
            badge: "GST COMPLIANCE",
            title: "How does URPASS solve Indian corporate and GST invoicing requirements?",
            paragraphs: [
              "Corporate conferences and paid educational summits in India must issue GST-compliant invoices for business attendees to claim input tax credit (ITC). Eventbrite does not provide native Indian GST invoices with GSTIN validation and state of supply codes.",
              "URPASS automates this entire process: attendees input their company GSTIN during checkout, and the system generates an official PDF invoice formatted with state codes, itemized CGST/SGST/IGST breakdowns, and your registered legal entity details.",
            ],
            takeaway: "Built-in GST invoicing ensures smooth accounting for corporate sponsors and business attendees.",
          },
        ],
        faqs: [
          {
            q: "How does URPASS pricing compare to Eventbrite?",
            a: "Eventbrite charges up to 3.7% + ₹79 per ticket plus payment processing fees. URPASS charges zero per-ticket platform fees with plans starting at ₹499/mo (and a 30-day free trial).",
          },
          {
            q: "Can I migrate my existing Eventbrite attendees into URPASS?",
            a: "Yes. You can export your attendee CSV from Eventbrite and import it directly into URPASS to issue dynamic digital passes.",
          },
          {
            q: "Are payouts deposited directly into my Indian bank account?",
            a: "Yes. With native Razorpay integration, ticket funds settle directly to your Indian bank account on standard T+2 banking schedules.",
          },
        ],
        relatedLinks: [
          { title: "Eventbrite Alternative Comparison", href: "/compare/eventbrite-alternative-india", category: "Comparison" },
          { title: "UPI Event Ticketing", href: "/upi-event-ticketing", category: "Product" },
          { title: "Razorpay Event Registration", href: "/razorpay-event-registration", category: "Product" },
          { title: "Townscript Alternative", href: "/compare/townscript-alternative", category: "Comparison" },
        ],
      }}
    />
  );
}
