import type { Currency } from "@/types/api";
import { formatAmount } from "@/utils/format";

/**
 * Converts amount from major units (pounds/euros) to minor units (pence/cents).
 * Currency-agnostic: both GBP and EUR use 100 minor units per major unit.
 */
export function toMinorUnits(amount: string | number): number {
  const parsed = Number(amount);
  if (Number.isNaN(parsed) || parsed <= 0) return 0;
  return Math.round(parsed * 100);
}

/**
 * Formats a payout amount (string or number) for display in a given currency.
 */
export function formatPayoutAmountForDisplay(
  amount: string | number,
  currency: Currency,
): string {
  return formatAmount(toMinorUnits(amount), currency);
}
