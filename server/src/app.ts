import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/config.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

//setup ayncHanlder util to return respsonse in json
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode ?? 500;
  const response: any = {
    success: false,
    message: err.message ?? 'internal server error',
    status: statusCode,
    path: req.path,
    timeStamp: new Date().toISOString(),
  };

  if (err.service) response.service = err.service;
  if (err.operation) response.operation = err.operation;

  res.status(statusCode).json(response);
});
