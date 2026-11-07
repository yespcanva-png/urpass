/** Public organiser acquisition pages. Event attendee and internal app traffic is excluded. */
export function isTrackableTrafficPath(path: string): boolean {
  if (!path.startsWith("/") || path.startsWith("//")) return false;
  return !/^\/(api|auth|ops|dashboard|admin|settings|event|create-event|onboarding|scan|billing|org|studio|apply|e|events|pass|share|order|join|portal|wallet|register|claim-ticket|verify|forgot-password|reset-password)(\/|$)/i.test(path);
}
