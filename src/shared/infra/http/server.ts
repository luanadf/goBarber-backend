import 'dotenv/config';

import 'reflect-metadata';
import cors from 'cors';
import { errors } from 'celebrate';
import express, { Request, Response, NextFunction } from 'express';

import AppError from '@shared/errors/AppError';
import uploadConfig from '@config/upload';
import rateLimiter from './middlewares/rateLimiter';
import routes from './routes';

import 'express-async-errors';
import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(rateLimiter);
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use(errors());

// Tratativa dos erros (depois das rotas)
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }
  console.error(err);
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  console.log('🌀️ Server started on port 3333!');
});
