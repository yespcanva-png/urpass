import type { Metadata } from "next";
import { Code2, QrCode, Users, ClipboardList, ScanLine, BarChart3 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Hackathon Registration & QR Check-In Software",
  description: "Manage hackathon registrations, team submissions, and QR check-in. Collect participant details, issue digital passes, and scan teams at entry. Free to start.",
  alternates: { canonical: "https://urpass.space/hackathons" },
  openGraph: {
    title: "Hackathon Registration & QR Check-In Software | URPASS",
    description: "Hackathon registration with team collection, digital passes, and QR check-in.",
    url: "https://urpass.space/hackathons",
  },
};

export default function HackathonsPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/hackathons",
        badge: "HACKATHONS",
        h1: "Hackathon Registration & QR Check-In",
        description: "Run your hackathon registration from a public link. Collect participant details, issue unique QR passes, and check in your teams at the venue with phone-based scanning.",
        ctaLabel: "Register your hackathon",
        features: [
          { icon: Code2, title: "Participant registration form", desc: "Collect participant name, college, tech stack, team name, and any custom fields you need." },
          { icon: ClipboardList, title: "Application review", desc: "Review hackathon applications and approve participants individually or in bulk." },
          { icon: QrCode, title: "Unique QR per participant", desc: "Every approved participant gets a unique QR pass for entry to the hackathon venue." },
          { icon: ScanLine, title: "Venue QR check-in", desc: "Scan participant passes at the venue entrance using any phone. Track arrivals in real time." },
          { icon: Users, title: "Participant dashboard", desc: "See the full participant list, filter by status, and manage check-ins from one view." },
          { icon: BarChart3, title: "Arrival tracking", desc: "Know how many participants have arrived, who is still pending, and your check-in rate live." },
        ],
        callout: {
          badge: "HACKATHON-READY",
          title: "Registration to QR entry for your hack.",
          description: "Share the registration link. Hackers apply. You approve. They get a QR pass. Scan at the venue. Dashboard updates live. Focus on the hackathon, not the logistics.",
          bullets: [
            "Public or invite-only registration",
            "Team and individual registration",
            "Instant QR pass on approval",
            "Any phone as entry scanner",
          ],
        },
        useCases: [
          "College hackathons", "National hackathons", "Company hackathons", "Community hacks",
          "Open-source events", "AI/ML events", "Design sprints", "Student competitions",
        ],
        faqs: [
          { q: "Can I register teams for a hackathon in URPASS?", a: "URPASS handles individual registrations. For team events, you can add a 'Team Name' custom field and approve each team member individually." },
          { q: "Can I limit registrations to a specific college?", a: "Not automatically, but you can collect college name in the form and manually review/approve only the participants who meet your criteria." },
          { q: "Is URPASS free for hackathons?", a: "Yes. The free plan supports 2 events/month with up to 100 participants/month at ₹0 forever. For larger hackathons, paid plans start at ₹499/month (Starter: 500 hackers) and ₹999/month (Pro: 2,500 hackers) with a 30-day free trial." },
          { q: "How do participants show their pass at the venue?", a: "Approved participants receive a link to their digital QR pass. They show the QR code on their phone at the hackathon venue entrance." },
          { q: "Can I use URPASS for a 24-hour hackathon with multiple entry/exit points?", a: "Yes. The scanner supports multiple simultaneous devices, so you can run check-in at multiple doors." },
          { q: "Can I collect GitHub links or project submissions in the form?", a: "Yes. URPASS supports custom fields, so you can ask for GitHub usernames, project ideas, or any other details in the registration form." },
        ],
        ctaTitle: "Run a seamless hackathon with URPASS",
        ctaDescription: "Online registration · Digital QR passes · Venue check-in · Free to start",
      }}
    />
  );
}
