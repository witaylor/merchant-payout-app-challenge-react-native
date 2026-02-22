/**
 * Normalizes IBAN for validation and storage: trims, removes spaces, uppercases.
 */
export function normalizeIban(iban: string): string {
  return iban.trim().replace(/\s/g, "").toUpperCase();
}

/**
 * Masks an IBAN for display, showing first 4 and last 4 characters.
 * Example: FR1212345123451234567A12310131231231231 → FR12*******************1231
 */
export function maskIban(iban: string): string {
  const normalized = normalizeIban(iban);
  if (normalized.length <= 8) {
    return normalized;
  }
  const first = normalized.slice(0, 4);
  const last = normalized.slice(-4);
  const maskedLength = normalized.length - 8;
  return `${first}${"*".repeat(maskedLength)}${last}`;
}
