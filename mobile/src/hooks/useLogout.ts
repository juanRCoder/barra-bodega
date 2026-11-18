import { useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '../services/auth.service';
import { queryKeys } from '../lib/querykey';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKeys.orders.all });
      queryClient.setQueryData(queryKeys.auth.me, null);
    },
  });
}
