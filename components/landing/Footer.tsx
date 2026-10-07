import React from "react";
import Link from "next/link";
import { InstagramIcon, YoutubeIcon, SOCIAL_LINKS } from "./SocialIcons";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300 px-5 sm:px-8 pt-16 pb-12 border-t border-neutral-800/80">
      <div className="max-w-6xl mx-auto">
        {/* Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-14">
          {/* Brand & Socials Column */}
          <div className="col-span-2 md:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-lg tracking-tight text-white">URPASS</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-brand/20 text-brand-300 border border-brand/30 px-2 py-0.5 rounded-full">
                  Event OS
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mb-3">
                URPASS by Yesp Corporation is an event registration, digital ticketing and QR check-in platform built for colleges, conferences, hackathons, businesses and event organizers worldwide.
              </p>
              <div className="mb-5">
                <a
                  href="https://yespstudio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-md transition-colors"
                >
                  <span>Product of</span>
                  <span className="text-white underline decoration-neutral-600 underline-offset-2">Yesp Corporation ↗</span>
                </a>
              </div>

              {/* Social Channels */}
              <div className="flex items-center gap-3 mb-6">
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

            <div className="mt-8 pt-6 border-t border-neutral-900 flex items-center gap-2 text-[11px] text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational · Cloud Infrastructure &amp; Real-Time Sync</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <p className="text-xs font-semibold text-white tracking-wider uppercase mb-4">Product</p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/features" className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                  Features Overview
                </Link>
              </li>
              <li>
                <Link href="/product" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Product Architecture
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Security &amp; Trust
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Pricing &amp; Plans
                </Link>
              </li>
              <li>
                <Link href="/founder-lifetime-deal" className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  Founder Lifetime Deal
                </Link>
              </li>
              <li>
                <Link href="/ticket-templates" className="text-xs text-violet-300 hover:text-white font-medium transition-colors flex items-center gap-1">
                  <span>Ticket Templates</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-violet-500/30 text-violet-200">New</span>
                </Link>
              </li>
              <li>
                <Link href="/design-your-ticket" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Design Your Ticket
                </Link>
              </li>
              <li>
                <Link href="/custom-pass-design" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Custom Pass Design
                </Link>
              </li>
              <li>
                <Link href="/qr-code-ticketing-system" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  QR Ticketing System
                </Link>
              </li>
              <li>
                <Link href="/qr-code-scanner" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  QR Scanner App
                </Link>
              </li>
              <li>
                <Link href="/event-analytics" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Real-time Analytics
                </Link>
              </li>
              <li>
                <Link href="/digital-event-pass" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Digital Pass Maker
                </Link>
              </li>
              <li>
                <Link href="/free-event-registration" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Free Event Software
                </Link>
              </li>
              <li>
                <Link href="/event-badge-printing-software" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Badge Printing Studio
                </Link>
              </li>
              <li>
                <Link href="/onsite-event-registration-software" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Onsite Registration Desk
                </Link>
              </li>
              <li>
                <Link href="/event-zone-access-control-software" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Zone Access Control
                </Link>
              </li>
              <li>
                <Link href="/mcp-event-management" className="text-xs text-purple-300 hover:text-white transition-colors flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  Model Context Protocol (MCP)
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions Links */}
          <div>
            <p className="text-xs font-semibold text-white tracking-wider uppercase mb-4">Solutions</p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/college-event-management-software" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  College Event Management
                </Link>
              </li>
              <li>
                <Link href="/college-fests" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  College Fests & Culturals
                </Link>
              </li>
              <li>
                <Link href="/college-cultural-fest-ticketing" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Cultural Fest Ticketing
                </Link>
              </li>
              <li>
                <Link href="/hackathons" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Hackathons & Buildathons
                </Link>
              </li>
              <li>
                <Link href="/conferences" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Tech Conferences
                </Link>
              </li>
              <li>
                <Link href="/workshops" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Workshops & Masterclasses
                </Link>
              </li>
              <li>
                <Link href="/corporate-events" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Corporate Summits
                </Link>
              </li>
              <li>
                <Link href="/conference-management-software" className="text-xs text-brand-300 hover:text-white transition-colors font-medium">
                  Conference Management
                </Link>
              </li>
              <li>
                <Link href="/event-agenda-builder" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Agenda Builder
                </Link>
              </li>
              <li>
                <Link href="/speaker-management-software" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Speaker Management
                </Link>
              </li>
              <li>
                <Link href="/session-qr-check-in" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Session QR Check-In
                </Link>
              </li>
              <li>
                <Link href="/community-events" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Community Meetups
                </Link>
              </li>
              <li>
                <Link href="/event-lead-retrieval-software" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Lead Retrieval App
                </Link>
              </li>
              <li>
                <Link href="/exhibitor-management-software" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Exhibitor Management
                </Link>
              </li>
              <li>
                <Link href="/event-sponsorship-management-software" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Sponsorship Portal
                </Link>
              </li>
              <li>
                <Link href="/b2b-event-matchmaking-software" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  B2B Matchmaking Scheduler
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations & Regional Markets */}
          <div>
            <p className="text-xs font-semibold text-white tracking-wider uppercase mb-4">Regional Hubs</p>
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
                <Link href="/uk/london" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  London &amp; UK Universities
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
                <Link href="/sitelinks" className="text-xs font-semibold text-brand-300 hover:text-white transition-colors">
                  Explore All Sitelinks →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
            <span>&copy; 2026 URPASS. Built with precision for organizers.</span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <span>Markets:</span>
              <Link href="/in" className="text-neutral-400 hover:text-white transition-colors underline-offset-2 hover:underline">
                India (INR · ₹)
              </Link>
              <span>·</span>
              <Link href="/uk" className="text-neutral-400 hover:text-white transition-colors underline-offset-2 hover:underline">
                United Kingdom (GBP · £)
              </Link>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-neutral-500">
            <Link href="/about" className="hover:text-neutral-300 transition-colors">
              About
            </Link>
            <Link href="/brand" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
              Brand &amp; Media Kit
            </Link>
            <Link href="/support" className="hover:text-neutral-300 transition-colors">
              Support Center
            </Link>
            <Link href="/status" className="hover:text-neutral-300 transition-colors flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Status
            </Link>
            <Link href="/company" className="hover:text-neutral-300 transition-colors">
              Company
            </Link>
            <Link href="/press" className="hover:text-neutral-300 transition-colors">
              Press
            </Link>
            <Link href="/yesp-urpass" className="hover:text-neutral-300 transition-colors">
              Yesp URPASS
            </Link>
            <Link href="/faq" className="hover:text-neutral-300 transition-colors">
              FAQ
            </Link>
            <Link href="/guides" className="hover:text-neutral-300 transition-colors">
              Guides
            </Link>
            <Link href="/compare" className="hover:text-neutral-300 transition-colors">
              Compare
            </Link>
            <Link href="/contact" className="hover:text-neutral-300 transition-colors">
              Contact
            </Link>
            <Link href="/feedback" className="hover:text-neutral-300 transition-colors">
              Feedback
            </Link>
            <Link href="/docs" className="hover:text-neutral-300 transition-colors">
              Documentation
            </Link>
            <Link href="/terms" className="hover:text-neutral-300 transition-colors">
              Terms &amp; Privacy
            </Link>
            <Link href="/sitelinks" className="hover:text-neutral-300 transition-colors">
              Sitelinks
            </Link>
          </div>
        </div>

        {/* Contextual Entity Line */}
        <div className="mt-6 pt-4 border-t border-neutral-900/60 text-center text-[11px] text-neutral-600">
          <p>URPASS is an event technology product developed by Yesp Corporation.</p>
        </div>
      </div>
    </footer>
  );
}
