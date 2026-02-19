import { http, HttpResponse } from "msw";

import { API_BASE_URL } from "@/constants";

import {
  generateMockActivity,
  getAvailableBalance,
  getCurrentCurrency,
  getPendingBalance,
} from "../mocks/data";
import { server } from "../mocks/server.jest";

import { getPaginatedActivity } from "../mocks/data";
import { fetchActivity, fetchMerchant } from "./merchant";

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

describe("fetchActivity", () => {
  beforeEach(() => {
    server.use(
      http.get(`${API_BASE_URL}/api/merchant/activity`, ({ request }) => {
        const url = new URL(request.url);
        const cursor = url.searchParams.get("cursor");
        const limit = parseInt(url.searchParams.get("limit") || "15", 10);
        const result = getPaginatedActivity(cursor, limit);
        return HttpResponse.json(result);
      }),
    );
  });

  it("returns paginated response on success", async () => {
    const result = await fetchActivity();

    expect(Array.isArray(result.items)).toBe(true);
    expect(typeof result.has_more).toBe("boolean");
    expect(result.next_cursor === null || typeof result.next_cursor === "string").toBe(true);

    if (result.items.length > 0) {
      expect(result.items[0]).toMatchObject({
        id: expect.any(String),
        type: expect.stringMatching(/^(payout|deposit|refund|fee)$/),
        amount: expect.any(Number),
        currency: expect.stringMatching(/^(GBP|EUR)$/),
        date: expect.any(String),
        description: expect.any(String),
        status: expect.any(String),
      });
    }
  });

  it("handles cursor and limit query params", async () => {
    const firstPage = await fetchActivity(null, 5);
    expect(firstPage.items.length).toBeLessThanOrEqual(5);

    if (firstPage.next_cursor) {
      const secondPage = await fetchActivity(firstPage.next_cursor, 5);
      expect(secondPage.items.length).toBeLessThanOrEqual(5);
      expect(secondPage.items[0]?.id).not.toBe(firstPage.items[0]?.id);
    }
  });

  it("throws on non-ok response", async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/merchant/activity`, () => {
        return HttpResponse.json(
          { error: "Service Unavailable" },
          { status: 503 },
        );
      }),
    );

    await expect(fetchActivity()).rejects.toThrow("Service Unavailable");
  });

  it("throws with status fallback when error body has no message", async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/merchant/activity`, () => {
        return HttpResponse.json({}, { status: 500 });
      }),
    );

    await expect(fetchActivity()).rejects.toThrow(
      "Failed to fetch activity: 500",
    );
  });
});
