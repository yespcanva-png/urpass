// Short-lived in-memory cache of recently exchanged authorization codes.
export interface ExchangedCodeRecord {
  destination: string;
  cookieName?: string;
  cookieValue?: string;
  maxAge?: number;
  ts: number;
}

export const recentExchangedCodes = new Map<string, ExchangedCodeRecord>();

export function clearRecentExchangedCodes() {
  recentExchangedCodes.clear();
}
