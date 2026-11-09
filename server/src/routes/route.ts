import { Router } from 'express';
import accountsRouter from '@/routes/accounts.route.js';
import authRouter from '@/routes/auth.route.js';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/accounts', accountsRouter);

apiRouter.get('/', (_req, res) => {
  res.json({ message: 'API is working!' });
});

export default apiRouter;
