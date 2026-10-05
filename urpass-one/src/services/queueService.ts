import type { OfflineScanRecord } from "../types";
import { StorageService } from "./storage";
import { CONFIG } from "../constants/config";

export const QueueService = {
  async getQueue(): Promise<OfflineScanRecord[]> {
    return await StorageService.getJSON<OfflineScanRecord[]>(
      CONFIG.STORAGE_KEYS.OFFLINE_QUEUE,
      []
    );
  },

  async enqueue(record: OfflineScanRecord): Promise<void> {
    const queue = await this.getQueue();
    queue.push(record);
    await StorageService.setJSON(CONFIG.STORAGE_KEYS.OFFLINE_QUEUE, queue);
  },

  async dequeue(id: string): Promise<void> {
    const queue = await this.getQueue();
    const updated = queue.filter((r) => r.id !== id);
    await StorageService.setJSON(CONFIG.STORAGE_KEYS.OFFLINE_QUEUE, updated);
  },

  async markSynced(ids: string[]): Promise<void> {
    const queue = await this.getQueue();
    const idSet = new Set(ids);
    const remaining = queue.filter((r) => !idSet.has(r.id));
    await StorageService.setJSON(CONFIG.STORAGE_KEYS.OFFLINE_QUEUE, remaining);
  },

  async getPendingCount(eventId?: string): Promise<number> {
    const queue = await this.getQueue();
    if (!eventId) return queue.length;
    return queue.filter((r) => r.eventId === eventId).length;
  },

  async clearQueue(eventId?: string): Promise<void> {
    if (!eventId) {
      await StorageService.setJSON(CONFIG.STORAGE_KEYS.OFFLINE_QUEUE, []);
    } else {
      const queue = await this.getQueue();
      const remaining = queue.filter((r) => r.eventId !== eventId);
      await StorageService.setJSON(CONFIG.STORAGE_KEYS.OFFLINE_QUEUE, remaining);
    }
  },
};
