import { API_BASE_URL } from "@/constants";
import type { MerchantDataResponse } from "@/types/api";

export async function fetchMerchant(): Promise<MerchantDataResponse> {
  const response = await fetch(`${API_BASE_URL}/api/merchant`);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message =
      (errorBody as { error?: string })?.error ||
      `Failed to fetch merchant: ${response.status}`;
    throw new Error(message);
  }
  
  return response.json() as Promise<MerchantDataResponse>;
}
