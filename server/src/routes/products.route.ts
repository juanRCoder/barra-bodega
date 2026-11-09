import { Router } from 'express';
import { productsController } from '@/controllers/products.controller.js';
import { requireAdmin } from '@/middleware/auth.middleware.js';

const productsRouter = Router();

productsRouter.use(requireAdmin);
productsRouter.get('/', productsController.getAll);
productsRouter.post('/', productsController.create);
productsRouter.patch('/:id', productsController.update);

export default productsRouter;
