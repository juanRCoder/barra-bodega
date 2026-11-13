import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { accountsQueryKeys } from '@/hooks/useAccounts';
import { useAuthSession } from '@/hooks/useAuthSession';
import { createOrder, getSalesAnalytics } from '@/services/orders.service';
import type { NewOrder, SalesPeriod } from '@/types/order.type';

export const ordersQueryKeys = {
  analytics: (period: SalesPeriod) => ['orders', 'analytics', period] as const,
};

export function useSalesAnalytics(period: SalesPeriod) {
  return useQuery({
    queryKey: ordersQueryKeys.analytics(period),
    queryFn: () => getSalesAnalytics(period),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { data: user } = useAuthSession();

  return useMutation({
    mutationFn: (data: NewOrder) => createOrder(data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: accountsQueryKeys.byAdmin(user?.id ?? ''),
        }),
        queryClient.invalidateQueries({
          queryKey: ['orders', 'analytics'],
        }),
      ]);
    },
  });
}
