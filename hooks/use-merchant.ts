import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";

import { fetchMerchant } from "@/api/merchant";
import type { MerchantDataResponse } from "@/types/api";

const merchantKeys = {
  all: ["merchant"] as const,
};

export type UseMerchantOptions = Omit<
  UseQueryOptions<MerchantDataResponse, Error>,
  "queryKey" | "queryFn"
>;

export function useMerchant(
  options?: UseMerchantOptions,
): UseQueryResult<MerchantDataResponse, Error> {
  return useQuery({
    queryKey: merchantKeys.all,
    queryFn: fetchMerchant,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 2,
    ...options,
  });
}
