import React from "react";
import Link from "next/link";
import { Ticket, ShieldCheck, Zap, Mail, ArrowRight, ExternalLink } from "lucide-react";
import { InstagramIcon, YoutubeIcon, SOCIAL_LINKS } from "@/components/landing/SocialIcons";

export default function ExploreFooter() {
  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-14 pb-10 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Attendee Reassurance Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-10 mb-10 border-b border-neutral-800/80">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/60">
            <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-tight">Instant QR Delivery</p>
              <p className="text-[11px] text-neutral-400 leading-snug mt-0.5">
                Passes issued to email and SMS immediately after confirmation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/60">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-tight">Verified Organizers</p>
              <p className="text-[11px] text-neutral-400 leading-snug mt-0.5">
                Every conference, college fest, and creator is authenticated.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/60">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-tight">Guest-First Entry</p>
              <p className="text-[11px] text-neutral-400 leading-snug mt-0.5">
                Sub-0.3s gate scan. No mandatory apps or spam notifications.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/60">
            <div className="w-8 h-8 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-tight">Direct Support &amp; Refunds</p>
              <p className="text-[11px] text-neutral-400 leading-snug mt-0.5">
                Clear organizer refund terms with assisted support anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Column */}
          <div className="space-y-3.5 md:col-span-1">
            <Link href="/explore" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-xs">
                <Ticket className="w-3.5 h-3.5 -rotate-12" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                UrPass <span className="text-violet-400 font-semibold text-sm">Explore</span>
              </span>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Discover verified conferences, creative workshops, concerts, hackathons, and community gatherings across India.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="UrPass Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="UrPass YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://yespstudio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-neutral-400 hover:text-white inline-flex items-center gap-1 transition-colors"
              >
                <span>Yesp Corporation</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Popular Cities */}
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-wider mb-3">Popular Cities</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/explore/bangalore" className="text-neutral-400 hover:text-white transition-colors">
                  Events in Bengaluru
                </Link>
              </li>
              <li>
                <Link href="/explore/chennai" className="text-neutral-400 hover:text-white transition-colors">
                  Events in Chennai
                </Link>
              </li>
              <li>
                <Link href="/explore/mumbai" className="text-neutral-400 hover:text-white transition-colors">
                  Events in Mumbai
                </Link>
              </li>
              <li>
                <Link href="/explore/hyderabad" className="text-neutral-400 hover:text-white transition-colors">
                  Events in Hyderabad
                </Link>
              </li>
              <li>
                <Link href="/explore/delhi-ncr" className="text-neutral-400 hover:text-white transition-colors">
                  Events in Delhi NCR
                </Link>
              </li>
            </ul>
          </div>

          {/* Attendee Help & Policies */}
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-wider mb-3">Attendee Help</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/terms" className="text-neutral-400 hover:text-white transition-colors">
                  Ticketing &amp; Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-neutral-400 hover:text-white transition-colors">
                  Guest Privacy &amp; Data Security
                </Link>
              </li>
              <li>
                <Link href="/contact?subject=Explore%20Support" className="text-neutral-400 hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <a href="mailto:support@yespstudio.com" className="text-neutral-400 hover:text-white transition-colors">
                  support@yespstudio.com
                </a>
              </li>
            </ul>
          </div>

          {/* For Event Organizers */}
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-wider mb-3">For Event Hosts</p>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">
              Organizing a conference, college fest, or meetup? Publish for free with 0% platform fee.
            </p>
            <div className="space-y-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors"
              >
                <span>Publish on Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <div>
                <Link
                  href="/"
                  className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors inline-block"
                >
                  Switch to Organizer OS →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Notice */}
        <div className="pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <p>© 2026 Yesp Corporation. UrPass is a registered product of Yesp Corporation.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-neutral-300 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-neutral-300 transition-colors">
              Privacy
            </Link>
            <Link href="/contact" className="hover:text-neutral-300 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
