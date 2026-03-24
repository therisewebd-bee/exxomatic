/**
 * Centralized Query Key Factory
 *
 * Every React Query key in the app goes through here.
 * Using a factory pattern ensures:
 *  1. Consistent keys across queries and invalidations
 *  2. Granular invalidation (e.g. invalidate a single vehicle vs all vehicles)
 *  3. No magic string typos
 *
 * Usage:
 *   queryKey: queryKeys.vehicles.all          → ['vehicles']
 *   queryKey: queryKeys.vehicles.detail(id)   → ['vehicles', 'detail', id]
 *   invalidate: queryKeys.vehicles.all        → invalidates all vehicle queries
 */

export const queryKeys = {
  vehicles: {
    all: ['vehicles'],
    detail: (id) => ['vehicles', 'detail', id],
  },
  geofences: {
    all: ['geofences'],
    detail: (id) => ['geofences', 'detail', id],
  },
  users: {
    all: ['users'],
    detail: (id) => ['users', 'detail', id],
  },
  compliances: {
    all: ['compliances'],
    list: (params) => ['compliances', params],
  },
  locations: {
    history: (imei, start, end) => ['locations', 'history', imei, start, end],
  },
};
