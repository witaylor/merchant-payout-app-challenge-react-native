import {
  formatPayoutAmountForDisplay,
  toMinorUnits,
} from "./payout";

describe("toMinorUnits", () => {
  it("converts major units to minor (pence/cents)", () => {
    expect(toMinorUnits(400)).toBe(40000);
    expect(toMinorUnits("400")).toBe(40000);
  });

  it("rounds to nearest minor unit", () => {
    expect(toMinorUnits(1.234)).toBe(123);
    expect(toMinorUnits(1.235)).toBe(124);
  });

  it("returns 0 for invalid or non-positive input", () => {
    expect(toMinorUnits(0)).toBe(0);
    expect(toMinorUnits(-1)).toBe(0);
    expect(toMinorUnits(NaN)).toBe(0);
    expect(toMinorUnits("")).toBe(0);
    expect(toMinorUnits("abc")).toBe(0);
  });
});

describe("formatPayoutAmountForDisplay", () => {
  it("formats GBP amounts", () => {
    expect(formatPayoutAmountForDisplay(400, "GBP")).toBe("£400.00");
    expect(formatPayoutAmountForDisplay("1.50", "GBP")).toBe("£1.50");
  });

  it("formats EUR amounts", () => {
    expect(formatPayoutAmountForDisplay(400, "EUR")).toBe("€400.00");
  });

  it("handles zero and invalid input", () => {
    expect(formatPayoutAmountForDisplay(0, "GBP")).toBe("£0.00");
    expect(formatPayoutAmountForDisplay("", "GBP")).toBe("£0.00");
  });
});
