import type { Metadata } from "next";
import { CheckCircle2, ClipboardList, Link2, QrCode, Users, ShieldCheck, Smartphone } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Form Builder & Pass Creator",
  description: "Build clean, high-converting event registration forms. Collect custom attendee details, manage approvals, and automatically issue digital QR passes.",
  keywords: [
    "event registration form",
    "event registration software",
    "QR event check-in",
    "digital event pass",
    "event ticketing platform",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-registration-form" },
  openGraph: {
    title: "Event Registration Form Builder & Pass Creator | URPASS",
    description: "Build clean, high-converting event registration forms. Collect custom attendee details, manage approvals, and automatically issue digital QR passes.",
    url: "https://urpass.space/event-registration-form",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "EVENT REGISTRATION FORM",
        h1: "Event Registration Form Builder with Instant QR Pass Delivery",
        canonicalUrl: "https://urpass.space/event-registration-form",
        description: "Build clean, high-converting event registration forms. Collect custom attendee details, manage approvals, and automatically issue digital QR passes.",
        ctaLabel: "Build registration form free",
        features: [
          { icon: ClipboardList, title: "Custom Question Builder", desc: "Collect name, email, phone number, college, department, dietary preferences, or custom text inputs." },
          { icon: Link2, title: "One Shareable Public Link", desc: "Every event gets a clean, responsive public registration URL that works seamlessly across all devices." },
          { icon: QrCode, title: "Instant QR Pass Generation", desc: "Submitting the registration form automatically generates a unique digital QR pass for approved participants." },
          { icon: Users, title: "Capacity Management", desc: "Set registration caps that automatically shut down or waitlist forms once your venue capacity is reached." },
          { icon: ShieldCheck, title: "Auto or Manual Approval", desc: "Enable instant auto-admit for open events or review submissions individually before issuing passes." },
          { icon: Smartphone, title: "Export Responses to CSV", desc: "Download full form submissions and contact information into Excel-compatible spreadsheets." },
        ],
        steps: [
          { n: "01", title: "Build Form", desc: "Add required questions, select custom field types, and set attendee caps." },
          { n: "02", title: "Share Link", desc: "Distribute your registration form URL via WhatsApp, email, or social media." },
          { n: "03", title: "Collect Submissions", desc: "Review incoming applicant responses on your live organizer dashboard." },
          { n: "04", title: "Approve Registrants", desc: "Approved participants instantly receive their unique digital QR pass." },
          { n: "05", title: "Door Check-In", desc: "Scan generated QR passes at venue doors with any smartphone camera." },
        ],
        callout: {
          badge: "FORM TO PASS",
          title: "Why use Google Forms when you can have automated passes?",
          description: "Google Forms leaves you with a raw spreadsheet and no way to manage entrance security. URPASS turns form submissions directly into verifiable QR passes.",
          bullets: [
            "Direct conversion from form submission to digital QR pass",
            "No messy spreadsheets or manual email merges required",
            "Automated duplicate entry lockout at venue gates",
            "Clean, mobile-first design with high completion rates",
          ],
        },
        useCases: [
          "College Club Signups",
          "Technical Workshop Registrations",
          "Hackathon Applications",
          "Webinar & Seminar Forms",
          "Campus Sports Registrations",
          "Volunteer Recruitment",
        ],
        faqs: [
          { q: "How is an URPASS registration form different from Google Forms?", a: "Google Forms only records spreadsheet rows. URPASS automates the entire flow: collecting responses, approving attendees, generating secure QR passes, and verifying entry at the door." },
          { q: "Can I embed the registration form on my website?", a: "You can link directly to your clean, mobile-responsive URPASS registration URL from any button or webpage." },
          { q: "Can I collect payments on the form?", a: "Yes. You can attach paid ticket tiers via Razorpay so registrants complete payment before pass generation." },
          { q: "Can I limit registrations to a maximum number of participants?", a: "Yes. Configure a maximum attendee cap to close registration automatically once full." },
        ],
        ctaTitle: "Start streamlining your event with URPASS",
        ctaDescription: "Permanent free tier · 30-day free trial on paid plans · Fast sub-second check-in",
      }}
    />
  );
}
