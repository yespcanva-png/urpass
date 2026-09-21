import type { Metadata } from "next";
import { CheckCircle2, ClipboardList, School, Ticket, QrCode, Users, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "How to Create a College Fest Registration Form: Complete Guide",
  description: "Create a college fest registration form by selecting necessary participant fields (student name, college ID, department, year, event category), publishing a shareable public link, enabling auto-approval or manual verification, and ensuring every submission immediately triggers a verified digital QR entry pass.",
  keywords: [
    "how to create a college fest registration form",
    "QR event check-in guide",
    "digital event pass tutorial",
    "event check-in best practices",
    "college fest check-in",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/guides/how-to-create-college-fest-registration-form" },
  openGraph: {
    title: "How to Create a College Fest Registration Form: Complete Guide | URPASS",
    description: "Create a college fest registration form by selecting necessary participant fields (student name, college ID, department, year, event category), publishing a shareable public link, enabling auto-approval or manual verification, and ensuring every submission immediately triggers a verified digital QR entry pass.",
    url: "https://urpass.space/guides/how-to-create-college-fest-registration-form",
    locale: "en_IN",
    type: "article",
  },
};

export default function GuidePage() {
  return (
    <SEOPage
      config={{
        badge: "COLLEGE GUIDE",
        h1: "How to Create a College Fest Registration Form",
        canonicalUrl: "https://urpass.space/guides/how-to-create-college-fest-registration-form",
        description: "Create a college fest registration form by selecting necessary participant fields (student name, college ID, department, year, event category), publishing a shareable public link, enabling auto-approval or manual verification, and ensuring every submission immediately triggers a verified digital QR entry pass.",
        ctaLabel: "Create college fest form free",
        features: [
          { icon: ClipboardList, title: "Student Identification Fields", desc: "Collect student name, roll number, college name, department, year, and emergency contact information." },
          { icon: School, title: "Multi-Event & Workshop Options", desc: "Allow students to choose specific technical tracks, cultural contests, or gaming tournaments on a single form." },
          { icon: Ticket, title: "Instant QR Pass Generation", desc: "Every approved student automatically receives a unique digital QR pass to present at the college gate." },
          { icon: QrCode, title: "Capacity Quotas per Contest", desc: "Set individual limits for high-demand events like coding contests or dance competitions to avoid overcrowding." },
          { icon: Users, title: "Single Shareable Link", desc: "Distribute one clean, mobile-optimized link across college WhatsApp groups, Instagram bios, and posters." },
          { icon: BarChart3, title: "CSV Attendee Export", desc: "Download complete registration data sorted by college or department for faculty approval and certificates." },
        ],
        steps: [
          { n: "01", title: "Create Fest Event", desc: "Set your college fest title, dates, campus venue, and overall capacity." },
          { n: "02", title: "Build Form Fields", desc: "Add student roll number, college name, department, and competition choices." },
          { n: "03", title: "Share Public URL", desc: "Distribute your fest registration link across student channels." },
          { n: "04", title: "Auto-Deliver Passes", desc: "Students receive mobile digital QR passes immediately upon approval." },
          { n: "05", title: "Scan at Campus Doors", desc: "Student volunteers scan passes in under 0.3s at the entrance gates." },
        ],
        callout: {
          badge: "ZERO EFFORT",
          title: "Ditch Google Forms and manual ticket distribution.",
          description: "Using Google Forms forces student organizers to manually create and email QR codes or manage messy paper lists. URPASS connects form registration directly to automated QR passes.",
          bullets: [
            "Automatic single-use QR pass delivery upon form submission",
            "No manual spreadsheet formatting or email merging",
            "Fast phone-based entrance scanning for student volunteers",
            "Duplicate entry blocked automatically at the gate",
          ],
        },
        useCases: [
          "Inter-College Culturals",
          "Department Tech Symposiums",
          "24h Hackathons",
          "Campus Battle of the Bands",
          "Gaming Tournaments",
          "Literary & Debate Fests",
        ],
        faqs: [
          { q: "Can we collect registrations for both team and individual events?", a: "Yes. You can add custom questions to collect team names and partner roll numbers on the registration form." },
          { q: "Can we accept registration fees for college fest workshops?", a: "Yes. Native Razorpay integration allows you to collect paid ticket fees via UPI (GPay, PhonePe, Paytm) and cards." },
          { q: "Do students need to create an URPASS account to register?", a: "No. Students complete the form via a public link and receive their pass without creating an account." },
          { q: "Is URPASS free for student fests?", a: "Yes. You can host up to 2 events per month with 100 registrations per month for ₹0 forever on our free plan." },
        ],
        ctaTitle: "Streamline your event check-in with URPASS",
        ctaDescription: "Permanent free tier · Zero app downloads · Fast sub-second scanning",
      }}
    />
  );
}
