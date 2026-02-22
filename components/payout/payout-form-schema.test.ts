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

  it("normalizes IBAN (uppercase, no spaces)", () => {
    const result = validatePayoutForm({
      amount: "100",
      currency: "EUR",
      iban: "  fr12 1234 5678 9012 3456 7890 1234 56  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.iban).toBe("FR1212345678901234567890123456");
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
});
