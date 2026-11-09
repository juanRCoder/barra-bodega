import { z } from 'zod';

const priceSchema = z
  .number()
  .finite()
  .min(0, 'El precio no puede ser negativo')
  .max(99_999_999.99, 'El precio supera el máximo permitido');

const stockSchema = z
  .number()
  .int()
  .min(0, 'El stock no puede ser negativo')
  .max(2_147_483_647, 'El stock supera el máximo permitido');

export const listProductsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().max(120).default(''),
});

export const createProductSchema = z.object({
  code: z.string().trim().min(1).max(100),
  name: z.string().trim().min(1).max(120),
  price: priceSchema,
  stock: stockSchema,
});

export const updateProductSchema = z.object({
  price: priceSchema,
  stock: stockSchema,
});

export const productIdSchema = z.string().uuid();
