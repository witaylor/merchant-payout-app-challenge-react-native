import { formatAmount, formatDate } from "./format";

describe("formatAmount", () => {
  it("formats amount with correct symbol and thousand separators", () => {
    expect(formatAmount(500000, "GBP")).toBe("£5,000.00");
    expect(formatAmount(123456, "EUR")).toBe("€1,234.56");
  });

  it("formats small amount and zero", () => {
    expect(formatAmount(100, "GBP")).toBe("£1.00");
    expect(formatAmount(0, "GBP")).toBe("£0.00");
  });

  it("formats negative and decimal amounts", () => {
    expect(formatAmount(-50000, "GBP")).toBe("£-500.00");
    expect(formatAmount(99999, "GBP")).toBe("£999.99");
  });
});

describe("formatDate", () => {
  it("formats ISO and date-only strings to DD MM YYYY", () => {
    expect(formatDate("2026-02-17T17:21:34.658Z")).toBe("17 02 2026");
    expect(formatDate("2026-01-05")).toBe("05 01 2026");
  });
});
