import { http, HttpResponse } from "msw";

import { API_BASE_URL } from "@/constants";

import {
  generateMockActivity,
  getAvailableBalance,
  getCurrentCurrency,
  getPendingBalance,
} from "../mocks/data";
import { server } from "../mocks/server.jest";

import { fetchMerchant } from "./merchant";

describe("fetchMerchant", () => {
  beforeEach(() => {
    server.use(
      http.get(`${API_BASE_URL}/api/merchant`, () => {
        return HttpResponse.json({
          available_balance: getAvailableBalance(),
          pending_balance: getPendingBalance(),
          currency: getCurrentCurrency(),
          activity: generateMockActivity(),
        });
      }),
    );
  });

  it("returns merchant data on success", async () => {
    const result = await fetchMerchant();

    expect(result).toMatchObject({
      available_balance: expect.any(Number),
      pending_balance: expect.any(Number),
      currency: expect.stringMatching(/^(GBP|EUR)$/),
    });
    expect(Array.isArray(result.activity)).toBe(true);
  });

  it("throws with API error message when response is not ok", async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/merchant`, () => {
        return HttpResponse.json(
          { error: "Internal Server Error" },
          { status: 500 },
        );
      }),
    );

    await expect(fetchMerchant()).rejects.toThrow("Internal Server Error");
  });

  it("throws with status fallback when error body has no message", async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/merchant`, () => {
        return HttpResponse.json({}, { status: 503 });
      }),
    );

    await expect(fetchMerchant()).rejects.toThrow(
      "Failed to fetch merchant: 503",
    );
  });
});
