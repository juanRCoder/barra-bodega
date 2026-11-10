import { Prisma } from '../../generated/prisma/client.js';
import { AppError } from '@/lib/app-error.js';
import { prisma } from '@/lib/prisma.js';
import {
  createOrderSchema,
  orderBarcodeSchema,
} from '@/schemas/orders.schema.js';

function orderData(order: {
  id: string;
  status: 'PAID' | 'PENDING' | 'CANCELLED';
  total: Prisma.Decimal;
  account_id: string | null;
  created_at: Date;
  productsOrder: {
    id: string;
    manual_name: string | null;
    quantity: number;
    price: Prisma.Decimal;
    subtotal: Prisma.Decimal;
    productAdmin: { product: { name: string } } | null;
  }[];
}) {
  return {
    id: order.id,
    status: order.status,
    total: order.total.toNumber(),
    accountId: order.account_id,
    createdAt: order.created_at.toISOString(),
    items: order.productsOrder.map((item) => ({
      id: item.id,
      name: item.manual_name ?? item.productAdmin?.product.name ?? '',
      quantity: item.quantity,
      price: item.price.toNumber(),
      subtotal: item.subtotal.toNumber(),
      isManual: item.manual_name !== null,
    })),
  };
}

export class OrdersService {
  async getProductByCode(adminId: string, input: unknown) {
    const code = orderBarcodeSchema.parse(input);
    const product = await prisma.productsAdmin.findFirst({
      where: { admin_id: adminId, product: { code } },
      include: {
        product: { select: { id: true, code: true, name: true } },
      },
    });

    if (!product) {
      throw new AppError(404, 'No se encontró el código en tu inventario');
    }

    return {
      id: product.id,
      productId: product.product.id,
      code: product.product.code,
      name: product.product.name,
      price: product.price.toNumber(),
      stock: product.stock,
      unit: '/ unid.',
    };
  }

  async create(adminId: string, input: unknown) {
    const data = createOrderSchema.parse(input);

    return prisma.$transaction(async (transaction) => {
      if (data.accountId) {
        const account = await transaction.account.findFirst({
          where: { id: data.accountId, admin_id: adminId },
          select: { id: true },
        });

        if (!account) {
          throw new AppError(404, 'Cuenta no encontrada');
        }
      }

      const productAdminIds = [
        ...new Set(
          data.items.flatMap((item) =>
            item.type === 'inventory' ? [item.productAdminId] : []
          )
        ),
      ];
      const products = productAdminIds.length
        ? await transaction.productsAdmin.findMany({
            where: { id: { in: productAdminIds }, admin_id: adminId },
            select: { id: true, price: true },
          })
        : [];
      const productsById = new Map(
        products.map((product) => [product.id, product])
      );

      if (productsById.size !== productAdminIds.length) {
        throw new AppError(
          404,
          'Uno o más productos no pertenecen a tu inventario'
        );
      }

      const orderItems = data.items.map((item) => {
        let productAdminId: string | null = null;
        let manualName: string | null = null;
        let price: Prisma.Decimal;

        if (item.type === 'inventory') {
          const product = productsById.get(item.productAdminId);
          if (!product) {
            throw new AppError(
              404,
              'Uno o más productos no pertenecen a tu inventario'
            );
          }
          productAdminId = item.productAdminId;
          price = product.price;
        } else {
          manualName = item.name;
          price = new Prisma.Decimal(item.price);
        }

        const subtotal = price.mul(item.quantity);
        if (subtotal.gt('99999999.99')) {
          throw new AppError(400, 'El subtotal supera el máximo permitido');
        }

        return {
          product_admin_id: productAdminId,
          manual_name: manualName,
          quantity: item.quantity,
          price,
          subtotal,
        };
      });
      const total = orderItems.reduce(
        (sum, item) => sum.plus(item.subtotal),
        new Prisma.Decimal(0)
      );
      if (total.gt('99999999.99')) {
        throw new AppError(
          400,
          'El total del pedido supera el máximo permitido'
        );
      }

      const order = await transaction.order.create({
        data: {
          admin_id: adminId,
          account_id: data.accountId,
          status: data.accountId ? 'PENDING' : 'PAID',
          total,
          productsOrder: { create: orderItems },
        },
        include: {
          productsOrder: {
            include: {
              productAdmin: {
                include: { product: { select: { name: true } } },
              },
            },
          },
        },
      });

      if (data.accountId) {
        await transaction.account.update({
          where: { id: data.accountId },
          data: { debt: { increment: total } },
        });
      }

      return orderData(order);
    });
  }
}

export const ordersService = new OrdersService();
