import type { Metadata } from "next";
import { CheckCircle2, ClipboardList, Ticket, ShieldCheck, Users, Zap, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Platform with Digital QR Ticketing",
  description: "Create customizable registration forms, collect participant details, issue digital QR passes, and automate approvals from one intuitive platform.",
  keywords: [
    "event registration platform",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "event ticketing platform",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-registration-platform" },
  openGraph: {
    title: "Event Registration Platform with Digital QR Ticketing | URPASS",
    description: "Create customizable registration forms, collect participant details, issue digital QR passes, and automate approvals from one intuitive platform.",
    url: "https://urpass.space/event-registration-platform",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "REGISTRATION PLATFORM",
        h1: "Event Registration Platform Built for Modern Organizers",
        canonicalUrl: "https://urpass.space/event-registration-platform",
        description: "Create customizable registration forms, collect participant details, issue digital QR passes, and automate approvals from one intuitive platform.",
        ctaLabel: "Launch registration platform",
        features: [
          { icon: ClipboardList, title: "Custom Form Builder", desc: "Design registration workflows with custom text fields, dropdowns, checkboxes, and file uploads tailored to your event." },
          { icon: Ticket, title: "Instant QR Pass Generation", desc: "Every approved registrant automatically receives a responsive mobile pass with a unique scannable QR code." },
          { icon: ShieldCheck, title: "Flexible Approval Modes", desc: "Choose automated instant admission for open events or manual organizer approval for competitive fests and workshops." },
          { icon: Users, title: "Registration Capacity Limits", desc: "Set strict seat caps per event or ticket tier with automated waitlists once maximum capacity is reached." },
          { icon: Zap, title: "Integrated Razorpay Payments", desc: "Collect ticket fees via UPI, credit/debit cards, and net banking with zero platform commission." },
          { icon: BarChart3, title: "Real-Time Registrant Roster", desc: "Manage, search, filter, and export attendee profiles directly to CSV or Excel spreadsheet formats." },
        ],
        steps: [
          { n: "01", title: "Setup Form", desc: "Specify required attendee fields, event date, and seat quotas." },
          { n: "02", title: "Share Public Link", desc: "Embed or distribute your unique registration URL across channels." },
          { n: "03", title: "Approve Signups", desc: "Approve participants one-by-one or in bulk with single-click actions." },
          { n: "04", title: "Deliver Passes", desc: "Attendees receive mobile digital passes accessible in any browser." },
          { n: "05", title: "Verify at Entrance", desc: "Scan digital QR passes at the venue doors for instantaneous check-in." },
        ],
        callout: {
          badge: "SEAMLESS ADMISSIONS",
          title: "From first signup to final entrance check-in.",
          description: "Stop losing registrations to clunky forms and spreadsheets. URPASS gives your event a clean, modern registration experience with instant pass delivery.",
          bullets: [
            "Mobile-optimized application forms with high conversion",
            "Automated confirmation and digital pass issuance",
            "Zero per-ticket percentage deductions on ticket revenue",
            "Comprehensive CSV data export for post-event analysis",
          ],
        },
        useCases: [
          "Hackathons & Buildathons",
          "College Fests & Culturals",
          "Technical Symposiums",
          "Developer Conferences",
          "Corporate Seminars",
          "Hands-on Masterclasses",
        ],
        faqs: [
          { q: "Can I collect custom fields like student ID or organization name?", a: "Yes. You can add unlimited custom questions to your registration form to gather all required participant information." },
          { q: "Do attendees need an account to register?", a: "No. Attendees complete the registration form via a public link without needing to create an account or install an app." },
          { q: "How are tickets or passes delivered to registrants?", a: "Attendees receive a direct web pass link upon registration or approval. They can view the pass on their phone, add to Apple Wallet, or save as an image." },
          { q: "Is there a free tier available for small events?", a: "Yes. Organizers can host up to 2 events per month with 100 registrations per month completely free." },
        ],
        ctaTitle: "Start streamlining your event with URPASS",
        ctaDescription: "Permanent free tier · 30-day free trial on paid plans · Fast sub-second check-in",
      }}
    />
  );
}
