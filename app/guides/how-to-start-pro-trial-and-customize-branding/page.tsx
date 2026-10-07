import type { Metadata } from "next";
import { Palette, Sparkles, ShieldCheck, Ticket, EyeOff, Upload, CheckCircle2, Crown } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "How to Start Pro Free Trial & Customize Ticket Branding | URPASS Guide",
  description: "Learn how to activate the 30-Day Pro Free Trial (£0 / ₹0) on URPASS and customize organization branding, upload logos, set brand palettes, and hide 'Powered by URPASS' watermarks.",
  keywords: [
    "pro trial branding guide",
    "how to start pro trial urpass",
    "custom ticket branding",
    "remove powered by urpass",
    "white label event ticketing",
    "custom brand colors event passes",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/guides/how-to-start-pro-trial-and-customize-branding" },
  openGraph: {
    title: "How to Start Pro Free Trial & Customize Ticket Branding | URPASS",
    description: "Step-by-step guide to unlocking full custom branding with the 30-Day Pro Free Trial on URPASS.",
    url: "https://urpass.space/guides/how-to-start-pro-trial-and-customize-branding",
    locale: "en_IN",
    type: "article",
  },
};

export default function ProTrialBrandingGuidePage() {
  return (
    <SEOPage
      config={{
        badge: "PRO TRIAL & BRANDING GUIDE",
        h1: "How to Start the Pro Free Trial & Customize Ticket Branding",
        canonicalUrl: "https://urpass.space/guides/how-to-start-pro-trial-and-customize-branding",
        description: "Unlock full white-label branding, custom event logos, hex color palettes, and visual Ticket Studio design with a 1-click 30-Day Pro Free Trial on URPASS.",
        ctaLabel: "Start 30-day Pro trial free",
        features: [
          { icon: Crown, title: "30-Day Free Pro Trial", desc: "Instantly activate 30 days of full Pro access with £0 / ₹0 upfront payment and zero risk." },
          { icon: EyeOff, title: "100% White-Label Passes", desc: "Remove the 'Powered by URPASS' badge across all registration pages, emails, and attendee QR passes." },
          { icon: Upload, title: "Custom Organization & Event Logos", desc: "Upload high-resolution logos that appear prominently on the digital pass and signup portals." },
          { icon: Palette, title: "Custom Brand Hex Palettes", desc: "Select curated swatches or input your brand's exact hex color code for unified aesthetics." },
          { icon: Ticket, title: "Visual Ticket Studio", desc: "Access the drag-and-drop Ticket Studio designer with live smartphone previews and custom badges." },
          { icon: ShieldCheck, title: "Instant Entitlement Activation", desc: "All branding, API keys, webhooks, and 2,500 monthly registrations unlock immediately upon trial start." },
        ],
        steps: [
          { n: "01", title: "Navigate to Branding", desc: "Visit Dashboard → Branding (urpass.space/dashboard/branding) or Event Settings → Event & Pass Branding." },
          { n: "02", title: "Click 'Start 30-Day Pro Free Trial'", desc: "Click the 1-click Pro Trial button to open the confirmation modal with £0 / ₹0 upfront." },
          { n: "03", title: "Upload Your Logo", desc: "Upload your company or festival logo via direct image upload or enter an image URL." },
          { n: "04", title: "Select Brand Colors", desc: "Choose an accent preset or enter your custom HEX color code (e.g. #6D28D9)." },
          { n: "05", title: "Toggle White-Label", desc: "Enable 'Hide Powered by URPASS' to deliver clean, 100% white-labeled digital passes." },
        ],
        callout: {
          badge: "UNLIMITED PRESTIGE",
          title: "Deliver professional, branded passes your attendees love.",
          description: "Whether you're organizing a corporate tech summit, collegiate festival, or VIP gala, custom branding elevates your event's credibility from the moment participants register to the second they scan their QR pass at the entrance.",
          bullets: [
            "30-day free trial includes full Pro plan entitlements and 2,500 registrations",
            "Event-level branding overrides allow different themes per event",
            "Automatic synchronization with Ticket Studio and email confirmations",
            "Zero hidden fees with seamless cancellation anytime",
          ],
        },
        useCases: [
          "Corporate Tech Summits & Expos",
          "College Culturals & Technical Fests",
          "Academic Seminars & Medical Conferences",
          "VIP Networking Galas & Award Nights",
          "Hackathons & Developer Buildathons",
          "Brand Activations & Product Launches",
        ],
        faqs: [
          { q: "Is the 30-day Pro trial completely free?", a: "Yes. The 30-day Pro trial costs £0 / ₹0 upfront. You get immediate access to all Pro features including custom branding, Ticket Studio, API access, and increased attendee capacity." },
          { q: "Where can I find the Branding option in my dashboard?", a: "You can find Branding in your sidebar under Workspace → Branding (/dashboard/branding), or under Event Settings → Event & Pass Branding for event-specific styling." },
          { q: "Can I use different branding for different events?", a: "Yes. In your Event Settings (/event/[eventId]/settings), you can override your organization default branding with a specific event logo and color palette." },
          { q: "Does the Pro trial require installing any mobile app?", a: "No. URPASS is completely web-based. Passes and scanning operate seamlessly in standard mobile browsers like Chrome and Safari." },
        ],
        ctaTitle: "Elevate your event experience with custom branding",
        ctaDescription: "Start your 30-day Pro free trial today · 100% white-label passes · Sub-second QR check-in",
      }}
    />
  );
}
