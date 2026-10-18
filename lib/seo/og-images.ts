export const DEFAULT_BRAND_OG_IMAGE = "https://urpass.space/og-image.png";
export const DEFAULT_EVENT_REGISTRATION_OG_IMAGE = "https://urpass.space/ticket-og-image.png";
export const TICKET_OG_IMAGE = DEFAULT_EVENT_REGISTRATION_OG_IMAGE;

export const TICKET_OG_IMAGE_META = {
  url: TICKET_OG_IMAGE,
  secureUrl: TICKET_OG_IMAGE,
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "URPASS — Event Registration & Digital Passes",
};

export const BRAND_OG_IMAGE_META = {
  url: DEFAULT_BRAND_OG_IMAGE,
  secureUrl: DEFAULT_BRAND_OG_IMAGE,
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "URPASS — Your Events, Your Way",
};

/**
 * Resolves the OpenGraph image for a public event:
 * - If the event has an organizer-provided banner or logo, use that image.
 * - Otherwise, fall back to the premium UrPass Event Registration default.
 */
export function resolveEventOgImage(event?: {
  banner_url?: string | null;
  logo_url?: string | null;
  custom_pass_design?: unknown;
  name?: string;
} | null): { url: string; secureUrl: string; alt: string } {
  if (!event) {
    return {
      url: DEFAULT_EVENT_REGISTRATION_OG_IMAGE,
      secureUrl: DEFAULT_EVENT_REGISTRATION_OG_IMAGE,
      alt: "URPASS — Event Registration Made Simple",
    };
  }

  const cpd = (event.custom_pass_design as Record<string, any>) || {};
  const customUrl =
    event.banner_url ||
    cpd.banner_url ||
    cpd.header_image_url ||
    cpd.background_image_url ||
    event.logo_url ||
    null;

  if (customUrl && typeof customUrl === "string" && customUrl.trim().length > 0) {
    const cleanUrl = customUrl.trim();
    return {
      url: cleanUrl,
      secureUrl: cleanUrl.startsWith("http://") ? cleanUrl.replace("http://", "https://") : cleanUrl,
      alt: event.name ? `${event.name} on URPASS` : "Event banner on URPASS",
    };
  }

  return {
    url: DEFAULT_EVENT_REGISTRATION_OG_IMAGE,
    secureUrl: DEFAULT_EVENT_REGISTRATION_OG_IMAGE,
    alt: event.name ? `${event.name} — Registration & Entry Pass on URPASS` : "URPASS Event Registration",
  };
}
