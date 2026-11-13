import type { Request, Response } from 'express';
import { accountsService } from '@/services/accounts.service.js';

export class AccountsController {
  getAll = async (_req: Request, res: Response) => {
    const result = await accountsService.getAll(res.locals.adminId);
    res.json({ data: result });
  };

  create = async (req: Request, res: Response) => {
    const account = await accountsService.create(res.locals.adminId, req.body);
    res.status(201).json({ data: account });
  };

  getById = async (req: Request, res: Response) => {
    const account = await accountsService.getById(
      res.locals.adminId,
      req.params.id
    );
    res.json({ data: account });
  };

  registerPayment = async (req: Request, res: Response) => {
    const payment = await accountsService.registerPayment(
      res.locals.adminId,
      req.params.id,
      req.body
    );
    res.status(201).json({ data: payment });
  };
}

export const accountsController = new AccountsController();
