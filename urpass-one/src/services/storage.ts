import AsyncStorage from "@react-native-async-storage/async-storage";

const memoryStore = new Map<string, string>();

function canUseWebStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export const StorageService = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (canUseWebStorage()) {
        return window.localStorage.getItem(key);
      }
      const nativeValue = await AsyncStorage.getItem(key);
      if (nativeValue !== null) return nativeValue;
    } catch {
      // ignore
    }
    return memoryStore.get(key) ?? null;
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (canUseWebStorage()) {
        window.localStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch {
      // ignore
    }
    memoryStore.set(key, value);
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (canUseWebStorage()) {
        window.localStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch {
      // ignore
    }
    memoryStore.delete(key);
  },

  async getJSON<T>(key: string, fallback: T): Promise<T> {
    const raw = await this.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  async setJSON<T>(key: string, value: T): Promise<void> {
    await this.setItem(key, JSON.stringify(value));
  },
};
