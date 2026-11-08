export type User = {
  id: string;
  name: string;
  email: string;
};

export type UserRole = 'ADMIN' | 'SUPER_ADMIN';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  businessName: string | null;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = LoginRequest & {
  name: string;
  businessName?: string;
  phone: string;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export type ErrorResponse = {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
};
