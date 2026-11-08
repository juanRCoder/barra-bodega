import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRouter from '@/routes/route.js';
import { AuthError, getAccessTokenSecret } from '@/services/auth.service.js';
import { prisma } from '@/lib/prisma.js';

getAccessTokenSecret();

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
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction
  ) => {
    if (error instanceof AuthError) {
      response.status(error.status).json({ message: error.message });
      return;
    }

    console.error(error);
    response.status(500).json({ message: 'Error interno del servidor.' });
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
