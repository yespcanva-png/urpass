// Short-lived in-memory cache of recently exchanged authorization codes.
export const recentExchangedCodes = new Map<string, { destination: string; ts: number }>();

export function clearRecentExchangedCodes() {
  recentExchangedCodes.clear();
}
