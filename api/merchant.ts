import { API_BASE_URL } from "@/constants";
import type {
  MerchantDataResponse,
  PaginatedActivityResponse,
} from "@/types/api";

async function handleFetchError(response: Response, context: string): Promise<never> {
  const errorBody = await response.json().catch(() => ({}));
  const message =
    (errorBody as { error?: string })?.error ||
    `Failed to fetch ${context}: ${response.status}`;
  throw new Error(message);
}

export async function fetchActivity(
  cursor?: string | null,
  limit: number = 15
): Promise<PaginatedActivityResponse> {
  const params = new URLSearchParams();
  if (cursor) params.set("cursor", cursor);
  params.set("limit", String(limit));

  const response = await fetch(
    `${API_BASE_URL}/api/merchant/activity?${params.toString()}`
  );

  if (!response.ok) {
    await handleFetchError(response, "activity");
  }

  return response.json() as Promise<PaginatedActivityResponse>;
}

export async function fetchMerchant(): Promise<MerchantDataResponse> {
  const response = await fetch(`${API_BASE_URL}/api/merchant`);

  if (!response.ok) {
    await handleFetchError(response, "merchant");
  }

  return response.json() as Promise<MerchantDataResponse>;
}
