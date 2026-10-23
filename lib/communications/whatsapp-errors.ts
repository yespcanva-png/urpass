/** Explain both new receipts with codes and older receipts that stored only text. */
export function explainWhatsAppFailure(reason?: string | null, code?: string | null): string {
  if (code === "131049" || /healthy ecosystem engagement/i.test(reason || "")) {
    return "Meta declined this marketing message to protect recipient engagement. Immediate retries may also fail. Try later or share the pass through another channel.";
  }
  return [reason || "WhatsApp delivery failed.", code ? `Meta code: ${code}` : ""].filter(Boolean).join(" ");
}
