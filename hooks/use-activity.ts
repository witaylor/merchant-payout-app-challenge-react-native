import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";

import { fetchActivity } from "@/api/merchant";
import type { ActivityItem, PaginatedActivityResponse } from "@/types/api";

const activityKeys = {
  all: ["activity"] as const,
};

const ACTIVITY_PAGE_LIMIT = 15;

export function useActivity(): UseInfiniteQueryResult<
  PaginatedActivityResponse,
  Error
> & { activities: ActivityItem[] } {
  const result = useInfiniteQuery({
    queryKey: activityKeys.all,
    queryFn: ({ pageParam }) =>
      fetchActivity(pageParam ?? undefined, ACTIVITY_PAGE_LIMIT),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 2,
  });

  const activities = result.data?.pages.flatMap((page) => page.items) ?? [];

  return { ...result, activities };
}
