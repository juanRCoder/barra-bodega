import { Router } from 'express';
import accountsRouter from '@/routes/accounts.route.js';
import authRouter from '@/routes/auth.route.js';
import productsRouter from '@/routes/products.route.js';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/accounts', accountsRouter);
apiRouter.use('/products', productsRouter);

apiRouter.get('/', (_req, res) => {
  res.json({ message: 'API is working!' });
});

export default apiRouter;
