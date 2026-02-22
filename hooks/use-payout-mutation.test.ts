import { renderHook, waitFor } from "@testing-library/react-native";
import { http, HttpResponse } from "msw";

import { API_BASE_URL } from "@/constants";
import { createQueryClientWrapper } from "@/lib/test-utils";
import { server } from "@/mocks/server.jest";

import { usePayoutMutation } from "./use-payout-mutation";

const { wrapper } = createQueryClientWrapper();

describe("usePayoutMutation", () => {
  it("resolves with payout on success", async () => {
    const { result } = renderHook(() => usePayoutMutation(), { wrapper });

    result.current.mutate({
      amount: 40000,
      currency: "GBP",
      iban: "FR1212345123451234567A12310131231231231",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchObject({
      amount: 40000,
      currency: "GBP",
      status: expect.any(String),
    });
  });

  it("rejects with error message on API failure", async () => {
    server.use(
      http.post(`${API_BASE_URL}/api/payouts`, () => {
        return HttpResponse.json(
          { error: "Insufficient funds" },
          { status: 400 }
        );
      })
    );

    const { result } = renderHook(() => usePayoutMutation(), { wrapper });

    result.current.mutate({
      amount: 88888,
      currency: "GBP",
      iban: "FR123",
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe("Insufficient funds");
  });
});
