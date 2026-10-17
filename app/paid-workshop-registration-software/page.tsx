import type { Metadata } from "next";
import { CreditCard, FileText, Layers, QrCode, ScanLine, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Paid Workshop Registration Software | UrPass",
  description: "Sell tickets for professional workshops, bootcamps and masterclasses with integrated payments, automated receipts and digital QR entry.",
  keywords: [
    "paid workshop registration software",
    "sell workshop seats and manage attendees",
    "urpass qr ticketing",
    "event check in software",
    "qr ticket scanner",
    "event registration platform"
  ],
  alternates: { canonical: "https://urpass.space/paid-workshop-registration-software" },
  openGraph: {
    title: "Paid Workshop Registration Software | UrPass",
    description: "Sell tickets for professional workshops, bootcamps and masterclasses with integrated payments, automated receipts and digital QR entry.",
    url: "https://urpass.space/paid-workshop-registration-software",
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
        badge: "WORKSHOPS & MASTERCLASSES",
        h1: "Sell Workshop Seats and Manage Attendees",
        canonicalUrl: "https://urpass.space/paid-workshop-registration-software",
        description: "Sell tickets for professional workshops, bootcamps and masterclasses with integrated payments, automated receipts and digital QR entry.",
        ctaLabel: "Sell Workshop Seats",
        directAnswer: {
          title: "How Does Paid Workshop Registration Work on UrPass?",
          summary: "UrPass provides an all-in-one registration and ticketing solution for corporate trainers, design masterclasses, and coding bootcamps. Organizers set strict seat caps, sell Early Bird and General Admission tickets, collect payments via UPI and cards with 0% platform fees, and verify attendees at the workshop door in <0.3s.",
          keyPoints: ["Strict seat capacity management preventing overbooking of interactive workshops", "Tiered pricing (Early Bird, Standard, Group) with automated price expiration dates", "0% per-seat platform fees to maximize instructor and training agency revenue", "Automated workshop syllabus delivery and calendar invites upon registration"],
        },
        keyFactsTable: {
          title: "Workshop Registration: UrPass vs Generic Forms",
          subtitle: "Optimizing seat sales and attendance for intensive training events.",
          headers: ["Workshop Feature", "UrPass Workshop Platform", "Google Forms + Manual Payment Checks"],
          rows: [
            {
                        "col1": "Payment & Seat Confirmation",
                        "col2": "Instant automated seat lock upon successful payment",
                        "col3": "Manual UPI screenshot verification taking hours"
            },
            {
                        "col1": "Strict Seat Capacity Capping",
                        "col2": "Automated 'Sold Out' trigger at exact seat limit",
                        "col3": "Forms stay open causing embarrassing overbooking"
            },
            {
                        "col1": "Check-In Speed at Door",
                        "col2": "<0.3s camera scan on instructor's phone",
                        "col3": "Manual paper sign-in delaying workshop start"
            },
            {
                        "col1": "Platform Ticket Fees",
                        "col2": "0% commission; keep 100% of seat revenue",
                        "col3": "Aggregators take 5% to 10% per attendee"
            },
            {
                        "col1": "Automated Tax Receipts",
                        "col2": "Instant GST invoice sent to corporate delegates",
                        "col3": "Manual PDF invoice generation after the workshop"
            }
],
        },
        features: [
          { icon: Users, title: "Strict Seat Capacity Limits", desc: "Cap registrations at exact classroom limits (e.g., 30 or 50 seats); checkout closes automatically when full." },
          { icon: CreditCard, title: "Zero Commission Seat Sales", desc: "Sell workshop seats via UPI and credit cards without sacrificing 5%–10% of revenue to aggregators." },
          { icon: Layers, title: "Early Bird & Student Tiers", desc: "Configure discounted Early Bird deadlines and student pricing with automatic price adjustments." },
          { icon: QrCode, title: "Instant QR Ticket & Calendar", desc: "Attendees receive digital tickets with venue directions and add-to-calendar invites immediately." },
          { icon: ScanLine, title: "Sub-0.3s Classroom Check-In", desc: "Scan attendees at the classroom door using any phone camera to start your workshop on schedule." },
          { icon: FileText, title: "Automated B2B Tax Receipts", desc: "Deliver compliant GST invoices so corporate attendees can claim company training reimbursements." }
        ],
        steps: [
          { n: "01", title: "Create Workshop", desc: "Set workshop topic, venue or studio location, seat cap (e.g. 25 attendees), and ticket pricing." },
          { n: "02", title: "Configure Ticket Tiers", desc: "Add Early Bird discount tiers with automated expiration dates and standard seat tiers." },
          { n: "03", title: "Share Landing Link", desc: "Promote your dedicated, high-converting workshop link on LinkedIn, Twitter, and email." },
          { n: "04", title: "Collect Instant Payments", desc: "Attendees pay securely via UPI or cards; seat count decrements automatically in real time." },
          { n: "05", title: "Scan at the Door", desc: "Scan student QR passes with your smartphone camera to begin training without delays." }
        ],
        callout: {
          badge: "TRAINER-FIRST TICKETING",
          title: "Never lose hours manually verifying UPI payment screenshots on WhatsApp.",
          description: "Independent trainers and agencies waste countless hours checking bank statements to confirm attendees who sent payment screenshots. UrPass automates payment, receipting, and pass dispatch.",
          bullets: ["Automated instant booking confirmation and pass dispatch", "Zero risk of classroom overbooking with real-time seat lock", "Keep 100% of your training earnings with 0% platform cuts", "Deliver professional B2B invoices for company expense claims"],
        },
        faqs: [
          { q: "Can I set an exact limit of 25 attendees for my workshop?", a: "Yes. UrPass enforces strict capacity caps. The moment the 25th seat is booked, the registration page automatically shows 'Sold Out'." },
          { q: "Can I offer an Early Bird discount that expires on a specific date?", a: "Yes. You can configure multiple ticket tiers with individual pricing, quotas, and automatic sale start/end dates." },
          { q: "Do I need special equipment to check people in at the workshop?", a: "No. You can open the UrPass scanner URL on your smartphone, grant camera access, and scan tickets in under 0.3 seconds." },
          { q: "Can attendees claim corporate training reimbursement with GST?", a: "Yes. Attendees can enter their company name and GSTIN during checkout to receive an automated compliant tax invoice." }
        ],
        relatedLinks: [
          { title: "Event Registration with Payment Gateway", href: "/event-registration-with-payment-gateway", category: "Product" },
          { title: "Zero Commission Event Ticketing", href: "/zero-commission-event-ticketing", category: "Product" },
          { title: "Event Capacity Management", href: "/event-capacity-management-software", category: "Product" },
          { title: "Event Ticket Types Management", href: "/event-ticket-types-management", category: "Product" }
        ],
      }}
    />
  );
}
