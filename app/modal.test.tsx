import { fireEvent, render, screen } from "@testing-library/react-native";
import { http, HttpResponse } from "msw";

import { API_BASE_URL } from "@/constants";
import { createQueryClientWrapper } from "@/lib/test-utils";
import { getPaginatedActivity } from "@/mocks/data";
import { server } from "@/mocks/server.jest";

const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ back: mockBack }),
}));
jest.mock("@/hooks/use-color-scheme", () => ({
  useColorScheme: () => "light",
}));

import ModalScreen from "./modal";

const { wrapper: QueryWrapper, queryClient } = createQueryClientWrapper();

function renderModal() {
  return render(<ModalScreen />, { wrapper: QueryWrapper });
}

describe("ModalScreen", () => {
  afterEach(() => {
    queryClient.clear();
  });

  beforeEach(() => {
    mockBack.mockClear();
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

  it("renders header with title and Done button", async () => {
    renderModal();

    await expect(screen.findByText("Recent Activity")).resolves.toBeTruthy();
    expect(screen.getByText("Done")).toBeTruthy();
  });

  it("renders activity list items when loaded", async () => {
    renderModal();

    await expect(
      screen.findByText("Payment from Customer ABC", {}, { timeout: 5000 }),
    ).resolves.toBeTruthy();
    expect(screen.getByText("Payout to Bank Account ****1234")).toBeTruthy();
  });

  it("calls router.back when Done is pressed", async () => {
    renderModal();
    await screen.findByText("Done");

    fireEvent.press(screen.getByText("Done"));

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("shows loading view initially", () => {
    renderModal();

    expect(screen.getByTestId("loading-indicator")).toBeTruthy();
  });

  it("shows error view when the API fails", async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/merchant/activity`, () => {
        return HttpResponse.json(
          { error: "Network failed" },
          { status: 500 },
        );
      }),
    );

    renderModal();

    await expect(
      screen.findByText("Network failed", {}, { timeout: 5000 }),
    ).resolves.toBeTruthy();
    expect(screen.getByText("Retry")).toBeTruthy();
  });

  it("shows empty state when no activities", async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/merchant/activity`, () => {
        return HttpResponse.json({
          items: [],
          next_cursor: null,
          has_more: false,
        });
      }),
    );

    renderModal();

    await expect(
      screen.findByText("No recent activity"),
    ).resolves.toBeTruthy();
  });
});
