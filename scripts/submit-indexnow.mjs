#!/usr/bin/env node

/**
 * URPASS IndexNow Submission Script
 * Run with: npm run indexnow
 */

const INDEXNOW_KEY = "9f8b4c2e6a1d7f3e8b2a5c9d0e4f1a7b";
const INDEXNOW_HOST = "urpass.space";
const INDEXNOW_KEY_LOCATION = "https://urpass.space/9f8b4c2e6a1d7f3e8b2a5c9d0e4f1a7b.txt";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

const URL_LIST = [
  "https://urpass.space/",
  "https://urpass.space/pricing",
  "https://urpass.space/ticket-fee-calculator",
  "https://urpass.space/free-qr-ticket-generator",
  "https://urpass.space/sponsorship",
  "https://urpass.space/platform",
  "https://urpass.space/compare",
  "https://urpass.space/in",
  "https://urpass.space/uk",
  "https://urpass.space/sitelinks",
  "https://urpass.space/guides",
  "https://urpass.space/zero-fee-ticket-platform",
  "https://urpass.space/fastest-event-check-in-software",
  "https://urpass.space/instant-upi-event-ticketing",
  "https://urpass.space/gst-compliant-event-ticketing",
  "https://urpass.space/university-fest-ticketing-platform",
  "https://urpass.space/hackathon-check-in-system",
  "https://urpass.space/offline-event-check-in-system",
  "https://urpass.space/multi-gate-qr-scanner",
  "https://urpass.space/event-registration-without-fees",
  "https://urpass.space/instant-qr-ticket-generator",
  "https://urpass.space/event-badge-printing-software",
  "https://urpass.space/no-app-event-check-in",
  "https://urpass.space/mcp-event-check-in",
  "https://urpass.space/custom-ticket-branding-software",
  "https://urpass.space/live-event-attendance-tracker",
  "https://urpass.space/developer-conference-registration",
  "https://urpass.space/corporate-townhall-registration",
  "https://urpass.space/academic-symposium-registration",
  "https://urpass.space/digital-conference-badges",
  "https://urpass.space/open-source-event-ticketing-alternative",
  "https://urpass.space/campus-event-management-platform",
  "https://urpass.space/event-entry-qr-code-system",
  "https://urpass.space/event-registration-approval-workflow",
  "https://urpass.space/event-guest-list-check-in",
  "https://urpass.space/ai-event-management-platform",
  "https://urpass.space/compare/urpass-vs-eventbrite",
  "https://urpass.space/compare/urpass-vs-townscript",
  "https://urpass.space/compare/urpass-vs-luma",
  "https://urpass.space/compare/luma-alternative",
  "https://urpass.space/compare/urpass-vs-meetup",
  "https://urpass.space/compare/urpass-vs-google-forms",
  "https://urpass.space/compare/urpass-vs-zoho-backstage",
  "https://urpass.space/compare/townscript-alternative",
  "https://urpass.space/compare/allevents-alternative",
  "https://urpass.space/compare/eventbrite-alternative-india",
  "https://urpass.space/compare/zoho-backstage-alternative-india",
  "https://urpass.space/in/bangalore",
  "https://urpass.space/in/chennai",
  "https://urpass.space/in/mumbai",
  "https://urpass.space/in/delhi",
  "https://urpass.space/in/hyderabad",
  "https://urpass.space/in/pune",
  "https://urpass.space/uk/london",
  "https://urpass.space/uk/manchester",
  "https://urpass.space/uk/edinburgh",
];

async function main() {
  console.log(`[IndexNow] Preparing submission of ${URL_LIST.length} high-intent URLs...`);
  console.log(`[IndexNow] Host: ${INDEXNOW_HOST}`);
  console.log(`[IndexNow] Key Location: ${INDEXNOW_KEY_LOCATION}`);

  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: URL_LIST,
  };

  try {
    const startTime = Date.now();
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    const elapsed = Date.now() - startTime;
    console.log(`[IndexNow] Response Status: ${res.status} ${res.statusText} (${elapsed}ms)`);

    if (res.status === 200 || res.status === 202) {
      console.log(`✅ [IndexNow] Successfully submitted ${URL_LIST.length} URLs to Bing, Yandex, Seznam & Copilot!`);
    } else {
      const text = await res.text().catch(() => "");
      console.error(`⚠️ [IndexNow] Submission received HTTP ${res.status}:`, text);
    }
  } catch (err) {
    console.error(`❌ [IndexNow] Error submitting to IndexNow:`, err);
    process.exit(1);
  }
}

main();
