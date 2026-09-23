/**
 * URPASS Offline Scanner & Local Reconciliation Engine
 *
 * Provides full offline check-in capability during poor/zero gate connectivity:
 * 1. Pre-caches event pass manifests in browser IndexedDB (with in-memory fallback)
 * 2. Instant zero-latency offline QR verification against cached tickets
 * 3. Enforces local duplicate gate entry prevention (ALREADY_CHECKED_IN)
 * 4. Queues scans with unique scanOperationId and actual physical scannedAt timestamp
 * 5. Automatically detects connectivity restoration and triggers batch sync
 * 6. Handles multi-gate offline conflict resolution (Gate A vs Gate B concurrency)
 */

export interface ManifestPass {
  passId: string;
  passToken: string;
  attendeeId: string;
  name: string;
  email: string;
  passType: string;
  ticketTypeId?: string | null;
  allowedZoneIds?: string[];
  checkedIn: boolean;
  checkedInAt?: string | null;
}

export interface CachedGate {
  id: string;
  name: string;
  zone_id?: string | null;
  zone?: { name: string } | null;
}

export interface ManifestMeta {
  eventId: string;
  eventName: string;
  lastCachedAt: string;
  totalPasses: number;
  checkedInCount: number;
  gates?: CachedGate[];
}

export interface OfflineQueueEntry {
  scanOperationId: string;
  eventId: string;
  passToken: string;
  gateId?: string | null;
  gateName?: string | null;
  checkInMethod?: "qr" | "manual";
  scannedAt: string;
  status: "pending" | "syncing" | "synced" | "conflict" | "failed";
  retryCount: number;
  conflictDetails?: {
    message?: string;
    winningGateId?: string | null;
    winningCheckedInAt?: string | null;
  };
  syncedAt?: string | null;
  createdAt: string;
}

export interface OfflineVerificationResult {
  status: "CHECKED_IN" | "ALREADY_CHECKED_IN" | "INVALID_PASS" | "ACCESS_DENIED" | "NOT_APPROVED";
  success: boolean;
  offline: boolean;
  attendee?: {
    name: string;
    email: string;
    pass_type: string;
  };
  passType?: string;
  checkedInAt?: string | null;
  scanOperationId: string;
  error?: string;
  alreadyCheckedIn?: boolean;
  accessDenied?: boolean;
}

export interface SyncReport {
  eventId: string;
  totalPending: number;
  synced: number;
  conflicts: number;
  failed: number;
  conflictEntries: OfflineQueueEntry[];
}

const DB_NAME = "urpass_scanner_offline_db";
const DB_VERSION = 1;
const STORE_MANIFEST = "event_manifest";
const STORE_QUEUE = "offline_queue";
const STORE_META = "manifest_meta";

// In-memory fallback if IndexedDB is blocked or running in server/test environments
const memoryManifestStore = new Map<string, ManifestPass & { tokenKey: string; eventId: string }>();
const memoryQueueStore = new Map<string, OfflineQueueEntry>();
const memoryMetaStore = new Map<string, ManifestMeta>();

export function isIndexedDbAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.indexedDB !== "undefined";
}

/**
 * Normalizes pass token string, stripping URL prefixes if scanned from an email link.
 */
export function normalizeToken(token: string): string {
  if (typeof token !== "string") return "";
  return token.trim().replace(/^https?:\/\/[^\/]+\/pass\//, "");
}

/**
 * Initializes and returns an open IndexedDB connection.
 */
export function openScannerDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isIndexedDbAvailable()) {
      return reject(new Error("IndexedDB is not available in this environment"));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_MANIFEST)) {
        const manifestStore = db.createObjectStore(STORE_MANIFEST, { keyPath: "tokenKey" });
        manifestStore.createIndex("by_event", "eventId", { unique: false });
        manifestStore.createIndex("by_token", "passToken", { unique: false });
      }

      if (!db.objectStoreNames.contains(STORE_QUEUE)) {
        const queueStore = db.createObjectStore(STORE_QUEUE, { keyPath: "scanOperationId" });
        queueStore.createIndex("by_event", "eventId", { unique: false });
        queueStore.createIndex("by_status", "status", { unique: false });
      }

      if (!db.objectStoreNames.contains(STORE_META)) {
        db.createObjectStore(STORE_META, { keyPath: "eventId" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Failed to open IndexedDB"));
  });
}

/**
 * Saves or updates an event's full pass manifest for offline use.
 */
export async function saveEventManifest(
  eventId: string,
  eventName: string,
  passes: ManifestPass[],
  gates: CachedGate[] = []
): Promise<void> {
  const lastCachedAt = new Date().toISOString();
  let checkedInCount = 0;

  for (const p of passes) {
    if (p.checkedIn) checkedInCount++;
  }

  const meta: ManifestMeta = {
    eventId,
    eventName,
    lastCachedAt,
    totalPasses: passes.length,
    checkedInCount,
    gates,
  };

  if (!isIndexedDbAvailable()) {
    // In-memory fallback
    memoryMetaStore.set(eventId, meta);
    for (const p of passes) {
      const cleanToken = normalizeToken(p.passToken);
      const key = `${eventId}:${cleanToken}`;
      memoryManifestStore.set(key, { ...p, tokenKey: key, eventId, passToken: cleanToken });
    }
    return;
  }

  const db = await openScannerDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_MANIFEST, STORE_META], "readwrite");
    const manifestStore = tx.objectStore(STORE_MANIFEST);
    const metaStore = tx.objectStore(STORE_META);

    metaStore.put(meta);

    for (const p of passes) {
      const cleanToken = normalizeToken(p.passToken);
      const tokenKey = `${eventId}:${cleanToken}`;
      manifestStore.put({
        ...p,
        tokenKey,
        eventId,
        passToken: cleanToken,
      });
    }

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Retrieves cached event metadata (cached pass counts, sync timestamp, etc.)
 */
export async function getManifestMeta(eventId: string): Promise<ManifestMeta | null> {
  if (!isIndexedDbAvailable()) {
    return memoryMetaStore.get(eventId) || null;
  }

  try {
    const db = await openScannerDb();
    return new Promise((resolve) => {
      const tx = db.transaction([STORE_META], "readonly");
      const store = tx.objectStore(STORE_META);
      const request = store.get(eventId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Searches cached attendees by name, email, or pass type in offline storage.
 */
export async function searchOfflineAttendees(
  eventId: string,
  query: string
): Promise<ManifestPass[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  if (!isIndexedDbAvailable()) {
    const results: ManifestPass[] = [];
    for (const item of memoryManifestStore.values()) {
      if (item.eventId === eventId) {
        if (
          item.name.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q) ||
          item.passType.toLowerCase().includes(q)
        ) {
          results.push(item);
        }
      }
    }
    return results.slice(0, 30);
  }

  try {
    const db = await openScannerDb();
    return new Promise((resolve) => {
      const tx = db.transaction([STORE_MANIFEST], "readonly");
      const store = tx.objectStore(STORE_MANIFEST);
      const index = store.index("by_event");
      const request = index.getAll(eventId);

      request.onsuccess = () => {
        const allPasses = (request.result as (ManifestPass & { eventId: string })[]) || [];
        const matches = allPasses.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.email.toLowerCase().includes(q) ||
            p.passType.toLowerCase().includes(q)
        );
        resolve(matches.slice(0, 30));
      };
      request.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

/**
 * Performs immediate local gate verification and check-in when offline:
 * - Validates pass existence against cached manifest
 * - Blocks local duplicate scans (ALREADY_CHECKED_IN)
 * - Verifies zone access if gate has a zone restriction
 * - Marks pass locally as checked in and appends to the offline sync queue
 */
export async function verifyPassOffline(params: {
  eventId: string;
  passToken: string;
  gateId?: string | null;
  gateName?: string | null;
  checkInMethod?: "qr" | "manual";
}): Promise<OfflineVerificationResult> {
  const { eventId, passToken, gateId, gateName, checkInMethod = "qr" } = params;
  const cleanToken = normalizeToken(passToken);
  const tokenKey = `${eventId}:${cleanToken}`;
  const scannedAt = new Date().toISOString();
  const scanOperationId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `offline_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  // ── In-Memory Execution ──
  if (!isIndexedDbAvailable()) {
    const pass = memoryManifestStore.get(tokenKey);
    if (!pass) {
      return {
        status: "INVALID_PASS",
        success: false,
        offline: true,
        scanOperationId,
        error: "Pass not found in offline database. Reconnect to download the latest event list.",
      };
    }

    if (pass.checkedIn) {
      return {
        status: "ALREADY_CHECKED_IN",
        success: false,
        offline: true,
        alreadyCheckedIn: true,
        attendee: { name: pass.name, email: pass.email, pass_type: pass.passType },
        passType: pass.passType,
        checkedInAt: pass.checkedInAt || scannedAt,
        scanOperationId,
      };
    }

    // Zone verification
    const meta = memoryMetaStore.get(eventId);
    if (gateId && meta?.gates && pass.allowedZoneIds && pass.allowedZoneIds.length > 0) {
      const gate = meta.gates.find((g) => g.id === gateId);
      if (gate?.zone_id && !pass.allowedZoneIds.includes(gate.zone_id)) {
        return {
          status: "ACCESS_DENIED",
          success: false,
          offline: true,
          accessDenied: true,
          error: "Pass is not authorized for this gate / zone.",
          passType: pass.passType,
          scanOperationId,
        };
      }
    }

    // Mark checked in locally
    pass.checkedIn = true;
    pass.checkedInAt = scannedAt;
    memoryManifestStore.set(tokenKey, pass);

    // Queue for sync
    const queueEntry: OfflineQueueEntry = {
      scanOperationId,
      eventId,
      passToken: cleanToken,
      gateId: gateId || null,
      gateName: gateName || null,
      checkInMethod,
      scannedAt,
      status: "pending",
      retryCount: 0,
      createdAt: scannedAt,
    };
    memoryQueueStore.set(scanOperationId, queueEntry);

    return {
      status: "CHECKED_IN",
      success: true,
      offline: true,
      attendee: { name: pass.name, email: pass.email, pass_type: pass.passType },
      passType: pass.passType,
      checkedInAt: scannedAt,
      scanOperationId,
    };
  }

  // ── IndexedDB Execution ──
  const db = await openScannerDb();

  return new Promise((resolve) => {
    const tx = db.transaction([STORE_MANIFEST, STORE_QUEUE, STORE_META], "readwrite");
    const manifestStore = tx.objectStore(STORE_MANIFEST);
    const queueStore = tx.objectStore(STORE_QUEUE);
    const metaStore = tx.objectStore(STORE_META);

    const getRequest = manifestStore.get(tokenKey);

    getRequest.onsuccess = () => {
      const pass = getRequest.result as (ManifestPass & { tokenKey: string }) | undefined;

      if (!pass) {
        return resolve({
          status: "INVALID_PASS",
          success: false,
          offline: true,
          scanOperationId,
          error: "Pass not found in offline database. Reconnect to download the latest event list.",
        });
      }

      if (pass.checkedIn) {
        return resolve({
          status: "ALREADY_CHECKED_IN",
          success: false,
          offline: true,
          alreadyCheckedIn: true,
          attendee: { name: pass.name, email: pass.email, pass_type: pass.passType },
          passType: pass.passType,
          checkedInAt: pass.checkedInAt || scannedAt,
          scanOperationId,
        });
      }

      // Check Zone restriction
      const metaReq = metaStore.get(eventId);
      metaReq.onsuccess = () => {
        const meta = metaReq.result as ManifestMeta | undefined;
        if (gateId && meta?.gates && pass.allowedZoneIds && pass.allowedZoneIds.length > 0) {
          const gate = meta.gates.find((g) => g.id === gateId);
          if (gate?.zone_id && !pass.allowedZoneIds.includes(gate.zone_id)) {
            return resolve({
              status: "ACCESS_DENIED",
              success: false,
              offline: true,
              accessDenied: true,
              error: "Pass is not authorized for this gate / zone.",
              passType: pass.passType,
              scanOperationId,
            });
          }
        }

        // Update local pass entry to checked_in
        pass.checkedIn = true;
        pass.checkedInAt = scannedAt;
        manifestStore.put(pass);

        // Update metadata checkedInCount
        if (meta) {
          meta.checkedInCount = (meta.checkedInCount || 0) + 1;
          metaStore.put(meta);
        }

        // Add to offline sync queue
        const queueEntry: OfflineQueueEntry = {
          scanOperationId,
          eventId,
          passToken: cleanToken,
          gateId: gateId || null,
          gateName: gateName || null,
          checkInMethod,
          scannedAt,
          status: "pending",
          retryCount: 0,
          createdAt: scannedAt,
        };
        queueStore.put(queueEntry);

        resolve({
          status: "CHECKED_IN",
          success: true,
          offline: true,
          attendee: { name: pass.name, email: pass.email, pass_type: pass.passType },
          passType: pass.passType,
          checkedInAt: scannedAt,
          scanOperationId,
        });
      };

      metaReq.onerror = () => {
        resolve({
          status: "INVALID_PASS",
          success: false,
          offline: true,
          scanOperationId,
          error: "Failed to read event metadata",
        });
      };
    };

    getRequest.onerror = () => {
      resolve({
        status: "INVALID_PASS",
        success: false,
        offline: true,
        scanOperationId,
        error: "Database error during offline pass verification",
      });
    };
  });
}

/**
 * Returns all pending items in the offline queue for an event.
 */
export async function getPendingOfflineQueue(eventId: string): Promise<OfflineQueueEntry[]> {
  if (!isIndexedDbAvailable()) {
    const list: OfflineQueueEntry[] = [];
    for (const q of memoryQueueStore.values()) {
      if (q.eventId === eventId && (q.status === "pending" || q.status === "failed")) {
        list.push(q);
      }
    }
    return list;
  }

  try {
    const db = await openScannerDb();
    return new Promise((resolve) => {
      const tx = db.transaction([STORE_QUEUE], "readonly");
      const store = tx.objectStore(STORE_QUEUE);
      const index = store.index("by_event");
      const request = index.getAll(eventId);

      request.onsuccess = () => {
        const all = (request.result as OfflineQueueEntry[]) || [];
        const pending = all.filter((item) => item.status === "pending" || item.status === "failed");
        resolve(pending);
      };
      request.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

/**
 * Returns queue counts (pending, synced, conflicts).
 */
export async function getQueueStats(
  eventId: string
): Promise<{ pending: number; synced: number; conflicts: number }> {
  if (!isIndexedDbAvailable()) {
    let pending = 0;
    let synced = 0;
    let conflicts = 0;
    for (const q of memoryQueueStore.values()) {
      if (q.eventId === eventId) {
        if (q.status === "pending" || q.status === "failed") pending++;
        else if (q.status === "synced") synced++;
        else if (q.status === "conflict") conflicts++;
      }
    }
    return { pending, synced, conflicts };
  }

  try {
    const db = await openScannerDb();
    return new Promise((resolve) => {
      const tx = db.transaction([STORE_QUEUE], "readonly");
      const store = tx.objectStore(STORE_QUEUE);
      const index = store.index("by_event");
      const request = index.getAll(eventId);

      request.onsuccess = () => {
        const all = (request.result as OfflineQueueEntry[]) || [];
        let pending = 0;
        let synced = 0;
        let conflicts = 0;
        for (const item of all) {
          if (item.status === "pending" || item.status === "failed") pending++;
          else if (item.status === "synced") synced++;
          else if (item.status === "conflict") conflicts++;
        }
        resolve({ pending, synced, conflicts });
      };
      request.onerror = () => resolve({ pending: 0, synced: 0, conflicts: 0 });
    });
  } catch {
    return { pending: 0, synced: 0, conflicts: 0 };
  }
}

/**
 * Reconciles and synchronizes all pending offline scans to the server.
 */
export async function syncOfflineQueue(eventId: string): Promise<SyncReport> {
  const pending = await getPendingOfflineQueue(eventId);
  const report: SyncReport = {
    eventId,
    totalPending: pending.length,
    synced: 0,
    conflicts: 0,
    failed: 0,
    conflictEntries: [],
  };

  if (pending.length === 0) return report;

  try {
    const res = await fetch("/api/scan/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId,
        scans: pending.map((item) => ({
          scanOperationId: item.scanOperationId,
          passToken: item.passToken,
          gateId: item.gateId,
          gateName: item.gateName,
          checkInMethod: item.checkInMethod || "qr",
          scannedAt: item.scannedAt,
        })),
      }),
    });

    if (!res.ok) {
      report.failed = pending.length;
      return report;
    }

    const data = await res.json();
    const results = (data.results || []) as Array<{
      scanOperationId: string;
      status: "CHECKED_IN" | "ALREADY_CHECKED_IN" | "INVALID_PASS" | "ERROR";
      conflict?: boolean;
      conflictMessage?: string;
      winningGateId?: string | null;
      winningCheckedInAt?: string | null;
    }>;

    const resultMap = new Map(results.map((r) => [r.scanOperationId, r]));

    // Update local statuses based on server reconciliation response
    if (!isIndexedDbAvailable()) {
      for (const item of pending) {
        const result = resultMap.get(item.scanOperationId);
        if (result) {
          if (result.status === "CHECKED_IN") {
            item.status = "synced";
            item.syncedAt = new Date().toISOString();
            report.synced++;
          } else if (result.conflict || result.status === "ALREADY_CHECKED_IN") {
            item.status = "conflict";
            item.conflictDetails = {
              message: result.conflictMessage || "Pass was already checked in at another gate",
              winningGateId: result.winningGateId,
              winningCheckedInAt: result.winningCheckedInAt,
            };
            report.conflicts++;
            report.conflictEntries.push(item);
          } else {
            item.status = "failed";
            report.failed++;
          }
          memoryQueueStore.set(item.scanOperationId, item);
        }
      }
      return report;
    }

    const db = await openScannerDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_QUEUE], "readwrite");
      const store = tx.objectStore(STORE_QUEUE);

      for (const item of pending) {
        const result = resultMap.get(item.scanOperationId);
        if (result) {
          if (result.status === "CHECKED_IN") {
            item.status = "synced";
            item.syncedAt = new Date().toISOString();
            report.synced++;
          } else if (result.conflict || result.status === "ALREADY_CHECKED_IN") {
            item.status = "conflict";
            item.conflictDetails = {
              message: result.conflictMessage || "Pass was already checked in at another gate",
              winningGateId: result.winningGateId,
              winningCheckedInAt: result.winningCheckedInAt,
            };
            report.conflicts++;
            report.conflictEntries.push(item);
          } else {
            item.status = "failed";
            report.failed++;
          }
          store.put(item);
        }
      }

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    return report;
  } catch (err) {
    report.failed = pending.length;
    return report;
  }
}
