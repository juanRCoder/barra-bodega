import type { Request, Response } from 'express';
import { productsService } from '@/services/products.service.js';

export class ProductsController {
  getAll = async (req: Request, res: Response) => {
    const result = await productsService.getAll(res.locals.adminId, req.query);
    res.json({ data: result });
  };

  create = async (req: Request, res: Response) => {
    const product = await productsService.create(res.locals.adminId, req.body);
    res.status(201).json({ data: product });
  };

  update = async (req: Request, res: Response) => {
    const product = await productsService.update(
      res.locals.adminId,
      req.params.id,
      req.body
    );
    res.json({ data: product });
  };
}

export const productsController = new ProductsController();
