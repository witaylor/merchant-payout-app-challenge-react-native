import { Platform } from "react-native";

import { WEB_PAYOUT_LIMIT_MESSAGE } from "@/utils/payout-error";

import {
  getPayoutFormFieldErrors,
  validatePayoutForm,
} from "./payout-form-schema";

describe("validatePayoutForm", () => {
  it("passes valid form data", () => {
    const result = validatePayoutForm({
      amount: "400.50",
      currency: "GBP",
      iban: "FR12123451234512345678901234567890",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.amount).toBe(400.5);
      expect(result.data.currency).toBe("GBP");
      expect(result.data.iban).toBe("FR12123451234512345678901234567890");
    }
  });

  it("normalizes IBAN (uppercase) when no spaces", () => {
    const result = validatePayoutForm({
      amount: "100",
      currency: "EUR",
      iban: "  fr1212345678901234567890123456  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.iban).toBe("FR1212345678901234567890123456");
    }
  });

  it("fails when IBAN contains spaces", () => {
    const result = validatePayoutForm({
      amount: "100",
      currency: "EUR",
      iban: "FR12 1234 5678 9012 3456 7890 1234 56",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors as Partial<
        Record<"amount" | "iban", string[]>
      >;
      expect(fieldErrors.iban?.[0]).toMatch(/must not contain spaces/);
    }
  });

  it("fails when amount is empty", () => {
    const result = validatePayoutForm({
      amount: "",
      currency: "GBP",
      iban: "FR12123451234512345678901234567890",
    });
    expect(result.success).toBe(false);
  });

  it("fails when amount is zero", () => {
    const result = validatePayoutForm({
      amount: "0",
      currency: "GBP",
      iban: "FR12123451234512345678901234567890",
    });
    expect(result.success).toBe(false);
  });

  it("fails when amount is negative", () => {
    const result = validatePayoutForm({
      amount: "-10",
      currency: "GBP",
      iban: "FR12123451234512345678901234567890",
    });
    expect(result.success).toBe(false);
  });

  it("fails when amount has more than 2 decimal places", () => {
    const result = validatePayoutForm({
      amount: "10.999",
      currency: "GBP",
      iban: "FR12123451234512345678901234567890",
    });
    expect(result.success).toBe(false);
  });

  it("fails when IBAN is too short", () => {
    const result = validatePayoutForm({
      amount: "100",
      currency: "GBP",
      iban: "FR1234",
    });
    expect(result.success).toBe(false);
  });

  it("fails when IBAN has invalid structure (must start with 2 letters, 2 digits)", () => {
    const result = validatePayoutForm({
      amount: "100",
      currency: "GBP",
      iban: "1R121234512345123456789012345678",
    });
    expect(result.success).toBe(false);
  });

  it("fails when amount exceeds £1,000 on web platform", () => {
    const originalOS = Platform.OS;
    (Platform as { OS: string }).OS = "web";
    try {
      const result = validatePayoutForm({
        amount: "1500",
        currency: "GBP",
        iban: "FR12123451234512345678901234567890",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors as Partial<
          Record<"amount" | "iban", string[]>
        >;
        expect(fieldErrors.amount?.[0]).toBe(WEB_PAYOUT_LIMIT_MESSAGE);
      }
    } finally {
      (Platform as { OS: string }).OS = originalOS;
    }
  });

  it("passes when amount exceeds £1,000 on native platform", () => {
    const originalOS = Platform.OS;
    (Platform as { OS: string }).OS = "ios";
    try {
      const result = validatePayoutForm({
        amount: "1500",
        currency: "GBP",
        iban: "FR12123451234512345678901234567890",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.amount).toBe(1500);
      }
    } finally {
      (Platform as { OS: string }).OS = originalOS;
    }
  });
});

describe("getPayoutFormFieldErrors", () => {
  it("returns empty object for valid data", () => {
    expect(
      getPayoutFormFieldErrors({
        amount: "400",
        currency: "GBP",
        iban: "FR12123451234512345678901234567890",
      })
    ).toEqual({});
  });

  it("returns amount error for invalid amount", () => {
    const errors = getPayoutFormFieldErrors({
      amount: "-5",
      currency: "GBP",
      iban: "FR12123451234512345678901234567890",
    });
    expect(errors.amount).toBe("Amount must be positive");
  });

  it("returns iban error for invalid IBAN format", () => {
    const errors = getPayoutFormFieldErrors({
      amount: "100",
      currency: "GBP",
      iban: "FR12",
    });
    expect(errors.iban).toMatch(/15-34|2 letters/);
  });

  it("returns amount error for amount over £1,000 on web", () => {
    const originalOS = Platform.OS;
    (Platform as { OS: string }).OS = "web";
    try {
      const errors = getPayoutFormFieldErrors({
        amount: "1500",
        currency: "GBP",
        iban: "FR12123451234512345678901234567890",
      });
      expect(errors.amount).toBe(WEB_PAYOUT_LIMIT_MESSAGE);
    } finally {
      (Platform as { OS: string }).OS = originalOS;
    }
  });
});
