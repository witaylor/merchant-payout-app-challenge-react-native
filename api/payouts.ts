import { API_BASE_URL } from "@/constants";
import type { CreatePayoutRequest, PayoutResponse } from "@/types/api";

async function handleFetchError(
  response: Response,
  context: string
): Promise<never> {
  const contentType = response.headers.get("content-type") ?? "";
  let message = `Failed to fetch ${context}: ${response.status}`;

  if (contentType.includes("application/json")) {
    const errorBody = await response.json().catch(() => ({}));
    const apiMessage = (errorBody as { error?: string })?.error;
    if (apiMessage) message = apiMessage;
  }

  throw new Error(message);
}

export async function createPayout(
  request: CreatePayoutRequest
): Promise<PayoutResponse> {
  const response = await fetch(`${API_BASE_URL}/api/payouts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    await handleFetchError(response, "payout");
  }

  // Returning the Promise directly is equivalent to await+return in an async function
  return response.json() as Promise<PayoutResponse>;
}
