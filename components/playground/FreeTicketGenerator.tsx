"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  Sparkles,
  Download,
  Calendar,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Layers,
  Palette,
  User,
  Ticket,
} from "lucide-react";

const COLOR_PRESETS = [
  { name: "Royal Violet", hex: "#6D28D9" },
  { name: "Emerald Tech", hex: "#059669" },
  { name: "Electric Blue", hex: "#2563EB" },
  { name: "Crimson Rose", hex: "#E11D48" },
  { name: "Amber Gold", hex: "#D97706" },
  { name: "Obsidian Dark", hex: "#18181B" },
];

export default function FreeTicketGenerator() {
  const [eventName, setEventName] = useState("DevSummit 2026");
  const [attendeeName, setAttendeeName] = useState("Alex Rivera");
  const [ticketTier, setTicketTier] = useState("VIP ALL-ACCESS");
  const [venue, setVenue] = useState("Main Convention Center");
  const [eventDate, setEventDate] = useState("Saturday, Oct 24, 2026");
  const [brandColor, setBrandColor] = useState("#6D28D9");
  const [downloading, setDownloading] = useState(false);

  const qrRef = useRef<HTMLDivElement>(null);
  const ticketRef = useRef<HTMLDivElement>(null);

  // Generate dynamic QR payload preview
  const qrPayload = `https://urpass.space/verify?token=demo-${encodeURIComponent(
    eventName.toLowerCase().replace(/\s+/g, "-")
  )}-${Date.now().toString(36)}`;

  function handleDownloadQR() {
    setDownloading(true);
    try {
      const svg = qrRef.current?.querySelector("svg");
      if (!svg) return;

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      canvas.width = 400;
      canvas.height = 400;

      img.onload = () => {
        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, 400, 400);
          ctx.drawImage(img, 20, 20, 360, 360);
          const pngFile = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.download = `${eventName.toLowerCase().replace(/\s+/g, "-")}-qr-pass.png`;
          downloadLink.href = pngFile;
          downloadLink.click();
        }
        setDownloading(false);
      };

      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    } catch (err) {
      console.error("Download failed:", err);
      setDownloading(false);
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden">
      {/* Top Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Interactive Ticket Studio Playground
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Create & Preview Your Digital QR Pass in Real Time
            </h2>
            <p className="text-neutral-300 text-xs sm:text-sm mt-1">
              Customize attendee tickets, test scannable QR generation, and launch your free event in seconds.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls (Left) & Live Pass Render (Right) */}
      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Event Name
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. AI Founder Summit"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Attendee Name
              </label>
              <input
                type="text"
                value={attendeeName}
                onChange={(e) => setAttendeeName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Ticket Tier / Class
              </label>
              <input
                type="text"
                value={ticketTier}
                onChange={(e) => setTicketTier(e.target.value)}
                placeholder="e.g. VIP Pass / General"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Venue Location
              </label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Grand Ballroom / Online"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Event Date & Time
              </label>
              <input
                type="text"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                placeholder="e.g. Oct 24, 2026 • 10:00 AM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Color Presets */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
              Brand Accent Color
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => setBrandColor(color.hex)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    brandColor === color.hex
                      ? "border-neutral-900 bg-neutral-900 text-white shadow-xs"
                      : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-black/10"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Value Callout Box */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-600 space-y-1.5">
            <div className="flex items-center gap-2 text-neutral-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cryptographic Anti-Duplicate Scanning Included</span>
            </div>
            <p className="text-[11px] text-neutral-500">
              When attendees register on URPASS, each pass is automatically issued with a unique, cryptographically signed UUID. Gate volunteers scan them in &lt;0.3s with smartphone cameras without installing apps.
            </p>
          </div>
        </div>

        {/* Right Live Pass Render (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 text-center">
            Live Ticket Preview
          </p>

          {/* Rendered Ticket Card */}
          <div
            ref={ticketRef}
            className="w-full max-w-xs bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden text-center relative select-none"
            style={{
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.15)",
            }}
          >
            {/* Top Color Accent Strip */}
            <div className="h-3 w-full" style={{ backgroundColor: brandColor }} />

            <div className="p-6 flex flex-col items-center">
              {/* Event Name */}
              <h4 className="text-base font-black text-neutral-900 tracking-tight leading-tight max-w-[220px]">
                {eventName || "Untitled Event"}
              </h4>

              {/* Tier Badge */}
              <span
                className="mt-2 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: brandColor }}
              >
                {ticketTier || "GENERAL PASS"}
              </span>

              {/* Attendee Name */}
              <div className="mt-4 flex items-center justify-center gap-1.5 text-neutral-800">
                <User className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-sm font-bold">{attendeeName || "Attendee Name"}</span>
              </div>

              {/* Live Scannable QR Code */}
              <div
                ref={qrRef}
                className="mt-4 p-3 bg-white rounded-2xl border border-neutral-200/90 shadow-xs inline-block"
              >
                <QRCodeSVG
                  value={qrPayload}
                  size={150}
                  level="M"
                  includeMargin={false}
                  fgColor="#111827"
                  bgColor="#ffffff"
                />
              </div>

              {/* Ticket ID */}
              <p className="mt-2 text-[10px] font-mono text-neutral-400 tracking-wider">
                PASS ID: #URP-{Math.floor(1000 + Math.random() * 9000)}
              </p>

              {/* Date & Venue */}
              <div className="mt-4 pt-3 border-t border-neutral-100 w-full space-y-1 text-[11px] text-neutral-500">
                <p className="flex items-center justify-center gap-1 font-medium">
                  <Calendar className="w-3 h-3 text-neutral-400" />
                  <span>{eventDate}</span>
                </p>
                <p className="flex items-center justify-center gap-1 truncate max-w-[240px]">
                  <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                  <span className="truncate">{venue}</span>
                </p>
              </div>

              {/* Pass Status Strip */}
              <div className="mt-4 w-full py-1.5 px-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Valid for Single Entry</span>
              </div>
            </div>
          </div>

          {/* Actions & Next Steps */}
          <div className="w-full max-w-xs mt-4 space-y-2.5">
            <button
              onClick={handleDownloadQR}
              disabled={downloading}
              className="w-full py-2.5 px-4 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? "Preparing PNG..." : "Download QR Code PNG"}</span>
            </button>

            <Link
              href={`/signup?ref=qr-generator&eventName=${encodeURIComponent(eventName)}`}
              className="w-full py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-all shadow-md group cursor-pointer"
            >
              <span>Publish This Event Free</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-[10px] text-center text-neutral-400">
              ₹0 to start · Up to 100 free registrations/mo · No credit card
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
