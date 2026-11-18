import { useQuery } from '@tanstack/react-query';
import type { AuthUser } from '@barra-bodega/types';
import { queryKeys } from '../lib/querykey';

// El usuario lo escribe useLogin en la caché; aquí solo se observa.
export function useAuthUser() {
  return useQuery<AuthUser | null>({
    queryKey: queryKeys.auth.me,
    queryFn: () => null,
    enabled: false,
    initialData: null,
  });
}
