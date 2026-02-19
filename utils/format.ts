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

const DATE_LOCALE = "en-GB";

export type FormatDateOptions = {
  /** "numeric" for DD MM YYYY, "abbreviated" for DD MMM YYYY */
  monthStyle?: "numeric" | "abbreviated";
};

/**
 * Format date string. Defaults to DD MM YYYY.
 * Use monthStyle: "abbreviated" for DD MMM YYYY (e.g. "23 Jan 2026").
 */
export function formatDate(
  dateString: string,
  options?: FormatDateOptions,
): string {
  const { monthStyle = "numeric" } = options ?? {};

  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat(DATE_LOCALE, {
    day: "2-digit",
    month: monthStyle === "abbreviated" ? "short" : "2-digit",
    year: "numeric",
  });

  return formatter
    .formatToParts(date)
    .filter((p) => p.type !== "literal")
    .map((p) => p.value)
    .join(" ");
}
