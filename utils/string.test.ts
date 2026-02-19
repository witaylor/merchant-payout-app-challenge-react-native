import { capitalize } from "./string";

describe("capitalize", () => {
  it("capitalizes the first character", () => {
    expect(capitalize("deposit")).toBe("Deposit");
    expect(capitalize("payout")).toBe("Payout");
  });

  it("handles single character", () => {
    expect(capitalize("a")).toBe("A");
  });
});
