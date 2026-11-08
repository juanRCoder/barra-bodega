import { z } from 'zod';
import type { LoginRequest, RegisterRequest } from '@barra-bodega/types';

export const loginSchema = z.object({
  email: z.string().trim().email('Ingresa un correo válido'),
  password: z
    .string()
    .min(1, 'Ingresa tu contraseña')
    .max(72, 'La contraseña es demasiado larga'),
  showPassword: z.boolean(),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Ingresa tu nombre').max(100),
  businessName: z.string().trim().max(120),
  email: z.string().trim().email('Ingresa un correo válido').max(254),
  phone: z
    .string()
    .regex(/^\d(?:[ -]?\d){8}$/, 'Ingresa un teléfono peruano de 9 dígitos'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(72, 'La contraseña es demasiado larga'),
  showPassword: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type { LoginRequest, RegisterRequest };
