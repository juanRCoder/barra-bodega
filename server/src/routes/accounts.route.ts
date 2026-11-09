import { Router } from 'express';
import { accountsController } from '@/controllers/accounts.controller.js';
import { requireAdmin } from '@/middleware/auth.middleware.js';

const accountsRouter = Router();

accountsRouter.use(requireAdmin);
accountsRouter.get('/', accountsController.getAll);
accountsRouter.post('/', accountsController.create);
accountsRouter.get('/:id', accountsController.getById);

export default accountsRouter;
