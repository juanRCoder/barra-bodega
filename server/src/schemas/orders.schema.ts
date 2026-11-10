import { z } from 'zod';

const quantitySchema = z.number().int().min(1).max(2_147_483_647);

const inventoryOrderItemSchema = z.object({
  type: z.literal('inventory'),
  productAdminId: z.string().uuid(),
  quantity: quantitySchema,
});

const manualOrderItemSchema = z.object({
  type: z.literal('manual'),
  name: z.string().trim().min(1).max(120),
  price: z.number().finite().positive().max(99_999_999.99),
  quantity: quantitySchema,
});

export const createOrderSchema = z.object({
  accountId: z.string().uuid().nullable().default(null),
  items: z
    .array(
      z.discriminatedUnion('type', [
        inventoryOrderItemSchema,
        manualOrderItemSchema,
      ])
    )
    .min(1)
    .max(100),
});

export const orderBarcodeSchema = z.string().trim().min(1).max(100);
