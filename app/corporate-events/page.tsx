import type { Metadata } from "next";
import { Building2, Ticket, QrCode, ScanLine, BarChart3, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Corporate Event Registration & Check-In",
  description: "Manage corporate event registrations, employee passes, and QR entry scanning. Branded passes on Pro plan. Real-time check-in dashboard. Secure attendee management.",
  alternates: { canonical: "https://urpass.space/corporate-events" },
  openGraph: {
    title: "Corporate Event Registration & Check-In | URPASS",
    description: "Professional corporate event management with branded passes and QR check-in.",
    url: "https://urpass.space/corporate-events",
  },
};

export default function CorporateEventsPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/corporate-events",
        badge: "CORPORATE EVENTS",
        h1: "Corporate Event Registration & Check-In",
        description: "Handle corporate event registrations, team passes, and QR entry management professionally. Custom branding on Pro plan. Secure, reliable, and simple.",
        ctaLabel: "Manage your corporate event",
        features: [
          { icon: Building2, title: "Professional event setup", desc: "Create branded corporate events with custom organisation name and colours on Pro plan." },
          { icon: Ticket, title: "Employee and guest passes", desc: "Issue separate pass types for employees, external guests, VIPs, and speakers." },
          { icon: QrCode, title: "Branded digital passes", desc: "Custom-branded QR passes with your company name and colours on the Pro plan." },
          { icon: ScanLine, title: "Secure QR entry", desc: "Control who enters your corporate event with QR validation and duplicate prevention." },
          { icon: Users, title: "Team management", desc: "Add multiple team members as organisers with role-based access on Pro plan." },
          { icon: BarChart3, title: "Attendance reporting", desc: "Export full attendance data for compliance, reporting, or post-event analysis." },
        ],
        callout: {
          badge: "PRO BRANDING",
          title: "Your brand. Your event. Your passes.",
          description: "Pro plan users can customise every pass with their company name, logo, and brand colour. Attendees see your brand, not URPASS branding.",
          bullets: [
            "Custom company name on passes",
            "Organisation logo on passes",
            "Brand colour in pass header",
            "Remove URPASS watermark",
          ],
        },
        useCases: [
          "Company townhalls", "Product launches", "Team offsites", "Corporate training",
          "Leadership summits", "Client events", "Award ceremonies", "Annual dinners",
        ],
        faqs: [
          { q: "Can I brand the QR passes with my company name?", a: "Yes. Pro plan users can add their company name, logo URL, and brand colour to every digital pass. URPASS branding can be removed on Starter and higher plans." },
          { q: "Can I restrict registration to company employees only?", a: "You can keep the registration link private (share it only internally) and manually review each registration before approving." },
          { q: "Does URPASS support multiple team members managing the event?", a: "Yes. The Pro plan includes Organisations, allowing multiple team members with different roles (admin, event manager, check-in staff) to manage events." },
          { q: "Can I export attendance data for corporate compliance records?", a: "Yes. Starter and Pro plans include CSV export of the full attendee list with check-in timestamps." },
          { q: "What security does URPASS provide for corporate events?", a: "QR passes are cryptographically unique and single-use. Each entry is validated and logged. Unauthorised or duplicate entries are blocked." },
          { q: "Can I use URPASS for paid corporate events?", a: "Yes. Paid event ticketing is supported on Starter and Pro plans with Razorpay integration." },
        ],
        ctaTitle: "Run your next corporate event with confidence",
        ctaDescription: "Custom branding · Secure QR entry · Team management · Export data",
      }}
    />
  );
}
