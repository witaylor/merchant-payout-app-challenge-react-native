import type { Currency } from "@/types/api";

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  GBP: "£",
  EUR: "€",
};

/**
 * Format amount from lowest denomination (pence/cents) to display string.
 */
export function formatAmount(amount: number, currency: Currency): string {
  const value = amount / 100;
  const symbol = CURRENCY_SYMBOLS[currency];
  return `${symbol}${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

/**
 * Format date string to DD MM YYYY.
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}
