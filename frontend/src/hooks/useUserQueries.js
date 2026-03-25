import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, deleteUser, updateUser } from '../services/api';
import { queryKeys } from '../lib/queryKeys';

export function useUsersQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: async () => {
      const res = await getUsers();
      return res.data || [];
    },
    enabled,
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createUser(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
  });
}
