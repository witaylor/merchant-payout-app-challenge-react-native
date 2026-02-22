import { maskIban, normalizeIban } from "./iban";

describe("normalizeIban", () => {
  it("trims and uppercases", () => {
    expect(normalizeIban("  fr1212345678901234  ")).toBe("FR1212345678901234");
  });

  it("removes internal spaces", () => {
    expect(normalizeIban("FR 12 12 34 56 78 90 12 34")).toBe("FR1212345678901234");
  });

  it("handles empty string", () => {
    expect(normalizeIban("")).toBe("");
  });

  it("handles already normalized input", () => {
    expect(normalizeIban("FR1212345678901234")).toBe("FR1212345678901234");
  });
});

describe("maskIban", () => {
  it("masks IBAN showing first 4 and last 4 characters", () => {
    const iban = "FR1212345123451234567A12310131231231231";
    const result = maskIban(iban);
    expect(result.startsWith("FR12")).toBe(true);
    expect(result.endsWith("1231")).toBe(true);
    expect(result.length).toBe(iban.length);
  });

  it("returns full string when length <= 8", () => {
    expect(maskIban("FR1234")).toBe("FR1234");
    expect(maskIban("12345678")).toBe("12345678");
  });

  it("trims whitespace before masking", () => {
    expect(maskIban("  FR1212345678901234  ")).toBe("FR12**********1234");
  });

  it("handles empty string", () => {
    expect(maskIban("")).toBe("");
  });
});
