import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { http, HttpResponse } from "msw";

import { API_BASE_URL } from "@/constants";
import { createQueryClientWrapper } from "@/lib/test-utils";
import { server } from "@/mocks/server.jest";

import PayoutsScreen from "./(tabs)/payouts";

const { wrapper, queryClient } = createQueryClientWrapper();

jest.mock("@/hooks/use-color-scheme", () => ({
  useColorScheme: () => "light",
}));

describe("PayoutsScreen", () => {
  it("renders form with title Send Payout", () => {
    render(<PayoutsScreen />, { wrapper });

    expect(screen.getByText("Send Payout")).toBeTruthy();
    expect(screen.getByPlaceholderText("0.00")).toBeTruthy();
    expect(screen.getByText("GBP")).toBeTruthy();
    expect(screen.getByText("Confirm")).toBeTruthy();
  });

  it("does not show confirmation modal when form is invalid", () => {
    render(<PayoutsScreen />, { wrapper });

    fireEvent.press(screen.getByText("Confirm"));
    expect(screen.queryByText("Confirm Payout")).toBeNull();
  });

  it("shows confirmation modal when valid form is submitted", async () => {
    render(<PayoutsScreen />, { wrapper });

    fireEvent.changeText(screen.getByPlaceholderText("0.00"), "400");
    fireEvent.changeText(
      screen.getByPlaceholderText(/FR12/),
      "FR12123451234512345678901234567890"
    );

    fireEvent.press(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(screen.getByText("Confirm Payout")).toBeTruthy();
      expect(screen.getByText("£400.00")).toBeTruthy();
      expect(screen.getByText("Cancel")).toBeTruthy();
    });
  });

  it("shows success view after successful payout", async () => {
    render(<PayoutsScreen />, { wrapper });

    fireEvent.changeText(screen.getByPlaceholderText("0.00"), "400");
    fireEvent.changeText(
      screen.getByPlaceholderText(/FR12/),
      "FR12123451234512345678901234567890"
    );
    fireEvent.press(screen.getByText("Confirm"));

    await waitFor(() => expect(screen.getByText("Confirm Payout")).toBeTruthy());

    fireEvent.press(screen.getByLabelText("Confirm payout"));

    await waitFor(() => {
      expect(screen.getByText("Payout Completed")).toBeTruthy();
      expect(screen.getByText(/Your payout of £400.00 has been processed/)).toBeTruthy();
      expect(screen.getByText("Create Another Payout")).toBeTruthy();
    });
  });

  it("shows error view with message on insufficient funds from API", async () => {
    server.use(
      http.post(`${API_BASE_URL}/api/payouts`, () => {
        return HttpResponse.json(
          { error: "Insufficient funds" },
          { status: 400 }
        );
      })
    );

    render(<PayoutsScreen />, { wrapper });

    fireEvent.changeText(screen.getByPlaceholderText("0.00"), "888.88");
    fireEvent.changeText(
      screen.getByPlaceholderText(/FR12/),
      "FR12123451234512345678901234567890"
    );
    fireEvent.press(screen.getByText("Confirm"));

    await waitFor(() => expect(screen.getByText("Confirm Payout")).toBeTruthy());

    fireEvent.press(screen.getByLabelText("Confirm payout"));

    await waitFor(() => {
      expect(screen.getByText("Unable to Process Payout")).toBeTruthy();
      expect(screen.getByText("Insufficient funds.")).toBeTruthy();
      expect(screen.getByText("Try Again")).toBeTruthy();
    });
  });

  it("shows error view on 500 Internal Server Error from API", async () => {
    render(<PayoutsScreen />, { wrapper });

    fireEvent.changeText(screen.getByPlaceholderText("0.00"), "777.77");
    fireEvent.changeText(
      screen.getByPlaceholderText(/FR12/),
      "FR12123451234512345678901234567890"
    );
    fireEvent.press(screen.getByText("Confirm"));

    await waitFor(() => expect(screen.getByText("Confirm Payout")).toBeTruthy());

    fireEvent.press(screen.getByLabelText("Confirm payout"));

    await waitFor(() => {
      expect(screen.getByText("Unable to Process Payout")).toBeTruthy();
      expect(screen.getByText("Internal Server Error")).toBeTruthy();
      expect(screen.getByText("Try Again")).toBeTruthy();
    });
  });

  it("shows error view for client-side insufficient funds when amount exceeds balance", async () => {
    queryClient.clear();

    server.use(
      http.get(`${API_BASE_URL}/api/merchant`, () => {
        return HttpResponse.json({
          available_balance: 40000, // 400.00 GBP
          pending_balance: 25000,
          currency: "GBP",
          activity: [],
        });
      })
    );

    render(<PayoutsScreen />, { wrapper });

    await waitFor(() => expect(screen.getByText("Confirm")).toBeTruthy());

    fireEvent.changeText(screen.getByPlaceholderText("0.00"), "500");
    fireEvent.changeText(
      screen.getByPlaceholderText(/FR12/),
      "FR12123451234512345678901234567890"
    );
    fireEvent.press(screen.getByText("Confirm"));

    await waitFor(() => expect(screen.getByText("Confirm Payout")).toBeTruthy());

    fireEvent.press(screen.getByLabelText("Confirm payout"));

    await waitFor(() => {
      expect(screen.getByText("Unable to Process Payout")).toBeTruthy();
      expect(screen.getByText("Insufficient funds.")).toBeTruthy();
      expect(screen.getByText("Try Again")).toBeTruthy();
    });
  });
});
