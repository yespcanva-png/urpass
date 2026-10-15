import React from "react";
import Link from "next/link";
import { InstagramIcon, YoutubeIcon, SOCIAL_LINKS } from "./SocialIcons";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300 px-5 sm:px-8 pt-16 pb-12 border-t border-neutral-800/80">
      <div className="max-w-6xl mx-auto">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-14">
          {/* Brand & Socials Column (Spans 2 columns on large screens) */}
          <div className="sm:col-span-2 lg:col-span-2 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <span className="font-bold text-xl tracking-tight text-white">URPASS</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2.5 py-0.5 rounded-full">
                  Event OS
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mb-4">
                URPASS by Yesp Corporation is the all-in-one event registration, digital ticketing, and sub-second QR check-in platform built for modern organizers, conferences, and colleges worldwide.
              </p>
              
              <div className="mb-6">
                <a
                  href="https://yespstudio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <span>Product of</span>
                  <span className="text-white underline decoration-neutral-600 underline-offset-2">Yesp Corporation ↗</span>
                </a>
              </div>

              {/* Social Channels */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 hover:bg-neutral-850 transition-all text-xs font-medium group"
                  aria-label="Follow URPASS on Instagram"
                >
                  <InstagramIcon className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform" />
                  <span>Instagram</span>
                </a>

                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 hover:bg-neutral-850 transition-all text-xs font-medium group"
                  aria-label="Subscribe to URPASS on YouTube"
                >
                  <YoutubeIcon className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                  <span>YouTube</span>
                </a>
              </div>

              {/* Newsletter Subscription */}
              <div className="max-w-sm">
                <p className="text-xs font-semibold text-white tracking-wider uppercase mb-2">Stay in the Loop</p>
                <NewsletterForm />
              </div>
            </div>

            <div className="pt-5 border-t border-neutral-900 flex items-center gap-2 text-[11px] text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational · Sub-Second Cloud Infrastructure</span>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <p className="text-xs font-semibold text-white tracking-wider uppercase mb-4">Product</p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/features" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Features Overview
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Pricing &amp; Plans
                </Link>
              </li>
              <li>
                <Link href="/ticket-templates" className="text-xs text-violet-300 hover:text-white font-medium transition-colors flex items-center gap-1.5">
                  <span>Ticket Templates</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-violet-500/30 text-violet-200">New</span>
                </Link>
              </li>
              <li>
                <Link href="/mcp-event-management" className="text-xs text-purple-300 hover:text-white transition-colors flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  Model Context Protocol
                </Link>
              </li>
              <li>
                <Link href="/developers" className="text-xs text-violet-300 hover:text-white font-medium transition-colors flex items-center gap-1.5">
                  <span>Developer API &amp; EIaaS</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-violet-500/30 text-violet-200">API</span>
                </Link>
              </li>
              <li>
                <Link href="/qr-code-ticketing-system" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  QR Ticketing System
                </Link>
              </li>
              <li>
                <Link href="/qr-code-scanner" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Browser QR Scanner
                </Link>
              </li>
              <li>
                <Link href="/event-analytics" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Real-time Analytics
                </Link>
              </li>
              <li>
                <Link href="/digital-event-pass" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Digital Pass Designer
                </Link>
              </li>
              <li>
                <Link href="/free-event-registration" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Free Event Software
                </Link>
              </li>
              <li>
                <Link href="/founder-lifetime-deal" className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  Founder Deal
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Security &amp; Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions & Services Column */}
          <div>
            <p className="text-xs font-semibold text-white tracking-wider uppercase mb-4">Solutions &amp; Services</p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/managed-setup" className="text-xs text-violet-300 hover:text-white font-medium transition-colors flex items-center gap-1.5">
                  <span>Managed Event Setup</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-violet-500/30 text-violet-200">Service</span>
                </Link>
              </li>
              <li>
                <Link href="/ticketing-software-for-events" className="text-xs text-neutral-300 hover:text-white font-medium transition-colors">
                  Ticketing Software for Events
                </Link>
              </li>
              <li>
                <Link href="/college-event-management-software" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  College Event Management
                </Link>
              </li>
              <li>
                <Link href="/college-fests" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  College Fests &amp; Culturals
                </Link>
              </li>
              <li>
                <Link href="/hackathons" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Hackathons &amp; Buildathons
                </Link>
              </li>
              <li>
                <Link href="/conferences" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Tech Conferences
                </Link>
              </li>
              <li>
                <Link href="/workshops" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Workshops &amp; Seminars
                </Link>
              </li>
              <li>
                <Link href="/corporate-events" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Corporate Summits
                </Link>
              </li>
              <li>
                <Link href="/session-qr-check-in" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Session Access Control
                </Link>
              </li>
              <li>
                <Link href="/community-events" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Community Meetups
                </Link>
              </li>
            </ul>
          </div>

          {/* Regional Hubs & Resources Column */}
          <div>
            <p className="text-xs font-semibold text-white tracking-wider uppercase mb-4">Hubs &amp; Resources</p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/in" className="text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>India Hub (₹ UPI &amp; Razorpay)</span>
                </Link>
              </li>
              <li>
                <Link href="/uk" className="text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span>UK Hub (£ 0% Commission)</span>
                </Link>
              </li>
              <li>
                <Link href="/in/bangalore" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Bangalore Tech Events
                </Link>
              </li>
              <li>
                <Link href="/in/mumbai" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Mumbai &amp; Pune Events
                </Link>
              </li>
              <li>
                <Link href="/uk/london" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  London &amp; UK Universities
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Organizer Guides
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Platform Comparisons
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Knowledge Base &amp; FAQ
                </Link>
              </li>
              <li>
                <Link href="/sitelinks" className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                  Explore All Sitelinks →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span>&copy; 2026 URPASS. Built with precision for organizers.</span>
            <span className="hidden sm:inline">·</span>
            <span className="flex items-center gap-1.5">
              <span>Markets:</span>
              <Link href="/in" className="text-neutral-400 hover:text-white transition-colors underline-offset-2 hover:underline">
                India (₹)
              </Link>
              <span>·</span>
              <Link href="/uk" className="text-neutral-400 hover:text-white transition-colors underline-offset-2 hover:underline">
                United Kingdom (£)
              </Link>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-5 gap-y-2">
            <Link href="/about" className="hover:text-neutral-300 transition-colors">
              About
            </Link>
            <Link href="/brand" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
              Brand Kit
            </Link>
            <Link href="/support" className="hover:text-neutral-300 transition-colors">
              Support
            </Link>
            <Link href="/status" className="hover:text-neutral-300 transition-colors flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Status
            </Link>
            <Link href="/docs" className="hover:text-neutral-300 transition-colors">
              Documentation
            </Link>
            <Link href="/developers" className="text-violet-300 hover:text-white transition-colors">
              Developers (EIaaS)
            </Link>
            <Link href="/terms" className="hover:text-neutral-300 transition-colors">
              Terms &amp; Privacy
            </Link>
            <Link href="/contact" className="hover:text-neutral-300 transition-colors">
              Contact
            </Link>
          </div>
        </div>

        {/* Contextual Entity Line */}
        <div className="mt-6 pt-4 border-t border-neutral-900/60 text-center text-[11px] text-neutral-600">
          <p>URPASS is an event technology platform engineered and operated by Yesp Corporation.</p>
        </div>
      </div>
    </footer>
  );
}
