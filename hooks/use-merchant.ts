import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";

import { fetchMerchant } from "@/api/merchant";
import { queryKeys } from "@/lib/query-keys";
import type { MerchantDataResponse } from "@/types/api";

export type UseMerchantOptions = Omit<
  UseQueryOptions<MerchantDataResponse, Error>,
  "queryKey" | "queryFn"
>;

export function useMerchant(
  options?: UseMerchantOptions,
): UseQueryResult<MerchantDataResponse, Error> {
  return useQuery({
    queryKey: queryKeys.merchant,
    queryFn: fetchMerchant,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 2,
    ...options,
  });
}
