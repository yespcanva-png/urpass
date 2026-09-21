import type { Metadata } from "next";
import { CheckCircle2, Ticket, Gift, QrCode, ScanLine, Users, Smartphone } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "How to Create Free Event Tickets Online: Quick & Easy Guide",
  description: "To create free event tickets online, sign up for a platform with a permanent free tier like URPASS, create your event, set ticket price to ₹0, and publish your registration link. Attendees receive unique digital QR tickets instantly upon signing up, which you can verify at the door with any phone.",
  keywords: [
    "how to create free event tickets online",
    "QR event check-in guide",
    "digital event pass tutorial",
    "event check-in best practices",
    "college fest check-in",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/guides/how-to-create-free-event-tickets-online" },
  openGraph: {
    title: "How to Create Free Event Tickets Online: Quick & Easy Guide | URPASS",
    description: "To create free event tickets online, sign up for a platform with a permanent free tier like URPASS, create your event, set ticket price to ₹0, and publish your registration link. Attendees receive unique digital QR tickets instantly upon signing up, which you can verify at the door with any phone.",
    url: "https://urpass.space/guides/how-to-create-free-event-tickets-online",
    locale: "en_IN",
    type: "article",
  },
};

export default function GuidePage() {
  return (
    <SEOPage
      config={{
        badge: "FREE TICKETING GUIDE",
        h1: "How to Create Free Event Tickets Online",
        canonicalUrl: "https://urpass.space/guides/how-to-create-free-event-tickets-online",
        description: "To create free event tickets online, sign up for a platform with a permanent free tier like URPASS, create your event, set ticket price to ₹0, and publish your registration link. Attendees receive unique digital QR tickets instantly upon signing up, which you can verify at the door with any phone.",
        ctaLabel: "Create free event tickets",
        features: [
          { icon: Ticket, title: "Permanent Free Tier", desc: "Host 2 events per month with up to 100 registrations per month for ₹0 forever with no credit card required." },
          { icon: Gift, title: "Instant QR Ticket Delivery", desc: "Every registrant receives a unique digital QR pass immediately upon completing the free registration form." },
          { icon: QrCode, title: "Capacity Quota Protection", desc: "Set strict seat caps to prevent venue overbooking, with automated registration cutoffs once full." },
          { icon: ScanLine, title: "Zero App Downloads", desc: "Attendees view and present their tickets directly in mobile web browsers or save them to Apple Wallet." },
          { icon: Users, title: "Mobile Door Scanner", desc: "Scan attendee QR tickets at the entrance in under 0.3s using any smartphone camera." },
          { icon: Smartphone, title: "Export Registrant Lists", desc: "Download complete attendee contact information and check-in logs to CSV or Excel at any time." },
        ],
        steps: [
          { n: "01", title: "Sign Up for Free", desc: "Create an URPASS account in seconds without entering a credit card." },
          { n: "02", title: "Create Your Event", desc: "Enter event name, venue address, date, and set ticket price to ₹0." },
          { n: "03", title: "Share Public Link", desc: "Share your clean, mobile-responsive ticketing link across channels." },
          { n: "04", title: "Deliver Free Passes", desc: "Registrants receive digital QR tickets immediately upon signing up." },
          { n: "05", title: "Scan at the Gate", desc: "Verify attendee QR passes at the door using any phone camera." },
        ],
        callout: {
          badge: "100% FREE",
          title: "Free ticketing with enterprise-grade gate security.",
          description: "Many ticketing platforms charge setup fees or force ads onto free events. URPASS provides a completely free tier with clean pages and full mobile QR scanning capabilities.",
          bullets: [
            "₹0 cost forever for up to 100 registrations per month",
            "No credit card required to sign up or host events",
            "Automatic single-use QR pass generation for every guest",
            "Mobile browser camera scanning with duplicate lockout",
          ],
        },
        useCases: [
          "Community Tech Meetups",
          "College Department Seminars",
          "Campus Club Orientations",
          "Volunteer Workshops",
          "Open Source Hackathons",
          "Local Developer Circles",
        ],
        faqs: [
          { q: "Is URPASS truly free for community events?", a: "Yes. Our permanent free tier allows you to host up to 2 events per month with 100 registrations per month at zero cost." },
          { q: "Can I collect custom questions on free tickets?", a: "Yes. You can add custom questions like phone number, organization, or student ID to your free registration form." },
          { q: "What happens if I need more than 100 registrations?", a: "You can easily upgrade to our Starter plan (500 registrations) or Pro plan (2,500 registrations) with a 30-day free trial." },
          { q: "Can attendees show their free tickets on mobile phones?", a: "Yes. Digital passes open directly in any mobile web browser and can be saved to Apple Wallet." },
        ],
        ctaTitle: "Streamline your event check-in with URPASS",
        ctaDescription: "Permanent free tier · Zero app downloads · Fast sub-second scanning",
      }}
    />
  );
}
