import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCompliances, createCompliance } from '../services/api';
import { queryKeys } from '../lib/queryKeys';

export function useCompliancesQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.compliances.all,
    queryFn: async () => {
      const res = await getCompliances();
      return res.data || [];
    },
    enabled,
  });
}

export function useCreateComplianceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createCompliance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.compliances.all });
    }
  });
}
