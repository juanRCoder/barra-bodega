import { createHash, randomUUID, timingSafeEqual } from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { Prisma } from '../../generated/prisma/client.js';
import type { AuthUser } from '@barra-bodega/types';
import { prisma } from '@/lib/prisma.js';
import { authConfig } from '@/lib/auth-config.js';
import { AppError } from '@/lib/app-error.js';
import { loginSchema, registerSchema } from '@/schemas/auth.schema.js';

function hashRefreshToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function safeHashEquals(left: string, right: string) {
  const leftBuffer = Buffer.from(left, 'hex');
  const rightBuffer = Buffer.from(right, 'hex');
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function authUser(user: {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  business_name: string | null;
}): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    businessName: user.business_name,
  };
}

function createTokens(user: AuthUser, sessionId: string) {
  const accessToken = jwt.sign({ role: user.role }, authConfig.accessSecret, {
    subject: user.id,
    expiresIn: authConfig.accessExpiresInSeconds,
  });
  const refreshToken = jwt.sign({}, authConfig.refreshSecret, {
    subject: user.id,
    jwtid: sessionId,
    expiresIn: authConfig.refreshExpiresInSeconds,
  });

  return { accessToken, refreshToken };
}

function getRefreshClaims(token: string): JwtPayload {
  try {
    const payload = jwt.verify(token, authConfig.refreshSecret);
    if (
      typeof payload === 'string' ||
      typeof payload.sub !== 'string' ||
      typeof payload.jti !== 'string'
    ) {
      throw new AppError(401, 'Sesión inválida');
    }
    return payload;
  } catch {
    throw new AppError(401, 'Sesión inválida o expirada');
  }
}

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  );
}

export class AuthService {
  async register(input: unknown) {
    const data = registerSchema.parse(input);
    if (Buffer.byteLength(data.password, 'utf8') > 72) {
      throw new AppError(400, 'La contraseña es demasiado larga');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const userId = randomUUID();
    const sessionId = randomUUID();
    const user = {
      id: userId,
      name: data.name,
      email: data.email,
      role: 'ADMIN' as const,
      business_name: data.businessName || null,
    };
    const tokens = createTokens(authUser(user), sessionId);
    const now = new Date();

    try {
      await prisma.$transaction(async (transaction) => {
        await transaction.user.create({
          data: {
            id: userId,
            name: data.name,
            business_name: data.businessName || null,
            email: data.email,
            phone: data.phone,
            password_hash: passwordHash,
            role: 'ADMIN',
          },
        });
        await transaction.session.create({
          data: {
            id: sessionId,
            user_id: userId,
            family_id: sessionId,
            refresh_token_hash: hashRefreshToken(tokens.refreshToken),
            expires_at: new Date(now.getTime() + authConfig.refreshExpiresInMs),
          },
        });
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new AppError(409, 'El correo o teléfono ya está registrado');
      }
      throw error;
    }

    return { user: authUser(user), ...tokens };
  }

  async login(input: unknown) {
    const data = loginSchema.parse(input);
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !(await bcrypt.compare(data.password, user.password_hash))) {
      throw new AppError(401, 'Correo o contraseña incorrectos');
    }

    const sessionId = randomUUID();
    const tokens = createTokens(authUser(user), sessionId);
    await prisma.session.create({
      data: {
        id: sessionId,
        user_id: user.id,
        family_id: sessionId,
        refresh_token_hash: hashRefreshToken(tokens.refreshToken),
        expires_at: new Date(Date.now() + authConfig.refreshExpiresInMs),
      },
    });

    return { user: authUser(user), ...tokens };
  }

  async refresh(token: string) {
    const claims = getRefreshClaims(token);
    const currentHash = hashRefreshToken(token);
    const now = new Date();
    const session = await prisma.session.findUnique({
      where: { id: claims.jti },
      include: { user: true },
    });

    if (
      !session ||
      session.user_id !== claims.sub ||
      session.revoked_at ||
      session.expires_at <= now
    ) {
      throw new AppError(401, 'Sesión inválida o expirada');
    }

    if (!safeHashEquals(session.refresh_token_hash, currentHash)) {
      await prisma.session.updateMany({
        where: { family_id: session.family_id, revoked_at: null },
        data: { revoked_at: now },
      });
      throw new AppError(401, 'Sesión inválida o expirada');
    }

    const user = authUser(session.user);
    const tokens = createTokens(user, session.id);
    const updated = await prisma.session.updateMany({
      where: {
        id: session.id,
        refresh_token_hash: currentHash,
        revoked_at: null,
        expires_at: { gt: now },
      },
      data: {
        refresh_token_hash: hashRefreshToken(tokens.refreshToken),
        expires_at: new Date(now.getTime() + authConfig.refreshExpiresInMs),
      },
    });

    if (updated.count !== 1) {
      await prisma.session.updateMany({
        where: { family_id: session.family_id, revoked_at: null },
        data: { revoked_at: now },
      });
      throw new AppError(401, 'Sesión inválida o expirada');
    }

    return { user, ...tokens };
  }

  async logout(token?: string) {
    if (!token) return;

    await prisma.session.updateMany({
      where: {
        refresh_token_hash: hashRefreshToken(token),
        revoked_at: null,
      },
      data: { revoked_at: new Date() },
    });
  }
}

export const authService = new AuthService();
