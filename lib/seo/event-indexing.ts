import { isEventPrivate, type EventPrivacyInput } from "@/lib/events/privacy";

export function isPublicIndexableEvent(event: EventPrivacyInput & { status?: string | null }): boolean {
  if (event.status !== "active") return false;
  return !isEventPrivate(event);
}
