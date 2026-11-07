import express from 'express';
import cors from 'cors';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import apiRouter from '@/routes/route.js';
import 'dotenv/config';

const app = express();
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// 4. Validación de la URL de la base de datos
if (!process.env.DATABASE_URL) {
  throw new Error('Falta la variable DATABASE_URL en el archivo .env');
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

app.use('/api', apiRouter);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`Server en http://localhost:${PORT}`));
