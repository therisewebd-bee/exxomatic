import { QueryClient } from '@tanstack/react-query';

/**
 * Centralized QueryClient configuration.
 *
 * Default behaviour:
 *  - staleTime  5 min  → data stays "fresh" for 5 minutes (no background refetch)
 *  - gcTime     10 min → unused cache entries are garbage-collected after 10 minutes
 *  - retry      1      → one retry on failure (2 total attempts)
 *  - refetchOnWindowFocus false → prevents refetch spam on alt-tab
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 minutes
      gcTime: 1000 * 60 * 10,         // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
