import { Platform } from "react-native";
import { z } from "zod";

import { CURRENCIES } from "@/constants/currencies";
import { normalizeIban } from "@/utils/iban";
import { BIOMETRIC_THRESHOLD_MAJOR_UNITS } from "@/utils/payout";
import { WEB_PAYOUT_LIMIT_MESSAGE } from "@/utils/payout-error";

/**
 * IBAN structure per ISO 13616: 2 letters (country) + 2 digits (check) + 1-30 alphanumeric (BBAN).
 * Total length 15-34. Does not validate checksum.
 */
const IBAN_SHAPE_REGEX = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/;

/**
 * Validates IBAN format (ISO 13616). Returns true if valid.
 */
export function isValidIbanFormat(iban: string): boolean {
  const normalized = normalizeIban(iban);
  if (normalized.length === 0) return false;
  if (normalized.length < 15 || normalized.length > 34) return false;
  return IBAN_SHAPE_REGEX.test(normalized);
}

export const payoutFormSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .transform((s) => parseFloat(s))
    .pipe(
      z
        .number()
        .refine((n) => !Number.isNaN(n), "Invalid number")
        .refine((n) => n > 0, "Amount must be positive")
        .multipleOf(0.01, "Amount can only have up to 2 decimal places"),
    ),
  currency: z.enum(CURRENCIES),
  iban: z
    .string()
    .min(1, "IBAN is required")
    .refine((val) => !/\s/.test(val.trim()), "IBAN must not contain spaces")
    .transform((val) => normalizeIban(val))
    .refine(
      (val) =>
        val.length >= 15 &&
        val.length <= 34 &&
        IBAN_SHAPE_REGEX.test(val),
      "IBAN must be 15-34 characters, starting with 2 letters, 2 digits, then alphanumeric",
    ),
});

export type PayoutFormSchema = z.infer<typeof payoutFormSchema>;

/**
 * Validates raw form input. Returns success with transformed data or failure with issues.
 * Use this to enable/disable Submit and to validate before submit.
 * On web, amounts over £1,000 are rejected (biometric auth not available).
 */
export function validatePayoutForm(data: {
  amount: string;
  currency: (typeof CURRENCIES)[number];
  iban: string;
}) {
  const result = payoutFormSchema.safeParse(data);

  if (result.success && Platform.OS === "web" && result.data.amount > BIOMETRIC_THRESHOLD_MAJOR_UNITS) {
    return {
      success: false as const,
      error: new z.ZodError([
        {
          code: "custom",
          path: ["amount"],
          message: WEB_PAYOUT_LIMIT_MESSAGE,
        },
      ]),
    };
  }

  return result;
}

export type PayoutFormFieldErrors = {
  amount?: string;
  iban?: string;
};

/**
 * Returns field-level error messages from validation. Use for inline form errors.
 */
export function getPayoutFormFieldErrors(data: {
  amount: string;
  currency: (typeof CURRENCIES)[number];
  iban: string;
}): PayoutFormFieldErrors {
  const result = validatePayoutForm(data);
  if (result.success) return {};
  const fieldErrors = result.error.flatten().fieldErrors as Partial<
    Record<"amount" | "iban", string[]>
  >;
  return {
    amount: fieldErrors.amount?.[0],
    iban: fieldErrors.iban?.[0],
  };
}
