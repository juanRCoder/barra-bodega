import { apiFetch } from '@/services/auth.service';
import type {
  AccountDetail,
  AccountSummary,
  AccountsResponse,
  NewAccountForm,
} from '@/types/account.type';

export class AccountsApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'AccountsApiError';
    this.status = status;
  }
}

async function accountsRequest<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await apiFetch(`/api/accounts${path}`, init);
  const result = (await response.json().catch(() => null)) as {
    data?: T;
    message?: string;
  } | null;

  if (!response.ok) {
    throw new AccountsApiError(
      result?.message ?? 'No se pudo completar la solicitud',
      response.status
    );
  }

  if (!result?.data) {
    throw new AccountsApiError('La respuesta del servidor no es válida', 500);
  }

  return result.data;
}

export function getAccounts() {
  return accountsRequest<AccountsResponse>('');
}

export function createAccount(data: NewAccountForm) {
  return accountsRequest<AccountSummary>('', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function getAccountById(id: string) {
  return accountsRequest<AccountDetail>(`/${encodeURIComponent(id)}`);
}
