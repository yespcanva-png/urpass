import type { Metadata } from "next";
import {
  Globe2,
  Lock,
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Custom Domain Event Ticketing & White-Label Portals (CNAME) — URPASS",
  description:
    "Host your event ticketing pages, digital pass portals, and attendee verification gates on your own branded domain (events.yourcompany.com). Automated SSL, CNAME routing, and complete white-label branding.",
  keywords: [
    "custom domain event ticketing",
    "white label event ticketing platform",
    "branded event portal CNAME",
    "custom URL event passes",
    "white label QR check in",
    "custom domain event registration",
    "URPASS custom domain",
  ],
  alternates: { canonical: "https://urpass.space/custom-domain-event-ticketing" },
  openGraph: {
    title: "Custom Domain Event Ticketing & White-Label Portals | URPASS",
    description:
      "Run your event registration and ticketing on your company subdomain with automated SSL certificate provisioning and zero vendor branding.",
    url: "https://urpass.space/custom-domain-event-ticketing",
    type: "website",
  },
};

export default function CustomDomainEventTicketingPage() {
  return (
    <SEOPage
      config={{
        badge: "BRANDED PORTALS · CUSTOM CNAME",
        h1: "Custom Domain Event Ticketing & White-Label Portals (CNAME)",
        canonicalUrl: "https://urpass.space/custom-domain-event-ticketing",
        description:
          "Provide attendees and delegates with a seamless, fully branded ticketing experience. Connect your custom subdomain (e.g. events.acmecorp.com or fest.university.edu) to URPASS with automated SSL certificate provisioning and zero third-party branding.",
        ctaLabel: "Connect your Custom Domain",

        directAnswer: {
          title: "How Does Custom Domain Event Ticketing Work?",
          summary:
            "Custom domain event ticketing allows organizations to host registration landing pages, payment checkouts, digital passes, and check-in portals directly on their own corporate subdomain (such as events.yourcompany.com). By adding a single DNS CNAME record pointing to cname.urpass.in, URPASS automatically provisions high-speed edge routing and issues an automated TLS/SSL certificate with zero downtime.",
          keyPoints: [
            "Point any subdomain (e.g., events, tickets, summits) to cname.urpass.in via DNS CNAME",
            "Automated SSL/TLS certificate issuance and seamless 90-day renewal cycle",
            "Eliminate third-party vendor URLs and strengthen corporate brand trust and SEO authority",
            "Seamlessly integrates with Enterprise SSO (SAML 2.0 / OIDC) and Razorpay payment gateways",
          ],
        },

        keyFactsTable: {
          title: "Custom Domain & Edge Routing Specifications",
          subtitle: "Technical architecture powering white-label enterprise event portals.",
          headers: ["Architecture Layer", "URPASS Implementation", "Enterprise Benefit"],
          rows: [
            {
              col1: "DNS Routing",
              col2: "CNAME alias targeting cname.urpass.in",
              col3: "Works with Cloudflare, AWS Route 53, GoDaddy, and Google Cloud DNS",
            },
            {
              col1: "SSL / TLS Encryption",
              col2: "Automated Let's Encrypt / DigiCert wildcard edge certificates",
              col3: "Zero manual certificate generation or maintenance required",
            },
            {
              col1: "Branding Isolation",
              col2: "Full white-label option removing vendor footprints from attendee view",
              col3: "Strengthens institutional credibility and attendee conversion rates",
            },
            {
              col1: "Custom Email Domain",
              col2: "DKIM, SPF, and DMARC verified outbound transactional relays",
              col3: "High deliverability directly from tickets@yourcompany.com",
            },
            {
              col1: "Global CDN Edge",
              col2: "Anycast edge caching across 285+ cities globally",
              col3: "<50ms page load times for international event registrants",
            },
          ],
        },

        features: [
          {
            icon: Globe2,
            title: "Your Subdomain, Your Brand",
            desc: "Register events.acmecorp.com or passes.university.edu to preserve brand consistency.",
          },
          {
            icon: Lock,
            title: "Automated SSL Certificates",
            desc: "Edge proxies automatically provision and renew TLS certificates with 100% uptime.",
          },
          {
            icon: Sparkles,
            title: "White-Label Experience",
            desc: "Custom logos, typography, brand colors, and removal of third-party platform badges.",
          },
          {
            icon: Zap,
            title: "Sub-Second Global Edge",
            desc: "Distributed CDN edge routing ensures lightning-fast pass downloads and door scans.",
          },
          {
            icon: ShieldCheck,
            title: "Verified DNS Ownership",
            desc: "Guarantees domain security with DNS TXT and CNAME verification before going live.",
          },
          {
            icon: Layers,
            title: "Custom DKIM Email Relays",
            desc: "Send confirmation tickets and Apple Wallet passes directly from your corporate domain.",
          },
        ],

        callout: {
          badge: "DNS INSTRUCTIONS",
          title: "Simple 2-minute DNS CNAME setup.",
          description:
            "Log in to your DNS provider (Cloudflare, AWS Route 53, GoDaddy, Namecheap) and add a CNAME record:",
          bullets: [
            "Record Type: CNAME",
            "Host / Name: events (or your desired subdomain)",
            "Target / Points to: cname.urpass.in",
            "TTL: Auto or 300 seconds",
          ],
        },

        useCases: [
          "Annual flagship technology conferences and developer summits",
          "University campus portals for cultural and technical fests",
          "Corporate event marketing teams driving SEO authority to their primary domain",
          "High-end trade expos and private executive roundtables",
          "Event production agencies white-labeling ticketing for corporate clients",
        ],

        relatedLinks: [
          {
            title: "White-Label Event Platform",
            href: "/white-label-event-platform",
            category: "Product",
          },
          {
            title: "Branded Event Tickets & Passes",
            href: "/branded-event-tickets",
            category: "Product",
          },
          {
            title: "Enterprise SSO Integration",
            href: "/enterprise-sso-event-ticketing",
            category: "Product",
          },
          {
            title: "Event Security & Compliance",
            href: "/event-security-compliance",
            category: "Product",
          },
          {
            title: "Developer Documentation: Custom Domains",
            href: "/docs#enterprise-identity",
            category: "Guide",
          },
        ],

        faqs: [
          {
            q: "Can I use my existing company domain for URPASS events?",
            a: "Yes. You can use any subdomain of your primary domain, such as events.company.com, tickets.company.com, or summit.brand.com.",
          },
          {
            q: "Do I need to purchase an SSL certificate?",
            a: "No. URPASS edge proxies automatically issue and maintain free SSL/TLS certificates with automated renewals, ensuring HTTPS encryption across all pages.",
          },
          {
            q: "How long does custom domain DNS verification take?",
            a: "DNS propagation usually takes between 2 to 15 minutes depending on your DNS provider. Once you add the CNAME record, click 'Verify CNAME' in your Security settings to activate it immediately.",
          },
          {
            q: "Does custom domain support payment gateways like Razorpay?",
            a: "Yes. All ticket checkouts, UPI payments, and receipt generation work seamlessly under your custom domain.",
          },
        ],

        ctaTitle: "Launch your white-label event portal today",
        ctaDescription: "Connect your CNAME in minutes · Automated SSL · Enterprise tier",
      }}
    />
  );
}
