import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  LoginFormValues,
  RegisterFormValues,
} from '@/schemas/auth.schema';
import {
  authSessionQueryKey,
  loginAdmin,
  logoutAdmin,
  registerAdmin,
} from '@/services/auth.service';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: LoginFormValues) => loginAdmin(values),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(authSessionQueryKey, user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: RegisterFormValues) => registerAdmin(values),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(authSessionQueryKey, user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutAdmin,
    onSuccess: () => {
      queryClient.setQueryData(authSessionQueryKey, null);
    },
  });
}
