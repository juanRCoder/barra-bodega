import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '@/lib/auth-config.js';
import { AppError } from '@/lib/app-error.js';

declare global {
  namespace Express {
    interface Locals {
      adminId: string;
    }
  }
}

export const requireAdmin: RequestHandler = (req, res, next) => {
  const authorization = req.get('authorization');
  const match = authorization?.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    next(new AppError(401, 'Debes iniciar sesión'));
    return;
  }

  let claims: string | jwt.JwtPayload;
  try {
    claims = jwt.verify(match[1], authConfig.accessSecret);
  } catch {
    next(new AppError(401, 'Sesión inválida o expirada'));
    return;
  }

  if (typeof claims === 'string' || typeof claims.sub !== 'string') {
    next(new AppError(401, 'Sesión inválida o expirada'));
    return;
  }

  if (claims.role !== 'ADMIN') {
    next(new AppError(403, 'No tienes permiso para acceder a este recurso'));
    return;
  }

  res.locals.adminId = claims.sub;
  next();
};
