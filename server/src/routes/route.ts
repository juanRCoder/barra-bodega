import { Router } from 'express';
import authRouter from '@/routes/auth.route.js';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);

apiRouter.get('/', (_req, res) => {
  res.json({ message: 'API is working!' });
});

export default apiRouter;
