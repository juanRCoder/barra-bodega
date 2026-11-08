import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ZodError } from 'zod';
import { AppError } from '@/lib/app-error.js';
import apiRouter from '@/routes/route.js';
import { prisma } from '@/lib/prisma.js';

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(cookieParser());

app.use('/api', apiRouter);
app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    if (error instanceof ZodError) {
      res.status(400).json({
        message: 'Los datos enviados no son válidos',
        errors: error.issues.map(({ path, message }) => ({
          field: path.join('.'),
          message,
        })),
      });
      return;
    }
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
);

const PORT = process.env.PORT ?? 3000;
const server = app.listen(PORT, () =>
  console.log(`Server en http://localhost:${PORT}`)
);

function shutdown() {
  server.close(() => {
    void prisma.$disconnect();
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
