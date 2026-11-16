import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { LoginFormValues } from '../schemas/auth.schema';
import authService from '../services/auth.service';
import { queryKeys } from '../lib/querykey';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginFormValues) => authService.login(data),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(queryKeys.auth.me, user);
    },
  });
}
