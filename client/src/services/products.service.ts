import { apiFetch } from '@/services/auth.service';
import type {
  NewProductForm,
  ProductData,
  ProductsResponse,
  UpdateProductForm,
} from '@/types/inventory.type';

export class ProductsApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ProductsApiError';
    this.status = status;
  }
}

async function productsRequest<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await apiFetch(`/api/products${path}`, init);
  const result = (await response.json().catch(() => null)) as {
    data?: T;
    message?: string;
  } | null;

  if (!response.ok) {
    throw new ProductsApiError(
      result?.message ?? 'No se pudo completar la solicitud',
      response.status
    );
  }

  if (!result?.data) {
    throw new ProductsApiError('La respuesta del servidor no es válida', 500);
  }

  return result.data;
}

export function getProducts(params: {
  page: number;
  pageSize: number;
  search: string;
}) {
  const query = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
    search: params.search,
  });
  return productsRequest<ProductsResponse>(`?${query.toString()}`);
}

export function createProduct(data: NewProductForm) {
  return productsRequest<ProductData>('', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function updateProduct(id: string, data: UpdateProductForm) {
  return productsRequest<ProductData>(`/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
