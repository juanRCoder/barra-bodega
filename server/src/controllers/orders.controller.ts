import type { Request, Response } from 'express';
import { ordersService } from '@/services/orders.service.js';

export class OrdersController {
  getProductByCode = async (req: Request, res: Response) => {
    const product = await ordersService.getProductByCode(
      res.locals.adminId,
      req.params.code
    );
    res.json({ data: product });
  };

  create = async (req: Request, res: Response) => {
    const order = await ordersService.create(res.locals.adminId, req.body);
    res.status(201).json({ data: order });
  };

  getAnalytics = async (req: Request, res: Response) => {
    const analytics = await ordersService.getAnalytics(
      res.locals.adminId,
      req.query.period
    );
    res.json({ data: analytics });
  };
}

export const ordersController = new OrdersController();
