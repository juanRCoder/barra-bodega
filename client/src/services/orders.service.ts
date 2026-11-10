import { apiFetch } from '@/services/auth.service';
import type { NewOrder, OrderData } from '@/types/order.type';
import type { ProductData } from '@/types/inventory.type';

export class OrdersApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'OrdersApiError';
    this.status = status;
  }
}

async function ordersRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await apiFetch(`/api/orders${path}`, init);
  const result = (await response.json().catch(() => null)) as {
    data?: T;
    message?: string;
  } | null;

  if (!response.ok) {
    throw new OrdersApiError(
      result?.message ?? 'No se pudo completar la solicitud',
      response.status
    );
  }

  if (!result?.data) {
    throw new OrdersApiError('La respuesta del servidor no es válida', 500);
  }

  return result.data;
}

export function getOrderProductByCode(code: string) {
  return ordersRequest<ProductData>(
    `/products/${encodeURIComponent(code.trim())}`
  );
}

export function createOrder(data: NewOrder) {
  return ordersRequest<OrderData>('', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
