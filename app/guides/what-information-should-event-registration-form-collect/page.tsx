import type { Metadata } from "next";
import { CheckCircle2, ClipboardList, Users, Mail, ShieldCheck, CheckSquare, FileText } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "What Information Should an Event Registration Form Collect?",
  description: "An event registration form should collect essential identifying data: full name, primary email, and mobile phone number for pass delivery. Depending on the event type, include institutional fields like college name or student ID, ticket tier selection, dietary preferences, and emergency contact details while keeping the form concise to maximize completion rates.",
  keywords: [
    "what information should an event registration form collect",
    "QR event check-in guide",
    "digital event pass tutorial",
    "event check-in best practices",
    "college fest check-in",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/guides/what-information-should-event-registration-form-collect" },
  openGraph: {
    title: "What Information Should an Event Registration Form Collect? | URPASS",
    description: "An event registration form should collect essential identifying data: full name, primary email, and mobile phone number for pass delivery. Depending on the event type, include institutional fields like college name or student ID, ticket tier selection, dietary preferences, and emergency contact details while keeping the form concise to maximize completion rates.",
    url: "https://urpass.space/guides/what-information-should-event-registration-form-collect",
    locale: "en_IN",
    type: "article",
  },
};

export default function GuidePage() {
  return (
    <SEOPage
      config={{
        badge: "FORM DESIGN GUIDE",
        h1: "What Information Should an Event Registration Form Collect?",
        canonicalUrl: "https://urpass.space/guides/what-information-should-event-registration-form-collect",
        description: "An event registration form should collect essential identifying data: full name, primary email, and mobile phone number for pass delivery. Depending on the event type, include institutional fields like college name or student ID, ticket tier selection, dietary preferences, and emergency contact details while keeping the form concise to maximize completion rates.",
        ctaLabel: "Build optimized form free",
        features: [
          { icon: ClipboardList, title: "1. Core Contact Information", desc: "Full Name and Email Address are essential for attendee identification, communication, and digital QR pass delivery." },
          { icon: Users, title: "2. Mobile Phone Number", desc: "Critical for SMS/WhatsApp pass links, last-minute schedule changes, and entrance gate lookup." },
          { icon: Mail, title: "3. Ticket Tier Selection", desc: "Let attendees choose between General, VIP, Student, Workshop, or Early Bird admission tiers." },
          { icon: ShieldCheck, title: "4. Institutional Credentials", desc: "For college fests or academic conferences, collect Student ID, Department, Year, or Organization name." },
          { icon: CheckSquare, title: "5. Dietary & Accessibility Needs", desc: "Gather vegetarian/vegan preferences or accessibility accommodations for catered, in-person events." },
          { icon: FileText, title: "6. Avoid Form Abandonment", desc: "Keep mandatory questions to under 5 fields whenever possible to maximize form conversion rates." },
        ],
        steps: [
          { n: "01", title: "Identify Goals", desc: "Determine the minimal required data needed for security and logistics." },
          { n: "02", title: "Add Core Fields", desc: "Include Full Name, Email, and Phone as required fields in URPASS." },
          { n: "03", title: "Add Custom Questions", desc: "Insert college, company, or dietary dropdowns as optional fields." },
          { n: "04", title: "Set Ticket Tiers", desc: "Configure admission classes with seat limits and individual pricing." },
          { n: "05", title: "Test on Mobile", desc: "Preview your registration link on smartphone screens before publishing." },
        ],
        callout: {
          badge: "CONVERSION TIPS",
          title: "Shorter forms equal higher event registration rates.",
          description: "Every extra required field reduces registration completion by 5% to 10%. Only ask for information you genuinely need to admit attendees and run the event safely.",
          bullets: [
            "Keep mandatory fields to 4-5 questions for best conversion",
            "Use dropdowns and checkboxes instead of open text fields",
            "Mobile-optimized form fields with instant validation",
            "Automated pass delivery directly upon form completion",
          ],
        },
        useCases: [
          "College Fest Signups",
          "Tech Conference Registration",
          "Hackathon Applications",
          "Workshop Registrations",
          "Executive Dinner RSVPs",
          "Community Meetups",
        ],
        faqs: [
          { q: "Should phone numbers be mandatory on event registration forms?", a: "Yes, for in-person events where gate staff might need to search attendees manually if their phone battery dies." },
          { q: "Can I collect file uploads like student ID cards or resumes?", a: "Yes. You can add custom file upload fields to verify student IDs or review hackathon project proposals." },
          { q: "How do I prevent fake email registrations?", a: "You can enable approval mode to review submissions before issuing passes, or deliver passes strictly via confirmation email." },
          { q: "Can I edit form questions after publishing the link?", a: "Yes. You can update questions, change seat quotas, and modify form fields anytime in your organizer dashboard." },
        ],
        ctaTitle: "Streamline your event check-in with URPASS",
        ctaDescription: "Permanent free tier · Zero app downloads · Fast sub-second scanning",
      }}
    />
  );
}
