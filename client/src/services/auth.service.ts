import type {
  LoginFormValues,
  RegisterFormValues,
} from '@/schemas/auth.schema';
import type {
  AuthResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from '@barra-bodega/types';

export class AuthApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'AuthApiError';
    this.status = status;
  }
}

export const authSessionQueryKey = ['auth', 'session'] as const;
export const ACCESS_TOKEN_REFRESH_INTERVAL = 29 * 60 * 1000;

let accessToken: string | null = null;

export function getAccessToken() {
  return accessToken;
}

function setAccessToken(token: string | null) {
  accessToken = token;
}

async function authRequest<T>(
  endpoint: string,
  body?: Record<string, string>
): Promise<T> {
  const response = await fetch(`/api/auth/${endpoint}`, {
    method: 'POST',
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new AuthApiError(
      result?.message ?? 'No se pudo completar la solicitud',
      response.status
    );
  }

  return (response.status === 204 ? undefined : await response.json()) as T;
}

function acceptAuthResponse(result: AuthResponse) {
  setAccessToken(result.accessToken);
  return result;
}

export async function registerAdmin(values: RegisterFormValues) {
  const request: RegisterRequest = {
    name: values.name,
    businessName: values.businessName,
    email: values.email,
    phone: `+51${values.phone.replace(/\D/g, '')}`,
    password: values.password,
  };
  return acceptAuthResponse(
    await authRequest<AuthResponse>('register', request)
  );
}

export async function loginAdmin(values: LoginFormValues) {
  const request: LoginRequest = {
    email: values.email,
    password: values.password,
  };
  return acceptAuthResponse(await authRequest<AuthResponse>('login', request));
}

export async function refreshAuthSession(): Promise<AuthUser | null> {
  try {
    const result = acceptAuthResponse(
      await authRequest<AuthResponse>('refresh')
    );
    return result.user;
  } catch (error) {
    if (
      error instanceof AuthApiError &&
      (error.status === 401 || error.status === 400)
    ) {
      setAccessToken(null);
      return null;
    }
    throw error;
  }
}

export async function logoutAdmin() {
  await authRequest<void>('logout');
  setAccessToken(null);
}

export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
) {
  const send = () => {
    const headers = new Headers(init.headers);
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
    return fetch(input, { ...init, headers, credentials: 'include' });
  };

  let response = await send();
  if (response.status !== 401) return response;

  const user = await refreshAuthSession();
  if (!user) return response;
  response = await send();
  return response;
}
