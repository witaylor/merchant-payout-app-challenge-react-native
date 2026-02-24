import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { http, HttpResponse } from "msw";
import { Platform } from "react-native";

import { API_BASE_URL } from "@/constants";
import { createQueryClientWrapper } from "@/lib/test-utils";
import { server } from "@/mocks/server.jest";
import type { CreatePayoutRequest } from "@/types/api";

import PayoutsScreen from "./(tabs)/payouts";

const { wrapper, queryClient } = createQueryClientWrapper();

jest.mock("@/hooks/use-color-scheme", () => ({
  useColorScheme: () => "light",
}));

const mockGetDeviceId = jest.fn((): string | null => "test-device-id-123");
const mockIsBiometricAuthenticated = jest.fn(() => Promise.resolve(true));
jest.mock("screen-security", () => ({
  getDeviceId: () => mockGetDeviceId(),
  isBiometricAuthenticated: () => mockIsBiometricAuthenticated(),
  addScreenshotTakenListener: () => ({ remove: () => {} }),
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

  it("includes device_id in payout request when getDeviceId returns a value", async () => {
    let capturedBody: CreatePayoutRequest | null = null;
    server.use(
      http.post(`${API_BASE_URL}/api/payouts`, async ({ request }) => {
        capturedBody = (await request.json()) as CreatePayoutRequest;
        return HttpResponse.json(
          {
            id: "payout_test",
            status: "completed",
            amount: 40000,
            currency: "GBP",
            iban: "FR12123451234512345678901234567890",
            created_at: new Date().toISOString(),
          },
          { status: 201 }
        );
      })
    );

    render(<PayoutsScreen />, { wrapper });

    fireEvent.changeText(screen.getByPlaceholderText("0.00"), "400");
    fireEvent.changeText(
      screen.getByPlaceholderText(/FR12/),
      "FR12123451234512345678901234567890"
    );
    fireEvent.press(screen.getByText("Confirm"));

    await waitFor(() => expect(screen.getByText("Confirm Payout")).toBeTruthy());

    fireEvent.press(screen.getByLabelText("Confirm payout"));

    await waitFor(() => expect(screen.getByText("Payout Completed")).toBeTruthy());

    expect(capturedBody).toMatchObject({
      amount: 40000,
      currency: "GBP",
      iban: "FR12123451234512345678901234567890",
      device_id: "test-device-id-123",
    });
  });

  it("omits device_id from payout request when getDeviceId returns null", async () => {
    mockGetDeviceId.mockReturnValueOnce(null);

    let capturedBody: CreatePayoutRequest | null = null;
    server.use(
      http.post(`${API_BASE_URL}/api/payouts`, async ({ request }) => {
        capturedBody = (await request.json()) as CreatePayoutRequest;
        return HttpResponse.json(
          {
            id: "payout_test",
            status: "completed",
            amount: 40000,
            currency: "GBP",
            iban: "FR12123451234512345678901234567890",
            created_at: new Date().toISOString(),
          },
          { status: 201 }
        );
      })
    );

    render(<PayoutsScreen />, { wrapper });

    fireEvent.changeText(screen.getByPlaceholderText("0.00"), "400");
    fireEvent.changeText(
      screen.getByPlaceholderText(/FR12/),
      "FR12123451234512345678901234567890"
    );
    fireEvent.press(screen.getByText("Confirm"));

    await waitFor(() => expect(screen.getByText("Confirm Payout")).toBeTruthy());

    fireEvent.press(screen.getByLabelText("Confirm payout"));

    await waitFor(() => expect(screen.getByText("Payout Completed")).toBeTruthy());

    expect(capturedBody).toMatchObject({
      amount: 40000,
      currency: "GBP",
      iban: "FR12123451234512345678901234567890",
    });
    expect(capturedBody).not.toHaveProperty("device_id");
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

  it("shows error view on 503 Service Unavailable from API", async () => {
    render(<PayoutsScreen />, { wrapper });

    fireEvent.changeText(screen.getByPlaceholderText("0.00"), "999.99");
    fireEvent.changeText(
      screen.getByPlaceholderText(/FR12/),
      "FR12123451234512345678901234567890"
    );
    fireEvent.press(screen.getByText("Confirm"));

    await waitFor(() => expect(screen.getByText("Confirm Payout")).toBeTruthy());

    fireEvent.press(screen.getByLabelText("Confirm payout"));

    await waitFor(() => {
      expect(screen.getByText("Unable to Process Payout")).toBeTruthy();
      expect(
        screen.getByText("Service temporarily unavailable. Please try again later.")
      ).toBeTruthy();
      expect(screen.getByText("Try Again")).toBeTruthy();
    });
  });

  it("shows insufficient funds hint under amount when amount exceeds balance", async () => {
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
    fireEvent(screen.getByPlaceholderText("0.00"), "blur");

    await waitFor(() => {
      expect(screen.getByText("Insufficient funds.")).toBeTruthy();
    });

    fireEvent.press(screen.getByText("Confirm"));
    expect(screen.queryByText("Confirm Payout")).toBeNull();
  });

  it("proceeds without biometric when payout is £1,000 or less", async () => {
    mockIsBiometricAuthenticated.mockClear();
    queryClient.clear();

    server.use(
      http.get(`${API_BASE_URL}/api/merchant`, () =>
        HttpResponse.json({
          available_balance: 500000,
          pending_balance: 25000,
          currency: "GBP",
          activity: [],
        })
      )
    );

    render(<PayoutsScreen />, { wrapper });

    await waitFor(() => expect(screen.getByText("Confirm")).toBeTruthy());

    fireEvent.changeText(screen.getByPlaceholderText("0.00"), "1000");
    fireEvent.changeText(
      screen.getByPlaceholderText(/FR12/),
      "FR12123451234512345678901234567890"
    );
    fireEvent.press(screen.getByText("Confirm"));

    await waitFor(() => expect(screen.getByText("Confirm Payout")).toBeTruthy());

    fireEvent.press(screen.getByLabelText("Confirm payout"));

    await waitFor(() => expect(screen.getByText("Payout Completed")).toBeTruthy());

    expect(mockIsBiometricAuthenticated).not.toHaveBeenCalled();
  });

  it("proceeds with payout over £1,000 when biometric authenticates successfully", async () => {
    mockIsBiometricAuthenticated.mockResolvedValueOnce(true);
    queryClient.clear();

    server.use(
      http.get(`${API_BASE_URL}/api/merchant`, () =>
        HttpResponse.json({
          available_balance: 500000,
          pending_balance: 25000,
          currency: "GBP",
          activity: [],
        })
      )
    );

    render(<PayoutsScreen />, { wrapper });

    await waitFor(() => expect(screen.getByText("Confirm")).toBeTruthy());

    fireEvent.changeText(screen.getByPlaceholderText("0.00"), "1500");
    fireEvent.changeText(
      screen.getByPlaceholderText(/FR12/),
      "FR12123451234512345678901234567890"
    );
    fireEvent.press(screen.getByText("Confirm"));

    await waitFor(() => expect(screen.getByText("Confirm Payout")).toBeTruthy());

    fireEvent.press(screen.getByLabelText("Confirm payout"));

    await waitFor(() => expect(screen.getByText("Payout Completed")).toBeTruthy());

    expect(mockIsBiometricAuthenticated).toHaveBeenCalled();
  });

  it("shows error view when user cancels or fails biometric for payout over £1,000", async () => {
    mockIsBiometricAuthenticated.mockResolvedValueOnce(false);
    queryClient.clear();

    server.use(
      http.get(`${API_BASE_URL}/api/merchant`, () =>
        HttpResponse.json({
          available_balance: 500000,
          pending_balance: 25000,
          currency: "GBP",
          activity: [],
        })
      )
    );

    render(<PayoutsScreen />, { wrapper });

    await waitFor(() => expect(screen.getByText("Confirm")).toBeTruthy());

    fireEvent.changeText(screen.getByPlaceholderText("0.00"), "1500");
    fireEvent.changeText(
      screen.getByPlaceholderText(/FR12/),
      "FR12123451234512345678901234567890"
    );
    fireEvent.press(screen.getByText("Confirm"));

    await waitFor(() => expect(screen.getByText("Confirm Payout")).toBeTruthy());

    fireEvent.press(screen.getByLabelText("Confirm payout"));

    await waitFor(() => {
      expect(screen.getByText("Unable to Process Payout")).toBeTruthy();
      expect(screen.getByText("Biometric authentication was cancelled.")).toBeTruthy();
      expect(screen.getByText("Try Again")).toBeTruthy();
    });
  });

  it("blocks payouts over £1,000 on web with appropriate message", async () => {
    const originalOS = Platform.OS;
    (Platform as { OS: string }).OS = "web";

    try {
      render(<PayoutsScreen />, { wrapper });

      await waitFor(() => expect(screen.getByText("Confirm")).toBeTruthy());

      fireEvent.changeText(screen.getByPlaceholderText("0.00"), "1500");
      fireEvent.changeText(
        screen.getByPlaceholderText(/FR12/),
        "FR12123451234512345678901234567890"
      );
      fireEvent(screen.getByPlaceholderText("0.00"), "blur");

      await waitFor(() => {
        expect(
          screen.getByText(
            "Payouts over £1,000 are only available in the mobile app."
          )
        ).toBeTruthy();
      });

      fireEvent.press(screen.getByText("Confirm"));
      expect(screen.queryByText("Confirm Payout")).toBeNull();
    } finally {
      (Platform as { OS: string }).OS = originalOS;
    }
  });

  it("shows setup biometrics message when biometrics not available for payout over £1,000", async () => {
    const error = new Error("Biometrics not available") as Error & {
      code?: string;
    };
    error.code = "BIOMETRIC_NOT_AVAILABLE";
    mockIsBiometricAuthenticated.mockRejectedValueOnce(error);
    queryClient.clear();

    server.use(
      http.get(`${API_BASE_URL}/api/merchant`, () =>
        HttpResponse.json({
          available_balance: 500000,
          pending_balance: 25000,
          currency: "GBP",
          activity: [],
        })
      )
    );

    render(<PayoutsScreen />, { wrapper });

    await waitFor(() => expect(screen.getByText("Confirm")).toBeTruthy());

    fireEvent.changeText(screen.getByPlaceholderText("0.00"), "1500");
    fireEvent.changeText(
      screen.getByPlaceholderText(/FR12/),
      "FR12123451234512345678901234567890"
    );
    fireEvent.press(screen.getByText("Confirm"));

    await waitFor(() => expect(screen.getByText("Confirm Payout")).toBeTruthy());

    fireEvent.press(screen.getByLabelText("Confirm payout"));

    await waitFor(() => {
      expect(screen.getByText("Unable to Process Payout")).toBeTruthy();
      expect(
        screen.getByText(
          "Please set up biometric authentication in your device settings to complete payouts over £1,000."
        )
      ).toBeTruthy();
      expect(screen.getByText("Try Again")).toBeTruthy();
    });
  });
});
