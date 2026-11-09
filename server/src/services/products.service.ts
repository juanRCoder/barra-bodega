import { Prisma } from '../../generated/prisma/client.js';
import { AppError } from '@/lib/app-error.js';
import { prisma } from '@/lib/prisma.js';
import {
  createProductSchema,
  listProductsSchema,
  productIdSchema,
  updateProductSchema,
} from '@/schemas/products.schema.js';

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  );
}

function productData(product: {
  id: string;
  price: Prisma.Decimal;
  stock: number;
  product: { id: string; code: string; name: string };
}) {
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

export class ProductsService {
  async getAll(adminId: string, input: unknown) {
    const { page, pageSize, search } = listProductsSchema.parse(input);
    const where: Prisma.ProductsAdminWhereInput = {
      admin_id: adminId,
      ...(search
        ? {
            product: {
              OR: [
                { code: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
              ],
            },
          }
        : {}),
    };

    const [products, totalItems, totalProducts, restockCount] =
      await Promise.all([
        prisma.productsAdmin.findMany({
          where,
          orderBy: [{ product: { name: 'asc' } }, { created_at: 'desc' }],
          skip: (page - 1) * pageSize,
          take: pageSize,
          include: {
            product: { select: { id: true, code: true, name: true } },
          },
        }),
        prisma.productsAdmin.count({ where }),
        prisma.productsAdmin.count({ where: { admin_id: adminId } }),
        prisma.productsAdmin.count({
          where: { admin_id: adminId, stock: { lte: 10 } },
        }),
      ]);

    return {
      products: products.map(productData),
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
      summary: { totalProducts, restockCount },
    };
  }

  async create(adminId: string, input: unknown) {
    const data = createProductSchema.parse(input);

    try {
      return await prisma.$transaction(async (transaction) => {
        const product = await transaction.product.upsert({
          where: { code: data.code },
          create: { code: data.code, name: data.name },
          update: {},
        });
        const existingAssociation = await transaction.productsAdmin.findUnique({
          where: {
            admin_id_product_id: {
              admin_id: adminId,
              product_id: product.id,
            },
          },
          select: { id: true },
        });

        if (existingAssociation) {
          throw new AppError(
            409,
            'Este producto ya está registrado en tu inventario'
          );
        }

        const association = await transaction.productsAdmin.create({
          data: {
            admin_id: adminId,
            product_id: product.id,
            price: data.price,
            stock: data.stock,
          },
          include: {
            product: { select: { id: true, code: true, name: true } },
          },
        });

        return productData(association);
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new AppError(
          409,
          'El producto ya está registrado en tu inventario'
        );
      }
      throw error;
    }
  }

  async update(adminId: string, id: unknown, input: unknown) {
    const productAdminId = productIdSchema.parse(id);
    const data = updateProductSchema.parse(input);
    const result = await prisma.productsAdmin.updateMany({
      where: { id: productAdminId, admin_id: adminId },
      data: { price: data.price, stock: data.stock },
    });

    if (result.count === 0) {
      throw new AppError(404, 'Producto no encontrado');
    }

    const product = await prisma.productsAdmin.findFirst({
      where: { id: productAdminId, admin_id: adminId },
      include: { product: { select: { id: true, code: true, name: true } } },
    });

    if (!product) {
      throw new AppError(404, 'Producto no encontrado');
    }

    return productData(product);
  }
}

export const productsService = new ProductsService();
