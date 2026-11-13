import { Router } from 'express';
import { ordersController } from '@/controllers/orders.controller.js';
import { requireAdmin } from '@/middleware/auth.middleware.js';

const ordersRouter = Router();

ordersRouter.use(requireAdmin);
ordersRouter.get('/analytics', ordersController.getAnalytics);
ordersRouter.get('/products/:code', ordersController.getProductByCode);
ordersRouter.post('/', ordersController.create);

export default ordersRouter;
