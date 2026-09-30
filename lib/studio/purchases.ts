import {
  STUDIO_TEMPLATES,
  isTemplateFree,
  SINGLE_TEMPLATE_PRICE_INR,
  ALL_ACCESS_BUNDLE_PRICE_INR,
} from "./templates";

export const UNLOCKED_TEMPLATES_COOKIE = "urpass_unlocked_templates";

export interface TemplatePurchaseRecord {
  templateId: string;
  templateName: string;
  amountINR: number;
  orderId: string;
  paymentId: string;
  purchasedAt: string;
  email?: string;
}

export function parseUnlockedCookie(cookieVal?: string | null): string[] {
  if (!cookieVal) return [];
  try {
    const decoded = decodeURIComponent(cookieVal);
    const parsed = JSON.parse(decoded);
    if (Array.isArray(parsed)) {
      return parsed.map(String);
    }
  } catch {
    // If comma-separated fallback
    return cookieVal.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

export function isTemplateUnlocked(
  templateId: string,
  unlockedList: string[] = [],
  isProUser = false
): boolean {
  if (isProUser) return true;
  if (unlockedList.includes("all") || unlockedList.includes(templateId)) {
    return true;
  }
  const tpl = STUDIO_TEMPLATES.find((t) => t.id === templateId);
  if (!tpl || isTemplateFree(tpl)) {
    return true; // Free templates always unlocked
  }
  return false;
}

export { SINGLE_TEMPLATE_PRICE_INR, ALL_ACCESS_BUNDLE_PRICE_INR };
