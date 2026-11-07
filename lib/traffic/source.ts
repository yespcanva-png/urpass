export const DIRECT_SOURCE = "Direct / Unknown";

export type TrafficSource =
  | "ChatGPT" | "Product Hunt" | "Google" | "Bing" | "Claude" | "Gemini"
  | "Perplexity" | "Reddit" | "LinkedIn" | "Instagram" | "Facebook"
  | "X" | "Other" | typeof DIRECT_SOURCE;

export interface SourceInput {
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  referrer?: string | null;
  siteHost?: string | null;
}

export interface ResolvedSource {
  source: TrafficSource;
  referrerHost: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
}

function clean(value: string | null | undefined, max = 80): string | null {
  if (!value) return null;
  if (/@|https?:\/\/|\b\d{10,}\b/i.test(value)) return null;
  const result = value.trim().replace(/[\x00-\x1f\x7f]/g, "").slice(0, max);
  return result || null;
}

function hostOf(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value.slice(0, 2048));
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.hostname.toLowerCase().replace(/\.$/, "").slice(0, 253);
  } catch {
    return null;
  }
}

function matches(host: string, domain: string) {
  return host === domain || host.endsWith(`.${domain}`);
}

function fromUtm(raw: string): TrafficSource | null {
  const value = raw.toLowerCase().replace(/[^a-z0-9]+/g, "");
  if (["chatgpt", "openai", "chatopenai"].includes(value)) return "ChatGPT";
  if (["producthunt", "ph"].includes(value)) return "Product Hunt";
  if (["google", "googleads", "adwords"].includes(value)) return "Google";
  if (["bing", "microsoftads"].includes(value)) return "Bing";
  if (["claude", "anthropic"].includes(value)) return "Claude";
  if (["gemini", "bard"].includes(value)) return "Gemini";
  if (["perplexity", "pplx"].includes(value)) return "Perplexity";
  if (["reddit", "redditads"].includes(value)) return "Reddit";
  if (["linkedin", "linkedinads"].includes(value)) return "LinkedIn";
  if (["instagram", "ig"].includes(value)) return "Instagram";
  if (["facebook", "fb", "meta"].includes(value)) return "Facebook";
  if (["x", "twitter", "tco"].includes(value)) return "X";
  if (["direct", "none", "unknown"].includes(value)) return DIRECT_SOURCE;
  return null;
}

function fromHost(host: string): TrafficSource {
  if (matches(host, "chatgpt.com") || matches(host, "chat.openai.com")) return "ChatGPT";
  if (matches(host, "producthunt.com")) return "Product Hunt";
  if (matches(host, "gemini.google.com")) return "Gemini";
  if (matches(host, "google.com") || /(^|\.)google\.(?:co\.[a-z]{2}|[a-z]{2})$/.test(host)) return "Google";
  if (matches(host, "bing.com")) return "Bing";
  if (matches(host, "claude.ai")) return "Claude";
  if (matches(host, "perplexity.ai")) return "Perplexity";
  if (matches(host, "reddit.com") || matches(host, "redd.it")) return "Reddit";
  if (matches(host, "linkedin.com") || matches(host, "lnkd.in")) return "LinkedIn";
  if (matches(host, "instagram.com")) return "Instagram";
  if (matches(host, "facebook.com") || matches(host, "fb.com") || matches(host, "fb.me")) return "Facebook";
  if (matches(host, "x.com") || matches(host, "twitter.com") || matches(host, "t.co")) return "X";
  return "Other";
}

export function resolveTrafficSource(input: SourceInput): ResolvedSource {
  const utmSource = clean(input.utmSource);
  const utmMedium = clean(input.utmMedium);
  const utmCampaign = clean(input.utmCampaign);
  const referrerHost = hostOf(input.referrer);
  const siteHost = clean(input.siteHost, 253)?.toLowerCase() || null;
  const isInternal = Boolean(referrerHost && siteHost &&
    (referrerHost === siteHost ||
      (matches(referrerHost, "urpass.space") && matches(siteHost, "urpass.space"))));

  let source: TrafficSource = DIRECT_SOURCE;
  if (utmSource) source = fromUtm(utmSource) || "Other";
  else if (referrerHost && !isInternal) source = fromHost(referrerHost);

  return {
    source,
    referrerHost: isInternal ? null : referrerHost,
    utmSource,
    utmMedium,
    utmCampaign,
  };
}
