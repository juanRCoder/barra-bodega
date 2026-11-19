import { rateLimit } from 'express-rate-limit';

function limiter(options: {
  windowMs: number;
  limit: number;
  message: string;
  skipSuccessfulRequests?: boolean;
}) {
  return rateLimit({
    windowMs: options.windowMs,
    limit: options.limit,
    skipSuccessfulRequests: options.skipSuccessfulRequests,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message: options.message },
  });
}

const MINUTE = 60 * 1000;

// Tope general por IP para toda la API.
export const apiLimiter = limiter({
  windowMs: 15 * MINUTE,
  limit: 300,
  message: 'Demasiadas solicitudes. Intenta de nuevo en unos minutos.',
});

// Fuerza bruta: solo cuentan los intentos fallidos de login.
export const loginLimiter = limiter({
  windowMs: 15 * MINUTE,
  limit: 10,
  skipSuccessfulRequests: true,
  message: 'Demasiados intentos de inicio de sesión. Intenta en 15 minutos.',
});

// bcrypt es costoso en CPU: se limita también el registro.
export const registerLimiter = limiter({
  windowMs: 60 * MINUTE,
  limit: 5,
  message: 'Demasiados registros desde esta red. Intenta más tarde.',
});
