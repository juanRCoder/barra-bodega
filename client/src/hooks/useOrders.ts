import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsQueryKeys } from '@/hooks/useAccounts';
import { useAuthSession } from '@/hooks/useAuthSession';
import { createOrder } from '@/services/orders.service';
import type { NewOrder } from '@/types/order.type';

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { data: user } = useAuthSession();

  return useMutation({
    mutationFn: (data: NewOrder) => createOrder(data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: accountsQueryKeys.byAdmin(user?.id ?? ''),
      }),
  });
}
