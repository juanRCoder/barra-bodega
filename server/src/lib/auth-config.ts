import 'dotenv/config';

function requiredSecret(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta configurar ${name} en server/.env`);
  }
  return value;
}

function durationInSeconds(name: string, fallback: string) {
  const value = process.env[name] ?? fallback;
  const match = /^(\d+)(s|m|h|d)$/.exec(value);
  if (!match) {
    throw new Error(`${name} debe usar una duración como 30m o 7d`);
  }

  const amount = Number(match[1]);
  const unitSeconds = { s: 1, m: 60, h: 3600, d: 86400 } as const;
  const seconds = amount * unitSeconds[match[2] as keyof typeof unitSeconds];
  if (!Number.isSafeInteger(seconds) || seconds <= 0) {
    throw new Error(`${name} debe ser una duración positiva válida`);
  }
  return seconds;
}

const accessExpiresInSeconds = durationInSeconds(
  'JWT_ACCESS_EXPIRES_IN',
  '30m'
);
const refreshExpiresInSeconds = durationInSeconds(
  'JWT_REFRESH_EXPIRES_IN',
  '7d'
);

if (accessExpiresInSeconds !== 30 * 60) {
  throw new Error('JWT_ACCESS_EXPIRES_IN debe ser 30m');
}
if (refreshExpiresInSeconds !== 7 * 24 * 60 * 60) {
  throw new Error('JWT_REFRESH_EXPIRES_IN debe ser 7d');
}

export const authConfig = {
  accessSecret: requiredSecret('JWT_ACCESS_SECRET'),
  refreshSecret: requiredSecret('JWT_REFRESH_SECRET'),
  accessExpiresInSeconds,
  refreshExpiresInSeconds,
  refreshExpiresInMs: refreshExpiresInSeconds * 1000,
};

if (authConfig.accessSecret === authConfig.refreshSecret) {
  throw new Error('JWT_ACCESS_SECRET y JWT_REFRESH_SECRET deben ser distintos');
}
