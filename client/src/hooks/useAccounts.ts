import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAccount,
  getAccountById,
  getAccounts,
} from '@/services/accounts.service';
import type { NewAccountForm } from '@/types/account.type';
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
