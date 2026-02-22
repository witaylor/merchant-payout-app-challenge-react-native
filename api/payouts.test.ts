import { http, HttpResponse } from "msw";

import { API_BASE_URL } from "@/constants";
import { server } from "@/mocks/server.jest";

import { createPayout } from "./payouts";

describe("createPayout", () => {
  it("returns payout on success", async () => {
    const result = await createPayout({
      amount: 40000,
      currency: "GBP",
      iban: "FR1212345123451234567A12310131231231231",
    });

    expect(result).toMatchObject({
      id: expect.any(String),
      status: expect.stringMatching(/^(completed|failed)$/),
      amount: 40000,
      currency: "GBP",
      iban: "FR1212345123451234567A12310131231231231",
      created_at: expect.any(String),
    });
  });

  it("throws with Insufficient funds on amount 88888", async () => {
    await expect(
      createPayout({ amount: 88888, currency: "GBP", iban: "FR123" })
    ).rejects.toThrow("Insufficient funds");
  });

  it("throws with Service unavailable on amount 99999", async () => {
    await expect(
      createPayout({ amount: 99999, currency: "EUR", iban: "DE123" })
    ).rejects.toThrow("Service temporarily unavailable");
  });

  it("throws on other 4xx/5xx with API error message", async () => {
    server.use(
      http.post(`${API_BASE_URL}/api/payouts`, () => {
        return HttpResponse.json(
          { error: "Invalid IBAN format" },
          { status: 400 }
        );
      })
    );

    await expect(
      createPayout({ amount: 10000, currency: "GBP", iban: "invalid" })
    ).rejects.toThrow("Invalid IBAN format");
  });

  it("throws with status fallback when error body has no message", async () => {
    server.use(
      http.post(`${API_BASE_URL}/api/payouts`, () => {
        return HttpResponse.json({}, { status: 500 });
      })
    );

    await expect(
      createPayout({ amount: 10000, currency: "GBP", iban: "FR123" })
    ).rejects.toThrow("Failed to fetch payout: 500");
  });
});
