import { z } from 'zod';

export const createAccountSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z
    .string()
    .trim()
    .regex(/^\d{9}$/, 'Ingresa un teléfono de 9 dígitos'),
});

export const accountIdSchema = z.string().uuid();

export const registerAccountPaymentSchema = z.object({
  amount: z.number().finite().positive().max(99_999_999.99),
});
