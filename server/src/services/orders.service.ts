import { Prisma } from '../../generated/prisma/client.js';
import { AppError } from '@/lib/app-error.js';
import { prisma } from '@/lib/prisma.js';
import {
  createOrderSchema,
  orderBarcodeSchema,
  salesPeriodSchema,
} from '@/schemas/orders.schema.js';

type SalesPeriod = ReturnType<typeof salesPeriodSchema.parse>;

function getPeriodStart(period: SalesPeriod, now: Date) {
  const dateParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(now);
  const year = Number(dateParts.find((part) => part.type === 'year')?.value);
  const month = Number(dateParts.find((part) => part.type === 'month')?.value);
  const day = Number(dateParts.find((part) => part.type === 'day')?.value);
  const periodStart = new Date(
    Date.UTC(
      year,
      month - 1,
      period === 'month' ? 1 : day - (period === 'week' ? 6 : 0)
    )
  );

  return new Date(
    Date.UTC(
      periodStart.getUTCFullYear(),
      periodStart.getUTCMonth(),
      periodStart.getUTCDate(),
      5
    )
  );
}

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
  async getAnalytics(adminId: string, input: unknown) {
    const period = salesPeriodSchema.parse(input);
    const now = new Date();
    const createdAt = { gte: getPeriodStart(period, now), lte: now };
    const [orders, accountPayments] = await Promise.all([
      prisma.order.findMany({
        where: {
          admin_id: adminId,
          status: { not: 'CANCELLED' },
          created_at: createdAt,
        },
        select: {
          account_id: true,
          status: true,
          total: true,
          productsOrder: {
            select: {
              quantity: true,
              manual_name: true,
              subtotal: true,
              productAdmin: {
                select: {
                  product: { select: { id: true, name: true } },
                },
              },
            },
          },
        },
      }),
      prisma.accountPayment.aggregate({
        where: {
          created_at: createdAt,
          account: { is: { admin_id: adminId } },
        },
        _sum: { amount: true },
      }),
    ]);

    const products = new Map<
      string,
      {
        id: string;
        name: string;
        unitsSold: number;
        salesAmount: Prisma.Decimal;
      }
    >();
    let unitsSold = 0;
    let salesAmount = new Prisma.Decimal(0);
    let collectedAmount = accountPayments._sum.amount ?? new Prisma.Decimal(0);

    for (const order of orders) {
      if (order.account_id === null && order.status === 'PAID') {
        collectedAmount = collectedAmount.plus(order.total);
      }

      for (const item of order.productsOrder) {
        const product = item.productAdmin?.product;
        const name = item.manual_name ?? product?.name ?? 'Producto';
        const key = product
          ? `inventory:${product.id}`
          : `manual:${name.trim().toLocaleLowerCase('es-PE')}`;
        const existing = products.get(key);

        unitsSold += item.quantity;
        salesAmount = salesAmount.plus(item.subtotal);

        if (existing) {
          existing.unitsSold += item.quantity;
          existing.salesAmount = existing.salesAmount.plus(item.subtotal);
        } else {
          products.set(key, {
            id: key,
            name,
            unitsSold: item.quantity,
            salesAmount: item.subtotal,
          });
        }
      }
    }

    const topProducts = [...products.values()]
      .sort(
        (left, right) =>
          right.unitsSold - left.unitsSold ||
          right.salesAmount.comparedTo(left.salesAmount) ||
          left.name.localeCompare(right.name, 'es')
      )
      .map((product) => ({
        id: product.id,
        name: product.name,
        unitsSold: product.unitsSold,
        salesAmount: product.salesAmount.toNumber(),
      }));

    return {
      period,
      ordersCount: orders.length,
      unitsSold,
      salesAmount: salesAmount.toNumber(),
      collectedAmount: collectedAmount.toNumber(),
      topProducts,
    };
  }

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
