import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Ingresa un correo válido')
    .max(254)
    .transform((email) => email.toLowerCase()),
  password: z.string().min(1, 'Ingresa tu contraseña').max(72),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  businessName: z.string().trim().max(120).optional(),
  email: z
    .string()
    .trim()
    .email('Ingresa un correo válido')
    .max(254)
    .transform((email) => email.toLowerCase()),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{6,14}$/, 'Ingresa un teléfono válido'),
  password: z.string().min(8).max(72),
});
