/**
 * Validates Indian Goods and Services Tax Identification Number (GSTIN).
 * Format: 15 alphanumeric characters:
 * - 2 digits (State code: 01-38)
 * - 5 uppercase letters (PAN alphabets)
 * - 4 digits (PAN number)
 * - 1 uppercase letter (PAN check letter)
 * - 1 alphanumeric character (Entity code: 1-9, A-Z)
 * - 'Z' (Default 14th character)
 * - 1 alphanumeric character (Check digit)
 */
export function validateGstin(gstin: string): boolean {
  const cleaned = gstin.trim().toUpperCase();
  if (!cleaned) return true;
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(cleaned);
}
