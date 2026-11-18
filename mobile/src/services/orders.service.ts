import { fetchWithTimeout } from '../lib/fetch-timeout';
import type { SalesAnalytics, SalesPeriod } from '../types/order.type';
import { getAccessToken } from './auth.service';

export class OrdersApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'OrdersApiError';
    this.status = status;
  }
}

const API = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, '');

async function ordersRequest<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API) {
    throw new OrdersApiError(
      'Configura EXPO_PUBLIC_API_URL en mobile/.env para conectar con el servidor',
      0
    );
  }

  const token = getAccessToken();
  const response = await fetchWithTimeout(`${API}/orders${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
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

export function getSalesAnalytics(period: SalesPeriod) {
  return ordersRequest<SalesAnalytics>(
    `/analytics?period=${encodeURIComponent(period)}`
  );
}
