import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/querykey';
import { getSalesAnalytics } from '../services/orders.service';
import type { SalesPeriod } from '../types/order.type';

export function useSalesAnalytics(period: SalesPeriod) {
  return useQuery({
    queryKey: queryKeys.orders.analytics(period),
    queryFn: () => getSalesAnalytics(period),
  });
}
