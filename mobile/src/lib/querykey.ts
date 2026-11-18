import type { SalesPeriod } from '../types/order.type';

const authBaseKey = ['auth'] as const;

export const authKeys = {
  all: authBaseKey,
  me: [...authBaseKey, 'me'] as const,
};

export const ordersKeys = {
  all: ['orders'] as const,
  analytics: (period: SalesPeriod) => ['orders', 'analytics', period] as const,
};

export const queryKeys = {
  auth: authKeys,
  orders: ordersKeys,
} as const;
