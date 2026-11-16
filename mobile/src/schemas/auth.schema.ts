import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Ingresa un correo válido')
    .max(254, 'El correo no puede superar los 254 caracteres'),
  password: z
    .string()
    .min(1, 'Ingresa tu contraseña')
    .max(72, 'La contraseña es demasiado larga'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
