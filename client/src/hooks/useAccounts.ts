import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAccount,
  getAccountById,
  getAccounts,
  registerAccountPayment,
} from '@/services/accounts.service';
import type { NewAccountForm, NewAccountPayment } from '@/types/account.type';
import { useAuthSession } from '@/hooks/useAuthSession';

export const accountsQueryKeys = {
  all: ['accounts'] as const,
  byAdmin: (adminId: string) => [...accountsQueryKeys.all, adminId] as const,
  detail: (adminId: string, id: string) =>
    [...accountsQueryKeys.byAdmin(adminId), id] as const,
};

export function useAccounts() {
  const { data: user } = useAuthSession();

  return useQuery({
    queryKey: accountsQueryKeys.byAdmin(user?.id ?? ''),
    queryFn: getAccounts,
    enabled: Boolean(user?.id),
  });
}

export function useAccount(id: string) {
  const { data: user } = useAuthSession();

  return useQuery({
    queryKey: accountsQueryKeys.detail(user?.id ?? '', id),
    queryFn: () => getAccountById(id),
    enabled: Boolean(user?.id && id),
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewAccountForm) => createAccount(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: accountsQueryKeys.all }),
  });
}

export function useRegisterAccountPayment(accountId: string) {
  const queryClient = useQueryClient();
  const { data: user } = useAuthSession();

  return useMutation({
    mutationFn: (data: NewAccountPayment) =>
      registerAccountPayment(accountId, data),
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
