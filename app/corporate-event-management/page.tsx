import type { Metadata } from "next";
import { Briefcase, Users, QrCode, ShieldCheck, BarChart3, Sparkles, Building, CalendarDays, Award } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Corporate Event Management Software | URPASS",
  description: "Manage corporate events, employee programs, business gatherings and attendee check-in from one platform.",
  keywords: [
    "corporate event management software",
    "corporate event platform",
    "business event management",
    "company event check in",
    "corporate event ticketing",
    "corporate guest management",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/corporate-event-management" },
  openGraph: {
    title: "Corporate Event Management Software | URPASS",
    description: "Manage corporate events, employee programs, business gatherings and attendee check-in from one platform.",
    url: "https://urpass.space/corporate-event-management",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "CORPORATE EVENT MANAGEMENT",
        h1: "A Simpler Way to Run Corporate Events",
        canonicalUrl: "https://urpass.space/corporate-event-management",
        description: "Manage registrations, guests, digital passes, event entry and attendance for company events without complicated event operations.",
        ctaLabel: "Create Corporate Event",
        features: [
          { icon: Briefcase, title: "Executive Brand Aesthetics", desc: "Launch polished, professional event registration pages matching your corporate color palette, typography, and logo." },
          { icon: Users, title: "Curated Guest & VIP Lists", desc: "Manage high-priority client lists, executive delegations, and speaker rosters with dedicated status tags and customized approvals." },
          { icon: QrCode, title: "Mobile Passes & Apple Wallet", desc: "Attendees receive clean, elegant digital credentials accessible in any mobile browser or saved directly to Apple Wallet." },
          { icon: ShieldCheck, title: "Discreet, Queue-Free Check-In", desc: "Verify incoming executives in under 0.3s on volunteer smartphones without cumbersome paper checklists or noisy hardware." },
          { icon: Award, title: "Internal Employee Programs", desc: "Organize town halls, awards galas, leadership offsites, and training workshops with domain-restricted signups." },
          { icon: BarChart3, title: "Real-Time Arrival Intelligence", desc: "Monitor executive arrivals live and deploy instant post-event feedback surveys to evaluate gathering satisfaction." },
        ],
        steps: [
          { n: "01", title: "Configure Event Details", desc: "Specify executive schedule, hotel/auditorium venue, dress code, and capacities." },
          { n: "02", title: "Invite Guests & Employees", desc: "Distribute your invitation link via corporate email, calendar invites, or WhatsApp." },
          { n: "03", title: "Manage Guest List", desc: "Monitor confirmations, approve external guests, and track dietary requirements." },
          { n: "04", title: "Issue Digital Passes", desc: "Guests receive instant digital passes with personalized schedules and QR credentials." },
          { n: "05", title: "Welcome Guests at Doors", desc: "Concierge staff scan passes discreetly on mobile phones in under 0.3 seconds." },
        ],
        callout: {
          badge: "PROFESSIONAL EXCELLENCE",
          title: "First-class event operations without complex enterprise software bloat.",
          description: "Corporate event organizers are often trapped between basic form tools that look unprofessional and enterprise event suites that cost tens of thousands of dollars and take weeks to learn. URPASS offers the perfect balance: immaculate design, reliable mobile check-in, and instant setup.",
          bullets: [
            "Elegant, distraction-free attendee signup experience on any smartphone",
            "Discreet mobile check-in eliminating awkward entrance delays for VIP guests",
            "Built-in post-event survey forms to collect participant sentiment automatically",
            "Transparent INR flat pricing with zero per-ticket platform commissions",
          ],
        },
        deepDiveSections: [
          {
            badge: "GUEST EXPERIENCE",
            title: "Elevating the Executive & VIP Guest Experience",
            paragraphs: [
              "When high-value clients, board members, and industry partners attend your corporate gathering, the registration and arrival experience sets the tone for the entire relationship. Forcing executives to wait in line while staff search for their name on paper spreadsheets creates an immediate impression of disorganization.",
              "URPASS transforms corporate hospitality into a sleek, contactless experience. Guests receive a clean, branded digital invitation link. Upon confirmation, their personalized digital pass loads instantly on their smartphone screen with venue directions, hotel check-in details, and their personalized itinerary.",
              "At the reception desk, concierge staff scan the pass on a smartphone in under 0.3 seconds. The guest is warmly greeted by name, their entry is logged, and executive hosts can be alerted automatically that a VIP client has arrived."
            ],
            bullets: [
              "Zero app downloads or account logins required for busy corporate guests",
              "Apple Wallet integration puts the pass on the executive's lock screen upon arrival",
              "Discreet sub-second scanning keeps lobby entrances moving effortlessly",
              "Immediate attendee tier display (e.g. Keynote Speaker, Board Member, VIP Partner)"
            ],
            takeaway: "Deliver a polished, modern arrival experience that respects your guests' time and enhances your corporate brand."
          },
          {
            badge: "OPERATIONAL EFFICIENCY",
            title: "Eliminating Administrative Overhead for Internal Corporate Programs",
            paragraphs: [
              "Corporate HR and communications teams manage dozens of internal programs every year: quarterly town halls, diversity forums, leadership academies, and annual family days. In most companies, these events are run on manual spreadsheets, resulting in lost RSVPs, unread reminder emails, and wasted catering budgets from inaccurate headcounts.",
              "URPASS automates the internal event lifecycle. HR coordinators launch an event in under 3 minutes, set seat limits to match auditorium capacity, and restrict registrations to internal employee domains.",
              "Employees receive automatic calendar reminders and dynamic mobile passes. On event day, door staff scan passes to record accurate attendance, giving HR verified headcount data for compliance and ROI reporting."
            ],
            bullets: [
              "Domain whitelisting ensures internal events remain private to verified staff",
              "Accurate real-time attendance figures prevent overpaying for catering and venue space",
              "Instant feedback surveys capture employee engagement before they leave the hall",
              "Downloadable CSV reports ready for internal company presentations"
            ],
            takeaway: "Replace manual spreadsheet tracking with an automated internal event workflow that saves corporate coordinators dozens of hours every month."
          }
        ],
        useCases: [
          "Annual General Meetings (AGMs)",
          "Dealer & Partner Summits",
          "Employee Recognition & Award Galas",
          "Leadership Offsites & Strategy Retreats",
          "Client Appreciation Dinners",
          "Internal Training & Certification Programs",
          "Quarterly Corporate All-Hands",
        ],
        relatedLinks: [
          { title: "Enterprise Event Management", href: "/enterprise-event-management", category: "Product" },
          { title: "Enterprise Event Registration", href: "/enterprise-event-registration", category: "Product" },
          { title: "Multi-Location Event Management", href: "/multi-location-event-management", category: "Product" },
          { title: "Dealer Meet Management", href: "/dealer-meet-management", category: "Use Case" },
          { title: "Corporate Events Solution", href: "/corporate-events", category: "Use Case" },
          { title: "Event Software Mumbai", href: "/in/mumbai", category: "Location" },
        ],
        faqs: [
          { q: "What is corporate event management software?", a: "Corporate event management software is a digital platform designed for businesses to organize company meetings, client conferences, internal employee gatherings, and executive retreats with registration, pass issuance, and door check-in." },
          { q: "Do corporate guests or executives need to install an app?", a: "No. URPASS is entirely browser-based. Guests open their invitation and digital pass directly in Safari or Chrome, with the option to save the pass to Apple Wallet for easy one-tap access." },
          { q: "How does check-in work at executive and VIP events?", a: "Door staff or receptionists open the URPASS camera scanner link on any smartphone or tablet. When the guest presents their phone or printed pass, the QR code is verified in under 0.3 seconds, displaying their name and credential tier." },
          { q: "Can we restrict event signups to employees only?", a: "Yes. You can enable corporate domain restrictions (e.g. only allowing registrations from @yourcompany.com) so private company gatherings cannot be accessed by external parties." },
          { q: "Can we capture post-event feedback from attendees?", a: "Yes. URPASS includes integrated post-event feedback surveys, allowing you to collect attendee ratings and qualitative reviews immediately following the event." },
          { q: "What plans are available for corporate event teams?", a: "URPASS offers a permanent free plan for up to 2 events per month (100 registrations), as well as Starter (₹499/mo), Pro (₹999/mo), and Business (₹2,499/mo) plans with 30-day free trials and zero platform commission." },
        ],
        ctaTitle: "Elevate your next corporate event",
        ctaDescription: "Set up in 5 minutes · Permanent free tier · 30-day free trial on paid plans",
      }}
    />
  );
}
