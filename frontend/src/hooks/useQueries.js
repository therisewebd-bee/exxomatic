import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVehicles, getGeofences, getCompliances, createGeofence, deleteGeofence, createCompliance, createVehicle, updateVehicle, deleteVehicle, updateUser } from '../services/api';

export function useVehiclesQuery(enabled = true) {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const res = await getVehicles();
      return res.data || [];
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useGeofencesQuery(enabled = true) {
  return useQuery({
    queryKey: ['geofences'],
    queryFn: async () => {
      const res = await getGeofences();
      return res.data || [];
    },
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCompliancesQuery(enabled = true) {
  return useQuery({
    queryKey: ['compliances'],
    queryFn: async () => {
      const res = await getCompliances();
      return res.data || [];
    },
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateGeofenceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createGeofence(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geofences'] });
    }
  });
}

export function useDeleteGeofenceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteGeofence(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geofences'] });
    }
  });
}

export function useCreateComplianceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createCompliance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliances'] });
    }
  });
}

export function useCreateVehicleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    }
  });
}

export function useUpdateVehicleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateVehicle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    }
  });
}

export function useDeleteVehicleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    }
  });
}

export function useUpdateUserMutation() {
  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data)
  });
}
