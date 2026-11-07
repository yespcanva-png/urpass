export type EventPrivacyInput = {
  is_private?: boolean | string | number | null;
  visibility?: string | null;
  application_enabled?: boolean | null;
  event_type?: string | null;
  custom_pass_design?: unknown;
};

/**
 * Centrally determines if an event is private, unlisted, or invite-only.
 *
 * An event is considered PRIVATE if ANY of the following are true:
 * 1. Event or custom_pass_design has is_private === true (or "true" or 1)
 * 2. Event or custom_pass_design has visibility in ["private", "unlisted", "invite_only", "hidden"]
 * 3. Event or custom_pass_design has privacy in ["private", "unlisted", "invite_only"]
 * 4. Event or custom_pass_design has access_type in ["private", "invite_only", "unlisted"]
 * 5. Event has event_type === "private"
 * 6. Event has application_enabled === false (public registration is closed / invite-only)
 */
export function isEventPrivate(event: EventPrivacyInput | null | undefined): boolean {
  if (!event) return false;

  // 1. Direct event properties
  if (event.is_private === true || event.is_private === "true" || event.is_private === 1) {
    return true;
  }

  if (typeof event.visibility === "string") {
    const v = event.visibility.trim().toLowerCase();
    if (["private", "unlisted", "invite_only", "hidden"].includes(v)) {
      return true;
    }
  }

  if (event.event_type?.trim().toLowerCase() === "private") {
    return true;
  }

  // If application / registration is disabled, it is an invite-only private event
  if (event.application_enabled === false) {
    return true;
  }

  // 2. Inspect custom_pass_design JSON
  const design = event.custom_pass_design;
  if (design && typeof design === "object" && !Array.isArray(design)) {
    const d = design as Record<string, unknown>;

    if (d.is_private === true || d.is_private === "true" || d.is_private === 1) {
      return true;
    }

    if (typeof d.visibility === "string") {
      const v = d.visibility.trim().toLowerCase();
      if (["private", "unlisted", "invite_only", "hidden"].includes(v)) {
        return true;
      }
    }

    if (typeof d.privacy === "string") {
      const p = d.privacy.trim().toLowerCase();
      if (["private", "unlisted", "invite_only", "hidden"].includes(p)) {
        return true;
      }
    }

    if (typeof d.access_type === "string") {
      const a = d.access_type.trim().toLowerCase();
      if (["private", "invite_only", "unlisted"].includes(a)) {
        return true;
      }
    }

    if (d.is_public === false || d.is_public === "false" || d.public === false) {
      return true;
    }
  }

  return false;
}
