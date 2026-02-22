/**
 * Supported payout currencies. Single source of truth for currency options.
 */
export const CURRENCIES = ["GBP", "EUR"] as const;

export type Currency = (typeof CURRENCIES)[number];

export const DEFAULT_CURRENCY: Currency = "GBP";
