import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createPayout } from "@/api/payouts";
import { queryKeys } from "@/lib/query-keys";
import type {
  ActivityItem,
  CreatePayoutRequest,
  PaginatedActivityResponse,
  PayoutResponse,
} from "@/types/api";

import type { InfiniteData } from "@tanstack/react-query";

function payoutToActivityItem(payout: PayoutResponse): ActivityItem {
  return {
    id: payout.id,
    type: "payout",
    amount: -payout.amount,
    currency: payout.currency,
    date: payout.created_at,
    description: `Payout to Bank Account ****${payout.iban.slice(-4)}`,
    status:
      payout.status === "completed"
        ? "completed"
        : payout.status === "failed"
          ? "failed"
          : "pending",
  };
}

export function usePayoutMutation() {
  const queryClient = useQueryClient();

  return useMutation<PayoutResponse, Error, CreatePayoutRequest>({
    mutationFn: createPayout,
    onSuccess: (payout) => {
      // invalidate to refetch updated balance
      queryClient.invalidateQueries({ queryKey: queryKeys.merchant });

      // update activity list with new payout (will only affect the modal)
      queryClient.setQueryData<InfiniteData<PaginatedActivityResponse>>(
        queryKeys.activity,
        (old) => {
          if (!old?.pages?.length) return old;
          const [first, ...rest] = old.pages;
          return {
            ...old,
            pages: [
              {
                ...first,
                items: [payoutToActivityItem(payout), ...first.items],
              },
              ...rest,
            ],
          };
        },
      );
    },
  });
}
