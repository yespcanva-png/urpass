import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const OUT_DIR = path.resolve("public/screenshots");
const TEMP_DIR = path.resolve("/tmp/urpass-screens");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

// Chrome binary path
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const SCREENS = [
  {
    name: "step1-event-registration",
    title: "1. Public Registration & Instant UPI/Card Checkout",
    url: "https://urpass.space/apply/ai-summit-2026",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Register for AI & Cloud Summit 2026 — UrPass</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0a0a0c; color: #f4f4f5; }
    .mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="p-8 flex items-center justify-center min-h-screen">
  <div class="w-[1100px] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
    <!-- Browser Window Header -->
    <div class="bg-neutral-950 px-5 py-3 border-b border-neutral-800 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
        <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
      </div>
      <div class="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-4 py-1.5 rounded-lg text-xs text-neutral-400 font-mono w-96 justify-center">
        <span class="text-emerald-400">🔒</span>
        <span>urpass.space/apply/ai-summit-2026</span>
      </div>
      <div class="flex items-center gap-2 text-xs font-semibold text-neutral-400">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live Registration
      </div>
    </div>

    <!-- Page Content -->
    <div class="grid grid-cols-12 p-8 gap-8 bg-neutral-900">
      <!-- Left: Event Hero Details -->
      <div class="col-span-5 flex flex-col justify-between border-r border-neutral-800/80 pr-6">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-bold uppercase tracking-wider mb-4">
            <span>⚡ Certified UrPass Event</span>
          </div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight leading-tight mb-3">
            Global AI &amp; Cloud Architecture Summit 2026
          </h1>
          <p class="text-sm text-neutral-400 leading-relaxed mb-6">
            Join 1,500+ cloud engineers, AI researchers, and tech founders in Bengaluru. Keynotes, workshops, and high-concurrency architecture teardowns.
          </p>

          <div class="space-y-3.5 mb-6">
            <div class="flex items-center gap-3 text-xs text-neutral-300">
              <span class="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-violet-400 text-base">📅</span>
              <div>
                <p class="font-semibold text-white">November 15, 2026</p>
                <p class="text-[11px] text-neutral-500">09:00 AM - 06:00 PM IST</p>
              </div>
            </div>
            <div class="flex items-center gap-3 text-xs text-neutral-300">
              <span class="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-violet-400 text-base">📍</span>
              <div>
                <p class="font-semibold text-white">NIMHANS Convention Centre</p>
                <p class="text-[11px] text-neutral-500">Hosur Road, Bengaluru, Karnataka</p>
              </div>
            </div>
            <div class="flex items-center gap-3 text-xs text-neutral-300">
              <span class="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-emerald-400 text-base">🎟️</span>
              <div>
                <p class="font-semibold text-white">Sub-Second Digital QR Pass</p>
                <p class="text-[11px] text-neutral-500">Instant delivery to WhatsApp &amp; Email</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800">
          <p class="text-xs font-semibold text-neutral-400 mb-1">Organized by</p>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xs">AI</div>
            <div>
              <p class="text-sm font-bold text-white">CloudNative India Foundation</p>
              <p class="text-[11px] text-emerald-400 font-medium">✓ Verified Organizer · 0% Platform Fee</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Ticket Selection & Registration Form -->
      <div class="col-span-7 flex flex-col gap-5 pl-2">
        <div>
          <h2 class="text-lg font-bold text-white mb-1">Choose Ticket Category</h2>
          <p class="text-xs text-neutral-400">Select your pass tier. QR pass is issued instantly upon checkout.</p>
        </div>

        <!-- Ticket Tiers -->
        <div class="grid grid-cols-2 gap-3">
          <!-- Tier 1 -->
          <div class="p-4 rounded-xl border-2 border-violet-500 bg-violet-950/20 relative">
            <span class="absolute -top-2.5 right-3 bg-violet-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Selected</span>
            <p class="text-xs font-bold text-white">Delegate Pass (Full Day)</p>
            <p class="text-xl font-extrabold text-white mt-1">₹499 <span class="text-xs font-normal text-neutral-400">+18% GST</span></p>
            <p class="text-[11px] text-neutral-400 mt-2">All keynote halls, networking lunch, AI hands-on labs &amp; digital certificate.</p>
          </div>
          <!-- Tier 2 -->
          <div class="p-4 rounded-xl border border-neutral-800 bg-neutral-950/40 hover:border-neutral-700 transition-colors">
            <p class="text-xs font-bold text-neutral-300">VIP Founder &amp; Speaker Pass</p>
            <p class="text-xl font-extrabold text-white mt-1">₹1,499 <span class="text-xs font-normal text-neutral-400">+18% GST</span></p>
            <p class="text-[11px] text-neutral-400 mt-2">VIP lounge access, priority front-row seating, 1:1 speaker roundtable &amp; swag kit.</p>
          </div>
        </div>

        <!-- Form fields -->
        <div class="space-y-3 bg-neutral-950/60 p-4 rounded-xl border border-neutral-800/80">
          <p class="text-xs font-bold uppercase tracking-wider text-neutral-400">Attendee Information</p>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-medium text-neutral-400 mb-1">Full Name</label>
              <div class="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-medium">Aarav Mehta</div>
            </div>
            <div>
              <label class="block text-[11px] font-medium text-neutral-400 mb-1">Work Email</label>
              <div class="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-medium">aarav.mehta@techlabs.in</div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-medium text-neutral-400 mb-1">Organization / College</label>
              <div class="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-medium">TechLabs India Pvt Ltd</div>
            </div>
            <div>
              <label class="block text-[11px] font-medium text-neutral-400 mb-1">WhatsApp Mobile (+91)</label>
              <div class="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-medium">+91 98765 43210</div>
            </div>
          </div>
        </div>

        <!-- Payment CTA with UPI -->
        <div class="p-4 rounded-xl bg-gradient-to-r from-violet-900/30 to-indigo-900/20 border border-violet-500/30 flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-white">Total Amount: ₹588.82</span>
              <span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-semibold">Incl. 18% GST</span>
            </div>
            <p class="text-[11px] text-neutral-400 mt-0.5">Instant UPI (GPay, PhonePe, Paytm, QR) &amp; Cards · 0% UrPass Fee</p>
          </div>
          <div class="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-2 cursor-pointer">
            <span>Pay &amp; Get Pass</span>
            <span>&rarr;</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`
  },
  {
    name: "step2-ticket-studio",
    title: "2. Visual Ticket Studio & Custom Pass Canvas",
    url: "https://app.urpass.space/studio/designer",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Ticket Studio — UrPass</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0a0a0c; color: #f4f4f5; }
    .mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="p-8 flex items-center justify-center min-h-screen">
  <div class="w-[1100px] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
    <!-- Browser Window Header -->
    <div class="bg-neutral-950 px-5 py-3 border-b border-neutral-800 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
        <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
      </div>
      <div class="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-4 py-1.5 rounded-lg text-xs text-neutral-400 font-mono w-96 justify-center">
        <span class="text-violet-400">✨</span>
        <span>app.urpass.space/studio/pass-designer</span>
      </div>
      <div class="flex items-center gap-2 text-xs font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-md">
        <span>● Ticket Studio Pro</span>
      </div>
    </div>

    <!-- Studio Toolbar -->
    <div class="bg-neutral-950/90 px-6 py-2.5 border-b border-neutral-800 flex items-center justify-between text-xs">
      <div class="flex items-center gap-4">
        <span class="font-bold text-white text-sm">Pass Canvas: AI &amp; Cloud Summit 2026</span>
        <span class="text-neutral-500">|</span>
        <div class="flex items-center gap-1 bg-neutral-900 p-0.5 rounded-lg border border-neutral-800">
          <button class="px-3 py-1 bg-violet-600 text-white rounded font-semibold text-[11px]">📱 Mobile Pass</button>
          <button class="px-3 py-1 text-neutral-400 hover:text-white rounded font-medium text-[11px]">🪪 Conference Badge</button>
          <button class="px-3 py-1 text-neutral-400 hover:text-white rounded font-medium text-[11px]">🖨️ Thermal Print</button>
        </div>
      </div>
      <div class="flex items-center gap-2.5">
        <button class="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold rounded-lg text-xs border border-neutral-700">↺ Undo</button>
        <button class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs shadow-md">✓ Save Design</button>
      </div>
    </div>

    <!-- Studio 3-Column Layout -->
    <div class="grid grid-cols-12 bg-neutral-900 min-h-[480px]">
      <!-- Left Controls: Tool Tabs -->
      <div class="col-span-3 border-r border-neutral-800 p-4 space-y-4 bg-neutral-950/40">
        <div>
          <p class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Preset Templates</p>
          <div class="space-y-1.5">
            <div class="p-2.5 rounded-lg bg-violet-950/40 border border-violet-500/60 flex items-center justify-between text-xs">
              <span class="font-bold text-white">⚡ Cyberpunk Indigo</span>
              <span class="text-[10px] text-violet-400 font-semibold">ACTIVE</span>
            </div>
            <div class="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 flex items-center justify-between text-xs">
              <span class="text-neutral-300">Minimalist Monochrome</span>
            </div>
            <div class="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 flex items-center justify-between text-xs">
              <span class="text-neutral-300">Executive Summit Badge</span>
            </div>
          </div>
        </div>

        <div>
          <p class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Color Gradient</p>
          <div class="flex gap-2">
            <div class="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-indigo-800 ring-2 ring-white cursor-pointer"></div>
            <div class="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-800 cursor-pointer"></div>
            <div class="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-800 cursor-pointer"></div>
            <div class="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-800 cursor-pointer"></div>
            <div class="w-7 h-7 rounded-full bg-gradient-to-br from-neutral-800 to-black cursor-pointer"></div>
          </div>
        </div>

        <div>
          <p class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Security Elements</p>
          <div class="space-y-1.5 text-xs text-neutral-300">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked class="rounded bg-neutral-800 border-neutral-700 text-violet-600">
              <span>Holographic Foil Security Strip</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked class="rounded bg-neutral-800 border-neutral-700 text-violet-600">
              <span>Encrypted QR Anti-Passback</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked class="rounded bg-neutral-800 border-neutral-700 text-violet-600">
              <span>Attendee Photo &amp; Company Tag</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Center: Pass Live Canvas Preview -->
      <div class="col-span-6 p-6 flex flex-col items-center justify-center bg-gradient-to-b from-neutral-900 to-neutral-950 relative">
        <div class="text-[11px] font-mono text-neutral-500 mb-2">Live Canvas · 100% Scale</div>

        <!-- The Pass Ticket Object -->
        <div class="w-72 rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-900 to-black border border-violet-500/40 shadow-2xl overflow-hidden relative">
          <!-- Holographic Header Bar -->
          <div class="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 px-5 py-3 flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="text-white font-extrabold text-xs tracking-wider">URPASS</span>
              <span class="text-[9px] bg-white/20 text-white px-1.5 py-0.2 rounded font-mono">2026</span>
            </div>
            <span class="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-400/30 px-2 py-0.5 rounded-full">
              VALID PASS
            </span>
          </div>

          <!-- Event Body -->
          <div class="p-5">
            <p class="text-[10px] font-bold tracking-widest text-violet-400 uppercase">AI &amp; CLOUD SUMMIT</p>
            <h3 class="text-base font-extrabold text-white leading-tight mt-0.5">Global Architecture 2026</h3>
            <p class="text-[10px] text-neutral-400 mt-1">NIMHANS Convention Centre · Bengaluru</p>

            <!-- Perforated Line Notch -->
            <div class="flex items-center gap-1 my-3 -mx-5">
              <div class="w-3 h-3 rounded-full bg-neutral-950 -ml-1.5 border-r border-neutral-800"></div>
              <div class="flex-1 border-t border-dashed border-neutral-700"></div>
              <div class="w-3 h-3 rounded-full bg-neutral-950 -mr-1.5 border-l border-neutral-800"></div>
            </div>

            <!-- Attendee Details -->
            <div class="flex items-center justify-between mb-3">
              <div>
                <p class="text-[9px] text-neutral-400 uppercase font-semibold">ATTENDEE</p>
                <p class="text-sm font-bold text-white">Aarav Mehta</p>
                <p class="text-[10px] text-neutral-400">TechLabs India</p>
              </div>
              <span class="px-2.5 py-1 rounded bg-violet-600/30 border border-violet-400/40 text-violet-300 font-extrabold text-[10px] tracking-wider uppercase">
                VIP DELEGATE
              </span>
            </div>

            <!-- QR Code -->
            <div class="flex flex-col items-center bg-white p-3 rounded-xl shadow-inner mt-2">
              <div class="w-24 h-24 bg-neutral-950 p-2 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 21 21" fill="white" class="w-full h-full">
                  <rect x="0" y="0" width="7" height="7"/><rect x="1" y="1" width="5" height="5" fill="#0a0a0c"/><rect x="2" y="2" width="3" height="3"/>
                  <rect x="14" y="0" width="7" height="7"/><rect x="15" y="1" width="5" height="5" fill="#0a0a0c"/><rect x="16" y="2" width="3" height="3"/>
                  <rect x="0" y="14" width="7" height="7"/><rect x="1" y="15" width="5" height="5" fill="#0a0a0c"/><rect x="2" y="16" width="3" height="3"/>
                  <rect x="8" y="8" width="5" height="5"/><rect x="14" y="9" width="3" height="3"/><rect x="9" y="14" width="4" height="2"/>
                </svg>
              </div>
              <p class="font-mono text-[9px] text-neutral-900 font-bold mt-1.5 tracking-wider">PASS ID: URP-2026-0891</p>
              <p class="text-[8px] text-neutral-500 font-semibold">SECURE SCAN VALIDATION · 0.3S</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Customizer Inspector -->
      <div class="col-span-3 border-l border-neutral-800 p-4 space-y-4 bg-neutral-950/40 text-xs">
        <div>
          <p class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Dynamic Merge Fields</p>
          <div class="space-y-1.5 text-neutral-300">
            <div class="flex items-center justify-between p-2 rounded bg-neutral-900 border border-neutral-800">
              <span class="font-mono text-[11px] text-violet-400">{{attendee_name}}</span>
              <span class="text-[10px] text-neutral-500">Text</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded bg-neutral-900 border border-neutral-800">
              <span class="font-mono text-[11px] text-violet-400">{{ticket_tier}}</span>
              <span class="text-[10px] text-neutral-500">Badge</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded bg-neutral-900 border border-neutral-800">
              <span class="font-mono text-[11px] text-violet-400">{{seat_number}}</span>
              <span class="text-[10px] text-neutral-500">Custom</span>
            </div>
          </div>
        </div>

        <div class="p-3 rounded-xl bg-violet-900/20 border border-violet-500/30">
          <p class="font-bold text-violet-300 text-xs mb-1">🪄 AI Pass Styler</p>
          <p class="text-[11px] text-neutral-400">Generate theme matches automatically from your event poster or website logo in 1 click.</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`
  },
  {
    name: "step3-organizer-dashboard",
    title: "3. Organizer Command Center & Attendee Manifest",
    url: "https://app.urpass.space/event/ai-summit-2026/attendees",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Attendees Command Center — UrPass</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0a0a0c; color: #f4f4f5; }
    .mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="p-8 flex items-center justify-center min-h-screen">
  <div class="w-[1100px] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
    <!-- Browser Window Header -->
    <div class="bg-neutral-950 px-5 py-3 border-b border-neutral-800 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
        <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
      </div>
      <div class="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-4 py-1.5 rounded-lg text-xs text-neutral-400 font-mono w-96 justify-center">
        <span class="text-blue-400">📊</span>
        <span>app.urpass.space/event/ai-summit-2026/attendees</span>
      </div>
      <div class="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Sync Active · 4 Gates
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="p-6 space-y-5 bg-neutral-900">
      <!-- Top Event Headline & Stats -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-white">AI &amp; Cloud Architecture Summit 2026</h1>
          <p class="text-xs text-neutral-400 mt-0.5">Live attendee manifest, real-time gate synchronization &amp; approvals</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold rounded-lg text-xs border border-neutral-700 flex items-center gap-1.5">
            <span>📥 Export CSV</span>
          </button>
          <button class="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md">
            <span>+ Add Attendee</span>
          </button>
        </div>
      </div>

      <!-- Real-Time Metrics Cards -->
      <div class="grid grid-cols-4 gap-3.5">
        <div class="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800">
          <p class="text-[11px] font-semibold text-neutral-400">Total Registered</p>
          <p class="text-2xl font-extrabold text-white mt-1">1,420</p>
          <p class="text-[10px] text-emerald-400 mt-0.5 font-medium">94.6% of venue capacity</p>
        </div>
        <div class="p-3.5 rounded-xl bg-neutral-950/70 border border-emerald-500/30 bg-emerald-950/10">
          <p class="text-[11px] font-semibold text-emerald-400">Checked In (Live)</p>
          <p class="text-2xl font-extrabold text-emerald-300 mt-1">1,180</p>
          <p class="text-[10px] text-emerald-400 mt-0.5 font-medium">83.1% gate turnout</p>
        </div>
        <div class="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800">
          <p class="text-[11px] font-semibold text-neutral-400">Pending Arrival</p>
          <p class="text-2xl font-extrabold text-amber-300 mt-1">240</p>
          <p class="text-[10px] text-neutral-500 mt-0.5 font-medium">Expected in next hour</p>
        </div>
        <div class="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800">
          <p class="text-[11px] font-semibold text-neutral-400">Total Ticket Revenue</p>
          <p class="text-2xl font-extrabold text-white mt-1">₹8,45,200</p>
          <p class="text-[10px] text-violet-400 mt-0.5 font-medium">0% platform commission</p>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="flex items-center justify-between gap-3 bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800">
        <div class="flex items-center gap-2 flex-1">
          <div class="bg-neutral-900 border border-neutral-700/80 rounded-lg px-3 py-1.5 text-xs text-neutral-300 w-72 flex items-center gap-2">
            <span class="text-neutral-500">🔍</span>
            <span>Search by name, email, or pass ID...</span>
          </div>
          <div class="flex items-center gap-1 text-xs">
            <span class="px-2.5 py-1 rounded-md bg-neutral-800 text-white font-semibold">All (1,420)</span>
            <span class="px-2.5 py-1 rounded-md text-neutral-400 hover:text-white">VIP (150)</span>
            <span class="px-2.5 py-1 rounded-md text-neutral-400 hover:text-white">Delegates (1,220)</span>
            <span class="px-2.5 py-1 rounded-md text-neutral-400 hover:text-white">Speakers (50)</span>
          </div>
        </div>
        <div class="flex items-center gap-2 text-xs text-neutral-400">
          <span>Sort by: <strong>Check-In Time</strong> ▾</span>
        </div>
      </div>

      <!-- Attendee Table -->
      <div class="rounded-xl border border-neutral-800 overflow-hidden bg-neutral-950/40">
        <table class="w-full text-left text-xs">
          <thead class="bg-neutral-950 text-neutral-400 uppercase text-[10px] font-bold border-b border-neutral-800">
            <tr>
              <th class="py-2.5 px-4">Attendee Name</th>
              <th class="py-2.5 px-4">Pass Tier</th>
              <th class="py-2.5 px-4">Pass ID</th>
              <th class="py-2.5 px-4">Approval</th>
              <th class="py-2.5 px-4">Gate Check-In Status</th>
              <th class="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-800/80 text-neutral-200">
            <tr class="hover:bg-neutral-800/30">
              <td class="py-2.5 px-4 flex items-center gap-2.5">
                <div class="w-6 h-6 rounded-full bg-violet-600/30 text-violet-300 flex items-center justify-center font-bold text-[10px]">AM</div>
                <div>
                  <p class="font-bold text-white text-xs">Aarav Mehta</p>
                  <p class="text-[10px] text-neutral-500">aarav.mehta@techlabs.in</p>
                </div>
              </td>
              <td class="py-2.5 px-4"><span class="px-2 py-0.5 rounded bg-violet-900/40 text-violet-300 font-bold text-[10px]">VIP DELEGATE</span></td>
              <td class="py-2.5 px-4 font-mono text-neutral-400 text-[11px]">#URP-02891</td>
              <td class="py-2.5 px-4"><span class="text-emerald-400 font-semibold text-[11px]">✓ Approved</span></td>
              <td class="py-2.5 px-4">
                <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Checked In · 09:42 AM (Gate 1)
                </span>
              </td>
              <td class="py-2.5 px-4 text-right text-neutral-400 font-mono text-[11px]">•••</td>
            </tr>
            <tr class="hover:bg-neutral-800/30">
              <td class="py-2.5 px-4 flex items-center gap-2.5">
                <div class="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-[10px]">PS</div>
                <div>
                  <p class="font-bold text-white text-xs">Priya Sharma</p>
                  <p class="text-[10px] text-neutral-500">priya@designhub.in</p>
                </div>
              </td>
              <td class="py-2.5 px-4"><span class="px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 font-bold text-[10px]">KEYNOTE SPEAKER</span></td>
              <td class="py-2.5 px-4 font-mono text-neutral-400 text-[11px]">#URP-07340</td>
              <td class="py-2.5 px-4"><span class="text-emerald-400 font-semibold text-[11px]">✓ Approved</span></td>
              <td class="py-2.5 px-4">
                <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Checked In · 09:30 AM (VIP Gate)
                </span>
              </td>
              <td class="py-2.5 px-4 text-right text-neutral-400 font-mono text-[11px]">•••</td>
            </tr>
            <tr class="hover:bg-neutral-800/30">
              <td class="py-2.5 px-4 flex items-center gap-2.5">
                <div class="w-6 h-6 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center font-bold text-[10px]">RK</div>
                <div>
                  <p class="font-bold text-white text-xs">Rohan Kulkarni</p>
                  <p class="text-[10px] text-neutral-500">rohan.k@cloudworks.io</p>
                </div>
              </td>
              <td class="py-2.5 px-4"><span class="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-bold text-[10px]">DELEGATE</span></td>
              <td class="py-2.5 px-4 font-mono text-neutral-400 text-[11px]">#URP-09142</td>
              <td class="py-2.5 px-4"><span class="text-emerald-400 font-semibold text-[11px]">✓ Approved</span></td>
              <td class="py-2.5 px-4">
                <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 text-[10px] font-medium">
                  ⏳ Pending Gate Scan
                </span>
              </td>
              <td class="py-2.5 px-4 text-right text-neutral-400 font-mono text-[11px]">•••</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</body>
</html>`
  },
  {
    name: "step4-qr-checkin-scanner",
    title: "4. Sub-Second Camera QR Scanner & Live Gate Validation",
    url: "https://app.urpass.space/scanner/gate-1",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>UrPass Gate Scanner — Sub-Second Entry</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0a0a0c; color: #f4f4f5; }
    .mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="p-8 flex items-center justify-center min-h-screen">
  <div class="w-[1100px] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
    <!-- Browser Window Header -->
    <div class="bg-neutral-950 px-5 py-3 border-b border-neutral-800 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
        <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
      </div>
      <div class="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-4 py-1.5 rounded-lg text-xs text-neutral-400 font-mono w-96 justify-center">
        <span class="text-emerald-400">📷</span>
        <span>app.urpass.space/scanner/gate-1</span>
      </div>
      <div class="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
        <span>⚡ 0.28s Scan Latency · Offline Ready</span>
      </div>
    </div>

    <!-- Scanner Interface (Split Layout) -->
    <div class="grid grid-cols-12 p-8 gap-8 bg-neutral-900">
      <!-- Left: Mobile Viewfinder Simulation -->
      <div class="col-span-6 flex justify-center">
        <div class="w-72 bg-black border-4 border-neutral-800 rounded-[32px] p-3 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <!-- Mobile Status Bar -->
          <div class="flex items-center justify-between px-2 pt-1 text-[10px] font-mono text-neutral-400">
            <span>09:42</span>
            <div class="flex items-center gap-1">
              <span class="text-emerald-400">● 5G</span>
              <span>100%</span>
            </div>
          </div>

          <!-- Camera Viewport Box -->
          <div class="relative bg-neutral-950 rounded-2xl my-3 h-96 flex flex-col items-center justify-center overflow-hidden border border-neutral-800">
            <!-- Simulated Live Camera Background -->
            <div class="absolute inset-0 bg-neutral-900/90 flex items-center justify-center">
              <div class="w-44 h-44 border-2 border-emerald-500/80 rounded-2xl relative flex items-center justify-center">
                <!-- Laser Scan Line -->
                <div class="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_#10B981]"></div>
                <!-- Corner Targets -->
                <div class="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></div>
                <div class="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></div>
                <div class="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
                <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>
                
                <!-- Simulated Pass QR in frame -->
                <div class="w-28 h-28 bg-white/10 rounded-lg p-2 border border-white/20 backdrop-blur-xs flex items-center justify-center">
                  <svg viewBox="0 0 21 21" fill="white" class="w-20 h-20 opacity-90">
                    <rect x="0" y="0" width="7" height="7"/><rect x="1" y="1" width="5" height="5" fill="#000"/><rect x="2" y="2" width="3" height="3"/>
                    <rect x="14" y="0" width="7" height="7"/><rect x="15" y="1" width="5" height="5" fill="#000"/><rect x="16" y="2" width="3" height="3"/>
                    <rect x="0" y="14" width="7" height="7"/><rect x="1" y="15" width="5" height="5" fill="#000"/><rect x="2" y="16" width="3" height="3"/>
                    <rect x="8" y="8" width="5" height="5"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Instant Verification Banner Popup -->
            <div class="absolute bottom-2 inset-x-2 bg-emerald-600 text-white rounded-xl p-3 shadow-2xl flex items-center gap-3 animate-bounce">
              <div class="w-9 h-9 rounded-full bg-white text-emerald-600 flex items-center justify-center font-extrabold text-lg shrink-0">
                ✓
              </div>
              <div>
                <p class="text-[10px] font-extrabold tracking-wider uppercase text-emerald-100">VALID PASS · ENTRY APPROVED</p>
                <p class="text-sm font-extrabold">Aarav Mehta</p>
                <p class="text-[10px] text-emerald-100 font-medium">VIP Delegate · Seat A-14</p>
              </div>
            </div>
          </div>

          <!-- Bottom Scanner Controls -->
          <div class="flex items-center justify-between px-3 pb-1 text-xs text-neutral-400">
            <span class="text-emerald-400 font-bold">● Gate 1 Online</span>
            <span class="font-mono text-[10px]">1,180 Scanned</span>
          </div>
        </div>
      </div>

      <!-- Right: Real-Time Gate Security Panel -->
      <div class="col-span-6 flex flex-col justify-between py-2">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span>⚡ Zero-Lag Hardware Acceleration</span>
          </div>
          <h2 class="text-2xl font-extrabold text-white tracking-tight mb-3">
            0.28-Second Lightning Verification
          </h2>
          <p class="text-sm text-neutral-400 leading-relaxed mb-6">
            Gate staff open UrPass on any standard smartphone camera. No app store downloads, no expensive scanner rentals. Verified cryptographically in browser memory.
          </p>

          <div class="space-y-3">
            <div class="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-start gap-3">
              <span class="text-lg">🛡️</span>
              <div>
                <p class="text-xs font-bold text-white">Anti-Passback Duplicate Detection</p>
                <p class="text-[11px] text-neutral-400 mt-0.5">If an attendee tries to reuse a forwarded screenshot, the scanner immediately flashes red with original check-in timestamp.</p>
              </div>
            </div>

            <div class="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-start gap-3">
              <span class="text-lg">📡</span>
              <div>
                <p class="text-xs font-bold text-white">Full Offline Synchronization</p>
                <p class="text-[11px] text-neutral-400 mt-0.5">If convention hall Wi-Fi dips, scanner caches manifest locally and syncs timestamps the instant connection is restored.</p>
              </div>
            </div>

            <div class="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-start gap-3">
              <span class="text-lg">🔊</span>
              <div>
                <p class="text-xs font-bold text-white">Audio &amp; Haptic Affirmations</p>
                <p class="text-[11px] text-neutral-400 mt-0.5">High-frequency chime and vibration feedback let staff process 40+ attendees per minute per gate lane.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs text-neutral-300">
          <span>Current Gate Throughput: <strong>38 entries/min</strong></span>
          <span class="text-emerald-400 font-bold">100% Data Integrity</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`
  }
];

async function run() {
  console.log("Generating 4 realistic UrPass page screenshots...");

  for (const screen of SCREENS) {
    const htmlPath = path.join(TEMP_DIR, `${screen.name}.html`);
    const pngPath = path.join(OUT_DIR, `${screen.name}.png`);
    fs.writeFileSync(htmlPath, screen.html, "utf-8");

    console.log(`Capturing ${screen.name} -> ${pngPath}...`);
    const cmd = `"${CHROME_PATH}" --headless --disable-gpu --user-data-dir=/tmp/chrome-user-data --no-sandbox --window-size=1200,780 --force-device-scale-factor=2 --hide-scrollbars --screenshot="${pngPath}" "file://${htmlPath}"`;

    try {
      execSync(cmd, { stdio: "ignore" });
      const stats = fs.statSync(pngPath);
      console.log(`✓ Generated ${screen.name}.png (${stats.size} bytes)`);
    } catch (err) {
      console.error(`Failed to capture ${screen.name}:`, err);
    }
  }

  console.log("All screenshots successfully captured!");
}

run();
