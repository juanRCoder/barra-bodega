import { useQuery } from '@tanstack/react-query';
import {
  ACCESS_TOKEN_REFRESH_INTERVAL,
  authSessionQueryKey,
  refreshAuthSession,
} from '@/services/auth.service';

export function useAuthSession() {
  return useQuery({
    queryKey: authSessionQueryKey,
    queryFn: refreshAuthSession,
    staleTime: ACCESS_TOKEN_REFRESH_INTERVAL,
    refetchInterval: ACCESS_TOKEN_REFRESH_INTERVAL,
    refetchIntervalInBackground: true,
    retry: false,
  });
}
