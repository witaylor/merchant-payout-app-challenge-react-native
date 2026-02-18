import { renderHook, waitFor } from "@testing-library/react-native";
import { http, HttpResponse } from "msw";

import { API_BASE_URL } from "@/constants";
import { createQueryClientWrapper } from "@/lib/test-utils";

import {
  generateMockActivity,
  getAvailableBalance,
  getCurrentCurrency,
  getPendingBalance,
} from "../mocks/data";
import { server } from "../mocks/server.jest";

import { useMerchant } from "./use-merchant";

const { wrapper, queryClient } = createQueryClientWrapper();

describe("useMerchant", () => {
  afterEach(() => {
    queryClient.clear();
  });

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

  it("returns loading state initially", () => {
    const { result } = renderHook(() => useMerchant(), { wrapper });

    expect(result.current.isLoading).toBe(true);
  });

  it("fetches and returns merchant data on success", async () => {
    const { result } = renderHook(() => useMerchant(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), {
      timeout: 5000,
    });

    const data = result.current.data!;
    expect(data).toMatchObject({
      available_balance: expect.any(Number),
      pending_balance: expect.any(Number),
      currency: expect.stringMatching(/^(GBP|EUR)$/),
    });
    expect(Array.isArray(data.activity)).toBe(true);
  });

  it("returns error state when the API fails", async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/merchant`, () => {
        return HttpResponse.json(
          { error: "Internal Server Error" },
          { status: 500 },
        );
      }),
    );

    const { result } = renderHook(() => useMerchant(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true), {
      timeout: 5000,
    });

    expect(result.current.error?.message).toContain("Internal Server Error");
  });
});
