/**
 * Centralized TanStack Query keys for cache invalidation.
 * Mutations should invalidate relevant queries here when data changes.
 */
export const queryKeys = {
  merchant: ["merchant"] as const,
  activity: ["activity"] as const,
} as const;
