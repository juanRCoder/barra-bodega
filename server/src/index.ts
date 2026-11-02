import express from 'express';
import cors from 'cors';
import apiRouter from '@/routes/route';

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

app.use('/api', apiRouter);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`Server en http://localhost:${PORT}`));
