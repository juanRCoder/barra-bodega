import { fetchWithTimeout } from '../lib/fetch-timeout';
import type { AuthResponse, LoginRequest } from '@barra-bodega/types';

export class AuthApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'AuthApiError';
    this.status = status;
  }
}

let accessToken: string | null = null;

export function getAccessToken() {
  return accessToken;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isAuthResponse(value: unknown): value is AuthResponse {
  if (!isRecord(value) || typeof value.accessToken !== 'string') return false;
  if (!isRecord(value.user)) return false;

  return (
    typeof value.user.id === 'string' &&
    typeof value.user.name === 'string' &&
    typeof value.user.email === 'string' &&
    (value.user.role === 'ADMIN' || value.user.role === 'SUPER_ADMIN') &&
    (typeof value.user.businessName === 'string' ||
      value.user.businessName === null)
  );
}

class AuthService {
  private readonly API = process.env.EXPO_PUBLIC_API_URL?.trim().replace(
    /\/+$/,
    ''
  );

  async login(data: LoginRequest): Promise<AuthResponse> {
    if (!this.API) {
      throw new AuthApiError(
        'Configura EXPO_PUBLIC_API_URL en mobile/.env para conectar con el servidor',
        0
      );
    }

    const response = await fetchWithTimeout(`${this.API}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        isRecord(result) && typeof result.message === 'string'
          ? result.message
          : 'No se pudo completar la solicitud';
      throw new AuthApiError(message, response.status);
    }

    if (!isAuthResponse(result)) {
      throw new AuthApiError(
        'El servidor devolvió una respuesta inválida',
        response.status
      );
    }

    accessToken = result.accessToken;
    return result;
  }

  async logout(): Promise<void> {
    if (!this.API) {
      throw new AuthApiError('Configura EXPO_PUBLIC_API_URL', 0);
    }

    const response = await fetchWithTimeout(`${this.API}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      const result: unknown = await response.json().catch(() => null);
      const message =
        isRecord(result) && typeof result.message === 'string'
          ? result.message
          : 'No se pudo cerrar sesión';
      throw new AuthApiError(message, response.status);
    }

    accessToken = null;
  }
}

export default new AuthService();
