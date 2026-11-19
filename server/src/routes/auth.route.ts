import { Router } from 'express';
import { authController } from '@/controllers/auth.controller.js';
import {
  loginLimiter,
  registerLimiter,
} from '@/middleware/rate-limit.middleware.js';

const authRouter = Router();

authRouter.post('/register', registerLimiter, authController.register);
authRouter.post('/login', loginLimiter, authController.login);
authRouter.post('/refresh', authController.refresh);
authRouter.post('/logout', authController.logout);

export default authRouter;
