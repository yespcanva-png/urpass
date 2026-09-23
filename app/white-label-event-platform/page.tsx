import type { Metadata } from "next";
import { Globe, Palette, Sparkles, ShieldCheck, Ticket, Layers, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "White Label Event Management Platform | URPASS",
  description: "Create branded event registration, digital passes and attendee experiences with URPASS.",
  keywords: [
    "white label event platform",
    "branded event registration",
    "custom domain event ticketing",
    "white label ticketing platform",
    "white label event software",
    "branded digital event pass",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/white-label-event-platform" },
  openGraph: {
    title: "White Label Event Management Platform | URPASS",
    description: "Create branded event registration, digital passes and attendee experiences with URPASS.",
    url: "https://urpass.space/white-label-event-platform",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "WHITE LABEL EVENT PLATFORM",
        h1: "Your Event. Your Brand.",
        canonicalUrl: "https://urpass.space/white-label-event-platform",
        description: "Build a consistent branded attendee journey across registration, passes and event-day experiences.",
        ctaLabel: "Explore White Label",
        features: [
          { icon: Globe, title: "Custom Domain Integration", desc: "Host your registration portal directly on your own branded domain (e.g. events.yourcompany.com) with automatic SSL encryption." },
          { icon: Palette, title: "Custom Palette & Typography", desc: "Match your company's exact hex colors, corporate logos, background banners, and button styling across all screens." },
          { icon: Ticket, title: "Fully Branded Digital Passes", desc: "Design bespoke digital passes with custom badges, sponsor placements, social links, and Apple Wallet pass styling." },
          { icon: Sparkles, title: "Zero Competitor Advertisements", desc: "Unlike ticketing aggregators that advertise competitor events on your page, URPASS keeps 100% of the spotlight on your event." },
          { icon: ShieldCheck, title: "Whitelabeled Pass Scanner", desc: "Even the gate check-in interface carries your brand mark and colors, projecting professional polish to door staff and VIP guests." },
          { icon: Lock, title: "Dedicated Data Ownership", desc: "You maintain 100% ownership of your attendee relationships. We never solicit or market to your registered participants." },
        ],
        steps: [
          { n: "01", title: "Connect Domain", desc: "Add a simple CNAME record to point events.yourbrand.com to URPASS." },
          { n: "02", title: "Upload Brand Assets", desc: "Add your high-resolution logos, brand color palette, and header banners." },
          { n: "03", title: "Customize Pass Design", desc: "Configure your digital pass layout, typography, and sponsor showcase blocks." },
          { n: "04", title: "Launch Registration", desc: "Share your clean, custom-domain link with prospective attendees." },
          { n: "05", title: "Deliver Branded Gate Entry", desc: "Welcome guests with a branded mobile check-in experience at the entrance." },
        ],
        callout: {
          badge: "UNCOMPROMISING IDENTITY",
          title: "Stop sending high-value attendees to third-party marketplaces.",
          description: "When you use legacy ticketing marketplaces, your attendees are bombarded with competitor event banners, third-party marketing emails, and confusing checkout redirects. URPASS gives you full control over the attendee experience with white-label perfection from first click to venue entry.",
          bullets: [
            "Seamless custom domain hosting with automatic SSL certification",
            "Zero third-party marketplace logos or competitor event recommendations",
            "Customizable digital mobile passes compatible with Apple Wallet",
            "Full attendee data privacy — your guest list is never re-marketed to",
          ],
        },
        deepDiveSections: [
          {
            badge: "BRAND PRESERVATION",
            title: "Why Marketplace Platforms Dilute Your Event Brand",
            paragraphs: [
              "Public ticketing aggregators are built around marketplace models. When an organizer drives traffic to an aggregator, the platform uses that traffic to promote other events, capture attendee emails for their own marketing newsletters, and charge hefty service fees.",
              "For luxury brands, enterprise software companies, private member networks, and prestigious academic institutions, this marketplace experience looks cheap and unprofessional. Attendees wonder why an enterprise conference is hosted on a general consumer ticketing portal.",
              "A white-label platform reclaims your brand authority. Attendees interact exclusively with your domain, your visual identity, and your communications. The technology powers the experience silently in the background, keeping your organization front and center."
            ],
            bullets: [
              "Keeps high-value traffic on your own domain rather than third-party portals",
              "Protects attendee contact information from third-party advertising algorithms",
              "Eliminates confusing marketplace checkout redirects and account creation hurdles",
              "Reinforces brand prestige and credibility from the first impression"
            ],
            takeaway: "Maintain complete ownership of your attendee journey, digital credentials, and customer data by hosting on your own white-label event platform."
          },
          {
            badge: "CREDENTIAL DESIGN",
            title: "Custom Domains, Apple Wallet Integration, and Digital Prestige",
            paragraphs: [
              "Your attendee's event credential is the most viewed asset in your entire operational workflow. Attendees look at it when registering, check it when preparing to leave, show it at the door, and frequently share screenshots of it on LinkedIn and social media.",
              "With URPASS, your digital pass is an extension of your creative brand. You can configure custom accent gradients, showcase headline sponsor logos, display VIP status badges, and enable Apple Wallet storage with your brand icon appearing directly on the user's lock screen.",
              "When attendees share their ticket passes online, they are sharing your brand identity, turning every attendee pass into an organic marketing asset for your organization."
            ],
            bullets: [
              "Add to Apple Wallet support with branded pass colors and lock screen notifications",
              "Dynamic sponsor banner spaces generating measurable sponsorship ROI",
              "High-contrast QR code styling with generous quiet zones for sub-0.3s scanning",
              "Social sharing optimization with branded Open Graph preview cards"
            ],
            takeaway: "Transform ordinary event passes into high-impact brand ambassadors that attendees proudly display and share across social networks."
          }
        ],
        useCases: [
          "Enterprise Customer Summits",
          "Luxury Brand Product Launches",
          "Private Member Clubs & Networks",
          "Flagship University & College Festivals",
          "Venture Capital & Investor Demo Days",
          "Premier Tech & Developer Conferences",
          "High-Profile Gala Dinners & Award Nights",
        ],
        relatedLinks: [
          { title: "Enterprise Event Management", href: "/enterprise-event-management", category: "Product" },
          { title: "Custom Pass Designer", href: "/design-your-ticket", category: "Product" },
          { title: "Corporate Event Management", href: "/corporate-event-management", category: "Product" },
          { title: "Event Registration Platform", href: "/event-registration-platform", category: "Product" },
          { title: "Eventbrite Alternative for India", href: "/compare/eventbrite-alternative", category: "Comparison" },
          { title: "Event Software Delhi NCR", href: "/in/delhi", category: "Location" },
        ],
        faqs: [
          { q: "What is a white-label event platform?", a: "A white-label event platform allows organizers to host event registration, ticket sales, digital passes, and door scanning entirely under their own brand identity and custom domain, with no third-party marketplace logos or competitor ads." },
          { q: "Can I use my own custom domain (e.g. events.mycompany.com)?", a: "Yes. On eligible plans, you can connect your custom subdomain via a simple DNS CNAME record. URPASS automatically provisions and manages an SSL certificate for secure HTTPS access." },
          { q: "Can attendees save the branded pass to Apple Wallet?", a: "Yes. URPASS digital event passes include native 'Add to Apple Wallet' support, displaying your custom logo, event colors, and scannable QR code directly inside Apple Wallet on iOS devices." },
          { q: "Does URPASS display competitor events on my registration page?", a: "Never. Unlike public ticketing marketplaces that display 'Other events you may like' from your competitors, URPASS provides standalone event pages dedicated 100% to your event." },
          { q: "Do you market to or send promotional emails to our attendees?", a: "No. You maintain 100% data ownership. We never sell, solicit, or send marketing emails to your registered attendees." },
          { q: "Can we customize the check-in scanner interface for door staff?", a: "Yes. The browser-based scanner interface reflects your event name and branding, providing a cohesive, professional experience for volunteers, guards, and attendees alike." },
        ],
        ctaTitle: "Build your white-label event platform today",
        ctaDescription: "Custom domain · Branded passes · Zero marketplace ads · 30-day free trial",
      }}
    />
  );
}
