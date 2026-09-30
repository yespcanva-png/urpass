/**
 * IndexNow Protocol Integration for URPASS
 * Notifies search engines (Bing, Yandex, Seznam, Naver, Copilot) instantly
 * whenever new event software landing pages and guides are published.
 */

export const INDEXNOW_KEY = "9f8b4c2e6a1d7f3e8b2a5c9d0e4f1a7b";
export const INDEXNOW_HOST = "urpass.space";
export const INDEXNOW_KEY_LOCATION = "https://urpass.space/9f8b4c2e6a1d7f3e8b2a5c9d0e4f1a7b.txt";
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

export interface IndexNowSubmissionResult {
  success: boolean;
  status: number;
  message: string;
  submittedCount: number;
  endpoint: string;
  timestamp: string;
}

/**
 * High-priority core & hub URLs for instant crawler invocation
 */
export const CORE_INDEXNOW_URLS: string[] = [
  "https://urpass.space/",
  "https://urpass.space/pricing",
  "https://urpass.space/ticket-fee-calculator",
  "https://urpass.space/free-qr-ticket-generator",
  "https://urpass.space/switch-to-urpass",
  "https://urpass.space/import",
  "https://urpass.space/ticket-templates",
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
];

/**
 * Submits a batch of URLs to the IndexNow protocol endpoint.
 */
export async function submitToIndexNow(
  urls: string[] = CORE_INDEXNOW_URLS
): Promise<IndexNowSubmissionResult> {
  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: urls,
  };

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  const timestamp = new Date().toISOString();
  const status = response.status;
  const isSuccess = status === 200 || status === 202;

  let message = "";
  if (status === 200) {
    message = `Successfully submitted ${urls.length} URLs to IndexNow (HTTP 200 OK).`;
  } else if (status === 202) {
    message = `IndexNow accepted ${urls.length} URLs for processing (HTTP 202 Accepted).`;
  } else {
    const errorText = await response.text().catch(() => "");
    message = `IndexNow responded with HTTP ${status}: ${errorText || "Submission error"}`;
  }

  return {
    success: isSuccess,
    status,
    message,
    submittedCount: urls.length,
    endpoint: INDEXNOW_ENDPOINT,
    timestamp,
  };
}
