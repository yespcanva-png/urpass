export function isPublicIndexableEvent(event: {
  status?: string | null;
  application_enabled?: boolean | null;
  custom_pass_design?: unknown;
}): boolean {
  if (event.status !== "active" || event.application_enabled !== true) return false;

  const design = event.custom_pass_design;
  if (!design || typeof design !== "object" || Array.isArray(design)) return true;
  const visibility = design as { is_private?: unknown; visibility?: unknown };
  return visibility.is_private !== true && !["private", "invite_only", "unlisted", "hidden"].includes(String(visibility.visibility));
}
