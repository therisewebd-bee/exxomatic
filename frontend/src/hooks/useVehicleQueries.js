import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle, updateVehicleLocation } from '../services/api';
import { queryKeys } from '../lib/queryKeys';

export function useVehiclesQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.vehicles.all,
    queryFn: async () => {
      const res = await getVehicles({ limit: 100 });
      return res.data || [];
    },
    enabled,
  });
}

export function useCreateVehicleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all });
    }
  });
}

export function useUpdateVehicleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateVehicle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all });
    }
  });
}

export function useDeleteVehicleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all });
    }
  });
}

export function useUpdateVehicleLocationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateVehicleLocation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all });
    }
  });
}
