export function firstEventConversionEnabledFor(userId: string): boolean {
  if (process.env.NEXT_PUBLIC_FIRST_EVENT_CONVERSION_ENABLED !== "true") return false;
  const percentage = Number(process.env.FIRST_EVENT_ROLLOUT_PERCENT ?? "100");
  if (!Number.isFinite(percentage) || percentage <= 0) return false;
  if (percentage >= 100) return true;
  let hash = 2166136261;
  for (const character of userId) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return (hash >>> 0) % 100 < percentage;
}
