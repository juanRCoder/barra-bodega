import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from '@/hooks/useAuthSession';
import {
  createProduct,
  getProducts,
  updateProduct,
} from '@/services/products.service';
import type { NewProductForm, UpdateProductForm } from '@/types/inventory.type';

export const productsQueryKeys = {
  all: ['products'] as const,
  byAdmin: (adminId: string) => [...productsQueryKeys.all, adminId] as const,
  list: (adminId: string, page: number, pageSize: number, search: string) =>
    [
      ...productsQueryKeys.byAdmin(adminId),
      'list',
      page,
      pageSize,
      search,
    ] as const,
};

export function useProducts(params: {
  page: number;
  pageSize: number;
  search: string;
}) {
  const { data: user } = useAuthSession();

  return useQuery({
    queryKey: productsQueryKeys.list(
      user?.id ?? '',
      params.page,
      params.pageSize,
      params.search
    ),
    queryFn: () => getProducts(params),
    enabled: Boolean(user?.id),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewProductForm) => createProduct(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.all }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductForm }) =>
      updateProduct(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.all }),
  });
}
