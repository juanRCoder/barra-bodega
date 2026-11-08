import type { NextFunction, Request, Response } from 'express';
import { AppError } from '@/lib/app-error.js';
import { authConfig } from '@/lib/auth-config.js';
import { authService } from '@/services/auth.service.js';

const refreshCookieName = 'refreshToken';
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/api/auth',
};

function setRefreshCookie(res: Response, token: string) {
  res.cookie(refreshCookieName, token, {
    ...cookieOptions,
    maxAge: authConfig.refreshExpiresInMs,
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(refreshCookieName, cookieOptions);
}

export class AuthController {
  register = async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    setRefreshCookie(res, result.refreshToken);
    res
      .status(201)
      .json({ accessToken: result.accessToken, user: result.user });
  };

  login = async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    setRefreshCookie(res, result.refreshToken);
    res.json({ accessToken: result.accessToken, user: result.user });
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.[refreshCookieName] as string | undefined;
    if (!token) {
      clearRefreshCookie(res);
      next(new AppError(401, 'Sesión inválida o expirada'));
      return;
    }

    try {
      const result = await authService.refresh(token);
      setRefreshCookie(res, result.refreshToken);
      res.json({ accessToken: result.accessToken, user: result.user });
    } catch (error) {
      clearRefreshCookie(res);
      next(error);
    }
  };

  logout = async (req: Request, res: Response) => {
    const token = req.cookies?.[refreshCookieName] as string | undefined;
    await authService.logout(token);
    clearRefreshCookie(res);
    res.status(204).end();
  };
}

export const authController = new AuthController();
