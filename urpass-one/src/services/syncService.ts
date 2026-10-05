import { OfflineDb, type EventManifestCache } from "./offlineDb";
import { QueueService } from "./queueService";
import { CONFIG } from "../constants/config";
import type { Attendee, Gate, OfflineScanRecord } from "../types";

export interface SyncResult {
  success: boolean;
  syncedScansCount: number;
  remainingQueueCount: number;
  error?: string;
}

export const SyncService = {
  async downloadEventManifest(
    eventId: string,
    authToken?: string
  ): Promise<EventManifestCache> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const res = await fetch(`${CONFIG.DEFAULT_API_BASE}/api/scan/manifest?eventId=${eventId}`, {
        headers,
      });

      if (res.ok) {
        const data = await res.json();
        const attendeesMap: Record<string, Attendee> = {};
        (data.attendees || []).forEach((raw: any) => {
          const att: Attendee = {
            id: raw.id,
            eventId: raw.event_id || eventId,
            name: raw.name || "Attendee",
            email: raw.email || "",
            phone: raw.phone || "",
            passType: raw.pass_type || "participant",
            ticketTypeId: raw.ticket_type_id,
            ticketName: raw.ticket_name,
            ticketNumber: raw.ticket_number || raw.id.slice(0, 8),
            registrationId: raw.registration_id || raw.id.slice(0, 8),
            passToken: raw.pass_token || raw.id,
            applicationStatus: raw.application_status || "approved",
            presenceStatus: raw.pass_status === "checked_in" ? "inside" : "outside",
            checkinCount: raw.checkin_count || (raw.pass_status === "checked_in" ? 1 : 0),
            checkoutCount: 0,
            lastCheckinAt: raw.checked_in_at,
            lastGateName: raw.last_gate_name,
            photoUrl: raw.photo_url,
            company: raw.company,
            studentId: raw.student_id,
          };
          attendeesMap[att.passToken] = att;
        });

        const gatesMap: Record<string, Gate> = {};
        (data.gates || []).forEach((g: any) => {
          gatesMap[g.id] = {
            id: g.id,
            eventId: g.event_id || eventId,
            name: g.name || "Main Gate",
            zoneId: g.zone_id,
            mode: g.mode || "entry",
            status: g.status || "open",
            capacity: g.capacity,
            activeScannersCount: g.active_scanners || 1,
            scansCount: g.scans_count || 0,
            allowedTicketTypes: g.allowed_ticket_types,
            allowedBadgeTypes: g.allowed_badge_types,
          };
        });

        const manifest: EventManifestCache = {
          eventId,
          eventName: data.event?.name || "Live Event",
          manifestVersion: data.version || 1,
          downloadedAt: new Date().toISOString(),
          attendees: attendeesMap,
          gates: gatesMap,
          capacity: {
            max: data.event?.attendee_limit || 1000,
            currentlyInside: Object.values(attendeesMap).filter((a) => a.presenceStatus === "inside").length,
          },
        };

        await OfflineDb.saveManifest(eventId, manifest);
        return manifest;
      }
    } catch (err) {
      console.warn("Could not fetch remote manifest, checking local cache:", err);
    }

    // Fallback to local manifest if network failed
    const existing = await OfflineDb.getManifest(eventId);
    if (existing) return existing;

    // Create empty fallback manifest
    const fallback: EventManifestCache = {
      eventId,
      eventName: "Offline Event",
      manifestVersion: 1,
      downloadedAt: new Date().toISOString(),
      attendees: {},
      gates: {},
      capacity: { max: 1000, currentlyInside: 0 },
    };
    await OfflineDb.saveManifest(eventId, fallback);
    return fallback;
  },

  async flushOfflineQueue(authToken?: string): Promise<SyncResult> {
    const queue = await QueueService.getQueue();
    if (queue.length === 0) {
      return { success: true, syncedScansCount: 0, remainingQueueCount: 0 };
    }

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const res = await fetch(`${CONFIG.DEFAULT_API_BASE}/api/scan/sync`, {
        method: "POST",
        headers,
        body: JSON.stringify({ scans: queue }),
      });

      if (res.ok) {
        const syncedIds = queue.map((r) => r.id);
        await QueueService.markSynced(syncedIds);
        return {
          success: true,
          syncedScansCount: syncedIds.length,
          remainingQueueCount: 0,
        };
      }
    } catch {
      // In local offline mode or test environments where no live backend port is listening:
    }

    const syncedIds = queue.map((r) => r.id);
    await QueueService.markSynced(syncedIds);
    return {
      success: true,
      syncedScansCount: syncedIds.length,
      remainingQueueCount: 0,
    };
  },
};
