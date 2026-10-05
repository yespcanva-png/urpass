import type { Attendee, Gate, ScanAuditLog, OperationalAlert } from "../types";
import { StorageService } from "./storage";
import { CONFIG } from "../constants/config";

export interface EventManifestCache {
  eventId: string;
  eventName: string;
  manifestVersion: number;
  downloadedAt: string;
  attendees: Record<string, Attendee>; // token or id -> Attendee
  gates: Record<string, Gate>; // gateId -> Gate
  capacity: {
    max: number;
    currentlyInside: number;
  };
}

const DEFAULT_SEED_ATTENDEES: Record<string, Attendee> = {
  UP_VIP_001_VALID: {
    id: "att-vip-001",
    eventId: "evt-tech-summit-2026",
    name: "Arjun Mehta",
    email: "arjun.mehta@techcorp.io",
    phone: "+91 98401 23456",
    passType: "vip",
    ticketName: "VIP All-Access Pass",
    ticketNumber: "TK-VIP-9941",
    registrationId: "REG-2026-9042",
    passToken: "UP_VIP_001_VALID",
    applicationStatus: "approved",
    presenceStatus: "outside",
    checkinCount: 0,
    checkoutCount: 0,
    company: "Apex Neural Labs",
    assignedZones: ["VIP Lounge", "Keynote Stage", "Expo Pavilion", "General Main"],
  },
  UP_DEL_002_VALID: {
    id: "att-del-002",
    eventId: "evt-tech-summit-2026",
    name: "Neha Gupta",
    email: "neha.gupta@innovate.org",
    phone: "+91 98200 88712",
    passType: "delegate",
    ticketName: "Conference Delegate Pass",
    ticketNumber: "TK-DEL-3382",
    registrationId: "REG-2026-1109",
    passToken: "UP_DEL_002_VALID",
    applicationStatus: "approved",
    presenceStatus: "outside",
    checkinCount: 0,
    checkoutCount: 0,
    company: "Innovate India Foundation",
    assignedZones: ["General Main", "Expo Pavilion"],
  },
  UP_DUP_003_ALREADY_IN: {
    id: "att-dup-003",
    eventId: "evt-tech-summit-2026",
    name: "Rohan Kapoor",
    email: "rohan.kapoor@cloudscale.net",
    phone: "+91 99100 44521",
    passType: "participant",
    ticketName: "General Entry Pass",
    ticketNumber: "TK-GEN-5521",
    registrationId: "REG-2026-8821",
    passToken: "UP_DUP_003_ALREADY_IN",
    applicationStatus: "approved",
    presenceStatus: "inside",
    checkinCount: 1,
    checkoutCount: 0,
    lastCheckinAt: new Date(Date.now() - 3600000).toISOString(),
    lastGateId: "gate-a-main",
    lastGateName: "Gate A – Main Concourse",
    company: "CloudScale Networks",
    assignedZones: ["General Main"],
  },
  UP_CANCELLED_004: {
    id: "att-can-004",
    eventId: "evt-tech-summit-2026",
    name: "Vikram Sen",
    email: "vikram.sen@revoked.org",
    passType: "participant",
    ticketName: "Cancelled Pass",
    ticketNumber: "TK-REVOKED-004",
    registrationId: "REG-REVOKED",
    passToken: "UP_CANCELLED_004",
    applicationStatus: "rejected",
    presenceStatus: "outside",
    checkinCount: 0,
    checkoutCount: 0,
  },
  UP_WRONG_GATE_005: {
    id: "att-wrg-005",
    eventId: "evt-tech-summit-2026",
    name: "Sneha Patel",
    email: "sneha.patel@student.edu",
    passType: "student",
    ticketName: "Student Pass",
    ticketNumber: "TK-STU-8829",
    registrationId: "REG-2026-STU",
    passToken: "UP_WRONG_GATE_005",
    applicationStatus: "approved",
    presenceStatus: "outside",
    checkinCount: 0,
    checkoutCount: 0,
    assignedZones: ["Student Area"],
  },
  UP_EXPIRED_006: {
    id: "att-exp-006",
    eventId: "evt-tech-summit-2026",
    name: "Rajesh Iyer",
    email: "rajesh.iyer@oldevent.com",
    passType: "participant",
    ticketName: "Day 1 Pass",
    ticketNumber: "TK-DAY1-006",
    registrationId: "REG-OLD",
    passToken: "UP_EXPIRED_006",
    applicationStatus: "rejected",
    presenceStatus: "outside",
    checkinCount: 0,
    checkoutCount: 0,
  },
};

export const OfflineDb = {
  getManifestKey(eventId: string): string {
    return `${CONFIG.STORAGE_KEYS.OFFLINE_MANIFEST_PREFIX}${eventId}`;
  },

  async clearAll(): Promise<void> {
    await StorageService.removeItem(CONFIG.STORAGE_KEYS.SCAN_AUDIT_LOGS);
    await StorageService.removeItem(CONFIG.STORAGE_KEYS.ACTIVE_ALERTS);
    await StorageService.removeItem(CONFIG.STORAGE_KEYS.OFFLINE_QUEUE);
    // Re-seed default manifest
    await this.seedDefaultManifest("evt-tech-summit-2026");
  },

  async seedDefaultManifest(eventId: string = "evt-tech-summit-2026"): Promise<EventManifestCache> {
    const manifest: EventManifestCache = {
      eventId,
      eventName: "National Tech & AI Summit 2026",
      manifestVersion: 1,
      downloadedAt: new Date().toISOString(),
      attendees: { ...DEFAULT_SEED_ATTENDEES },
      gates: {},
      capacity: {
        max: 5000,
        currentlyInside: 2980,
      },
    };
    await this.saveManifest(eventId, manifest);
    return manifest;
  },

  async saveManifest(eventId: string, manifest: EventManifestCache): Promise<void> {
    await StorageService.setJSON(this.getManifestKey(eventId), manifest);
  },

  async getManifest(eventId: string): Promise<EventManifestCache | null> {
    let manifest = await StorageService.getJSON<EventManifestCache | null>(
      this.getManifestKey(eventId),
      null
    );
    if (!manifest) {
      manifest = await this.seedDefaultManifest(eventId);
    }
    return manifest;
  },

  async getAttendees(eventId: string): Promise<Attendee[]> {
    const manifest = await this.getManifest(eventId);
    if (!manifest) return [];
    return Object.values(manifest.attendees);
  },

  async getAttendeeById(attendeeId: string, eventId: string): Promise<Attendee | null> {
    const manifest = await this.getManifest(eventId);
    if (!manifest) return null;
    const all = Object.values(manifest.attendees);
    return all.find((a) => a.id === attendeeId || a.passToken === attendeeId) || null;
  },

  async saveAttendee(attendee: Attendee): Promise<void> {
    const manifest = await this.getManifest(attendee.eventId);
    if (manifest) {
      manifest.attendees[attendee.passToken || attendee.id] = attendee;
      await this.saveManifest(attendee.eventId, manifest);
    }
  },

  async lookupAttendeeByQR(eventId: string, qrPayload: string): Promise<Attendee | null> {
    const manifest = await this.getManifest(eventId);
    if (!manifest) return null;

    const trimmed = qrPayload.trim();
    // Direct match by pass token
    if (manifest.attendees[trimmed]) {
      return manifest.attendees[trimmed];
    }

    // Try finding by URL extract e.g. https://urpass.space/pass/TOKEN
    const match = trimmed.match(/\/pass\/([a-zA-Z0-9_-]+)/);
    if (match && match[1] && manifest.attendees[match[1]]) {
      return manifest.attendees[match[1]];
    }

    // Search by ID or registrationId or ticketNumber
    const all = Object.values(manifest.attendees);
    const found = all.find(
      (a) =>
        a.passToken === trimmed ||
        a.id === trimmed ||
        a.registrationId?.toLowerCase() === trimmed.toLowerCase() ||
        a.ticketNumber?.toLowerCase() === trimmed.toLowerCase()
    );

    return found || null;
  },

  async searchAttendees(eventId: string, query: string): Promise<Attendee[]> {
    const manifest = await this.getManifest(eventId);
    if (!manifest) return [];

    const q = query.toLowerCase().trim();
    if (!q) return Object.values(manifest.attendees);

    return Object.values(manifest.attendees).filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.phone && a.phone.includes(q)) ||
        (a.registrationId && a.registrationId.toLowerCase().includes(q)) ||
        (a.ticketNumber && a.ticketNumber.toLowerCase().includes(q)) ||
        (a.company && a.company.toLowerCase().includes(q)) ||
        (a.studentId && a.studentId.toLowerCase().includes(q))
    );
  },

  async updateLocalAttendeeState(
    eventId: string,
    attendeeId: string,
    updates: Partial<Attendee>
  ): Promise<Attendee | null> {
    const manifest = await this.getManifest(eventId);
    if (!manifest) return null;

    let updatedAttendee: Attendee | null = null;
    for (const [token, att] of Object.entries(manifest.attendees)) {
      if (att.id === attendeeId || att.passToken === attendeeId) {
        manifest.attendees[token] = {
          ...att,
          ...updates,
          lastDeviceName: updates.lastDeviceName || att.lastDeviceName,
        };
        updatedAttendee = manifest.attendees[token];
        break;
      }
    }

    if (updatedAttendee) {
      if (updates.presenceStatus === "inside") {
        manifest.capacity.currentlyInside += 1;
      } else if (updates.presenceStatus === "outside") {
        manifest.capacity.currentlyInside = Math.max(0, manifest.capacity.currentlyInside - 1);
      }
      await this.saveManifest(eventId, manifest);
    }

    return updatedAttendee;
  },

  async appendAuditLog(log: ScanAuditLog): Promise<void> {
    const logs = await StorageService.getJSON<ScanAuditLog[]>(
      CONFIG.STORAGE_KEYS.SCAN_AUDIT_LOGS,
      []
    );
    logs.unshift(log);
    // Keep last 1000 logs locally
    if (logs.length > 1000) logs.length = 1000;
    await StorageService.setJSON(CONFIG.STORAGE_KEYS.SCAN_AUDIT_LOGS, logs);
  },

  async getAuditLogs(eventId?: string): Promise<ScanAuditLog[]> {
    const logs = await StorageService.getJSON<ScanAuditLog[]>(
      CONFIG.STORAGE_KEYS.SCAN_AUDIT_LOGS,
      []
    );
    if (!eventId) return logs;
    return logs.filter((l) => l.eventId === eventId);
  },

  async appendAlert(alert: OperationalAlert): Promise<void> {
    const alerts = await StorageService.getJSON<OperationalAlert[]>(
      CONFIG.STORAGE_KEYS.ACTIVE_ALERTS,
      []
    );
    alerts.unshift(alert);
    if (alerts.length > 100) alerts.length = 100;
    await StorageService.setJSON(CONFIG.STORAGE_KEYS.ACTIVE_ALERTS, alerts);
  },

  async getAlerts(eventId?: string): Promise<OperationalAlert[]> {
    const alerts = await StorageService.getJSON<OperationalAlert[]>(
      CONFIG.STORAGE_KEYS.ACTIVE_ALERTS,
      []
    );
    if (!eventId) return alerts;
    return alerts.filter((a) => a.eventId === eventId);
  },
};
