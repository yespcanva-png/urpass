import React from "react";
import Link from "next/link";
import { InstagramIcon, YoutubeIcon, SOCIAL_LINKS } from "./SocialIcons";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300 px-5 sm:px-8 pt-16 pb-12 border-t border-neutral-800/80">
      <div className="max-w-6xl mx-auto">
        {/* Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-14">
          {/* Brand & Socials Column */}
          <div className="col-span-2 md:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-lg tracking-tight text-white">URPASS</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-brand/20 text-brand-300 border border-brand/30 px-2 py-0.5 rounded-full">
                  Event OS
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mb-6">
                Fast digital event passes, custom ticket designer, and lightning QR check-in. Built for colleges, tech conferences, hackathons, and organizers across India and worldwide.
              </p>

              {/* Social Channels */}
              <div className="flex items-center gap-3">
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
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-900 flex items-center gap-2 text-[11px] text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational &middot; 99.9% Check-in Uptime</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <p className="text-xs font-semibold text-white tracking-wider uppercase mb-4">Product</p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/pricing" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Pricing & Plans
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
            </ul>
          </div>

          {/* Solutions Links */}
          <div>
            <p className="text-xs font-semibold text-white tracking-wider uppercase mb-4">Solutions</p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/college-fests" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  College Fests & Culturals
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
                <Link href="/community-events" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Community Meetups
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations & Sitelinks */}
          <div>
            <p className="text-xs font-semibold text-white tracking-wider uppercase mb-4">Cities & More</p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/in" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Events in India (Hub)
                </Link>
              </li>
              <li>
                <Link href="/in/bangalore" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Bangalore Tech Events
                </Link>
              </li>
              <li>
                <Link href="/in/chennai" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Chennai Colleges & Fests
                </Link>
              </li>
              <li>
                <Link href="/in/coimbatore" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Coimbatore Events
                </Link>
              </li>
              <li>
                <Link href="/in/mumbai" className="text-xs text-neutral-400 hover:text-white transition-colors">
                  Mumbai & Pune Events
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
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <span>&copy; 2026 URPASS. Built with precision for organizers.</span>
            <span>&middot;</span>
            <span className="hidden sm:inline">Made in India</span>
          </div>

          <div className="flex items-center gap-5 text-xs text-neutral-500">
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
      </div>
    </footer>
  );
}
