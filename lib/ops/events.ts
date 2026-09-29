export interface OpsLogItem {
  id: string;
  timestamp: string;
  level: "INFO" | "SUCCESS" | "WARN" | "ERROR";
  category: "AUTH" | "EVENT" | "BILLING" | "SCAN" | "EMAIL" | "SECURITY" | "SYSTEM";
  message: string;
  details?: Record<string, unknown> | null;
}

// Global in-memory ring buffer across requests in the Node server process
declare global {
  // eslint-disable-next-line no-var
  var __urpass_ops_event_buffer: OpsLogItem[] | undefined;
}

if (!globalThis.__urpass_ops_event_buffer) {
  globalThis.__urpass_ops_event_buffer = [];
}

/**
 * Record a live operational event into the global in-memory ring buffer.
 * Instantly surfaces in `/ops` command center during the next 3s poll.
 */
export function recordLiveOpsEvent(event: {
  level: OpsLogItem["level"];
  category: OpsLogItem["category"];
  message: string;
  details?: Record<string, unknown> | null;
  id?: string;
  timestamp?: string;
}): OpsLogItem {
  const item: OpsLogItem = {
    id: event.id || `live-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: event.timestamp || new Date().toISOString(),
    level: event.level,
    category: event.category,
    message: event.message,
    details: event.details || null,
  };

  const buffer = globalThis.__urpass_ops_event_buffer!;
  buffer.unshift(item);

  // Keep up to 250 items in the in-memory ring buffer
  if (buffer.length > 250) {
    buffer.length = 250;
  }

  return item;
}

/**
 * Retrieve recent live operational events from the in-memory ring buffer.
 */
export function getLiveOpsEvents(since?: string): OpsLogItem[] {
  const buffer = globalThis.__urpass_ops_event_buffer || [];
  if (!since) return [...buffer];
  const sinceTime = new Date(since).getTime();
  return buffer.filter((item) => new Date(item.timestamp).getTime() > sinceTime);
}
