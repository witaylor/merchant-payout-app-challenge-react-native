import { renderHook, waitFor } from "@testing-library/react-native";
import { http, HttpResponse } from "msw";

import { API_BASE_URL } from "@/constants";
import { createQueryClientWrapper } from "@/lib/test-utils";
import { getPaginatedActivity } from "@/mocks/data";
import { server } from "@/mocks/server.jest";

import { useActivity } from "./use-activity";

const { wrapper, queryClient } = createQueryClientWrapper();

describe("useActivity", () => {
  afterEach(() => {
    queryClient.clear();
  });

  beforeEach(() => {
    server.use(
      http.get(`${API_BASE_URL}/api/merchant/activity`, ({ request }) => {
        const url = new URL(request.url);
        const cursor = url.searchParams.get("cursor");
        const limit = parseInt(url.searchParams.get("limit") ?? "15", 10);
        const result = getPaginatedActivity(cursor, limit);
        return HttpResponse.json(result);
      }),
    );
  });

  it("returns loading state initially", () => {
    const { result } = renderHook(() => useActivity(), { wrapper });

    expect(result.current.isLoading).toBe(true);
  });

  it("fetches first page and returns activity items", async () => {
    const { result } = renderHook(() => useActivity(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), {
      timeout: 5000,
    });

    const data = result.current.data!;
    expect(data.pages).toHaveLength(1);
    expect(data.pages[0].items.length).toBeGreaterThan(0);
    expect(data.pages[0].items[0]).toMatchObject({
      id: expect.any(String),
      type: expect.any(String),
      amount: expect.any(Number),
      description: expect.any(String),
    });
  });

  it("provides getNextPageParam from next_cursor when has_more", async () => {
    const { result } = renderHook(() => useActivity(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), {
      timeout: 5000,
    });

    expect(result.current.hasNextPage).toBe(true);
  });

  it("returns error state when the API fails", async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/merchant/activity`, () => {
        return HttpResponse.json({ error: "Server Error" }, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useActivity(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true), {
      timeout: 5000,
    });

    expect(result.current.error?.message).toContain("Server Error");
  });

  it("fetches next page with cursor when fetchNextPage is called", async () => {
    const requestUrls: string[] = [];
    server.use(
      http.get(`${API_BASE_URL}/api/merchant/activity`, ({ request }) => {
        requestUrls.push(request.url);
        const url = new URL(request.url);
        const cursor = url.searchParams.get("cursor");
        const limit = parseInt(url.searchParams.get("limit") ?? "15", 10);
        const result = getPaginatedActivity(cursor, limit);
        return HttpResponse.json(result);
      }),
    );

    const { result } = renderHook(() => useActivity(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), {
      timeout: 5000,
    });

    const firstPageItemCount = result.current.activities.length;
    expect(requestUrls).toHaveLength(1);
    expect(new URL(requestUrls[0]).searchParams.has("cursor")).toBe(false);

    void result.current.fetchNextPage();

    await waitFor(
      () => {
        expect(requestUrls.length).toBeGreaterThanOrEqual(2);
        const secondRequestUrl = new URL(requestUrls[1]);
        expect(secondRequestUrl.searchParams.has("cursor")).toBe(true);
        expect(result.current.activities.length).toBeGreaterThan(
          firstPageItemCount,
        );
        return true;
      },
      { timeout: 5000 },
    );
  });
});
