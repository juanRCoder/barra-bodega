import { Router } from 'express';

const apiRouter = Router();

apiRouter.get('/', (_req, res) => {
  res.json({ message: 'API is working!' });
});

export default apiRouter;
