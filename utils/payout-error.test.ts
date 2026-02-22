import { getPayoutErrorMessage } from "./payout-error";

describe("getPayoutErrorMessage", () => {
  it("returns Insufficient funds for insufficient funds error", () => {
    expect(getPayoutErrorMessage(new Error("Insufficient funds"))).toBe(
      "Insufficient funds."
    );
  });

  it("returns service unavailable message for 503 error", () => {
    expect(
      getPayoutErrorMessage(new Error("Service temporarily unavailable"))
    ).toBe("Service temporarily unavailable. Please try again later.");
  });

  it("returns network error for fetch failures", () => {
    expect(
      getPayoutErrorMessage(new Error("Failed to fetch"))
    ).toBe(
      "A network error occurred. Please check your connection and try again."
    );
    expect(
      getPayoutErrorMessage(new Error("Network request failed"))
    ).toBe(
      "A network error occurred. Please check your connection and try again."
    );
  });

  it("returns original message for unknown errors", () => {
    expect(getPayoutErrorMessage(new Error("Custom error"))).toBe("Custom error");
  });
});
