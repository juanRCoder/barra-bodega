import { Prisma } from '../../generated/prisma/client.js';
import { AppError } from '@/lib/app-error.js';
import { prisma } from '@/lib/prisma.js';
import {
  accountIdSchema,
  createAccountSchema,
} from '@/schemas/accounts.schema.js';

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  );
}

function accountSummary(account: {
  id: string;
  name: string;
  phone: string;
  debt: Prisma.Decimal;
  created_at: Date;
}) {
  return {
    id: account.id,
    name: account.name,
    phone: account.phone,
    debt: account.debt.toNumber(),
    createdAt: account.created_at.toISOString(),
  };
}

export class AccountsService {
  async getAll(adminId: string) {
    const accounts = await prisma.account.findMany({
      where: { admin_id: adminId },
      orderBy: [{ name: 'asc' }, { created_at: 'desc' }],
      include: { accountPayments: { select: { amount: true } } },
    });

    const data = accounts.map((account) => ({
      ...accountSummary(account),
      totalPaid: Number(
        account.accountPayments
          .reduce((total, payment) => total + payment.amount.toNumber(), 0)
          .toFixed(2)
      ),
    }));
    const totalDebt = data.reduce((total, account) => total + account.debt, 0);
    const totalPaid = data.reduce(
      (total, account) => total + account.totalPaid,
      0
    );

    return {
      accounts: data,
      summary: {
        accountCount: data.length,
        debtCount: data.filter((account) => account.debt > 0).length,
        totalDebt: Number(totalDebt.toFixed(2)),
        totalPaid: Number(totalPaid.toFixed(2)),
      },
    };
  }

  async create(adminId: string, input: unknown) {
    const data = createAccountSchema.parse(input);

    try {
      const account = await prisma.account.create({
        data: {
          admin_id: adminId,
          name: data.name,
          phone: data.phone,
        },
      });

      return accountSummary(account);
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new AppError(409, 'Ya existe una cuenta con ese teléfono');
      }
      throw error;
    }
  }

  async getById(adminId: string, id: unknown) {
    const accountId = accountIdSchema.parse(id);
    const account = await prisma.account.findFirst({
      where: { id: accountId, admin_id: adminId },
      include: {
        accountPayments: {
          orderBy: { created_at: 'desc' },
        },
        orders: {
          where: { admin_id: adminId },
          orderBy: { created_at: 'desc' },
          include: {
            productsOrder: {
              include: {
                productAdmin: {
                  include: { product: { select: { name: true } } },
                },
              },
            },
          },
        },
      },
    });

    if (!account) {
      throw new AppError(404, 'Cuenta no encontrada');
    }

    const movements = [
      ...account.orders.map((order) => ({
        id: order.id,
        type: 'order' as const,
        date: order.created_at.toISOString(),
        amount: order.total.toNumber(),
        status: order.status,
        items: order.productsOrder.map(
          (item) =>
            `${item.quantity} x ${item.manual_name ?? item.productAdmin?.product.name ?? 'Producto'}`
        ),
      })),
      ...account.accountPayments.map((payment) => ({
        id: payment.id,
        type: 'payment' as const,
        date: payment.created_at.toISOString(),
        amount: payment.amount.toNumber(),
      })),
    ].sort((left, right) => right.date.localeCompare(left.date));

    return {
      ...accountSummary(account),
      movements,
    };
  }
}

export const accountsService = new AccountsService();
