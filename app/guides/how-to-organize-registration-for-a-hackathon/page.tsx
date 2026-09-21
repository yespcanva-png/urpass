import type { Metadata } from "next";
import { CheckCircle2, Trophy, ClipboardList, Users, QrCode, ScanLine, ShieldCheck } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "How to Organize Registration for a Hackathon: Complete Playbook",
  description: "Organizing registration for a hackathon involves collecting team member details, tech tracks, and project proposals via a custom form, reviewing applications in an organizer dashboard, and issuing digital QR passes that allow seamless overnight check-in and re-entry.",
  keywords: [
    "how to organize registration for a hackathon",
    "QR event check-in guide",
    "digital event pass tutorial",
    "event check-in best practices",
    "college fest check-in",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/guides/how-to-organize-registration-for-a-hackathon" },
  openGraph: {
    title: "How to Organize Registration for a Hackathon: Complete Playbook | URPASS",
    description: "Organizing registration for a hackathon involves collecting team member details, tech tracks, and project proposals via a custom form, reviewing applications in an organizer dashboard, and issuing digital QR passes that allow seamless overnight check-in and re-entry.",
    url: "https://urpass.space/guides/how-to-organize-registration-for-a-hackathon",
    locale: "en_IN",
    type: "article",
  },
};

export default function GuidePage() {
  return (
    <SEOPage
      config={{
        badge: "HACKATHON GUIDE",
        h1: "How to Organize Registration for a Hackathon",
        canonicalUrl: "https://urpass.space/guides/how-to-organize-registration-for-a-hackathon",
        description: "Organizing registration for a hackathon involves collecting team member details, tech tracks, and project proposals via a custom form, reviewing applications in an organizer dashboard, and issuing digital QR passes that allow seamless overnight check-in and re-entry.",
        ctaLabel: "Host hackathon registration free",
        features: [
          { icon: Trophy, title: "Team & Track Selection", desc: "Collect team names, individual hacker roles, tech stacks, and track preferences on your custom registration form." },
          { icon: ClipboardList, title: "Application Review Queue", desc: "Review candidate profiles, GitHub links, and project ideas, approving hackers individually or in batches." },
          { icon: Users, title: "Hacker QR Passes", desc: "Approved hackers receive dynamic digital passes containing their name, team, track, and unique QR code." },
          { icon: QrCode, title: "Overnight Gate Re-Entry", desc: "Manage multi-entry access throughout 24h or 48h hackathons with instant door scanner verification." },
          { icon: ScanLine, title: "Meal & Swag Tracking", desc: "Use tiered scanning or timestamped logs to verify midnight snacks, meal distribution, and swag pickup." },
          { icon: ShieldCheck, title: "Live Headcount Dashboard", desc: "Monitor checked-in teams and active hackers live from your central organizer command center." },
        ],
        steps: [
          { n: "01", title: "Set Up Hackathon", desc: "Specify hackathon dates, venue auditorium, and overall hacker capacity." },
          { n: "02", title: "Configure Form", desc: "Collect team name, GitHub profiles, college affiliation, and track selection." },
          { n: "03", title: "Review Applications", desc: "Accept qualified hackers and trigger automated digital QR pass delivery." },
          { n: "04", title: "Opening Check-In", desc: "Scan hacker passes at the main door in under 0.3s to kick off hacking." },
          { n: "05", title: "Manage Re-Entry", desc: "Verify hacker credentials smoothly during late-night food breaks and judging." },
        ],
        callout: {
          badge: "HACKATHON TESTED",
          title: "Engineered for 24-hour and 48-hour hackathon stamina.",
          description: "Hackathons are high-intensity events where security, late-night door control, and team management are crucial. URPASS gives hackathon organizers total control from application to final demo day.",
          bullets: [
            "Custom application review and approval workflow",
            "Digital QR passes for hackers, mentors, and judges",
            "Seamless door check-in and overnight re-entry validation",
            "Permanent free tier for up to 100 hackers per month",
          ],
        },
        useCases: [
          "24-Hour Student Hackathons",
          "Web3 & AI Buildathons",
          "Corporate Innovation Sprints",
          "Open Source Hack Weeks",
          "Inter-College Codefests",
          "Startup Weekend Competitions",
        ],
        faqs: [
          { q: "Can we collect GitHub links and portfolio URLs on the form?", a: "Yes. You can add custom URL and text fields to review applicants' technical experience." },
          { q: "How do we handle late-night re-entry for hackers stepping outside?", a: "Staff scan the hacker's pass to verify identity and re-entry authorization at any hour of the night." },
          { q: "Can we issue different passes for mentors, judges, and hackers?", a: "Yes. You can configure distinct pass tiers with visual badge pills for Hackers, Mentors, Judges, and Organizers." },
          { q: "Is URPASS free for student hackathons?", a: "Yes. You can run hackathons with up to 100 participants completely free on our permanent free tier." },
        ],
        ctaTitle: "Streamline your event check-in with URPASS",
        ctaDescription: "Permanent free tier · Zero app downloads · Fast sub-second scanning",
      }}
    />
  );
}
