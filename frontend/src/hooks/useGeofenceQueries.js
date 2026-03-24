import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGeofences, createGeofence, deleteGeofence } from '../services/api';
import { queryKeys } from '../lib/queryKeys';

export function useGeofencesQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.geofences.all,
    queryFn: async () => {
      const res = await getGeofences();
      return res.data || [];
    },
    enabled,
  });
}

export function useCreateGeofenceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createGeofence(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.geofences.all });
    }
  });
}

export function useDeleteGeofenceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteGeofence(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.geofences.all });
    }
  });
}
